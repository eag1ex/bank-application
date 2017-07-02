"use scrict"

// server
var express = require('express');
var apiRoutes = express.Router();
var myapp = express.Router();
var app = express();

//http 
var cors = require('cors');
var multer = require('multer');
var fs = require('fs');
var ejs = require('ejs');
var bodyParser = require('body-parser');

//mongodb 
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require(__dirname + '/config'); // config file
var Bankuser = require(__dirname + '/models/bank_user.js'); // orm model

/// for generating new db from json file
var json = require('json-file');
var jsonData = json.read(__dirname + '/initial_data.json').data;

// configuration =========
app.enable('trust proxy');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//console logging 
app.use(morgan('dev'));
app.use(express.static(config.PUBLIC));

app.use(function (req, res, next) {
    next();
});

apiRoutes.use(function (req, res, next) {
    //res.header({ "access-control-allow-origin": "*" });
    next();
});

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', config.PUBLIC);


var port = app.set('port', process.env.PORT || 8002);
//==============

// connect to database
mongoose.Promise = global.Promise;
mongoose.connect(config.database, function (err, db) {
    if (err) {
        // throw err;
        console.log('error connecting to mongo db');
        throw err;
    } else {
        console.log('data base connected');
    }
});


//https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
//https://stackoverflow.com/questions/21497639/how-to-get-id-from-url-in-express-param-and-query-doesnt-seem-to-work#21498520

//@upload image
apiRoutes.post('/upload', uploadImage);

apiRoutes.post('/setup', initialSetup);

apiRoutes.post('/update/', updateUser);

apiRoutes.post(['/register/:token', '/register'], registerAndSave);

//give access to these pages
myapp.get(['/', '/application', '/tc'], (req, res, next) => {
    res.render('index', {
        /**      
         * render server address API_MAIN in index.html
         */
        API_MAIN: "http://localhost:" + app.get('port') + "/api"
    });
})

// redirect non matching
myapp.get('/*', function (req, res, next) {
    res.redirect('/app');
});

//init routes  
app.use('/api', apiRoutes);
app.use('/app', myapp);


// redirect non matching
/*
app.get('/*', function (req, res, next) {
    res.redirect('/app');
});
*/
// start server and listen
var newport = app.get('port');
var server = app.listen(newport, function () {
    console.log('server started. listening on http://localhost:' + newport);
    console.log('Open Browser on http://localhost:' + newport);
});



//---------------------------
// FUNCTIONS


// define file name and destination to save
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('uploading image to ', __dirname + '\\images')
        cb(null, __dirname + '\\images')
    },
    filename: (req, file, cb) => {

        let ext = file.originalname.split('.');
        console.log('uploading filename', ext)
        ext = ext[ext.length - 1];
        cb(null, 'uploads-' + Date.now() + '.' + ext);
    }
});


// define what file type to accept
var filter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        console.log('all good uploading')
        cb(null, true);
    } else {
        console.log('Failed: format not supported')
        cb('Failed: format not supported');
    }
};

// set multer config
var upload = multer({
    storage: storage,
    fileFilter: filter
}).single('appForm');



function errorHandler(err, res, req, next) {
    throw new Error(err);
}

function registerAndSave(req, res) {


    let token = req.params.token || "??><$%^";
    let tokenOK = token.match(/^[a-zA-Z0-9\s]*$/);

    if (!tokenOK) {
        return res.status(200).json({
            userExists: false,
            message: 'token invalid!',
            success: false,
            newUser: false,
            invalidToken: true
        });
    }

    if (!req.params.token) {
        return res.status(200).json({
            userExists: false,
            message: 'no token found',
            success: false,
            newUser: false
        });
    }


    var dymmyToken = req.params.token;//'sdfsdf345sw';
    // check for existing user before registering new token
    let userfound = findUser(() => {
        let promise = new Promise((resolve, reject) => {
            resolve({ token: dymmyToken })
        })
        return promise;
    }, res);

    userfound.then((data) => {
        // if existing user not found move on!
        if (!data) return false;

        return res.json({
            message: 'user data found!',
            userExists: true,
            newUser: false,
            data: data
        });
    })
        .then((data) => {
            /// register new user here
            if (data === false) registerNew();

        }, (err) => {
            return res.json({ serverError: "could not do post/register request" })
        }).catch((err) => console.log(err));


    function registerNew() {
        let user = new Bankuser(
            {
                token: req.params.token,
                date: new Date(),
                form: {}
            });

        // save
        user.save(function (err) {
            if (err) errorHandler(err, res);

            return res.status(200).json({
                message: 'registered new user token',
                success: true,
                newUser: true,
                userExists: false,
                data: user
            });
        }, () => errorHandler(err, res));
    }
}//registerAndSave


/**
 * @findUser using promiss with callback from POST/register route
 */
function findUser(callbackPromise, res) {
    var dataFound = false;
    return callbackPromise().then((tokenName) => {

        var query = Bankuser.where({ token: tokenName.token });
        return query.findOne(function (err, obj) {
            if (obj === null) {
                console.log('no Bankuser with token ' + tokenName.token + " found!")
                return dataFound;
            }

            if (err) errorHandler(err, res);

            if (obj) {
                dataFound = obj;
                console.log('user already exists1', obj)
                return dataFound;
            }
        });
    });
}


function uploadImage(req, res) {
    upload(req, res, (err) => {
        if (err) {
            return res.end("Error uploading file.");
        }

        return res.status(200).json({
            file: req.protocol + '://' + req.get('host') + '/images/' + req.file.originalname,
            response: req.file
        })
    });
}//uploadImage

function initialSetup(req, res) {

    if (!jsonData.data) {
        return res.status(200).json({
            message: 'json data not available for new db',
            success: false
        });

    }
    // create
    let user1 = new Bankuser(
        {
            token: jsonData.data[0].token,
            form: jsonData.data[0].form
        });

    // save
    user1.save(function (err) {
        if (err) throw err;
        return res.status(200).json({
            message: 'populated db for jsonfile',
            success: true,
            data: user1
        });
    });
}//initialSetup


function updateUser(req, res) {

    if (req.body.token === undefined || req.body.token == '') {
        return res.status(404).json({
            message: 'no token found!',
            success: false
        })
    }

    let tokenID = req.body.token;
    let newData = req.body.form;

    var query = Bankuser.where({ token: tokenID });
    query.findOne(function (err, obj) {
        if (obj === null) {

            return res.status(404).json({
                message: 'no data found',
                success: false
            })

        }
        if (err) errorHandler(err, res);
        if (obj._id) saveUserToDB(obj._id, newData, res);
    })// findOne

}//updateUser

function saveUserToDB(findID, newData, res) {
    // get a user with ID of 1
    Bankuser.findById(findID, function (err, user) {
        if (err) errorHandler(err, res);

        user.form = newData;
        // save the user
        user.save(function (err) {
            if (err) errorHandler(err, res);

            // console.log('User successfully updated!');
            return res.status(200).json({ data: user, success: true })
        }, () => errorHandler(err, res));
    });
}// saveUser


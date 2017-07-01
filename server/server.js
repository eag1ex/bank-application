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
    res.header({ "access-control-allow-origin": "*" });
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
}

// set multer config
var upload = multer({
    storage: storage,
    fileFilter: filter
}).single('appForm');


function errorHandler(err, res, req, next) {
    throw new Error(err);
}


apiRoutes.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.end("Error uploading file.");
        }

        res.status(200).json({
            file: req.protocol + '://' + req.get('host') + '/images/' + req.file.originalname,
            response: req.file
        })
    });
})



apiRoutes.get('/remove', function (req, res) {
    removeModel('bankuser');
    res.status(200).json({
        message: 'bankuser table removed from mongo db',
        success: true
    });
});


//https://scotch.io/tutorials/using-mongoosejs-in-node-js-and-mongodb-applications
//https://stackoverflow.com/questions/21497639/how-to-get-id-from-url-in-express-param-and-query-doesnt-seem-to-work#21498520
apiRoutes.get('/setup', function (req, res) {

    //console.log('model is found', findModel('bankuser'))

    if (!jsonData.data) {
        console.log('json data not available for new db');
        res.status(200).json({
            message: 'json data not available for new db',
            success: false
        });
        return;
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

        console.log('saved successfully', user1);
        res.status(200).json({
            message: 'populated db for jsonfile',
            success: true,
            data: user1
        });
    });

});


/**
 * @register new
 */


apiRoutes.post(['/register/:token', '/register'], function (req, res) {
    //console.log('req.params.token',req.params.token );
    //console.log('model is found', findModel('bankuser'))


    if (!req.params.token) {
        res.status(200).json({
            message: 'no token found',
            success: false
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
        if (!data) return false;;

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
    })
    .catch((err) => {
        console.log(err);
    });


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

             res.status(200).json({
                message: 'registered new user token',
                success: true,
                newUser: true,
                userExists: false,
                data: user
            });
        },()=>{
          errorHandler(err, res);
        });
    }
});


/**
 * 
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
    })//
};


function removeModel(name, res) {
    var query = Bankuser.where({ name: name });
    Bankuser.remove({ name: name }, function (err) {
        if (!err) {
            console.log('object removed');
            query.findOne(function (err, obj) {
                if (err) errorHandler(err, res);
                if (obj) {
                    console.log('object found', obj)
                }
            });
        }
        else {

            console.log('error trying to remove')
        }
    });
};



apiRoutes.get('/all', function (req, res) {

    var query = Bankuser.where({ _id: '34456324234' });
    // console.log('query',query)
    query.findOne(function (err, obj) {
        if (obj === null) {
            console.log('no model found')

            res.status(200).json({
                message: 'no data found',
                success: false
            })
            res.status(404);
        }

        if (err) errorHandler(err, res);
        if (obj) {
            // res.json(jsonData.data)
            res.status(200).json(obj)
            console.log('we found your obj', obj)
        }
    });
});

apiRoutes.get('/:token', function (req, res) {
    console.log('req.params.token', req.params.token);

    var query = Bankuser.where({ token: req.params.token });
    query.findOne(function (err, obj) {
        if (obj === null) {
            res.status(200).json({
                message: 'no data found',
                success: false
            })
            res.status(404);
        }

        if (err) errorHandler(err, res);

        if (obj) {
            res.status(200).json({
                message: 'data received',
                success: true,
                data: obj
            });
        }
    });
});



myapp.get(['/', '/application'], (req, res, next) => {
    res.render('index', {
        /**
         * render server address API_MAIN in index.html
         * not working at moment??
         */
        API_MAIN: "http://localhost:" + app.get('port') + "/api"
    });
})



app.get('/application', function (req, res, next) {
    res.redirect('/app');
});

app.use('/api', apiRoutes);
app.use('/app', myapp);

// start server and listen
var newport = app.get('port');
var server = app.listen(newport, function () {
    console.log('server started. listening on http://localhost:' + newport);
    console.log('Open Browser on http://localhost:' + newport);
});




/*
.on('error', function (err) {
    if (err.code === 'EADDRINUSE') {
        newport++;
        console.log('Address in use, retrying on port ' + newport);
        setTimeout(function () {
            app.listen(newport);
        }, 250);
    }
});
*/






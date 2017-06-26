"use scrict"

var express = require('express');
var apiRoutes = express.Router();
var app = express();
var cors = require('cors');

const multer = require('multer');
const fs = require('fs');
const junk = require('junk');
var ejs = require('ejs');
var bodyParser = require('body-parser');

//mongodb setup
var morgan = require('morgan');
var mongoose = require('mongoose');
const config = require(__dirname+'/config'); // config file
var Bankuser = require(__dirname+'/models/bank_user.js'); // orm model

/// for generating new db from json file
var json = require('json-file');
var jsonData = json.read(__dirname+'/initial_data.json').data;


// configuration =========
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', config.PUBLIC);
var port = app.set('port', process.env.PORT || 8000);
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
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/images')
    },
    filename: (req, file, cb) => {
        let ext = file.originalname.split('.');
        ext = ext[ext.length - 1];
        cb(null, 'uploads-' + Date.now() + '.' + ext);
    }
});


// define what file type to accept
let filter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb('Failed: format not supported');
    }
}

// set multer config
let upload = multer({
    storage: storage,
    fileFilter: filter
}).single('upload');



//console logging 
app.use(morgan('dev'));

app.use(function (req, res, next) {
//    res.header("Access-Control-Allow-Origin", "*");
  //  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



app.get('/remove', function (req, res) {
    removeModel('bankuser');
    res.json({
        message: 'bankuser table removed from mongo db',
        success: true
    });
});

app.get('/setup', function (req, res) {

    //console.log('model is found', findModel('bankuser'))

    if (!jsonData.data) {
        console.log('json data not available for new db');
        res.send({
            message: 'json data not available for new db',
            success: false
        });
        return;
    }

    // create
    var newIndex = [];
    for (var i = 0; i < jsonData.data.length; i++) {
        newIndex.push(jsonData.data[i]);
    }

    var obj1 = new Bankuser({
        name: 'user',
        indexes: newIndex
    });

    // save
    obj1.save(function (err) {
        if (err) throw err;

        console.log('saved successfully', obj1);
        res.send({
            message: 'populated db for jsonfile',
            success: true
        });
    });




});

/**
 * 
 * @findmodel
 */

function findModel(name) {
    var query = Bankuser.where({ name: name });
    query.findOne(function (err, obj) {
        if (obj === null) {
            console.log('no model found')
        }

        if (err) return handleError(err);
        if (obj) {
            console.log('we found your obj', obj)
        }
    });
}; 


function removeModel(name) {
    var query = Bankuser.where({ name: name });
    Bankuser.remove({ name: name }, function (err) {
        if (!err) {
            console.log('object removed');
            query.findOne(function (err, obj) {
                if (err) return handleError(err);
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



apiRoutes.get('/', function (req, res) {

    var query = Bankuser.where({ name: 'user' });
   // console.log('query',query)
    query.findOne(function (err, obj) {
        if (obj === null) {
            console.log('no model found')
           
            res.send({
                message:'no data found',
                success:false
            })
            res.status(404);
        }

        if (err) return handleError(err);
        if (obj) {
            // res.json(jsonData.data)
            res.json(obj.indexes)
            console.log('we found your obj', obj)
        }
    });


});


// api call at http://localhost:{port}/api
app.use('/api', apiRoutes);



// general route
app.use(express.static(config.PUBLIC));
app.get('/', (req, res) => {
    res.render('index', {
        /**
         * render server address API_MAIN in index.html
         */
        API_MAIN: "http://localhost:" + app.get('port')
    });
})




// start server and listen
var server = app.listen(app.get('port'), _ => {
    console.log('server started. listening on http://localhost:' + app.get('port'));
    console.log('Open Browser on http://localhost:' + app.get('port'));
})









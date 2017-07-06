"use scrict"

// server
var express = require('express');
var apiRoutes = express.Router();
var myapp = express.Router();
var app = express();

//http  
var cors = require('cors');
var morgan = require('morgan');
var fs = require('fs');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var port = app.set('port', process.env.PORT || config.SERVER_PORT);

/// for generating new db from json file
var json = require('json-file');
var jsonData = json.read(__dirname + '/initial_data.json').data;

var contrl = require('./config/controllers');


var config = require(__dirname + '/config');
//mongodb and mongoose model
var mongoDB = require('./config/mongodb')(config);

//multer and file storage
var multer = require('./config/multer.file.storage')(config);
  

// configuration =========
app.enable('trust proxy');
app.use(cors());

apiRoutes.use(bodyParser.json());
apiRoutes.use(bodyParser.urlencoded({ extended: true }));

//console logging 
app.use(morgan('dev'));
app.use(express.static(config.PUBLIC));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

apiRoutes.use(function (req, res, next) {
    //res.header({ "access-control-allow-origin": "*" });
    next();
});

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', config.PUBLIC);



//==============

// connect to database
mongoDB.init();
var Bankuser = mongoDB.bankuser;

// multer upload
var upload = multer.upload();

// initialize controllers
var controller = contrl(upload, Bankuser,jsonData);

apiRoutes.post('/upload', controller.uploadImage);

apiRoutes.post('/setup', controller.initialSetup);

apiRoutes.post('/update', controller.updateUser);

apiRoutes.post(['/register/:token', '/register'], controller.registerAndSave);

//give access to these pages
myapp.get(['/', '/application', '/tc', '/application/*'], (req, res, next) => {
    res.render('index', {
        /**      
         * render server address API_MAIN in index.html
         */
        API_MAIN: "http://localhost:" + app.get('port') + "/api"
    });
})

// redirect non matching
myapp.get('/*', function (req, res, next) {
    // res.redirect('/app');
});

//init routes  
app.use('/api', apiRoutes);
app.use('/app', myapp);

// start server and listen
var newport = app.get('port');
var server = app.listen(newport, function () {
    console.log('server started. listening on http://localhost:' + newport);
    console.log('Open Browser on http://localhost:' + newport);
});

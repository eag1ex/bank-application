
var express = require('express');
var apiRoutes = express.Router();
var myapp = express.Router();
var app = express();
const config = require(__dirname + '/config'); // config file
//var ejs = require('ejs');
var bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//console logging 
//app.use(morgan('dev'));
app.use(express.static(config.PUBLIC));
app.use(express.static(config.PUBLIC+"/index.html"));
app.use('/*', express.static(config.PUBLIC+"/index.html"));
app.use('/*', express.static(config.PUBLIC+"/dist/js/*.*"));

app.use(function (req, res, next) {
    next()
});




//app.engine('html', ejs.renderFile);
//app.set('view engine', 'html');
//app.set('views', config.PUBLIC);


var port = app.set('port', process.env.PORT || config.SERVER_PORT);
//==============

// start server and listen
var newport = app.get('port');
var server = app.listen(newport, function () {
    console.log('server started. listening on http://localhost:' + newport);
    console.log('Open Browser on http://localhost:' + newport);
});






var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('./config/db');
var serverConfig = require('./config/server');
var routes = require('./routes');
var errorHandler = require('./middlewares/error-handler')
var path = require('path');
var serveStatic = require('serve-static');
var server = require('http').createServer(app);
var Socket = require('socket.io/lib/socket');
var io = require('socket.io').listen(server);
var socketConfig = require('./config/socket');
var morgan = require('morgan');

// =======================
// configuration =========
// =======================
var port = serverConfig.PORT; // used to create, sign, and verify tokens
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, authorization');

    next();
};
db.init();
app.use(morgan('dev'));
// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(errorHandler.errorHandler());
app.use(allowCrossDomain);
//service static files
app.use('/', express.static(path.resolve('./uploads')));
console.log(path.resolve('./uploads'));
//socket io

socketConfig(io, app);
//register routes
routes(app);
// register socket io
// socketIoConfig(app);
// use morgan to log requests to the console
server.listen(port);
console.log('Server starting http://localhost:' + port);
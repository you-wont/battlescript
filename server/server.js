
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var db = require('./schema.js');
var easySocket = require('./lib/easySocket.js');
var handler = require('./lib/socketHandler.js');
var passport = require('passport');
var session      = require('express-session');
var bcrypt = require('bcrypt-nodejs');

// This config should go in a module or something...
var passportConfig = require('./lib/strategyConfig.js')(db);
passport.use(passportConfig.strategy);
passport.serializeUser(passportConfig.serialization);
passport.deserializeUser(passportConfig.serialization);


// view engine setup
console.log(__dirname);
app.set('views', path.join(__dirname, '/../client'));
app.engine('html', require('./lib/htmlEngine'));
app.set('view engine', 'html');


server.listen(8080);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({ secret: 'swagillrektum8' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

require('./lib/routes.js')(app, passport, db, bcrypt);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

easySocket(server).onConnect(function(socket){
  handler(socket);
});

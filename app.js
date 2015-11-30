var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var envProps = require('./config/env/default.js');
var routes = require('./routes/index');
var users = require('./routes/users');
var fs = require("fs");
var mongoose = require('mongoose');
var app = express();

// Set Frequenly used libraries in global
global.chalk = require('chalk');
global.reqlib = require('app-root-path').require;
global.mongoose = require('mongoose'),
global.envProps = envProps;


// Bootstrap db connection
var db = mongoose.connect(envProps.db, function(err) {
  if (err) {
    console.error(chalk.red('Could not connect to MongoDB!'));
    console.log(chalk.red(err));
  }
});

// Load all Models.
var models = fs.readdirSync(__dirname+"/app/models");
models.forEach(function(fileName) {
  require(__dirname+"/app/models/"+fileName);
});

/*var livereload = require('express-livereload');
var liverReloadConfig = {};
liverReloadConfig.watchDir= __dirname+"/public";
livereload(app, liverReloadConfig);*/


// Bootstrap the application.
reqlib("/config/bootstrap")();

String.prototype.replaceAll = function(target, replacement) {
  return this.split(target).join(replacement);
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
  
app.use('/', routes);
app.use('/users', users);


/*var strFn = "module.exports = function (param) { return param.split(\" \"); }";
var strFn1 = "module.exports = function() {return envProps.jwt.secret }";
var strFn2 = "module.exports = function(dataToReturn) {return dataToReturn.split(' '); }";

var functionToCall = eval(strFn1);
var result = functionToCall();
console.log("Result "+result);*/

// Load all the routes.
var routeFiles = fs.readdirSync(__dirname+"/app/routes");
routeFiles.forEach(function(fileName) {
  require(__dirname+"/app/routes/"+fileName)(app);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var stylus = require('stylus');
var mongo = require('mongodb');

var db = require('./db');
var url = 'mongodb://josh:apricotmar_ble@localhost:27017/mgmt?authSource=admin';

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var crewRouter = require('./routes/crew');
var projectRouter = require('./routes/projects');
var stageRouter = require('./routes/stages');
var creditRouter = require('./routes/credits');
var noteRouter = require('./routes/notes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

db.connect(url);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/crew', crewRouter);
app.use('/projects', projectRouter);
app.use('/stages', stageRouter);
app.use('/credits', creditRouter);
app.use('/notes', noteRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

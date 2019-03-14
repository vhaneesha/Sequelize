var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var eventsRouter = require('./routes/events');
var tagsRouter = require('./routes/tags');

const { sequelize, User, Event, Tag } = require('./sequelize');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/events', eventsRouter);
app.use('/tags', tagsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
/*
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/

// error handler
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	if(req.originalUrl.startsWith('/')) {
		res.json({msg: err.message});
	} else {
	  	// set locals, only providing error in development
	  	res.locals.message = err.message;
	  	res.locals.error = req.app.get('env') === 'development' ? err : {};

		// render the error page
		res.render('error');
	}
});


async function shutdown(signal, callback) {
  console.log(`${signal} received.`);
  await sequelize.close();
  if (typeof callback === 'function') callback();
  else process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.once('SIGUSR2', signal => {
  shutdown(signal, () => process.kill(process.pid, 'SIGUSR2'));
});

module.exports = app;

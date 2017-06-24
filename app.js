const express = require('express');
const http = require('http');
const path = require('path');
const errorhandler = require('errorhandler');
const config = require('config');
const log = require('libs/log')(module);
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const HttpError = require('error').HttpError;
const mongoose = require('./libs/mongoose');
const session = require('express-session');
const cookieSession = require('cookie-session');
const index = require('./routes/index');

const app = express();

app.set('port', config.get('port'));

// view engine setup
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// set up logger
if (app.get('env') === 'development') {
	app.use(logger('dev'));
} else {
	app.use(logger('default'));
}


//app.use(bodyParser());
// req.body ...
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());

const MongoStore = require('connect-mongo')(session);
//
app.use(session({
	secret: config.get('session:secret'),
	key: config.get('session:key'),
	cookie: config.get('session:cookie'),
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({
		mongooseConnection: mongoose.connection,
		collection: 'sessions',
	})
}));


app.use((req, res, next) => {
	req.session.numberOfVisits = ++req.session.numberOfVisits || 1;
	res.send('Visits: ' + req.session.numberOfVisits);
})


app.use(require('middleware/sendHttpError'));

// Router
app.use('/', index);


app.use(express.static(path.join(__dirname, 'public')));


// Error middleware
app.use((err, req, res, next) => {
	if (typeof err == 'number') { // next(404)
		err = new HttpError(err);
	}

	if (err instanceof HttpError) {
		res.sendHttpError(err);
	} else {
		if (app.get('env') === 'development') {
			const errorHandler = errorhandler();
			errorHandler(err, req, res, next);
		} else {
			log.error(err);
			err = new HttpError(500);
			res.sendHttpError(err);
		}
	}

});


//
//// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//  next(err);
//});
//
//// error handler
//app.use(function(err, req, res, next) {
//  // set locals, only providing error in development
//  res.locals.message = err.message;
//  res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//  // render the error page
//  res.status(err.status || 500);
//  res.render('error');
//});

http.createServer(app).listen(config.get('port'), () => {
	log.info('Express server listening on port ' + config.get('port'));
});

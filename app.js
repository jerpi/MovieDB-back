"use strict";

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const auth = require('./routes/auth');
const movies = require('./routes/movies');
const cast = require('./routes/cast');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    session.cookie.secure = true; // serve secure cookies
}

const url = 'mongodb://localhost:27017/MovieDB';
const connection = mongoose.connect(url, {
    useMongoClient: true,
});
app.use(session({
    secret: 'abcdefg',
    resave: false,
    saveUninitialized: false,
    //store: new MongoStore({ mongooseConnection: connection })
}));

app.use('/auth', auth);
app.use('/movies', movies);
app.use('/cast', cast);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.sendStatus(err.status || 500);
});

module.exports = app;

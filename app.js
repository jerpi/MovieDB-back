"use strict";

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
mongoose.Promise = Promise;

const app = express();
const routes = require('./server/routes');

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

app.use(routes);

app.use(function(req, res, next) { // catch 404 and forward to error handler
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});


app.use(function(err, req, res) { // error handler
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.sendStatus(err.status || 500);
});

module.exports = app;

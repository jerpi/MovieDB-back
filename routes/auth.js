"use strict";

const express = require('express');
const router = express.Router();

const isAuth = (req, res, next) => {
    if (req.session.username) {
        //TODO check in db
        return next();
    }
    res.sendStatus(401);
};

const isAdmin = (req, res, next) => {
    if (req.session && req.session.admin) {
        //TODO check in db
        return next();
    }
    res.sendStatus(401);
};

router.get('/login', isAuth, (req, res, next) => {
    res.send(200, true);
});

router.post('/login', (req, res, next) => {
    let { username, password } = req.body;
    req.session.username = username;
    console.log(username, password);
    res.send(200, true);
});

router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.send(200, true);
});

router.post('/register', (req, res, next) => {
    let { username, password } = req.body;
    req.session.username = username;
    console.log(username, password);
    res.send(200, true);
});

router.get('/admin', isAdmin, (req, res, next) => {
    res.send(200, true);
});

module.exports = router;
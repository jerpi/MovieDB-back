"use strict";

const express = require('express');
const router = express.Router();
const User = require('../schemas/user');

const isAuth = (req, res, next) => {
    const { username } = req.session;
    if (!username) {
        return res.sendStatus(401);
    }
    User.findOne({ username })
        .then(
            doc => {
                if (doc) {
                    return next();
                }
                res.sendStatus(401);
            },
            err => {
                res.sendStatus(500);
            }
        );
};

const isAdmin = (req, res, next) => {
    const { username } = req.session;
    if (!username) {
        res.sendStatus(401);
    }
    User.findOne({ username })
        .then(
            doc => {
                if (doc) {
                    if (doc.admin) { return next(); }
                    return res.sendStatus(403);
                }
                res.sendStatus(401);
            },
            err => {
                res.sendStatus(500);
            }
        );
};

router.get('/login', isAuth, (req, res, next) => {
    res.send(200, true);
});

router.post('/login', (req, res, next) => {
    let { username, password } = req.body;
    User.findOne({ username, password })
        .then(
            doc => {
                if (doc) {
                    req.session.username = username;
                    return res.send(200, true);
                }
                res.sendStatus(401);
            },
            err => {
                res.sendStatus(400);
            }
        );
});

router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.send(200, true);
});

router.post('/register', (req, res, next) => {
    let { username, password } = req.body;
    new User({ username, password }).save()
        .then(
            doc => {
                req.session.username = username;
                res.send(200, true);
            },
            err => {
                res.sendStatus(400);
            }
        );
});

router.get('/admin', isAdmin, (req, res, next) => {
    res.send(200, true);
});

module.exports = router;
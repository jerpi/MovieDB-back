'use strict';

const express = require('express');
const router = express.Router();
const User = require('../schemas/user');

async function isAuth(req, res, next) {
    const { user } = req.session;
    if (!user) {
            return res.sendStatus(401);
        }
        try {
            const doc = await User.findOne({ _id: user });
            if (doc) {
                return next();
            }
        res.sendStatus(401);
    } catch (err) {
        res.sendStatus(500);
    }
}

async function isAdmin (req, res, next) {
    const { user } = req.session;
    if (!username) {
        res.sendStatus(401);
    }
    try {
        const doc = await User.findOne({ _id: user });
        if (doc) {
            if (doc.admin) { return next(); }
            return res.sendStatus(403);
        }
        res.sendStatus(401);
    } catch (err) {
        res.sendStatus(400);
    }
}

router.get('/login', isAuth, (req, res) => {
    res.status(200).send(true);
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const doc = await User.findOne({ username, password });
        if (doc) {
            req.session['user'] = doc._id;
            return res.status(200).send(true);
        }
        res.sendStatus(401);
    } catch(err) {
        res.sendStatus(400);
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).send(true);
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    try {
        const doc = await user.save();
        if (doc) {
            req.session.username = doc.username;
            res.status(200).send(true);
        }
        res.sendStatus(401);
    } catch(err) {
        res.sendStatus(400);
    }
});

router.get('/admin', isAdmin, (req, res) => {
    res.send(200, true);
});

module.exports = {
    router,
    isAuth,
};
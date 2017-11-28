"use strict";

const express = require('express');
const router = express.Router();

router.get('/login', (req, res, next) => {
    res.send(200, true);
});

router.post('/login', (req, res, next) => {
    res.send(200, true);
});

router.get('/logout', (req, res, next) => {
    res.send(200, true);
});

router.post('/register', (req, res, next) => {
    res.send(200, true);
});

router.get('/admin', (req, res, next) => {
    res.send(200, true);
});


module.exports = router;
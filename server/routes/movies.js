"use strict";

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    // returns list of movies
});

router.get('/:id', (req, res, next) => {
    //return only one movie
});

module.exports = router;
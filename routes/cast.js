"use strict";

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    // returns list of cast members
});

router.get('/:id', (req, res, next) => {
    //return only one cast member
});

module.exports = router;
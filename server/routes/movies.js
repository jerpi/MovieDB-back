"use strict";

const express = require('express');
const router = express.Router();

const Movie = require('../schemas/movie');

router.get('/', async (req, res) => {
    try {
        const docs = await Movie.find();
        res.send(docs);
    } catch (err) {
        res.sendStatus(400);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const doc = await Movie.findOne({ _id: req.params['id'] });
        if (doc) {
            return res.send(doc);
        }
        res.sendStatus(204);
    } catch (err) {
        res.sendStatus(400);
    }
});

module.exports = router;
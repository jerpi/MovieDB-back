'use strict';

const axios = require('axios');
const express = require('express');
const router = express.Router();

const token =  require('../../conf').api_token;
const Movie = require('../schemas/movie');

async function movieExists(req, res, next) {
    const title = req.query.title;
    if (!title) {
        res.sendStatus(400);
    }
    try {
        req.movie = await Movie.findOne(
            { title }
        );
        next();
    } catch(error) {
        res.sendStatus(400);
    }
}

async function fetchMovie(req, res, next) {
    const title = req.query.title;
    if (req.movie) { return next(); }
    try {

        const result = await axios.get(
            `http://api.myapifilms.com/tmdb/searchMovie?movieName=${title}&token=${token}&format=json&language=fr`,
            {
                withCredentials: true,
            }
        );
        //console.log(result.data['data']['results']);
        if (!result.data['data']['results'] || !result.data['data']['results'][0]) {
            return res.sendStatus(404);
        }
        const idIMDB = result.data['data']['results'][0].id;
        const mov = await axios.get(
            `http://api.myapifilms.com/tmdb/movieInfoImdb?idIMDB=${idIMDB}&token=${token}&format=json&language=fr&casts=1&images=1&keywords=1&videos=1&similar=1`
        );

        let movie = new Movie(mov.data['data']);
        movie = await movie.save();
        req.movie = movie;
        next();
    } catch(error) {
        console.log(error);
        res.sendStatus(400);
    }
}

router.get('/', async (req, res) => {
    try {
        const docs = await Movie
            .find()
            .populate({
                path: 'cast',
                options: {
                    limit: 3,
                }
            });
        res.send(docs);
    } catch (err) {
        res.sendStatus(400);
    }
});

router.get('/query', movieExists, fetchMovie, (req, res) => {
    res.send(req.movie);
});

router.get('/:id', async (req, res) => {
    try {
        const doc = await Movie
            .findOne({ _id: req.params['id'] })
            .populate({
                path: 'cast'
            });
        if (doc) { return res.send(doc); }
        res.sendStatus(204);
    } catch (err) {
        res.sendStatus(400);
    }
});

module.exports = {
    router
};
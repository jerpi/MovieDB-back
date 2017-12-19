'use strict';

const axios = require('axios');
const express = require('express');
const router = express.Router();

const token =  require('../../conf').api_token;
const proxy = require('../../conf').proxy;
const Movie = require('../schemas/movie');

async function movieExists(req, res, next) {
    const title = req.query.title;
    if (!title) {
        return res.sendStatus(400);
    }
    try {
        req.movies = await Movie.find(
            { title: new RegExp(title, "i") }
        );
        if (req.movies.length === 0) {
            delete req.movies;
        }
        next();
    } catch(error) {
        res.sendStatus(400);
    }
}

async function fetchMovie(req, res, next) {
    const title = req.query.title;
    if (req.movies) { return next(); }
    try {
        const response = await axios.get(
            `http://api.myapifilms.com/tmdb/searchMovie?movieName=${title}&token=${token}&format=json&language=fr`,
            { proxy }
        );
        const results = response.data['data']['results'];
        if (!results || results.length === 0) {
            return res.sendStatus(404);
        }
        results.splice(1);
        const promises = [];
        for (let result of results) {
            const idIMDB = result.id;
            promises.push(
                axios.get(
                `http://api.myapifilms.com/tmdb/movieInfoImdb?idIMDB=${idIMDB}&token=${token}&format=json&language=fr&casts=1&images=1&keywords=1&videos=1&similar=1`,
                { proxy }
            ));
        }
        const movies = await Promise.all(promises);
        const mvs = [];
        for (let movie of movies) {
            if (movie) {
                console.log(movie);
                const m = new Movie(movie.data['data']);
                mvs.push(m.save());
            }
        }
        req.movies = await Promise.all(mvs);
        next();
    } catch(error) {
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

router.get('/q', movieExists, fetchMovie, (req, res) => {
    res.send(req.movies);
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
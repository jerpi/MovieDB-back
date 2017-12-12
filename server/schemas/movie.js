'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectID = Schema.ObjectId;

const Movie = new Schema({
    id: {
        type: Number,
        required: [true, 'id is required'],
    },
    cast: [{
        type: ObjectID,
        ref: "cast_members",
    }],
    backdrop_path: {
        type: String,
        required: [true, 'Backdrop_path is required'],
    },
    poster_path: {
        type: String,
        required: [true, 'Poster_path is required'],
    },
    popularity: {
        type: Number,
        required: [true, 'Popularity is required'],
    },
    vote_average: {
        type: Number,
    },
    vote_count: {
        type: Number,
    },
    adult: {
        type: Boolean,
    },
    original_title: {
        type: String,
        required: [true, 'Original_title is required'],
    },
    release_date: {
        type: String,
        required: [true, 'Release_date is required'],
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    overview: {
        type: String,
        required: [true, 'Overview is required'],
    },
    revenue: {
        type: Number,
    },
    budget: {
        type: Number,
    },
    genres: [{
        type: {
            id: Number,
            name: String,
        },
    }],
    production_companies: [{
        type: {
            id: Number,
            name: String,
        },
    }],
    runtime: {
        type: Number,
    },
    spoken_languages: [{
        type: {
            iso_639_1: String,
            name: String,
        },
    }],
    tagline: {
        type: String,
    },
    status: {
        type: String,
    },
});

Movie.pre('save', async function(next) {
    const now = Date.now();
    if (this.isNew) {
        this.inscription = now;
    }
    this.updated = now;
    try {
        const doc = await this.constructor.findOne({ id: this.id });
        let err;
        if (doc) {
            err = new Error('Another movie is already using this id');
        }
        next(err);
    } catch(err) {
        next(err);
    }
});


const model = mongoose.model('movies', Movie);
module.exports = model;
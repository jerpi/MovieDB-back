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
        required: [true, 'backdrop_path is required'],
    },
    poster_path: {
        type: String,
        required: [true, 'poster_path is required'],
    },
    popularity: {
        type: Number,
        required: [true, 'popularity is required'],
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
        required: [true, 'original_title is required'],
    },
    release_date: {
        type: Date,
        required: [true, 'release_date is required'],
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    overview: {
        type: String,
        required: [true, 'overview is required'],
    },
    revenue: {
        type: Number,
    },
    budget: {
        type: Number,
    },
    genres: [{
        id: Number,
        name: String,
    }],
    production_companies: [{
        id: Number,
        name: String,
    }],
    runtime: {
        type: Number,
    },
    spoken_languages: [{
        iso_639_1: String,
        name: String,
    }],
    tagline: {
        type: String,
    },
    status: {
        type: String,
    },
    videos: [{
        type: {
            id: String,
            key: String,
            name: String,
            site: String,
            size: String,
            type: String,
            iso_639_1: String,
            iso_3166_1: String,
        }
    }],
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
            err = new Error('Another movie is already using this id.');
        }
        next(err);
    } catch(err) {
        next(err);
    }
});


const model = mongoose.model('movies', Movie);
module.exports = model;
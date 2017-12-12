'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectID = Schema.ObjectId;

const Cast = new Schema({
    id: {
        type: Number,
        required: [true, 'id is required'],
    },
    img: {
        type: String,
    },
    name: {
        type: String,
    },
    biography: {
        type: String,
    },
    birthdate: {
        type: Date,
    },
    updated: Date,
});

Cast.pre('save', async function(next) {
    const now = Date.now();
    if (this.isNew) {
        this.inscription = now;
    }
    this.updated = now;
    try {
        const doc = await this.constructor.findOne({ id: this.id });
        let err;
        if (doc) {
            err = new Error('Another cast member is already using this id');
        }
        next(err);
    } catch(err) {
        next(err);
    }
});

const model = mongoose.model('cast_members', Cast);
module.exports = model;
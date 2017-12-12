'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        minlength: [8, 'Username must be between 8 and 30 characters long'],
        maxlength: [30, 'Username must be between 8 and 30 characters long'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be between 8 and 30 characters long'],
        maxlength: [30, 'Password must be between 8 and 30 characters long'],
    },
    inscription: {
        type: Date,
    },
    updated: {
        type: Date,
    },
    admin: {
        type: Boolean,
        default: false,
    }
});

User.pre('save', async function(next) {
    const now = Date.now();
    if (this.isNew) {
        this.inscription = now;
    }
    this.updated = now;
    try {
        const doc = await this.constructor.findOne({ username: this.username });
        let err;
        if (doc) {
            err = new Error('Another user is already using this username');
        }
        next(err);
    } catch(err) {
        next(err);
    }
});


const model = mongoose.model('users', User);
module.exports = model;
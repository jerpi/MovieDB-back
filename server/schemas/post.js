'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectID = Schema.ObjectId;

const Post = new Schema({
    user: {
        type: ObjectID,
        ref: "cast_members",
        required: [true, "user is required"]
    },
    associatedContent: {
        type: ObjectID,
        ref: ['cast_members', 'movies'],
        required: [true, 'associatedContent is required'],
    },
    title: {
        type: String,
        required: [true, 'title is required'],
        minlength: [4, 'title must be between 4 and 40 characters long'],
        maxlength: [40, 'title must be between 4 and 40 characters long'],
    },
    content: {
        type: String,
        required: [true, 'content is required'],
        minlength: [4, 'content must be at least 4 characters long'],
        maxlength: [800, 'content mustn\'t be longer than 800 characters long'],
    },
    vote: {
        type: Number,
    },
    created: {
        type: Date,
    },
    updated: {
        type: Date,
    },

});

Post.pre('save', async function(next) {
    const now = Date.now();
    if (this.isNew) {
        this.created = now;
    }
    this.updated = now;
    next();
});


const model = mongoose.model('posts', Post);
module.exports = model;
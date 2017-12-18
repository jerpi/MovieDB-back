'use strict';

const express = require('express');
const router = express.Router();
const Post = require('../schemas/post');
const isAuth = require('./auth').isAuth;

router.get('/:contentId', async(req, res) => {
    const id = req.params['contentId'];
    if (!id) { return res.sendStatus(400); }
    try {
        const docs = await Post
            .find({_id: id }) // TODO
            .populate('associatedContent')
            .populate('user');
        res.send(docs);
    } catch(err) {
        res.sendStatus(400);
    }
});

router.post('/:contentId', isAuth, async(req, res) => {
    const body = req.body;
    const post = new Post({
        user: req.session['user'],
        associatedContent: req.params['contentId'],
        title: body.title,
        content: body.content,
        vote: body.vote,
    });
    try {
        await post.save();
        res.sendStatus(200);
    } catch(err) {
        res.sendStatus(400);
    }
});

router.delete('/:id', isAuth, async(req, res) => {
    try {
        const doc = await Post.deleteOne(
            { _id: req.params['id'] },
        );
        if (doc) {
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } catch(err) {
        res.sendStatus(400);
    }

});

router.patch('/:id', isAuth, async(req, res) => {
    const id = req.params['id'];
    const body = req.body;
    try {

    } catch(err) {
        res.sendStatus(400);
    }
});

module.exports = {
    router
};
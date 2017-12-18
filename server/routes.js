const express = require('express');
const router = express.Router();

const auth = require('./routes/auth').router;
const movies = require('./routes/movies').router;
const cast = require('./routes/cast').router;
const posts = require('./routes/posts').router;

router.use('/auth', auth);
router.use('/movies', movies);
router.use('/cast', cast);
router.use('/posts', posts);

module.exports = router;
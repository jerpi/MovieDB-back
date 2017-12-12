const express = require('express');
const router = express.Router();

const auth = require('./routes/auth');
const movies = require('./routes/movies');
const cast = require('./routes/cast');

router.use('/auth', auth);
router.use('/movies', movies);
router.use('/cast', cast);

module.exports = router;
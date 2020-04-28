const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const middleware = require('../middleware');

/* Profile viewer (show) */
router.get('/u/:username', (req, res) => {
    res.render('profiles/profile');
});

module.exports = router;
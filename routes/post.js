/* This file will handle the route for new post, show post, edit and delete posts */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const Post = require('../models/post');
const passport = require('passport');
const middleware = require('../middleware');
const { isLoggedIn } = require('../middleware');

/* In here i'll call the Posts people will make on the app with an uppercase P. The post http method will have a lowercase p */
/* Create new 'Post' route */
router.get('/post/new', isLoggedIn, (req, res) => {
    res.render('posts/new');
});

router.post('/post', isLoggedIn, (req, res) => {
    let post = new Post({
        author: {
            id: req.user._id,
            username: req.user.username
        },
        description: req.body.description,
        image: req.body.image
    })

    Post.create(post, (error, newPost) => {
        if (error) {
            console.log(error);
            res.redirect('/dashboard');
        } else {
            res.redirect('/dashboard');
        }
    })
});

module.exports = router;
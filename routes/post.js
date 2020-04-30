/* This file will handle the route for new post, show post, edit and delete posts */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const Post = require('../models/post');
const middleware = require('../middleware');

/* In here i'll call the posts people will make on the app with an lowercase P. The POST http method will be all in uppercase */
/* Create new 'post' route */
router.get('/post/new', middleware.isLoggedIn, (req, res) => {
    res.render('posts/new');
});

/* POST the new post */
router.post('/post', middleware.isLoggedIn, (req, res) => {
    const post = new Post({
        author: {
            id: req.user._id,
            username: req.user.username
        },
        description: req.body.description,
        image: req.body.image
    });

    /* Create the post */
    Post.create(post, (error, newPost) => {
        if (error) {
            console.log(error);
            /* If there's an error redirect to the dashboard (some error handling in the future) */
            res.redirect('/dashboard');
        } else {

            /* If post created, find an user to push it to the user.posts */
            User.findById(req.user._id, (error, foundUser) => {
                if (error) {
                    console.log(error);
                } else {
                    /* Push the post to user and save */
                    foundUser.posts.push(newPost);
                    foundUser.save();

                    /* Redirect to dashboard */
                    res.redirect('/dashboard');
                }
            });
        }
    });
});

/* Show post route */
router.get('/post/:id', (req, res) => {
    const id = req.params.id;

    Post.findById(id).populate('comments').exec((error, foundPost) => {
        if (error) {
            console.log(error);
            res.redirect('/');
        } else {
            res.render('posts/show', {post: foundPost});
        }
    });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const middleware = require('../middleware');

router.post('/post/:id/comments', (req, res) => {

    const comment = new Comment({
        text: req.body.text,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    });

    Comment.create(comment, (error, newComment) => {
        if (error) {
            console.log(error);
            res.redirect('/dashboard');
        } else {
            Post.findById(req.params.id, (error, foundPost) => {
                if (error) {
                    console.log(error);
                    res.redirect('back');
                } else {
                    foundPost.comments.push(newComment);
                    foundPost.save();
                }
            });

            res.redirect('back');
        }
    });

})

module.exports = router;
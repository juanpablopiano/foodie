const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/post')
const passport = require('passport');
const middleware = require('../middleware');

/* Profile viewer (show) */
router.get('/u/:username', (req, res) => {
    let user = req.params.username;
    
    User.findOne({username: user}).populate('posts').exec((error, foundUser) => {
        if (error) {
            console.log(error);
        } else {
            if (foundUser === null) {
                res.render('profiles/notfound');
            } else {
                if (user !== req.user.username) {
                    let following = foundUser.followers.filter(e => e.username == req.user.username);
                    following = following.length === 0 ? false : true;
                    res.render('profiles/profile', {user: foundUser, following: following});
                } else {
                    res.render('profiles/profile', {user: foundUser});
                }
                
                
            }
        }
    });
});

/* The route to edit the profile. Only accessible profile accessed is the same than the current user */
router.get('/u/:username/edit', (req, res) => {
    if (req.user.username === req.params.username) {
        User.findOne({username: req.user.username}, (error, foundUser) => {
            if (error) {
                console.log(error);
            } else {
                res.render('profiles/edit', {user: foundUser});
            }
        });
    } else {
        res.redirect('back');
    }
});

router.put('/u/:username', (req, res) => {
    if (req.user.username === req.params.username) {

        const user = req.body.user;
        req.body.birthday ? user.birthday = req.body.birthday : "";
        User.findOneAndUpdate({ username: req.user.username }, user, (error, foundUser) => {
            if (error) {
                console.log(error);
                res.redirect('back');
            } else {
                res.redirect(`/u/${foundUser.username}`);
            }
        });
    } else {
        res.redirect('back');
    }
});

router.put('/u/:username/follow', (req, res) => {
    const follower = {
        id: req.user._id,
        username: req.user.username
    }
    User.findOne({username: req.params.username}, (error, foundUser) => {
        if (error) {
            console.log(error);
            res.redirect('back');
        } else {
            /* Checks whether you're following the user. Probably will do with middleware */
            let following = foundUser.followers.filter(e => e.username == req.user.username);
            following = following.length === 0 ? false : true;

            if (!following) {
                foundUser.followers.push(follower);
                foundUser.save();
            }

            res.redirect('back');
        }
    });
});

module.exports = router;
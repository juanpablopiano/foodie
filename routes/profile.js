const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/post')
const passport = require('passport');
const middleware = require('../middleware');

/* Profile viewer (show) */
router.get('/u/:username', (req, res) => {
    let user = req.params.username.toLocaleLowerCase().toLocaleLowerCase();
    
    User.findOne({username: user}).populate('posts').exec((error, foundUser) => {
        if (error) {
            console.log(error);
        } else {
            if (foundUser === null) {
                res.render('profiles/notfound');
            } else {
                if (req.user && user !== req.user.username) {
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
    if (req.user.username === req.params.username.toLocaleLowerCase()) {
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

/* Edit put route */
router.put('/u/:username', (req, res) => {
    if (req.user.username === req.params.username.toLocaleLowerCase()) {

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

/* Follow implementation */
router.put('/u/:username/follow', (req, res) => {
    /* Creates a follower object based on the current  */
    const follower = {
        id: req.user._id,
        username: req.user.username
    };
    /* Finds the profile of the user currently visited */
    User.findOne({username: req.params.username.toLocaleLowerCase()}, (error, foundUser) => {
        if (error) {
            console.log(error);
            res.redirect('back');
        } else {
            /* Checks whether you're following the user. Probably will do with middleware */
            let following = foundUser.followers.filter(e => e.username == req.user.username);
            following = following.length === 0 ? false : true;

            if (!following) {
                /* If not following, update the visited profile followers */
                foundUser.followers.push(follower);
                foundUser.save();

                /* Then update the current user followings */
                User.findById(follower.id, (error, currUser) => {

                    currUser.following.push({
                        id: foundUser._id,
                        username: foundUser.username
                    });
                    currUser.save();
                });
            }

            res.redirect(`/u/${req.params.username}`);
        }
    });
});

/* Unfollow implementation */
router.put('/u/:username/unfollow', (req, res) => {
    
    /* finds the register of the visited user */
    User.findOne({username: req.params.username.toLowerCase()}, (error, foundUser) => {
        if (error) {
            console.log(error);
            res.redirect('back');
        } else {
            /* Checks whether you're following the user. Probably will do with middleware */
            let following = foundUser.followers.filter(e => e.username == req.user.username);
            following = following.length === 0 ? false : true;

            if (following) {
                foundUser.followers = foundUser.followers.filter(e => !(e.username === req.user.username));
                foundUser.save();

                User.findById(req.user._id, (error, currUser) => {

                    currUser.following = currUser.following.filter(e => !(e.username === foundUser.username));
                    currUser.save();
                });
            }

            res.redirect('back');
        }
    });
});

/* Some testing grounds to get to know better the mongoose handling */
router.get('/profiles/:username', (req, res) => {
    const username = req.params.username;
    async function getUser(username) {
        const user = await User.findOne({username: username});
        return(user);
    }

    getUser(username)
    .then(foundUser => {
        res.render('profiles/test2', {user: foundUser});
    });
});

router.get('/profiles/', (req, res) => {

    async function getUser() {
        const users = await User.find({});
        return(users);
    }

    getUser()
    .then(foundUsers => {
        res.render('profiles/test', {users: foundUsers});
    });
});

module.exports = router;
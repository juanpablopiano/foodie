const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/post');
const passport = require('passport');
const middleware = require('../middleware');

/* First routing */

/* Landing page */
router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard');
    } else {
        res.render('index');
    }
});

// =======================
// AUTH ROUTES
// =======================
/* Register routes */
router.get('/register', (req, res) => {
    res.render('register');
});
router.post('/register', (req, res) => {
    let newUser = new User({
        name: req.body.user.name,
        lastname: req.body.user.lastname,
        email: req.body.user.email,
        username: req.body.username,
        registerDate: new Date()
    });
    let password = req.body.password;

    User.register(newUser, password, (error, user) => {
        if (error) {
            console.log(error);
            res.redirect('/register');
        }

        passport.authenticate('local')(req, res, () => {
            res.redirect('/dashboard');
        });
    });
});

/* Login routes */
router.get('/login', (req, res) => {
    res.render('login');
});
router.post('/login', (req, res) => {
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/login"
    })(req, res);
});

/* Logout route */
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

/* Dashboard route */
/* For now it'll be displaying all of the posts of everyone */
/* Some time in the near future it'll filter chronologically the posts of the people you follow, and it'll an amout at a time */
router.get('/dashboard', middleware.isLoggedIn, (req, res) => {

    Post.find({}, (error, allPosts) => {
        if (error) {
            console.log(error);
        } else {
            res.render('dashboard', {posts: allPosts});
        }
    });
});

module.exports = router;
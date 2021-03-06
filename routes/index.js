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
router.get('/register', middleware.loginRedirect, (req, res) => {
    res.render('register');
});
router.post('/register', middleware.loginRedirect, (req, res) => {
    let newUser = new User({
        firstname: req.body.user.firstname,
        lastname: req.body.user.lastname,
        email: req.body.user.email,
        username: req.body.username.toLowerCase(),
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
router.get('/login', middleware.loginRedirect, (req, res) => {
    res.render('login');
});
router.post('/login', middleware.loginRedirect, (req, res) => {
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
    const following = req.user.following;
    Post.find({}).
    then(allPosts => {
        const p = [];
        let a = [];

        following.forEach(user => {
            a = allPosts.filter(posts => posts.author.username === user.username);
            p.push(...a);
        });
        a = allPosts.filter(posts => posts.author.username === req.user.username);
        p.push(...a);

        a = p.sort((a, b) => b.postDate - a.postDate);
        return p;
    }).
    then(p => res.render('dashboard', {posts: p}));
});

module.exports = router;
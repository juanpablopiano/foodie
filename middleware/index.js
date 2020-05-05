const User = require('../models/user');

let middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
};

middlewareObj.loginRedirect = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }

    return next();
}

middlewareObj.checkPostOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Post.findById(req.params.id).
        then(foundPost => {
            if (foundPost.author.id.equals(req.user._id)) {
                 return next();
            } else {
                return res.redirect('back');
            }
        });
    } else {
        return res.redirect('back');
    }
};

middlewareObj.checkFollowing = (req, res, next) => {

    if (req.isAuthenticated()) {
        User.findOne({username: req.params.username}).
        then(foundUser => {
            let following = foundUser.followers.filter(e => e.username === req.user.username);
            following = following.length === 0 ? false : true;

            if (!following) {
                return next();
            } else {
                return res.redirect('back');
            }
        })
    } else {
        return res.redirect('/login');
    }
    
}

module.exports = middlewareObj;
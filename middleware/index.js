const User = require('../models/user');

let middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

/*
middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                req.flash("error", "Campground not found");
                res.redirect('back');
            } else {
                // does the user own the campground?
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash('error', "You need to be logged in to do that!")
        res.redirect('back');
    }
}
*/

module.exports = middlewareObj;
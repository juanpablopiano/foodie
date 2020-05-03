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
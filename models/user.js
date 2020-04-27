const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// User Schema set up
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    name: String,
    lastname: String,
    avatar: String,
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    recipes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
        }
    ],
    shoppingList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ingredient',
            amount: Number,
            price: String
        }
    ]
    

});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);
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
    birthday: Date,
    registerDate: {
        type: Date,
        default: Date.now
    },
    phoneNumber: String,
    following: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            username: String
        }
    ],
    followers: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            username: String
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
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Ingredient'
            },
            amount: Number,
            price: String
        }
    ]
    

});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);
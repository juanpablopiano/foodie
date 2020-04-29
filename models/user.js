const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// User Schema set up
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    name: String,
    lastname: String,
    avatar: {
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR1KYdVbr_q9oPjjbBDx9se1reB9_DhUcpwwzGtkeLCSyp8v9dr&usqp=CAU',
    },
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
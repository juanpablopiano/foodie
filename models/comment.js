const mongoose = require('mongoose');

// Comment Schema set up
const commentSchema = new mongoose.Schema({
    text: String,
    date: {
        type: Date,
        default: Date.now
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
    //likes...... incoming

});

module.exports = mongoose.model('Comment', commentSchema);
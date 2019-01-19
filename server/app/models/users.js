// app/models/users.js

var mongoose     = require('mongoose');

var UserSchema   = new mongoose.Schema({
    fullName: {
        type:String,
        trim: true,
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        minlength: 5,
        maxlength: 50,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minlength: 5,
        required: true,
    },
});

module.exports = mongoose.model('User', UserSchema);

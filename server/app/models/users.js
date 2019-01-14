// app/models/users.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    fullName: {
        type:String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        minlength: 5,
        maxlength: 50,
        required: true,
    },
    password: {
        type: String,
        minlength: 5,
        required: true,
    },
});

module.exports = mongoose.model('User', UserSchema);

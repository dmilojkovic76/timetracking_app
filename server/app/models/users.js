// app/models/users.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
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
        required: true,
    },
});

module.exports = mongoose.model('User', UserSchema);

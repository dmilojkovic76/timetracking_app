// app/models/users.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    required: [true, 'Polje za Ime ne može biti prazno.'],
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    minlength: 5,
    maxlength: 50,
    required: [true, 'Polje za email adresu ne može biti prazno.'],
    unique: true,
  },
  password: {
    type: String,
    minlength: 5,
    required: [true, 'Polje za šifru ne može biti prazno.'],
  },
});

module.exports = mongoose.model('User', UserSchema);

// app/models/timers.js

const mongoose = require('mongoose');

const TimerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'ID korisnika ne može biti prazan.'],
  },
  startTime: {
    type: Date,
    required: [true, 'Početno vreme je obaveyno polje.'],
  },
  endTime: {
    type: Date,
  },
});

module.exports = mongoose.model('Timer', TimerSchema);

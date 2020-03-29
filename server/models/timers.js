// app/models/timers.js

const mongoose = require('mongoose');

const TimerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
  },
});

module.exports = mongoose.model('Timer', TimerSchema);

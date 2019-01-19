// app/models/timers.js

var mongoose     = require('mongoose');

var TimerSchema   = new mongoose.Schema({
    userId: String,
    startTime: Date,
    endTime: Date
});

module.exports = mongoose.model('Timer', TimerSchema);

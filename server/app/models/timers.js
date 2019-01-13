// app/models/timers.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TimerSchema   = new Schema({
    userId: String,
    startTime: Date,
    endTime: Date
});

module.exports = mongoose.model('Timer', TimerSchema);

const mongoose = require('mongoose');

const timeSchema = mongoose.Schema({
    hours: {
        type: Number,
        required: true,
        min: 0
    },
    minutes: {
        type: Number,
        required: true,
        min: 0,
        max: 59
    },
    seconds: {
        type: Number,
        required: true,
        min: 0,
        max: 59
    }
});

const Time = mongoose.model('time', timeSchema)
module.exports = Time;
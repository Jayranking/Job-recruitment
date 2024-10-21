const mongoose = require('mongoose');

const resultSchema = mongoose.Schema({
    applicantId: {
        type: mongoose.Schema.ObjectId,
        ref: 'applicant',
        required: true
    },

    answers: [{
        questionId: {
            type: mongoose.Schema.ObjectId,
            ref: 'question',
            required: true
        },
        selectedOption: {
            type: String,
            required: true
        },
        isCorrect: {
            type: Boolean,
            required: true
        }
    }],
    score: {
        type: Number,
        required: true
    }
});

const Result = mongoose.model('Result', resultSchema); 
module.exports = Result;

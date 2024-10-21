const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    question: {
        type: String,
        required: true
    },

    options: {
        type: Array,
        required: true
    },
    
    correctAnswer: {
        type: String,
        required: true
    },
    

});

const Question = mongoose.model('question', questionSchema);
module.exports = Question;
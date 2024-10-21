const mongoose = require('mongoose'); 

const jobSchema = mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },

    eduRequirement : {
        type : String,
        required : true
    },

    jobExperience : {
        type : String,
        required : true
    },

    skills : {
        type : String,
        required : true
    }

});

const Job = mongoose.model('job', jobSchema);
module.exports = Job;
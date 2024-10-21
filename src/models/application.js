const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const applicationSchema = mongoose.Schema({
    job_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'job',
        required: true
    },

    fullName: {
        type: String,
        required: true
    },

    email : {
        type : String,
        required : true
    },

    phone_no : {
        type : String,
        required : true
    },

    qualification : {
        type : String,
        required : true
    },

    resume : {
        type : String,
        required : true
    },

    password: {
        type: String,
    }
});

applicationSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  });
  
  // applicant login
  applicationSchema.statics.login = async function (email, password) {
    const applicant = await this.findOne({ email });
    if (applicant) {
      // compare password
      const auth = await bcrypt.compare(password, applicant.password);
  
      if (auth) {
        return applicant;
      }
      throw new Error("Incorrect email address or password");
    }
    throw new Error("Incorrect email address or password");
  };

const Applicant = mongoose.model('applicant', applicationSchema);
module.exports = Applicant;
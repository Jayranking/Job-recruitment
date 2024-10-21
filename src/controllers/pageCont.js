const Applicant = require('../models/application');
const Job = require('../models/jobs');
const Question = require('../models/question');
const Time = require('../models/time');
const jwt = require('jsonwebtoken');

module.exports = {
  index: async(req, res) => {
    const context = {};
    try {
      const _availableJobs = await Job.find();
      context['availableJobs'] = _availableJobs;

      res.render("index", {res, context});
    } catch (error) {
      return res.status(500).json({error: error.message});
    }
  },

  get_applicationForm: async(req, res) => {
    const context = {};
    try {
      const _job = await Job.findOne({_id: req.query.job_id});
      context['job'] = _job
      
      res.render("applyForm", {res, context});
    } catch (error) {
      return res.status(500).json({error: error.message})
    }
  },

  applicationForm: async(req, res) => {
    const {job_id, fullName, email, phone_no, qualification} = req.body;

    // Regex for validation
    const nameReg = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
    const phone_noReg = /^[0-9]+$/;
    const emailReg = /^[a-z0-9]([a-z0-9_\.\-])*\@(([a-z0-9])+(\-[a-z0-9]+)*\.)+([a-z0-9]{2,4})/;

    try {
        const resume = req.file ? req.file.filename : null;

        // Validation checks
        if (!nameReg.test(fullName)) {
            throw new Error("Full name is required");
        }

        if (!emailReg.test(email)) {
            throw new Error("Email is required");
        }

        if (!phone_noReg.test(phone_no)) {
            throw new Error("Phone number is required");
        }

        if (qualification == "") {
            throw new Error("Select your Qualification");
        }

        if (!resume) {
            throw new Error("Upload your resume");
        }

        // db
        const applicant = await Applicant.create({
            job_id,
            fullName,
            email,
            phone_no,
            qualification,
            resume,
        });
        
        return res.status(200).json({
            success: true,
            msg: "Application submitted successfully",
            redirectURL: '/'
        });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  get_login: (req, res) => {
    res.render("login");
  },

  login: async(req, res) =>{
    const {email, password} = req.body;
    const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordReg = /^(?:[0-9A-Za-z!@#$%^&*()\-+=_{}\[\]|:;"'<>,.?\\/ ])+$/;

    try {
        if (!emailReg.test(email)) {
            throw new Error('Incorrect Emaill Address');
        }

        if (!passwordReg.test(password)) {
            throw new Error('Incorrect password')
        }

        // invoke the static login method
        const isLoggedIn = await Applicant.login(email, password)
        // console.log(isLoggedIn)

        if (isLoggedIn) {
            // Generate JWT token
            const token = jwt.sign({id: isLoggedIn._id}, process.env.TOKEN_SECRET,
                {expiresIn: 4000 * 60 * 60 * 24}
            )
            
            // console.log(token);
            // send JWT to cookie
            res.cookie('jwt', token, {maxAge: 4000 * 60 * 60 * 24}); 

            return res.status(200).json({
                success: true, 
                msg:'Login Successfully',
                redirectURL : '/exam-page',
            });
        }else{
            throw new Error('Invalid Credentials');
        }
    } catch (error) {
        return res.status(401).json({error: error.message})
    }
},

  exam_page: async(req, res) => {
    const context = {}
    try {

      const _applicant = await Applicant.findOne({_id: req.applicant});
      context['applicant'] = _applicant
      // console.log(_applicant);
      
      
      res.render("exam_page", {res, context});
    } catch (error) {
      return res.status(500).json({error: error.message})
    }
  },

  exam: async (req, res) => {
    const context = {}
    try {

        const _examQuestions = await Question.find()
        context['examQuestions'] = _examQuestions

        const time = await Time.findOne();
        

        console.log(_examQuestions)
        return res.render('exam', { context,res,time});
    } catch (error) {  
        console.log(error);  
        return res.status(500).json({ error: error.message })
    }
  },



  

};

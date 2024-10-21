const Job = require('../models/jobs');
const Admin = require('../models/admin');
const Applicant = require('../models/application');
const jwt = require('jsonwebtoken');
const Question = require('../models/question');
const Score = require('../models/result');
const { sendEmailToApplicant } = require('../helpers/mailer');
const bcrypt = require("bcrypt");
const Result = require('../models/result');




module.exports = {
    dashboard: (req, res) => {
        res.render('dashboard');
    },

    view_applicants: async(req, res) => {
        const context = {};
        try {
            const _applicants = await Applicant.find().populate('job_id');
            context['applicants'] = _applicants;

            res.render('view_applicants', {res, context});
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },

    set_exam: (req, res)=> {
        res.render('set_exam')
    },

    exam_question: async (req, res) => {
        const {
            question,
            options,
            correctAnswer,
        } = req.body;

        const pattern = /^[A-Za-z0-9_\-? ]+$/;

        try {
            if (!pattern.test(question)) {
                throw new Error('Type questions correctly');
            }

            if (options == []) {
                throw new Error('Please upload Options');
            }

            if (!correctAnswer) {
                throw new Error('Please select the correct answer');
            }

            const _question = await Question.create({
                question,
                options,
                correctAnswer,
            })
            return res.status(200).json({
                success: true, msg: 'Question added successfully',
                redirectURL: '/admin/view-questions',
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    },

    view_questions: async(req, res) => {
        const context = {};
        try {
            const _questions = await Question.find();
            context['questions'] = _questions;

            res.render('questions', {res, context});
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },

    result: async (req, res) => {
        try {
            const applicantId = req.body.applicantId;
            console.log('Request received with data:', req.body); // Debugging log
    
            const selectedAnswers = req.body.answers;
            const existingResult = await Result.findOne({applicantId});
    
            if (existingResult) {
                return res.status(400).json({ 
                    error: 'You have already taken this exam, Logout Now!!!' 
                });
            }
    
            let score = 0;
            const answers = [];
            const questions = await Question.find();
            const correctAnswersMap = new Map();
    
            questions.forEach(question => {
                correctAnswersMap.set(question._id.toString(), question.correctAnswer);
            });
    
            for (const answer of selectedAnswers) {
                const question = await Question.findById(answer.questionId);
                if (!question) {
                    return res.status(400).json({ error: `Question with ID ${answer.questionId} not found` });
                }
    
                const selectedOptionLetter = String.fromCharCode(65 + question.options.indexOf(answer.selectedOption));
                const isCorrect = question.correctAnswer === selectedOptionLetter;
                if (isCorrect) score += 2;
    
                answers.push({ questionId: answer.questionId, selectedOption: answer.selectedOption, isCorrect });
            }
    
            const result = await Result.create({applicantId, answers, score });
            console.log('Result saved:', result); // Debugging log
            return res.status(200).json({ success: true, msg: 'Exam submitted successfully', redirectURL: '/login' });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: error.message });
        }
    },
    
    applicants_result: async(req, res) => {
        const context = {}
        try {
            const _result = await Score.find().populate('applicantId');
            context['results'] = _result;

            console.log(_result);
            
            res.render('applicants_result', {res, context});
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },

    get_post_job: (req, res) => {
        res.render('post_job');
    },

    post_job: async(req, res) => {
        const {jobTitle, eduRequirement, jobExperience, skills} = req.body;

        const textReg = /^[a-zA-Z0-9\s,.'()\-!]+$/;
        try {
            if (!textReg.test(jobTitle)) {
                throw new Error("Invalid text format input");
              }
            
              if (!textReg.test(eduRequirement)) {
                throw new Error("Invalid text format input");
              }
            
              if (!textReg.test(jobExperience)) {
                throw new Error("Invalid text format input");
              }
            
              if (!textReg.test(skills)) {
                throw new Error("Invalid text format input");
              }

              const job = await Job.create({jobTitle, eduRequirement, jobExperience, skills});
              console.log(job)

              res.status(200).json({
                success: true,
                msg: 'Job published successfully!',
                redirectURL: '/admin/available-jobs'
              })
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    },

    view_availableJobs: async(req, res) => {
        const context  = {};
        try {
            const _availableJobs = await Job.find();
            context['availableJobs'] = _availableJobs;

            res.render('availableJobs', {res,context})
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },

    get_login: (req, res) => {
      res.render('adminLogin')
    },
    login: async (req, res) => {
      const { email, password } = req.body;
      const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const pwdReg = /^(?:[0-9A-Za-z!@#$%^&*()\-+=_{}\[\]|:;"'<>,.?\\/ ])+$/;

      try {
          if (!emailReg.test(email)) {
              throw new Error('Invalid email address')
          }

          if (!pwdReg.test(password)) {
              throw new Error('Incorrect password')
          }

          // invoke the static login method
          const isLoggedIn = await Admin.login(email, password)

          if (isLoggedIn) {
              // Generate JWT token
              const token = jwt.sign({ id: isLoggedIn._id }, process.env.TOKEN_SECRET,
                  { expiresIn: 1000 * 60 * 60 * 24 }
              )
              // console.log(token);

              // send JWT to cookie
              res.cookie('jwt', token, { maxAge: 4000 * 60 * 60 });

              return res.status(200).json({
                  success: true, msg: 'Login Successfully',
                  redirectURL: '/admin/dashboard',
                  admin: isLoggedIn
              })
          }
      }   catch (error) {
          return res.status(401).json({ error: error.message })
      }
    },
    register_admin: async (req, res) => {
        const { fullname, email, phone_no} = req.body;

        const fullnameReg = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
        const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneReg = /^0[1-9]\d{9}$/;

        try {
            if (!fullnameReg.test(fullname)) {
                throw new Error('Invalid name format');
            }

            if (!emailReg.test(email)) {
                throw new Error('Invalid email address');
            }

            if (!phoneReg.test(phone_no)) {
                throw new Error('Invalid phone number input');
            }

            // Create user and put in db
            const admin = await Admin.create(
                { fullname, email, phone_no, password: 'Password@2' }
            )
            console.log(admin);

            return res.status(200).json({
                success: true, msg: 'Account created successfully',
                redirectURL: '/admin/sign-in'
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    admin_logout: (req, res) => {
        res.cookie('jwt', "", {maxAge: 4});
        res.redirect('/admin/sign-in')
    },

    send_mail: async (req, res) => {
        const { applicant_id } = req.body;
        try {
            if (!applicant_id) {
                throw Error('Invalid Data');
            }
            const loginUrl = `${req.protocol}://${req.get('host')}/login`;
    
            const _getApplicant = await Applicant.findOne({ _id: applicant_id });
    
            const userPassword = Math.random().toString(36).slice(-8);
            console.log("Generated password:", userPassword);
    
            // Hash the password before saving it to the database
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(userPassword, salt);
    
            const updatedUserDetails = await Applicant.findOneAndUpdate(
                { _id: applicant_id },
                { password: hashedPassword }
            );
    
            if (updatedUserDetails) {
                const message = `Hello \n Dear ${updatedUserDetails.fullName}, your Job application has been received and approved. \n
                You can now login to the exam portal to proceed with the CBT exam.\n
                Your password is: '${userPassword}' (please keep it secure). \n
                Your registration email: '${updatedUserDetails.email}'\n
                Login URL: '${loginUrl}'`;
    
                // Send the email with the plain text password
                sendEmailToApplicant(updatedUserDetails.email, message);
            }
    
            return res.status(200).json({
                success: true,
                msg: 'Email sent successfully',
                redirectURL: '/admin/dashboard'
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    },
    
};  
const express = require('express');
const route = express.Router();
const adminCont = require('../controllers/adminCont');
const { checkAdmin } = require('../middlewares/authMiddleware');


route.get('/dashboard', checkAdmin, adminCont.dashboard);
route.get('/view-applicants', checkAdmin, adminCont.view_applicants);

route.get('/applicants-results', checkAdmin, adminCont.applicants_result);
route.get('/set-exam', checkAdmin, adminCont.set_exam);
route.post('/exam-question', checkAdmin, adminCont.exam_question);
route.get('/view-questions', checkAdmin, adminCont.view_questions);
route.post('/result',  adminCont.result);

route.get('/post-job', checkAdmin, adminCont.get_post_job);
route.post('/post-job', checkAdmin, adminCont.post_job);
route.get('/available-jobs', checkAdmin, adminCont.view_availableJobs);

route.get('/sign-in', adminCont.get_login);
route.post('/sign-in', adminCont.login);
route.post('/sign-up', adminCont.register_admin);
route.get('/logout', adminCont.admin_logout);

route.post('/send-email', adminCont.send_mail);

module.exports = route;
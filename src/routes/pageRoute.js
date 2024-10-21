const pageCont = require('../controllers/pageCont');
const express = require('express');
const {profileHandler} = require('../helpers/img_handler')
const { checkApplicant } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', pageCont.index);

router.get('/application-form', pageCont.get_applicationForm);
router.post('/apply-form', profileHandler, pageCont.applicationForm);

router.get('/exam-page', checkApplicant, pageCont.exam_page);
router.get('/exam', checkApplicant, pageCont.exam);

router.get('/login', pageCont.get_login);
router.post('/sign-in', pageCont.login);


module.exports = router;
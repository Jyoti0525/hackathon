// backend/src/routes/interviewPrep.routes.js
const express = require('express');
const router = express.Router();
const interviewPrepController = require('../controllers/interviewPrepController');
const auth = require('../middlewares/auth');

router.post('/generate-questions', auth, interviewPrepController.generateQuestions);
router.post('/evaluate-response', auth, interviewPrepController.evaluateResponse);
router.get('/tips', auth, interviewPrepController.getInterviewTips);

module.exports = router;
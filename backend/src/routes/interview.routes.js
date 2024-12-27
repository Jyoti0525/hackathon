// backend/src/routes/interview.routes.js
const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const auth = require('../middlewares/auth');

// Interview session management
router.post('/sessions', auth, interviewController.createInterviewSession);
router.get('/sessions', auth, interviewController.getInterviewSessions);
router.get('/sessions/:id', auth, interviewController.getSessionById);
router.put('/sessions/:id', auth, interviewController.updateSession);

// Interview questions and responses
router.post('/sessions/:id/questions', auth, interviewController.generateQuestions);
router.post('/sessions/:id/responses', auth, interviewController.submitResponse);
router.get('/sessions/:id/feedback', auth, interviewController.getFeedback);

// Mock interviews
router.post('/mock', auth, interviewController.startMockInterview);
router.post('/mock/:id/next', auth, interviewController.getNextQuestion);
router.post('/mock/:id/evaluate', auth, interviewController.evaluateResponse);
router.get('/mock/:id/summary', auth, interviewController.getMockInterviewSummary);

// Practice and preparation
router.get('/practice/questions', auth, interviewController.getPracticeQuestions);
router.post('/practice/evaluate', auth, interviewController.evaluatePracticeResponse);
router.get('/practice/tips', auth, interviewController.getInterviewTips);

module.exports = router;
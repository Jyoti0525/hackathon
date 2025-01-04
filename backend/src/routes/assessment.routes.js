// backend/src/routes/assessment.routes.js
const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessment.controller'); 
const auth = require('../middlewares/auth');

router.get('/student-assessments', auth, assessmentController.getStudentAssessments);
router.post('/start/:assessmentId', auth, assessmentController.startAssessment);

module.exports = router;
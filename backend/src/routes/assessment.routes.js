// backend/src/routes/assessment.routes.js
const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const auth = require('../middlewares/auth');

// Core assessment routes
router.post('/', auth, assessmentController.createAssessment);
router.get('/', auth, assessmentController.getAssessments);
router.get('/:id', auth, assessmentController.getAssessmentById);
router.put('/:id', auth, assessmentController.updateAssessment);
router.delete('/:id', auth, assessmentController.deleteAssessment);

// Assessment taking routes
router.post('/:id/start', auth, assessmentController.startAssessment);
router.post('/:id/submit', auth, assessmentController.submitAssessment);
router.get('/:id/result', auth, assessmentController.getAssessmentResult);

// Assessment analytics
router.get('/analytics/performance', auth, assessmentController.getPerformanceAnalytics);
router.get('/analytics/progress', auth, assessmentController.getProgressAnalytics);

module.exports = router;
// backend/src/routes/analytics.routes.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middlewares/auth');

router.get('/student-progress', auth, analyticsController.getStudentProgress);
router.get('/assessments', auth, analyticsController.getAssessmentAnalytics);
router.get('/applications', auth, analyticsController.getApplicationAnalytics);
router.get('/career-readiness', auth, analyticsController.getCareerReadiness);
router.get('/comprehensive', auth, analyticsController.getComprehensiveAnalytics);

module.exports = router;
// backend/src/routes/jobMatching.routes.js
const express = require('express');
const router = express.Router();
const jobMatchingController = require('../controllers/jobMatchingController');
const auth = require('../middlewares/auth');

// Get matched jobs for student
router.get('/matches', auth, jobMatchingController.getMatchedJobs);

// Get detailed job fit analysis
router.get('/analysis/:jobId', auth, jobMatchingController.getJobFitAnalysis);

// Get skill improvement suggestions
router.get('/skills/:jobId', auth, jobMatchingController.getSkillImprovements);

// Get job market trends
router.get('/trends', auth, jobMatchingController.getJobTrends);

module.exports = router;
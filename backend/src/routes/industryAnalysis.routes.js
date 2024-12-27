// backend/src/routes/industryAnalysis.routes.js
const express = require('express');
const router = express.Router();
const industryAnalysisController = require('../controllers/industryAnalysisController');
const auth = require('../middlewares/auth');

// Get industry trends and analysis
router.get('/trends', auth, industryAnalysisController.getIndustryTrends);

// Get career pathway recommendations
router.get('/career-paths', auth, industryAnalysisController.getCareerPathways);

// Get predicted skill demands
router.get('/skill-predictions', auth, industryAnalysisController.getPredictedSkills);

// Get comprehensive industry insights
router.get('/insights', auth, industryAnalysisController.getIndustryInsights);

module.exports = router;
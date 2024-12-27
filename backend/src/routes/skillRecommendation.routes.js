// backend/src/routes/skillRecommendation.routes.js
const express = require('express');
const router = express.Router();
const skillRecommendationController = require('../controllers/skillRecommendationController');
const auth = require('../middlewares/auth');

// Get personalized learning path
router.get('/learning-path', auth, skillRecommendationController.getLearningPath);

// Get skill improvement recommendations
router.get('/improvements', auth, skillRecommendationController.getSkillImprovements);

// Get project suggestions
router.get('/projects', auth, skillRecommendationController.getProjectSuggestions);

// Get comprehensive recommendations
router.get('/comprehensive', auth, skillRecommendationController.getComprehensiveRecommendations);

module.exports = router;
// backend/src/routes/resumeEnhancement.routes.js
const express = require('express');
const router = express.Router();
const resumeEnhancementController = require('../controllers/resumeEnhancementController');
const auth = require('../middlewares/auth');

router.post('/optimize', auth, resumeEnhancementController.optimizeResume);
router.post('/extract-skills', auth, resumeEnhancementController.extractSkills);
router.post('/enhance-achievements', auth, resumeEnhancementController.enhanceAchievements);
router.post('/ats-optimize', auth, resumeEnhancementController.optimizeForATS);

module.exports = router;
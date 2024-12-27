// backend/src/routes/aiIntegration.routes.js
const express = require('express');
const router = express.Router();
const aiIntegrationController = require('../controllers/aiIntegrationController');
const auth = require('../middlewares/auth');

router.get('/profile-analysis', auth, aiIntegrationController.processProfile);
router.post('/enhance-profile', auth, aiIntegrationController.enhanceProfile);
router.get('/career-insights', auth, aiIntegrationController.getCareerInsights);
router.post('/verify-skills', auth, aiIntegrationController.verifySkills);
router.get('/comprehensive-analysis', auth, aiIntegrationController.getComprehensiveAnalysis);

module.exports = router;
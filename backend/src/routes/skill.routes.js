// backend/src/routes/skill.routes.js
const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const auth = require('../middlewares/auth');

// Core skill routes
router.get('/', auth, skillController.getSkills);
router.post('/', auth, skillController.addSkill);
router.put('/:id', auth, skillController.updateSkill);
router.delete('/:id', auth, skillController.deleteSkill);

// Skill assessment and verification
router.post('/assess', auth, skillController.assessSkill);
router.post('/verify', auth, skillController.verifySkill);
router.get('/recommendations', auth, skillController.getSkillRecommendations);

// Skill analytics
router.get('/analytics', auth, skillController.getSkillAnalytics);
router.get('/trends', auth, skillController.getSkillTrends);
router.get('/gaps', auth, skillController.getSkillGaps);

// Learning paths
router.get('/learning-paths', auth, skillController.getLearningPaths);
router.post('/learning-paths', auth, skillController.createLearningPath);
router.get('/progress', auth, skillController.getSkillProgress);

module.exports = router;
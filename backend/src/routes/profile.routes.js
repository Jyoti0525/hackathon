// src/routes/profile.routes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const auth = require('../middlewares/auth');

// Get and update profile
router.get('/', auth, profileController.getProfile);
router.put('/', auth, profileController.updateProfile);

// Student-specific routes
router.post('/skills', auth, profileController.addSkill);
router.post('/certifications', auth, profileController.addCertification);
router.post('/projects', auth, profileController.addProject);

module.exports = router;
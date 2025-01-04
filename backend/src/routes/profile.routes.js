// backend/src/routes/profile.routes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const auth = require('../middlewares/auth');

// GET request to fetch profile
router.get('/get-profile', auth, profileController.getProfile);

// PUT request to update profile
router.put('/update-profile', auth, profileController.updateProfile);

module.exports = router;
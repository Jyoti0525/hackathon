// src/routes/student.routes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const auth = require('../middlewares/auth');

// Get student profile
router.get('/profile', auth, studentController.getProfile);

// Update student profile
router.put('/profile', auth, studentController.updateProfile);

// Get available jobs
router.get('/jobs', auth, studentController.getAvailableJobs);

// Apply for a job
router.post('/apply/:jobId', auth, studentController.applyForJob);

module.exports = router;
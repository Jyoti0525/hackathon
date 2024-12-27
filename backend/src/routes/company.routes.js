// src/routes/company.routes.js
const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const auth = require('../middlewares/auth');

// Get company profile
router.get('/profile', auth, companyController.getProfile);

// Update company profile
router.put('/profile', auth, companyController.updateProfile);

// Post a new job
router.post('/jobs', auth, companyController.postJob);

// Get applications
router.get('/applications', auth, companyController.getApplications);

module.exports = router;
// backend/src/routes/job.routes.js
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middlewares/auth');

// Job listing routes
router.post('/', auth, jobController.createJob);
router.get('/', auth, jobController.getJobs);
router.get('/:id', auth, jobController.getJobById);
router.put('/:id', auth, jobController.updateJob);
router.delete('/:id', auth, jobController.deleteJob);

// Job application routes
router.post('/:id/apply', auth, jobController.applyForJob);
router.get('/applications', auth, jobController.getApplications);
router.put('/applications/:id/status', auth, jobController.updateApplicationStatus);

// Job matching routes
router.get('/matches', auth, jobController.getJobMatches);
router.get('/recommendations', auth, jobController.getRecommendedJobs);

module.exports = router;
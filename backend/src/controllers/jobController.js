// backend/src/controllers/jobController.js
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const jobMatchingService = require('../services/jobMatchingService');

exports.createJob = async (req, res) => {
    try {
        const job = new Job({
            ...req.body,
            company: req.user.companyId
        });
        await job.save();
        res.status(201).json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getJobs = async (req, res) => {
    try {
        const filters = { ...req.query };
        const jobs = await Job.find(filters).populate('company', 'name location');
        res.json({ success: true, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('company', 'name location');
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        res.json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true, runValidators: true }
        );
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        res.json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.applyForJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        const existingApplication = await JobApplication.findOne({
            job: req.params.id,
            student: req.user.id
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this job'
            });
        }

        const application = new JobApplication({
            job: req.params.id,
            student: req.user.id,
            status: 'pending',
            ...req.body
        });

        await application.save();
        res.status(201).json({ success: true, data: application });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getApplications = async (req, res) => {
    try {
        const applications = await JobApplication.find({
            [req.user.role === 'student' ? 'student' : 'company']: req.user.id
        })
        .populate('job')
        .populate('student', 'name email');

        res.json({ success: true, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateApplicationStatus = async (req, res) => {
    try {
        const application = await JobApplication.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.json({ success: true, data: application });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getJobMatches = async (req, res) => {
    try {
        const matches = await jobMatchingService.matchJobsToStudent(req.user.id);
        res.json({ success: true, data: matches });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getRecommendedJobs = async (req, res) => {
    try {
        const recommendations = await jobMatchingService.getRecommendedJobs(req.user.id);
        res.json({ success: true, data: recommendations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
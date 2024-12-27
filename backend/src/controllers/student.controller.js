// src/controllers/student.controller.js
const Student = require('../models/Student');
const User = require('../models/User');

// Get student profile
exports.getProfile = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.userId })
            .populate('university', 'name');
        
        if (!student) {
            return res.status(404).json({ message: 'Student profile not found' });
        }
        
        res.json(student);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Error getting profile' });
    }
};

// Update student profile
exports.updateProfile = async (req, res) => {
    try {
        const student = await Student.findOneAndUpdate(
            { userId: req.user.userId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ message: 'Student profile not found' });
        }

        res.json(student);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};

// Get available jobs
exports.getAvailableJobs = async (req, res) => {
    try {
        // This is a placeholder - implement the actual job fetching logic
        res.json({ message: 'Job fetching functionality will be implemented here' });
    } catch (error) {
        console.error('Get jobs error:', error);
        res.status(500).json({ message: 'Error getting jobs' });
    }
};

// Apply for a job
exports.applyForJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        // This is a placeholder - implement the actual job application logic
        res.json({ message: 'Job application functionality will be implemented here' });
    } catch (error) {
        console.error('Job application error:', error);
        res.status(500).json({ message: 'Error applying for job' });
    }
};
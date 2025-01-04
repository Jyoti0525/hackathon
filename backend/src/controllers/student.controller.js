// src/controllers/student.controller.js
const Student = require('../models/Student');
const User = require('../models/User');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const Skill = require('../models/Skill');

exports.getProfile = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.userId })
            .populate('university', 'name')
            .populate('skills')
            .populate('applications')
            .populate('interviews');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        res.json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting profile',
            error: error.message
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, department, year, phone, email, university, cgpa } = req.body;

        const student = await Student.findOneAndUpdate(
            { userId: req.user.userId },
            {
                name,
                department,
                year,
                phone,
                email,
                university,
                cgpa,
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        ).populate('university', 'name');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        res.json({
            success: true,
            data: student,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

exports.getDashboardData = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.userId })
            .populate('applications')
            .populate('interviews')
            .populate('skills');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        const dashboardData = {
            profile: {
                name: student.name,
                department: student.department,
                year: student.year,
                cgpa: student.cgpa
            },
            applications: student.applications,
            interviews: student.interviews,
            skills: student.skills
        };

        res.json({
            success: true,
            data: dashboardData
        });
    } catch (error) {
        console.error('Dashboard data fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data',
            error: error.message
        });
    }
};

exports.addSkill = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.userId });
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        const newSkill = new Skill({
            studentId: student._id,
            name: req.body.name,
            level: req.body.level,
            progress: req.body.progress || 0
        });

        await newSkill.save();
        
        student.skills.push(newSkill._id);
        await student.save();

        res.json({
            success: true,
            data: newSkill,
            message: 'Skill added successfully'
        });
    } catch (error) {
        console.error('Skill addition error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding skill',
            error: error.message
        });
    }
};

exports.getAvailableJobs = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.userId });
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        // Implement job matching logic based on student skills and preferences
        const availableJobs = await Job.find({
            isActive: true,
            requiredSkills: { $in: student.skills.map(skill => skill.name) }
        }).populate('company', 'name location');

        res.json({
            success: true,
            data: availableJobs
        });
    } catch (error) {
        console.error('Get jobs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting jobs',
            error: error.message
        });
    }
};

exports.applyForJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const student = await Student.findOne({ userId: req.user.userId });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        const newApplication = new Application({
            studentId: student._id,
            jobId,
            status: 'applied',
            appliedDate: Date.now()
        });

        await newApplication.save();
        
        student.applications.push(newApplication._id);
        await student.save();

        res.json({
            success: true,
            data: newApplication,
            message: 'Application submitted successfully'
        });
    } catch (error) {
        console.error('Job application error:', error);
        res.status(500).json({
            success: false,
            message: 'Error applying for job',
            error: error.message
        });
    }
};

exports.scheduleInterview = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.userId });
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        const newInterview = new Interview({
            studentId: student._id,
            ...req.body,
            status: 'scheduled'
        });

        await newInterview.save();
        
        student.interviews.push(newInterview._id);
        await student.save();

        res.json({
            success: true,
            data: newInterview,
            message: 'Interview scheduled successfully'
        });
    } catch (error) {
        console.error('Interview scheduling error:', error);
        res.status(500).json({
            success: false,
            message: 'Error scheduling interview',
            error: error.message
        });
    }
};

module.exports = exports;
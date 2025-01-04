// backend/src/routes/student.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const studentController = require('../controllers/student.controller');
const Student = require('../models/Student');

// Dashboard Data Route
router.get('/get-available-data', auth, async (req, res) => {
    try {
        let student = await Student.findOne({ userId: req.user._id });
        console.log('Found student profile:', student ? 'Yes' : 'No');

        if (!student) {
            student = new Student({
                userId: req.user._id,
                name: req.user.name,
                email: req.user.email,
                department: '',
                year: new Date().getFullYear()
            });
            
            try {
                await student.save();
                console.log('Created new student profile');
            } catch (saveError) {
                console.error('Error saving new student:', saveError);
                throw saveError;
            }
        }

        const dashboardData = {
            profile: {
                name: student.name,
                department: student.department,
                year: student.year,
                cgpa: student.cgpa || 0
            },
            applications: student.applications || [],
            skills: student.skills || [],
            interviews: student.interviews || []
        };

        return res.json({
            success: true,
            data: dashboardData
        });

    } catch (error) {
        console.error('Error in get-available-data:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch student data',
            error: error.message
        });
    }
});

router.get('/assessments', auth, async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user._id });
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        // For now, we'll just return completed assessments as that's what the frontend expects
        const completedAssessments = [];  // This will be populated when we implement assessment completion

        return res.json({
            success: true,
            data: completedAssessments
        });

    } catch (error) {
        console.error('Error fetching assessments:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch assessments',
            error: error.message
        });
    }
});

router.get('/dashboard', auth, async (req, res) => {
    try {
        let student = await Student.findOne({ userId: req.user._id });
        console.log('Fetching dashboard data for user:', req.user._id);

        if (!student) {
            student = new Student({
                userId: req.user._id,
                name: req.user.name || '',
                email: req.user.email || '',
                department: '',
                year: new Date().getFullYear()
            });
            await student.save();
            console.log('Created new student profile');
        }

        const dashboardData = {
            profile: {
                name: student.name,
                department: student.department,
                year: student.year,
                cgpa: student.cgpa || 0
            },
            applications: student.applications || [],
            skills: student.skills || [],
            interviews: student.interviews || []
        };

        res.json({
            success: true,
            data: dashboardData
        });

    } catch (error) {
        console.error('Dashboard data fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard data',
            error: error.message
        });
    }
});


// Profile Management Routes
router.get('/profile', auth, studentController.getProfile);
router.put('/profile/update', auth, studentController.updateProfile);

// Skills Management Routes
router.post('/skills/add', auth, async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user._id });
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        student.skills.push(req.body);
        await student.save();

        return res.json({
            success: true,
            message: 'Skill added successfully',
            data: student.skills
        });
    } catch (error) {
        console.error('Error adding skill:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to add skill',
            error: error.message
        });
    }
});

router.put('/skills/:skillId', auth, async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user._id });
        const skillIndex = student.skills.findIndex(skill => skill._id.toString() === req.params.skillId);

        if (skillIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }

        student.skills[skillIndex] = { ...student.skills[skillIndex], ...req.body };
        await student.save();

        return res.json({
            success: true,
            message: 'Skill updated successfully',
            data: student.skills[skillIndex]
        });
    } catch (error) {
        console.error('Error updating skill:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update skill',
            error: error.message
        });
    }
});

// Application Management Routes
router.post('/applications/submit', auth, async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user._id });
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        student.applications.push({
            ...req.body,
            status: 'applied',
            appliedDate: new Date()
        });
        await student.save();

        return res.json({
            success: true,
            message: 'Application submitted successfully',
            data: student.applications[student.applications.length - 1]
        });
    } catch (error) {
        console.error('Error submitting application:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to submit application',
            error: error.message
        });
    }
});

router.get('/applications', auth, async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user._id });
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        return res.json({
            success: true,
            data: student.applications
        });
    } catch (error) {
        console.error('Error fetching applications:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch applications',
            error: error.message
        });
    }
});

// Interview Management Routes
router.post('/interviews/schedule', auth, async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user._id });
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        student.interviews.push({
            ...req.body,
            status: 'scheduled'
        });
        await student.save();

        return res.json({
            success: true,
            message: 'Interview scheduled successfully',
            data: student.interviews[student.interviews.length - 1]
        });
    } catch (error) {
        console.error('Error scheduling interview:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to schedule interview',
            error: error.message
        });
    }
});

module.exports = router;
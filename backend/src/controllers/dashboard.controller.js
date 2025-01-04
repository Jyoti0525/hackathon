// backend/src/controllers/dashboard.controller.js
const Student = require('../models/Student');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const Skill = require('../models/Skill');

exports.getDashboardData = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user._id })
            .populate('applications')
            .populate('interviews')
            .populate('skills');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        const recentApplications = await Application.find({ 
            studentId: student._id 
        })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('companyId', 'name');

        const upcomingInterviews = await Interview.find({
            studentId: student._id,
            date: { $gte: new Date() }
        })
        .sort({ date: 1 })
        .limit(3)
        .populate('companyId', 'name');

        const skillsProgress = await Skill.find({
            studentId: student._id
        }).sort({ updatedAt: -1 });

        const dashboardData = {
            profile: {
                name: student.name,
                department: student.department,
                year: student.year,
                cgpa: student.cgpa
            },
            applications: recentApplications.map(app => ({
                companyName: app.companyId.name,
                position: app.position,
                status: app.status,
                appliedDate: app.createdAt
            })),
            interviews: upcomingInterviews.map(interview => ({
                companyName: interview.companyId.name,
                position: interview.position,
                date: interview.date,
                status: interview.status
            })),
            skills: skillsProgress.map(skill => ({
                name: skill.name,
                level: skill.level,
                progress: skill.progress
            }))
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
// backend/src/controllers/skillRecommendationController.js
const skillRecommendationService = require('../services/skillRecommendationService');
const Student = require('../models/Student');

exports.getLearningPath = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { targetRole } = req.query;

        const student = await Student.findById(studentId)
            .populate('skills')
            .populate('education')
            .populate('experience');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        const learningPath = await skillRecommendationService.generateLearningPath(
            student,
            targetRole
        );

        res.json({
            success: true,
            data: learningPath
        });
    } catch (error) {
        console.error('Learning path error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate learning path'
        });
    }
};

exports.getSkillImprovements = async (req, res) => {
    try {
        const studentId = req.user.id;

        const student = await Student.findById(studentId)
            .populate('skills')
            .populate('experience');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        const recommendations = await skillRecommendationService.recommendSkillImprovements(
            student
        );

        res.json({
            success: true,
            data: recommendations
        });
    } catch (error) {
        console.error('Skill improvement error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate skill improvements'
        });
    }
};

exports.getProjectSuggestions = async (req, res) => {
    try {
        const { skills, difficulty } = req.query;

        if (!skills || !difficulty) {
            return res.status(400).json({
                success: false,
                message: 'Skills and difficulty level are required'
            });
        }

        const projects = await skillRecommendationService.suggestProjects(
            skills.split(','),
            difficulty
        );

        res.json({
            success: true,
            data: projects
        });
    } catch (error) {
        console.error('Project suggestion error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate project suggestions'
        });
    }
};

exports.getComprehensiveRecommendations = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { targetRole } = req.query;

        const student = await Student.findById(studentId)
            .populate('skills')
            .populate('education')
            .populate('experience');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        const [learningPath, improvements, projects] = await Promise.all([
            skillRecommendationService.generateLearningPath(student, targetRole),
            skillRecommendationService.recommendSkillImprovements(student),
            skillRecommendationService.suggestProjects(student.skills, 'intermediate')
        ]);

        res.json({
            success: true,
            data: {
                learningPath,
                improvements,
                projects
            }
        });
    } catch (error) {
        console.error('Comprehensive recommendations error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate comprehensive recommendations'
        });
    }
};
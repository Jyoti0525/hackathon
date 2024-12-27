// backend/src/controllers/analyticsController.js
const analyticsService = require('../services/analyticsService');

exports.getStudentProgress = async (req, res) => {
    try {
        const progress = await analyticsService.getStudentProgress(req.user.id);
        res.json({ success: true, data: progress });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAssessmentAnalytics = async (req, res) => {
    try {
        const assessments = await analyticsService.analyzeAssessmentPerformance(req.user.id);
        res.json({ success: true, data: assessments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getApplicationAnalytics = async (req, res) => {
    try {
        const applications = await analyticsService.calculateApplicationSuccess(req.user.id);
        res.json({ success: true, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getCareerReadiness = async (req, res) => {
    try {
        const readiness = await analyticsService.calculateCareerReadiness(req.user.id);
        res.json({ success: true, data: readiness });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getComprehensiveAnalytics = async (req, res) => {
    try {
        const [progress, assessments, applications, readiness] = await Promise.all([
            analyticsService.getStudentProgress(req.user.id),
            analyticsService.analyzeAssessmentPerformance(req.user.id),
            analyticsService.calculateApplicationSuccess(req.user.id),
            analyticsService.calculateCareerReadiness(req.user.id)
        ]);

        res.json({
            success: true,
            data: {
                progress,
                assessments,
                applications,
                readiness
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
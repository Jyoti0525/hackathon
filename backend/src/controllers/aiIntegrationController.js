// backend/src/controllers/aiIntegrationController.js
const aiIntegrationService = require('../services/aiIntegrationService');

exports.processProfile = async (req, res) => {
    try {
        const analysis = await aiIntegrationService.processStudentProfile(req.user.id);
        res.json({ success: true, data: analysis });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.enhanceProfile = async (req, res) => {
    try {
        const enhancedProfile = await aiIntegrationService.enhanceProfile(req.body);
        res.json({ success: true, data: enhancedProfile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getCareerInsights = async (req, res) => {
    try {
        const insights = await aiIntegrationService.generateCareerInsights({
            ...req.user,
            ...req.query
        });
        res.json({ success: true, data: insights });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.verifySkills = async (req, res) => {
    try {
        const verifiedSkills = await aiIntegrationService.verifySkills(req.body.skills);
        res.json({ success: true, data: verifiedSkills });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getComprehensiveAnalysis = async (req, res) => {
    try {
        const [
            profile,
            insights,
            recommendations,
            readiness
        ] = await Promise.all([
            aiIntegrationService.enhanceProfile(req.user),
            aiIntegrationService.generateCareerInsights(req.user),
            aiIntegrationService.generateSkillRecommendations(req.user),
            aiIntegrationService.assessCareerReadiness(req.user)
        ]);

        res.json({
            success: true,
            data: {
                profile,
                insights,
                recommendations,
                readiness
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
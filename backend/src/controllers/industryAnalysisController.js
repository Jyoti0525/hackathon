// backend/src/controllers/industryAnalysisController.js
const industryAnalysisService = require('../services/industryAnalysisService');

exports.getIndustryTrends = async (req, res) => {
    try {
        const { industry, location } = req.query;
        const trends = await industryAnalysisService.analyzeIndustryTrends(
            industry,
            location
        );

        res.json({
            success: true,
            data: trends
        });
    } catch (error) {
        console.error('Industry trends error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch industry trends'
        });
    }
};

exports.getCareerPathways = async (req, res) => {
    try {
        const { industry, currentRole, experienceLevel } = req.query;
        const pathways = await industryAnalysisService.generateCareerPathways(
            industry,
            currentRole,
            experienceLevel
        );

        res.json({
            success: true,
            data: pathways
        });
    } catch (error) {
        console.error('Career pathways error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate career pathways'
        });
    }
};

exports.getPredictedSkills = async (req, res) => {
    try {
        const { industry, timeframe } = req.query;
        const predictions = await industryAnalysisService.predictSkillDemand(
            industry,
            timeframe
        );

        res.json({
            success: true,
            data: predictions
        });
    } catch (error) {
        console.error('Skill predictions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to predict skill demands'
        });
    }
};

exports.getIndustryInsights = async (req, res) => {
    try {
        const { industry } = req.query;
        
        const [trends, predictions, pathways] = await Promise.all([
            industryAnalysisService.analyzeIndustryTrends(industry, req.query.location),
            industryAnalysisService.predictSkillDemand(industry),
            industryAnalysisService.generateCareerPathways(
                industry,
                req.query.currentRole,
                req.query.experienceLevel
            )
        ]);

        res.json({
            success: true,
            data: {
                trends,
                predictions,
                pathways
            }
        });
    } catch (error) {
        console.error('Industry insights error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get industry insights'
        });
    }
};
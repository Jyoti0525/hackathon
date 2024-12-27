// backend/src/controllers/resumeEnhancementController.js
const resumeEnhancementService = require('../services/resumeEnhancementService');

exports.optimizeResume = async (req, res) => {
    try {
        const optimizedResume = await resumeEnhancementService.optimizeResume(req.body);
        res.json({ success: true, data: optimizedResume });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Resume optimization failed' });
    }
};

exports.extractSkills = async (req, res) => {
    try {
        const skills = await resumeEnhancementService.extractAndVerifySkills(req.body.text);
        res.json({ success: true, data: skills });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Skill extraction failed' });
    }
};

exports.enhanceAchievements = async (req, res) => {
    try {
        const enhanced = await resumeEnhancementService.enhanceAchievements(req.body.achievements);
        res.json({ success: true, data: enhanced });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Achievement enhancement failed' });
    }
};

exports.optimizeForATS = async (req, res) => {
    try {
        const { resumeContent, jobDescription } = req.body;
        const optimized = await resumeEnhancementService.optimizeForATS(resumeContent, jobDescription);
        res.json({ success: true, data: optimized });
    } catch (error) {
        res.status(500).json({ success: false, message: 'ATS optimization failed' });
    }
};
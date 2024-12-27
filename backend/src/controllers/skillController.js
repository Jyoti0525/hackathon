// backend/src/controllers/skillController.js
const Skill = require('../models/Skill');
const skillService = require('../services/skillService');

exports.getSkills = async (req, res) => {
    try {
        const skills = await Skill.find({ userId: req.user.id });
        res.json({ success: true, data: skills });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addSkill = async (req, res) => {
    try {
        const skill = new Skill({
            ...req.body,
            userId: req.user.id
        });
        await skill.save();
        res.status(201).json({ success: true, data: skill });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateSkill = async (req, res) => {
    try {
        const skill = await Skill.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true }
        );
        if (!skill) {
            return res.status(404).json({ success: false, message: 'Skill not found' });
        }
        res.json({ success: true, data: skill });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findByIdAndDelete(req.params.id);
        if (!skill) {
            return res.status(404).json({ success: false, message: 'Skill not found' });
        }
        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.assessSkill = async (req, res) => {
    try {
        const assessment = await skillService.assessSkill(
            req.user.id,
            req.body.skillId,
            req.body.evidence
        );
        res.json({ success: true, data: assessment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.verifySkill = async (req, res) => {
    try {
        const verification = await skillService.verifySkill(
            req.user.id,
            req.body.skillId,
            req.body.proofs
        );
        res.json({ success: true, data: verification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getSkillRecommendations = async (req, res) => {
    try {
        const recommendations = await skillService.getRecommendations(req.user.id);
        res.json({ success: true, data: recommendations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getSkillAnalytics = async (req, res) => {
    try {
        const analytics = await skillService.getAnalytics(req.user.id);
        res.json({ success: true, data: analytics });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getSkillTrends = async (req, res) => {
    try {
        const trends = await skillService.getSkillTrends();
        res.json({ success: true, data: trends });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getSkillGaps = async (req, res) => {
    try {
        const gaps = await skillService.analyzeSkillGaps(
            req.user.id,
            req.query.targetRole
        );
        res.json({ success: true, data: gaps });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getLearningPaths = async (req, res) => {
    try {
        const paths = await skillService.getLearningPaths(
            req.user.id,
            req.query.targetSkills
        );
        res.json({ success: true, data: paths });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createLearningPath = async (req, res) => {
    try {
        const path = await skillService.createLearningPath(
            req.user.id,
            req.body.targetSkills,
            req.body.preferences
        );
        res.json({ success: true, data: path });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getSkillProgress = async (req, res) => {
    try {
        const progress = await skillService.getSkillProgress(req.user.id);
        res.json({ success: true, data: progress });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
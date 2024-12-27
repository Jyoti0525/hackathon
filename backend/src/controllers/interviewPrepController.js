// backend/src/controllers/interviewPrepController.js
const interviewPrepService = require('../services/interviewPrepService');

exports.generateQuestions = async (req, res) => {
    try {
        const { role, experience, skills } = req.body;
        const questions = await interviewPrepService.generateQuestions(role, experience, skills);
        res.json({ success: true, data: questions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.evaluateResponse = async (req, res) => {
    try {
        const { question, answer } = req.body;
        const evaluation = await interviewPrepService.evaluateResponse(question, answer);
        res.json({ success: true, data: evaluation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getInterviewTips = async (req, res) => {
    try {
        const { role, company } = req.query;
        const tips = await interviewPrepService.getInterviewTips(role, company);
        res.json({ success: true, data: tips });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
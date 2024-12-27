// backend/src/controllers/interviewController.js
const Interview = require('../models/Interview');
const interviewService = require('../services/interviewService');

exports.createInterviewSession = async (req, res) => {
    try {
        const { jobId, type, preferences } = req.body;
        const session = await interviewService.createSession(req.user.id, jobId, type, preferences);
        res.status(201).json({ success: true, data: session });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getInterviewSessions = async (req, res) => {
    try {
        const sessions = await Interview.find({ userId: req.user.id })
            .populate('jobId')
            .sort('-createdAt');
        res.json({ success: true, data: sessions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getSessionById = async (req, res) => {
    try {
        const session = await Interview.findById(req.params.id).populate('jobId');
        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }
        res.json({ success: true, data: session });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateSession = async (req, res) => {
    try {
        const session = await Interview.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true }
        );
        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }
        res.json({ success: true, data: session });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.generateQuestions = async (req, res) => {
    try {
        const questions = await interviewService.generateQuestions(
            req.params.id,
            req.body.topics,
            req.body.difficulty
        );
        res.json({ success: true, data: questions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.submitResponse = async (req, res) => {
    try {
        const { questionId, response } = req.body;
        const evaluation = await interviewService.evaluateResponse(
            req.params.id,
            questionId,
            response
        );
        res.json({ success: true, data: evaluation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getFeedback = async (req, res) => {
    try {
        const feedback = await interviewService.generateFeedback(req.params.id);
        res.json({ success: true, data: feedback });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.startMockInterview = async (req, res) => {
    try {
        const mockInterview = await interviewService.startMockInterview(
            req.user.id,
            req.body.jobRole,
            req.body.preferences
        );
        res.json({ success: true, data: mockInterview });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getNextQuestion = async (req, res) => {
    try {
        const question = await interviewService.getNextQuestion(req.params.id);
        res.json({ success: true, data: question });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.evaluateResponse = async (req, res) => {
    try {
        const evaluation = await interviewService.evaluateMockResponse(
            req.params.id,
            req.body.response
        );
        res.json({ success: true, data: evaluation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMockInterviewSummary = async (req, res) => {
    try {
        const summary = await interviewService.generateInterviewSummary(req.params.id);
        res.json({ success: true, data: summary });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getPracticeQuestions = async (req, res) => {
    try {
        const questions = await interviewService.generatePracticeQuestions(
            req.query.role,
            req.query.topics
        );
        res.json({ success: true, data: questions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.evaluatePracticeResponse = async (req, res) => {
    try {
        const evaluation = await interviewService.evaluatePracticeResponse(
            req.body.question,
            req.body.response
        );
        res.json({ success: true, data: evaluation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getInterviewTips = async (req, res) => {
    try {
        const tips = await interviewService.generateInterviewTips(
            req.query.role,
            req.query.company
        );
        res.json({ success: true, data: tips });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
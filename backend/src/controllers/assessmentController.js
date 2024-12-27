// backend/src/controllers/assessmentController.js
const Assessment = require('../models/Assessment');
const AssessmentResult = require('../models/AssessmentResult');
const aiAssessmentService = require('../services/aiAssessmentService');

exports.createAssessment = async (req, res) => {
    try {
        const assessmentData = req.body;
        const questions = await aiAssessmentService.generateQuestions(
            assessmentData.topic,
            assessmentData.difficulty,
            assessmentData.questionCount
        );

        const assessment = new Assessment({
            ...assessmentData,
            questions,
            createdBy: req.user.id
        });

        await assessment.save();
        res.status(201).json({ success: true, data: assessment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAssessments = async (req, res) => {
    try {
        const filters = {};
        if (req.user.role === 'student') {
            filters.status = 'active';
        }
        if (req.user.role === 'university') {
            filters.createdBy = req.user.id;
        }

        const assessments = await Assessment.find(filters);
        res.json({ success: true, data: assessments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAssessmentById = async (req, res) => {
    try {
        const assessment = await Assessment.findById(req.params.id);
        if (!assessment) {
            return res.status(404).json({ success: false, message: 'Assessment not found' });
        }
        res.json({ success: true, data: assessment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateAssessment = async (req, res) => {
    try {
        const assessment = await Assessment.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true }
        );
        if (!assessment) {
            return res.status(404).json({ success: false, message: 'Assessment not found' });
        }
        res.json({ success: true, data: assessment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteAssessment = async (req, res) => {
    try {
        const assessment = await Assessment.findByIdAndDelete(req.params.id);
        if (!assessment) {
            return res.status(404).json({ success: false, message: 'Assessment not found' });
        }
        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.startAssessment = async (req, res) => {
    try {
        const assessment = await Assessment.findById(req.params.id);
        if (!assessment) {
            return res.status(404).json({ success: false, message: 'Assessment not found' });
        }

        const result = new AssessmentResult({
            assessment: assessment._id,
            student: req.user.id,
            startTime: Date.now()
        });

        await result.save();
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.submitAssessment = async (req, res) => {
    try {
        const { answers } = req.body;
        const result = await AssessmentResult.findOne({
            assessment: req.params.id,
            student: req.user.id,
            endTime: null
        });

        if (!result) {
            return res.status(404).json({ success: false, message: 'Assessment session not found' });
        }

        const evaluation = await aiAssessmentService.evaluateAnswers(answers);
        
        result.answers = answers;
        result.score = evaluation.score;
        result.feedback = evaluation.feedback;
        result.endTime = Date.now();
        
        await result.save();
        
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAssessmentResult = async (req, res) => {
    try {
        const result = await AssessmentResult.findOne({
            assessment: req.params.id,
            student: req.user.id
        }).populate('assessment');

        if (!result) {
            return res.status(404).json({ success: false, message: 'Result not found' });
        }

        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getPerformanceAnalytics = async (req, res) => {
    try {
        const analytics = await aiAssessmentService.generatePerformanceAnalytics(req.user.id);
        res.json({ success: true, data: analytics });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getProgressAnalytics = async (req, res) => {
    try {
        const analytics = await aiAssessmentService.generateProgressAnalytics(req.user.id);
        res.json({ success: true, data: analytics });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
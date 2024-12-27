// backend/src/services/aiAssessmentService.js
const OpenAI = require('openai');
const Assessment = require('../models/Assessment').Assessment;
const AssessmentResult = require('../models/Assessment').AssessmentResult;

class AIAssessmentService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async generateQuestions(topic, difficulty, count = 10) {
        try {
            const prompt = `
                Generate ${count} ${difficulty} level questions about ${topic}.
                For each question include:
                1. Question text
                2. Multiple choice options (4 options)
                3. Correct answer
                4. Explanation
                5. Points (1-5 based on difficulty)
            `;

            const response = await this.openai.createCompletion({
                model: "text-davinci-003",
                prompt,
                max_tokens: 1500,
                temperature: 0.7
            });

            return this.parseGeneratedQuestions(response.data.choices[0].text);
        } catch (error) {
            console.error('Question generation error:', error);
            throw new Error('Failed to generate questions');
        }
    }

    async evaluateAnswers(answers) {
        try {
            const evaluation = {
                score: 0,
                feedback: [],
                detailedAnalysis: {}
            };

            for (const answer of answers) {
                const prompt = `
                    Evaluate this answer:
                    Question: ${answer.question}
                    Student Answer: ${answer.response}
                    Correct Answer: ${answer.correctAnswer}
                    
                    Provide:
                    1. Score (0-100)
                    2. Detailed feedback
                    3. Improvement suggestions
                `;

                const response = await this.openai.createCompletion({
                    model: "text-davinci-003",
                    prompt,
                    max_tokens: 300,
                    temperature: 0.3
                });

                const answerEvaluation = this.parseEvaluation(response.data.choices[0].text);
                evaluation.score += answerEvaluation.score;
                evaluation.feedback.push(answerEvaluation.feedback);
                evaluation.detailedAnalysis[answer.questionId] = answerEvaluation;
            }

            evaluation.score = evaluation.score / answers.length;
            return evaluation;
        } catch (error) {
            console.error('Answer evaluation error:', error);
            throw new Error('Failed to evaluate answers');
        }
    }

    async generatePerformanceAnalytics(studentId) {
        try {
            const results = await AssessmentResult.find({ student: studentId })
                .populate('assessment');

            const analysisPrompt = `
                Analyze these assessment results:
                ${JSON.stringify(results.map(r => ({
                    topic: r.assessment.topic,
                    score: r.score,
                    timeTaken: r.timeTaken
                })))}
                
                Provide:
                1. Performance trends
                2. Strength areas
                3. Improvement areas
                4. Learning recommendations
            `;

            const response = await this.openai.createCompletion({
                model: "text-davinci-003",
                prompt: analysisPrompt,
                max_tokens: 800,
                temperature: 0.5
            });

            return this.parsePerformanceAnalysis(response.data.choices[0].text);
        } catch (error) {
            console.error('Performance analytics error:', error);
            throw new Error('Failed to generate performance analytics');
        }
    }

    async generateProgressAnalytics(studentId) {
        try {
            const results = await AssessmentResult.find({ student: studentId })
                .sort('createdAt')
                .populate('assessment');

            const progressPrompt = `
                Analyze learning progress based on these assessment results:
                ${JSON.stringify(results.map(r => ({
                    topic: r.assessment.topic,
                    score: r.score,
                    date: r.createdAt
                })))}
                
                Provide:
                1. Progress trajectory
                2. Skill development patterns
                3. Learning velocity
                4. Next level recommendations
            `;

            const response = await this.openai.createCompletion({
                model: "text-davinci-003",
                prompt: progressPrompt,
                max_tokens: 800,
                temperature: 0.5
            });

            return this.parseProgressAnalysis(response.data.choices[0].text);
        } catch (error) {
            console.error('Progress analytics error:', error);
            throw new Error('Failed to generate progress analytics');
        }
    }

    parseGeneratedQuestions(text) {
        // Implementation of question parsing logic
        return [];
    }

    parseEvaluation(text) {
        // Implementation of evaluation parsing logic
        return {
            score: 0,
            feedback: '',
            suggestions: []
        };
    }

    parsePerformanceAnalysis(text) {
        // Implementation of performance analysis parsing logic
        return {
            trends: [],
            strengths: [],
            improvements: [],
            recommendations: []
        };
    }

    parseProgressAnalysis(text) {
        // Implementation of progress analysis parsing logic
        return {
            trajectory: [],
            patterns: [],
            velocity: 0,
            recommendations: []
        };
    }
}

module.exports = new AIAssessmentService();
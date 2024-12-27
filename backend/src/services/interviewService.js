// backend/src/services/interviewService.js
const OpenAI = require('openai');
const Interview = require('../models/Interview');
const Job = require('../models/Job');

class InterviewService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async createSession(userId, jobId, type, preferences) {
        try {
            const interview = new Interview({
                userId,
                jobId,
                type,
                preferences,
                status: 'scheduled'
            });

            if (type !== 'real') {
                const questions = await this.generateQuestions(interview._id, preferences.topics, preferences.difficulty);
                interview.questions = questions;
            }

            await interview.save();
            return interview;
        } catch (error) {
            throw new Error('Failed to create interview session');
        }
    }

    async generateQuestions(interviewId, topics, difficulty) {
        try {
            const prompt = `
                Generate interview questions for:
                Topics: ${topics.join(', ')}
                Difficulty: ${difficulty}
                
                Include:
                1. Technical questions
                2. Behavioral questions
                3. Situational questions
                4. Expected answer points
                5. Follow-up questions
            `;

            const response = await this.openai.createCompletion({
                model: "text-davinci-003",
                prompt,
                max_tokens: 1000,
                temperature: 0.7
            });

            return this.parseQuestions(response.data.choices[0].text);
        } catch (error) {
            throw new Error('Failed to generate questions');
        }
    }

    async evaluateResponse(interviewId, questionId, response) {
        try {
            const interview = await Interview.findById(interviewId);
            const question = interview.questions.id(questionId);

            const prompt = `
                Evaluate this interview response:
                Question: ${question.text}
                Response: ${response}
                Expected Points: ${question.expectedAnswerPoints.join(', ')}
                
                Provide:
                1. Score (0-100)
                2. Specific feedback
                3. Strengths
                4. Areas for improvement
            `;

            const evaluation = await this.openai.createCompletion({
                model: "text-davinci-003",
                prompt,
                max_tokens: 500,
                temperature: 0.3
            });

            return this.parseEvaluation(evaluation.data.choices[0].text);
        } catch (error) {
            throw new Error('Failed to evaluate response');
        }
    }

    async generateFeedback(interviewId) {
        try {
            const interview = await Interview.findById(interviewId);
            
            const prompt = `
                Generate comprehensive interview feedback based on:
                Questions: ${JSON.stringify(interview.questions)}
                Responses: ${JSON.stringify(interview.responses)}
                
                Include:
                1. Overall performance analysis
                2. Key strengths demonstrated
                3. Areas for improvement
                4. Specific recommendations
                5. Preparation tips for future interviews
            `;

            const response = await this.openai.createCompletion({
                model: "text-davinci-003",
                prompt,
                max_tokens: 800,
                temperature: 0.6
            });

            return this.parseFeedback(response.data.choices[0].text);
        } catch (error) {
            throw new Error('Failed to generate feedback');
        }
    }

    async startMockInterview(userId, jobRole, preferences) {
        try {
            const session = await this.createSession(userId, null, 'mock', {
                ...preferences,
                jobRole
            });

            return {
                sessionId: session._id,
                firstQuestion: session.questions[0]
            };
        } catch (error) {
            throw new Error('Failed to start mock interview');
        }
    }

    async getNextQuestion(interviewId) {
        try {
            const interview = await Interview.findById(interviewId);
            const answeredQuestions = interview.responses.map(r => r.question.toString());
            const nextQuestion = interview.questions.find(q => 
                !answeredQuestions.includes(q._id.toString())
            );

            return nextQuestion || null;
        } catch (error) {
            throw new Error('Failed to get next question');
        }
    }

    async evaluateMockResponse(interviewId, response) {
        try {
            const interview = await Interview.findById(interviewId);
            const currentQuestion = await this.getNextQuestion(interviewId);

            const evaluation = await this.evaluateResponse(
                interviewId,
                currentQuestion._id,
                response
            );

            interview.responses.push({
                question: currentQuestion._id,
                answer: response,
                evaluation
            });

            await interview.save();
            return evaluation;
        } catch (error) {
            throw new Error('Failed to evaluate mock response');
        }
    }

    async generateInterviewSummary(interviewId) {
        try {
            const interview = await Interview.findById(interviewId);
            const feedback = await this.generateFeedback(interviewId);

            return {
                duration: interview.completedAt - interview.startedAt,
                questionsAnswered: interview.responses.length,
                overallScore: feedback.overallScore,
                strengths: feedback.strengths,
                improvements: feedback.improvements,
                recommendations: feedback.recommendations
            };
        } catch (error) {
            throw new Error('Failed to generate interview summary');
        }
    }

    async generatePracticeQuestions(role, topics) {
        try {
            const prompt = `
                Generate practice interview questions for:
                Role: ${role}
                Topics: ${topics.join(', ')}
                
                Include a mix of:
                1. Technical questions specific to the role
                2. Common behavioral questions
                3. Role-specific situational questions
            `;

            const response = await this.openai.createCompletion({
                model: "text-davinci-003",
                prompt,
                max_tokens: 800,
                temperature: 0.7
            });

            return this.parseQuestions(response.data.choices[0].text);
        } catch (error) {
            throw new Error('Failed to generate practice questions');
        }
    }

    async generateInterviewTips(role, company) {
        try {
            const prompt = `
                Generate interview tips for:
                Role: ${role}
                Company: ${company}
                
                Include:
                1. Company-specific preparation advice
                2. Common pitfalls to avoid
                3. Key topics to prepare for
                4. Communication strategies
                5. Questions to ask the interviewer
            `;

            const response = await this.openai.createCompletion({
                model: "text-davinci-003",
                prompt,
                max_tokens: 800,
                temperature: 0.6
            });

            return this.parseTips(response.data.choices[0].text);
        } catch (error) {
            throw new Error('Failed to generate interview tips');
        }
    }

    parseQuestions(text) {
        // Implementation of question parsing
        return [];
    }

    parseEvaluation(text) {
        // Implementation of evaluation parsing
        return {
            score: 0,
            feedback: '',
            strengths: [],
            improvements: []
        };
    }

    parseFeedback(text) {
        // Implementation of feedback parsing
        return {
            overallScore: 0,
            strengths: [],
            improvements: [],
            recommendations: []
        };
    }

    parseTips(text) {
        // Implementation of tips parsing
        return {
            preparation: [],
            pitfalls: [],
            topics: [],
            strategies: [],
            questions: []
        };
    }
}

module.exports = new InterviewService();
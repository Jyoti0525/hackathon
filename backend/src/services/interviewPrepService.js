// backend/src/services/interviewPrepService.js
const OpenAI = require('openai');

class InterviewPrepService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async generateQuestions(role, experience, skills) {
        try {
            const prompt = `Generate interview questions for:
                Role: ${role}
                Experience Level: ${experience}
                Skills: ${skills.join(', ')}
                Include technical and behavioral questions.`;

            const completion = await this.openai.createCompletion({
                model: "text-davinci-003",
                prompt,
                max_tokens: 1000
            });

            return this.parseQuestions(completion.data.choices[0].text);
        } catch (error) {
            throw new Error('Failed to generate interview questions');
        }
    }

    async evaluateResponse(question, answer) {
        try {
            const prompt = `Evaluate this interview response:
                Question: ${question}
                Answer: ${answer}
                Provide scoring and improvement suggestions.`;

            const completion = await this.openai.createCompletion({
                model: "text-davinci-003",
                prompt,
                max_tokens: 800
            });

            return this.parseEvaluation(completion.data.choices[0].text);
        } catch (error) {
            throw new Error('Failed to evaluate response');
        }
    }

    async getInterviewTips(role, company) {
        try {
            const prompt = `Provide interview tips for:
                Role: ${role}
                Company: ${company}
                Include preparation strategies and common pitfalls.`;

            const completion = await this.openai.createCompletion({
                model: "text-davinci-003",
                prompt,
                max_tokens: 800
            });

            return this.parseTips(completion.data.choices[0].text);
        } catch (error) {
            throw new Error('Failed to get interview tips');
        }
    }

    parseQuestions(text) {
        return {
            technical: [],
            behavioral: [],
            roleSpecific: []
        };
    }

    parseEvaluation(text) {
        return {
            score: 0,
            strengths: [],
            improvements: [],
            suggestions: []
        };
    }

    parseTips(text) {
        return {
            preparation: [],
            commonMistakes: [],
            keyStrategies: []
        };
    }
}

module.exports = new InterviewPrepService();
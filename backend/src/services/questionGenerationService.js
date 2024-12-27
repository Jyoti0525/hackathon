// src/services/questionGenerationService.js
import axios from 'axios';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export class QuestionGenerationService {
  async generateQuestions(topic, difficulty, count = 5) {
    try {
      const prompt = `Generate ${count} multiple-choice questions about ${topic} at ${difficulty} level. 
        Each question should have 4 options with one correct answer.
        Format: Question, Options (A,B,C,D), Correct Answer, Explanation`;

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 1000,
        temperature: 0.7
      });

      return this.parseQuestions(response.data.choices[0].text);
    } catch (error) {
      console.error('Error generating questions:', error);
      throw error;
    }
  }

  async generateTechnicalAssessment(skills, level) {
    try {
      const response = await axios.post('/api/ai/technical-assessment', {
        skills,
        level
      });

      return response.data;
    } catch (error) {
      console.error('Error generating technical assessment:', error);
      throw error;
    }
  }

  async evaluateAnswers(questions, answers) {
    try {
      const response = await axios.post('/api/ai/evaluate-answers', {
        questions,
        answers
      });

      return {
        score: response.data.score,
        feedback: response.data.feedback,
        recommendations: response.data.recommendations
      };
    } catch (error) {
      console.error('Error evaluating answers:', error);
      throw error;
    }
  }

  parseQuestions(rawText) {
    // Implementation of question parsing logic
    // Returns structured question objects
    const questions = [];
    // Parsing logic here
    return questions;
  }
}

export const questionService = new QuestionGenerationService();
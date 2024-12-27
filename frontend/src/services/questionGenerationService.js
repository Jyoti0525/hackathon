// src/services/questionGenerationService.js

import axios from 'axios';

const BASE_URL = '/api/questions'; // Ensure this matches your backend API route

const questionGenerationService = {
  /**
   * Fetch questions based on filters like topic and difficulty.
   * @param {string} topic - Topic for questions (optional).
   * @param {string} difficulty - Difficulty level (e.g., 'easy', 'medium', 'hard') (optional).
   * @returns {Promise<Array>} - A promise resolving to an array of questions.
   */
  fetchQuestions: async (topic, difficulty) => {
    try {
      const response = await axios.get(BASE_URL, {
        params: { topic, difficulty },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw new Error('Failed to fetch questions.');
    }
  },

  /**
   * Add a new question to the database.
   * @param {Object} questionData - The data for the new question.
   * @returns {Promise<Object>} - A promise resolving to the created question.
   */
  addQuestion: async (questionData) => {
    try {
      const response = await axios.post(BASE_URL, questionData);
      return response.data;
    } catch (error) {
      console.error('Error adding question:', error);
      throw new Error('Failed to add question.');
    }
  },

  /**
   * Update an existing question by ID.
   * @param {string} questionId - The ID of the question to update.
   * @param {Object} updateData - The data to update in the question.
   * @returns {Promise<Object>} - A promise resolving to the updated question.
   */
  updateQuestion: async (questionId, updateData) => {
    try {
      const response = await axios.put(`${BASE_URL}/${questionId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating question:', error);
      throw new Error('Failed to update question.');
    }
  },

  /**
   * Delete a question by ID.
   * @param {string} questionId - The ID of the question to delete.
   * @returns {Promise<void>} - A promise resolving when the deletion is successful.
   */
  deleteQuestion: async (questionId) => {
    try {
      await axios.delete(`${BASE_URL}/${questionId}`);
    } catch (error) {
      console.error('Error deleting question:', error);
      throw new Error('Failed to delete question.');
    }
  },
};

export default questionGenerationService;

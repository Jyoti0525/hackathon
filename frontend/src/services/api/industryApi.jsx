// src/services/api/industryApi.js
import axios from 'axios';

const BASE_URL = '/api/industry';

export const industryApi = {
  async getInsights(filters) {
    try {
      const response = await axios.get(`${BASE_URL}/insights`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch industry insights:', error);
      throw error;
    }
  },

  async getTrends(industry, location) {
    try {
      const response = await axios.get(`${BASE_URL}/trends`, {
        params: { industry, location }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch industry trends:', error);
      throw error;
    }
  },

  async getCareerPaths(params) {
    try {
      const response = await axios.get(`${BASE_URL}/career-paths`, {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch career paths:', error);
      throw error;
    }
  },

  async getSkillPredictions(industry, timeframe) {
    try {
      const response = await axios.get(`${BASE_URL}/skill-predictions`, {
        params: { industry, timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch skill predictions:', error);
      throw error;
    }
  }
};
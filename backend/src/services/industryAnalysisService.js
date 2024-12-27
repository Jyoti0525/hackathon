// backend/src/services/industryAnalysisService.js
const OpenAI = require('openai');
const Job = require('../models/Job');
const Industry = require('../models/Industry');

class IndustryAnalysisService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async analyzeIndustryTrends(industryName, location) {
    try {
      const jobs = await Job.find({
        industry: industryName,
        location: location,
        createdAt: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
      });

      const prompt = `
        Analyze these job market trends for the ${industryName} industry in ${location}:
        Total Jobs: ${jobs.length}
        Skills Distribution: ${this.getSkillsDistribution(jobs)}
        Salary Ranges: ${this.getSalaryRanges(jobs)}
        Experience Levels: ${this.getExperienceLevels(jobs)}

        Provide insights on:
        1. Growing skill demands
        2. Salary trends
        3. Experience requirements
        4. Industry growth indicators
        5. Future predictions
      `;

      const completion = await this.openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 700,
        temperature: 0.6
      });

      return this.parseIndustryAnalysis(completion.data.choices[0].text);
    } catch (error) {
      console.error('Industry analysis error:', error);
      throw new Error('Failed to analyze industry trends');
    }
  }

  async generateCareerPathways(industry, currentRole, experienceLevel) {
    try {
      const prompt = `
        Generate career progression pathways for:
        Industry: ${industry}
        Current Role: ${currentRole}
        Experience Level: ${experienceLevel}

        Provide:
        1. Possible career paths
        2. Required skill development
        3. Estimated timeline
        4. Potential challenges
        5. Industry-specific opportunities
      `;

      const completion = await this.openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 600,
        temperature: 0.7
      });

      return this.parseCareerPathways(completion.data.choices[0].text);
    } catch (error) {
      console.error('Career pathways error:', error);
      throw new Error('Failed to generate career pathways');
    }
  }

  async predictSkillDemand(industry, timeframe = '6months') {
    try {
      const historicalData = await this.getHistoricalSkillData(industry);

      const prompt = `
        Based on historical job market data:
        ${JSON.stringify(historicalData)}

        Predict skill demands for the next ${timeframe} in the ${industry} industry.
        Consider:
        1. Current trend trajectories
        2. Industry innovations
        3. Market conditions
        4. Technology adoption rates
      `;

      const completion = await this.openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 500,
        temperature: 0.6
      });

      return this.parseSkillPredictions(completion.data.choices[0].text);
    } catch (error) {
      console.error('Skill demand prediction error:', error);
      throw new Error('Failed to predict skill demands');
    }
  }

  getSkillsDistribution(jobs) {
    const skillCount = {};
    jobs.forEach(job => {
      job.requiredSkills.forEach(skill => {
        skillCount[skill] = (skillCount[skill] || 0) + 1;
      });
    });
    return Object.entries(skillCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }

  getSalaryRanges(jobs) {
    const salaries = jobs
      .filter(job => job.salary)
      .map(job => job.salary);
    return {
      min: Math.min(...salaries),
      max: Math.max(...salaries),
      avg: salaries.reduce((a, b) => a + b, 0) / salaries.length
    };
  }

  getExperienceLevels(jobs) {
    const expCount = {};
    jobs.forEach(job => {
      const level = this.categorizeExperience(job.requiredExperience);
      expCount[level] = (expCount[level] || 0) + 1;
    });
    return expCount;
  }

  categorizeExperience(years) {
    if (years <= 2) return 'Entry Level';
    if (years <= 5) return 'Mid Level';
    return 'Senior Level';
  }

  async getHistoricalSkillData(industry) {
    // Implementation to fetch historical skill demand data
    return [];
  }

  parseIndustryAnalysis(text) {
    // Implementation to parse industry analysis
    return {
      trends: [],
      insights: [],
      predictions: []
    };
  }

  parseCareerPathways(text) {
    // Implementation to parse career pathways
    return {
      paths: [],
      skillRequirements: {},
      timeline: {}
    };
  }

  parseSkillPredictions(text) {
    // Implementation to parse skill predictions
    return {
      emergingSkills: [],
      decliningSkills: [],
      stableSkills: []
    };
  }
}

module.exports = new IndustryAnalysisService();
// src/services/aiMatchingService.js
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

class AIMatchingService {
  async calculateMatchScore(candidate, job) {
    try {
      const prompt = `
        Analyze the match between candidate and job:
        
        Candidate Skills: ${candidate.skills.join(', ')}
        Candidate Experience: ${candidate.experience}
        Candidate Education: ${candidate.education.map(e => e.degree).join(', ')}
        
        Job Requirements:
        Title: ${job.title}
        Required Skills: ${job.skills.join(', ')}
        Required Experience: ${job.experience}
        
        Calculate a match percentage based on:
        1. Skills match (40%)
        2. Experience match (30%)
        3. Education relevance (30%)
        
        Return only the numerical score between 0-100.
      `;

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 10,
        temperature: 0.3
      });

      return parseFloat(response.data.choices[0].text.trim());
    } catch (error) {
      console.error('Error calculating match score:', error);
      return 0;
    }
  }

  async enhanceJobDescription(description) {
    try {
      const prompt = `
        Improve this job description to be more engaging and detailed:
        ${description}
        
        Include:
        1. Clear responsibilities
        2. Required qualifications
        3. Growth opportunities
        4. Company culture aspects
      `;

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 500,
        temperature: 0.7
      });

      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('Error enhancing job description:', error);
      return description;
    }
  }

  async suggestSkills(baseSkills) {
    try {
      const prompt = `
        Based on these skills: ${baseSkills.join(', ')}
        Suggest 5 relevant additional skills that are:
        1. In high demand
        2. Complementary to existing skills
        3. Relevant to current job market
        
        Return only the skill names, separated by commas.
      `;

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 100,
        temperature: 0.5
      });

      return response.data.choices[0].text
        .split(',')
        .map(skill => skill.trim());
    } catch (error) {
      console.error('Error suggesting skills:', error);
      return [];
    }
  }

  async analyzeCandidateProfile(profile) {
    try {
      const prompt = `
        Analyze this candidate profile and provide insights:
        Skills: ${profile.skills.join(', ')}
        Experience: ${JSON.stringify(profile.experience)}
        Education: ${JSON.stringify(profile.education)}
        
        Provide:
        1. Strength areas
        2. Improvement areas
        3. Suggested career paths
        4. Industry fit
      `;

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 500,
        temperature: 0.7
      });

      return {
        analysis: response.data.choices[0].text.trim(),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error analyzing profile:', error);
      throw error;
    }
  }
}

module.exports = new AIMatchingService();
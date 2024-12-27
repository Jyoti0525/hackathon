// backend/src/services/jobMatchingService.js
const OpenAI = require('openai');
const Job = require('../models/Job');
const Student = require('../models/Student');

class JobMatchingService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async matchJobsToStudent(studentId) {
    try {
      const student = await Student.findById(studentId)
        .populate('education')
        .populate('skills')
        .populate('experience');

      const jobs = await Job.find({ status: 'active' });
      
      const matchedJobs = await Promise.all(
        jobs.map(async (job) => {
          const score = await this.calculateMatchScore(student, job);
          const analysis = await this.analyzeJobFit(student, job);
          
          return {
            ...job.toObject(),
            matchScore: score,
            fitAnalysis: analysis
          };
        })
      );

      return matchedJobs.sort((a, b) => b.matchScore - a.matchScore);
    } catch (error) {
      console.error('Job matching error:', error);
      throw new Error('Failed to match jobs');
    }
  }

  async calculateMatchScore(student, job) {
    const prompt = `
      Calculate job match score for:
      
      Student Profile:
      - Skills: ${student.skills.join(', ')}
      - Education: ${student.education.degree} in ${student.education.major}
      - Experience: ${student.experience.map(exp => exp.title).join(', ')}
      
      Job Requirements:
      - Required Skills: ${job.requiredSkills.join(', ')}
      - Education: ${job.requiredEducation}
      - Experience: ${job.requiredExperience} years
      
      Return a score between 0-100 based on:
      1. Skills match (40%)
      2. Education match (30%)
      3. Experience match (30%)
    `;

    const completion = await this.openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 100,
      temperature: 0.3
    });

    return parseInt(completion.data.choices[0].text.trim());
  }

  async analyzeJobFit(student, job) {
    const prompt = `
      Analyze job fit and provide insights for:
      
      Student Profile:
      ${JSON.stringify(student, null, 2)}
      
      Job Details:
      ${JSON.stringify(job, null, 2)}
      
      Provide:
      1. Strengths for this role
      2. Areas for improvement
      3. Career growth potential
      4. Recommended preparation steps
    `;

    const completion = await this.openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 500,
      temperature: 0.7
    });

    return this.parseAnalysis(completion.data.choices[0].text);
  }

  parseAnalysis(text) {
    // Implementation of analysis parsing
    return {
      strengths: [],
      improvementAreas: [],
      growthPotential: '',
      preparationSteps: []
    };
  }

  async suggestSkillImprovements(student, targetJob) {
    const prompt = `
      Based on the student's current skills and target job requirements,
      suggest specific improvements:
      
      Current Skills: ${student.skills.join(', ')}
      Target Job Skills: ${targetJob.requiredSkills.join(', ')}
      
      Provide:
      1. Skills to acquire
      2. Skills to improve
      3. Estimated time for each
      4. Learning resources
    `;

    const completion = await this.openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 400,
      temperature: 0.6
    });

    return this.parseSkillSuggestions(completion.data.choices[0].text);
  }

  parseSkillSuggestions(text) {
    // Implementation of skill suggestions parsing
    return {
      skillsToAcquire: [],
      skillsToImprove: [],
      timeline: {},
      resources: []
    };
  }
}

module.exports = new JobMatchingService();
// backend/src/controllers/jobMatchingController.js
const jobMatchingService = require('../services/jobMatchingService');
const Job = require('../models/Job');

exports.getMatchedJobs = async (req, res) => {
  try {
    const studentId = req.user.id;
    const matchedJobs = await jobMatchingService.matchJobsToStudent(studentId);
    
    res.json({
      success: true,
      data: matchedJobs
    });
  } catch (error) {
    console.error('Get matched jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get matched jobs'
    });
  }
};

exports.getJobFitAnalysis = async (req, res) => {
  try {
    const { jobId } = req.params;
    const studentId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const analysis = await jobMatchingService.analyzeJobFit(studentId, job);
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Job fit analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze job fit'
    });
  }
};

exports.getSkillImprovements = async (req, res) => {
  try {
    const { jobId } = req.params;
    const studentId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const suggestions = await jobMatchingService.suggestSkillImprovements(
      studentId,
      job
    );
    
    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Skill improvements error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get skill improvements'
    });
  }
};

exports.getJobTrends = async (req, res) => {
  try {
    const trends = await jobMatchingService.analyzeJobMarketTrends(
      req.query.industry,
      req.query.location
    );
    
    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Job trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get job trends'
    });
  }
};
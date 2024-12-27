// src/components/job/JobMatchingService.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Rating,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Work as WorkIcon,
  LocationOn as LocationIcon,
  Timer as TimerIcon,
  School as SchoolIcon
} from '@mui/icons-material';

const JobMatchingService = () => {
    const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [matchedCandidates, setMatchedCandidates] = useState([]);
  const [filters, setFilters] = useState({
    jobType: 'all',
    experience: 'all',
    location: '',
    skillLevel: 'all'
  });
  const [applicationDialog, setApplicationDialog] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    setLoading(true);
    setProfileError(null);
    try {
      const response = await fetch('/api/jobs');
      const data = await response.json();
      const matchedJobs = await matchJobsWithProfile(data);
      setJobs(matchedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setProfileError('Failed to load job matches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/users/profile/${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      const profile = await response.json();
      return {
        ...profile,
        skills: profile.skills || [],
        yearsOfExperience: profile.experience || 0,
        education: profile.education || []
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return {
        skills: [],
        yearsOfExperience: 0,
        education: []
      };
    }
  };

  const matchJobsWithProfile = async (jobs) => {
    // Get current user profile
    const userProfile = await fetchUserProfile();
    
    // Calculate match score for each job
    return jobs.map(job => ({
      ...job,
      matchScore: calculateMatchScore(userProfile, job),
      matchDetails: analyzeMatch(userProfile, job)
    }));
  };

  const calculateMatchScore = (profile, job) => {
    const skillsMatch = job.requiredSkills.filter(skill => 
      profile.skills.includes(skill)
    ).length / job.requiredSkills.length;

    const experienceMatch = profile.yearsOfExperience >= job.requiredExperience ? 1 : 
      profile.yearsOfExperience / job.requiredExperience;

    const educationMatch = profile.education.some(edu => 
      job.requiredEducation.includes(edu.level)
    ) ? 1 : 0;

    return (skillsMatch * 0.5 + experienceMatch * 0.3 + educationMatch * 0.2) * 100;
  };

  const analyzeMatch = (profile, job) => {
    const missingSkills = job.requiredSkills.filter(skill => 
      !profile.skills.includes(skill)
    );

    const experienceGap = Math.max(0, job.requiredExperience - profile.yearsOfExperience);

    return {
      missingSkills,
      experienceGap,
      recommendations: generateRecommendations(missingSkills, experienceGap)
    };
  };

  const generateRecommendations = (missingSkills, experienceGap) => {
    const recommendations = [];

    if (missingSkills.length > 0) {
      recommendations.push({
        type: 'skills',
        message: `Consider acquiring these skills: ${missingSkills.join(', ')}`,
        priority: 'high'
      });
    }

    if (experienceGap > 0) {
      recommendations.push({
        type: 'experience',
        message: `Gain ${experienceGap} more years of relevant experience`,
        priority: 'medium'
      });
    }

    return recommendations;
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setApplicationDialog(true);
  };

  const submitApplication = async () => {
    try {
      await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobId: selectedJob.id,
          // Add other application details
        })
      });
      setApplicationDialog(false);
      // Show success message
    } catch (error) {
      console.error('Error submitting application:', error);
      // Show error message
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Job Matching
      </Typography>

      {profileError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {profileError}
        </Alert>
      )}

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <TextField
            select
            fullWidth
            label="Job Type"
            value={filters.jobType}
            onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="fulltime">Full Time</MenuItem>
            <MenuItem value="parttime">Part Time</MenuItem>
            <MenuItem value="contract">Contract</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            select
            fullWidth
            label="Experience Level"
            value={filters.experience}
            onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
          >
            <MenuItem value="all">All Levels</MenuItem>
            <MenuItem value="entry">Entry Level</MenuItem>
            <MenuItem value="mid">Mid Level</MenuItem>
            <MenuItem value="senior">Senior Level</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Location"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            select
            fullWidth
            label="Skill Level"
            value={filters.skillLevel}
            onChange={(e) => setFilters({ ...filters, skillLevel: e.target.value })}
          >
            <MenuItem value="all">All Skills</MenuItem>
            <MenuItem value="beginner">Beginner</MenuItem>
            <MenuItem value="intermediate">Intermediate</MenuItem>
            <MenuItem value="expert">Expert</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* Job Listings */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {jobs.map((job) => (
            <Grid item xs={12} key={job.id}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="h6" gutterBottom>
                        {job.title}
                      </Typography>
                      <Typography color="textSecondary" gutterBottom>
                        <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        {job.location}
                        <TimerIcon sx={{ ml: 2, mr: 1, verticalAlign: 'middle' }} />
                        {job.type}
                      </Typography>
                      
                      <Box sx={{ my: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Required Skills:
                        </Typography>
                        {job.requiredSkills.map((skill) => (
                          <Chip
                            key={skill}
                            label={skill}
                            size="small"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" gutterBottom>
                          {Math.round(job.matchScore)}%
                        </Typography>
                        <Typography variant="subtitle2" gutterBottom>
                          Match Score
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={job.matchScore}
                          sx={{ height: 8, borderRadius: 4, mb: 2 }}
                        />
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handleApply(job)}
                        >
                          Apply Now
                        </Button>
                      </Box>
                    </Grid>

                    {job.matchDetails.recommendations.length > 0 && (
                      <Grid item xs={12}>
                        <Alert severity="info">
                          <Typography variant="subtitle2" gutterBottom>
                            Recommendations to improve your match:
                          </Typography>
                          {job.matchDetails.recommendations.map((rec, index) => (
                            <Typography key={index} variant="body2">
                              • {rec.message}
                            </Typography>
                          ))}
                        </Alert>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Application Dialog */}
      <Dialog 
        open={applicationDialog} 
        onClose={() => setApplicationDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Apply for {selectedJob?.title}
        </DialogTitle>
        <DialogContent>
          {/* Add application form fields here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplicationDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={submitApplication}>
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobMatchingService;
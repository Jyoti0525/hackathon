// src/components/job/JobPosting.jsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Autocomplete,
  Chip,
  Alert
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const JobPosting = () => {
  const { user } = useAuth();
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    type: '',
    description: '',
    requirements: [],
    skills: [],
    salary: '',
    experience: ''
  });

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSkillSuggestions = async (currentSkills) => {
    try {
      const response = await axios.post('/api/ai/skill-suggestions', {
        skills: currentSkills
      });
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Error fetching skill suggestions:', error);
    }
  };

  const enhanceJobDescription = async (description) => {
    try {
      const response = await axios.post('/api/ai/enhance-job', {
        description
      });
      return response.data.enhancedDescription;
    } catch (error) {
      console.error('Error enhancing description:', error);
      return description;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const enhancedDescription = await enhanceJobDescription(jobData.description);
      const jobToPost = {
        ...jobData,
        description: enhancedDescription,
        companyId: user.companyId,
        postedBy: user.id,
        postedAt: new Date()
      };

      await axios.post('/api/jobs', jobToPost);
      // Reset form or redirect
      setJobData({
        title: '',
        company: '',
        location: '',
        type: '',
        description: '',
        requirements: [],
        skills: [],
        salary: '',
        experience: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Error posting job');
    } finally {
      setLoading(false);
    }
  };

  const handleSkillAdd = (skill) => {
    if (!jobData.skills.includes(skill)) {
      const updatedSkills = [...jobData.skills, skill];
      setJobData({ ...jobData, skills: updatedSkills });
      fetchSkillSuggestions(updatedSkills);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Post a New Job
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Job Title"
              value={jobData.title}
              onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location"
              value={jobData.location}
              onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Job Description"
              value={jobData.description}
              onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
              required
              helperText="AI will enhance this description"
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              options={suggestions}
              value={jobData.skills}
              onChange={(e, newValue) => setJobData({ ...jobData, skills: newValue })}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Required Skills"
                  placeholder="Add skill"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Experience Required (years)"
              type="number"
              value={jobData.experience}
              onChange={(e) => setJobData({ ...jobData, experience: e.target.value })}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Salary Range"
              value={jobData.salary}
              onChange={(e) => setJobData({ ...jobData, salary: e.target.value })}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Posting...' : 'Post Job'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default JobPosting;
import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Alert
} from '@mui/material';
import DashboardLayout from '../../components/layouts/DashboardLayout';

const JobPost = () => {
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary: '',
    type: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add API call to post job
      setSuccess('Job posted successfully!');
    } catch (err) {
      setError('Failed to post job');
    }
  };

  const handleChange = (field) => (e) => {
    setJobData({ ...jobData, [field]: e.target.value });
  };

  return (
    <DashboardLayout title="Post New Job">
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Create New Job Posting
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Title"
                  value={jobData.title}
                  onChange={handleChange('title')}
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
                  onChange={handleChange('description')}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Requirements"
                  value={jobData.requirements}
                  onChange={handleChange('requirements')}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={jobData.location}
                  onChange={handleChange('location')}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Salary Range"
                  value={jobData.salary}
                  onChange={handleChange('salary')}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                >
                  Post Job
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </DashboardLayout>
  );
};

export default JobPost;
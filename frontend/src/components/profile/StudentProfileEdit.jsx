// src/components/profile/StudentProfileEdit.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  Divider
} from '@mui/material';
import axios from 'axios';

const StudentProfileEdit = () => {
  const [profile, setProfile] = useState({
    personalInfo: {
      dateOfBirth: '',
      phoneNumber: '',
      address: ''
    },
    education: {
      degree: '',
      major: '',
      year: '',
      cgpa: ''
    },
    skills: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/profile');
      setProfile(response.data);
    } catch (err) {
      setError('Error fetching profile');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put('http://localhost:5000/api/profile', profile);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Error updating profile');
    }
    setLoading(false);
  };

  const handleChange = (section, field) => (e) => {
    setProfile({
      ...profile,
      [section]: {
        ...profile[section],
        [field]: e.target.value
      }
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Edit Profile
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={profile.personalInfo.phoneNumber}
                  onChange={handleChange('personalInfo', 'phoneNumber')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={profile.personalInfo.dateOfBirth}
                  onChange={handleChange('personalInfo', 'dateOfBirth')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={2}
                  value={profile.personalInfo.address}
                  onChange={handleChange('personalInfo', 'address')}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Education
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Degree"
                  value={profile.education.degree}
                  onChange={handleChange('education', 'degree')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Major"
                  value={profile.education.major}
                  onChange={handleChange('education', 'major')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Year"
                  type="number"
                  value={profile.education.year}
                  onChange={handleChange('education', 'year')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CGPA"
                  type="number"
                  step="0.01"
                  value={profile.education.cgpa}
                  onChange={handleChange('education', 'cgpa')}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default StudentProfileEdit;
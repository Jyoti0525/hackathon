// src/components/profile/UniversityProfileEdit.jsx
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

const UniversityProfileEdit = () => {
  const [profile, setProfile] = useState({
    institutionInfo: {
      name: '',
      establishedYear: '',
      website: '',
      address: '',
      phoneNumber: '',
      email: ''
    },
    stats: {
      totalStudents: '',
      placementRate: '',
      averagePackage: ''
    }
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
        Edit University Profile
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Institution Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Institution Name"
                  value={profile.institutionInfo.name}
                  onChange={handleChange('institutionInfo', 'name')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Established Year"
                  type="number"
                  value={profile.institutionInfo.establishedYear}
                  onChange={handleChange('institutionInfo', 'establishedYear')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Website"
                  value={profile.institutionInfo.website}
                  onChange={handleChange('institutionInfo', 'website')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={profile.institutionInfo.phoneNumber}
                  onChange={handleChange('institutionInfo', 'phoneNumber')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={2}
                  value={profile.institutionInfo.address}
                  onChange={handleChange('institutionInfo', 'address')}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Total Students"
                  type="number"
                  value={profile.stats.totalStudents}
                  onChange={handleChange('stats', 'totalStudents')}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Placement Rate (%)"
                  type="number"
                  value={profile.stats.placementRate}
                  onChange={handleChange('stats', 'placementRate')}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Average Package (LPA)"
                  type="number"
                  value={profile.stats.averagePackage}
                  onChange={handleChange('stats', 'averagePackage')}
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

export default UniversityProfileEdit;
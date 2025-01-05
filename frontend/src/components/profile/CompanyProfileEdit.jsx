// src/components/profile/CompanyProfileEdit.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  Divider,
  MenuItem
} from '@mui/material';
import axios from 'axios';

const CompanyProfileEdit = () => {
  const [profile, setProfile] = useState({
    companyInfo: {
      name: '',
      industry: '',
      website: '',
      size: '',
      founded: '',
      description: ''
    },
    contactInfo: {
      address: '',
      phoneNumber: '',
      email: '',
      hrContact: {
        name: '',
        email: '',
        phone: ''
      }
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const companySizes = [
    '1-50',
    '51-200',
    '201-500',
    '501-1000',
    '1000+'
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/profile');
      setProfile(response.data);
    } catch (err) {
      setError('Error fetching profile');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put('http://localhost:8000/api/profile', profile);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Error updating profile');
    }
    setLoading(false);
  };

  const handleChange = (section, field) => (e) => {
    if (section === 'hrContact') {
      setProfile({
        ...profile,
        contactInfo: {
          ...profile.contactInfo,
          hrContact: {
            ...profile.contactInfo.hrContact,
            [field]: e.target.value
          }
        }
      });
    } else {
      setProfile({
        ...profile,
        [section]: {
          ...profile[section],
          [field]: e.target.value
        }
      });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Edit Company Profile
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Company Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Company Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={profile.companyInfo.name}
                  onChange={handleChange('companyInfo', 'name')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Industry"
                  value={profile.companyInfo.industry}
                  onChange={handleChange('companyInfo', 'industry')}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Website"
                  value={profile.companyInfo.website}
                  onChange={handleChange('companyInfo', 'website')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Company Size"
                  value={profile.companyInfo.size}
                  onChange={handleChange('companyInfo', 'size')}
                  required
                >
                  {companySizes.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size} employees
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Description"
                  multiline
                  rows={4}
                  value={profile.companyInfo.description}
                  onChange={handleChange('companyInfo', 'description')}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Contact Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={2}
                  value={profile.contactInfo.address}
                  onChange={handleChange('contactInfo', 'address')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={profile.contactInfo.phoneNumber}
                  onChange={handleChange('contactInfo', 'phoneNumber')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={profile.contactInfo.email}
                  onChange={handleChange('contactInfo', 'email')}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* HR Contact */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              HR Contact Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="HR Name"
                  value={profile.contactInfo.hrContact.name}
                  onChange={handleChange('hrContact', 'name')}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="HR Email"
                  type="email"
                  value={profile.contactInfo.hrContact.email}
                  onChange={handleChange('hrContact', 'email')}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="HR Phone"
                  value={profile.contactInfo.hrContact.phone}
                  onChange={handleChange('hrContact', 'phone')}
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

export default CompanyProfileEdit;
// src/components/resume/sections/PersonalInfo.jsx
import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Typography,
  Box,
  Alert
} from '@mui/material';
import axios from 'axios';

const PersonalInfo = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState(data);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    onUpdate(newData);
  };

  // AI-powered summary suggestion
  const getSummarySuggestions = async () => {
    if (!formData.name || !formData.email) return;

    setLoading(true);
    try {
      const response = await axios.post('/api/ai/summary-suggestions', {
        name: formData.name,
        email: formData.email,
        currentSummary: formData.summary
      });
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Error getting suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get AI suggestions when summary field is focused
    const timer = setTimeout(() => {
      if (formData.summary) {
        getSummarySuggestions();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData.summary]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Personal Information
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="LinkedIn Profile"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Professional Summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            required
            helperText="AI will help optimize your summary"
          />
        </Grid>

        {suggestions && (
          <Grid item xs={12}>
            <Alert severity="info">
              <Typography variant="subtitle2" gutterBottom>
                AI-Suggested Improvements:
              </Typography>
              {suggestions.map((suggestion, index) => (
                <Typography key={index} variant="body2">
                  • {suggestion}
                </Typography>
              ))}
            </Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default PersonalInfo;
// src/components/resume/ResumeAnalysis.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Chip,
  LinearProgress
} from '@mui/material';
import axios from 'axios';

const ResumeAnalysis = ({ resumeData }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    analyzeResume();
  }, [resumeData]);

  const analyzeResume = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/ai/analyze-resume', resumeData);
      setAnalysis(response.data);
    } catch (err) {
      setError('Failed to analyze resume. Please try again.');
      console.error('Resume analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Analyzing your resume...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!analysis) return null;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Resume Analysis
      </Typography>

      <Grid container spacing={3}>
        {/* Strength Score */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Overall Strength
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant="determinate"
                  value={analysis.strengthScore}
                  size={80}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6">
                    {analysis.strengthScore}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Key Skills Analysis */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skills Analysis
              </Typography>
              {analysis.skillsAnalysis.map((skill, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">
                    {skill.name}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={skill.relevance}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="textSecondary">
                    Market Relevance: {skill.relevance}%
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Improvement Suggestions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Improvement Suggestions
              </Typography>
              {analysis.suggestions.map((suggestion, index) => (
                <Alert 
                  key={index} 
                  severity="info" 
                  sx={{ mb: 1 }}
                >
                  {suggestion}
                </Alert>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Industry Fit */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Industry Fit
              </Typography>
              <Grid container spacing={2}>
                {analysis.industryFit.map((industry, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          {industry.name}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={industry.matchScore}
                          sx={{ height: 8, borderRadius: 4, mb: 1 }}
                        />
                        <Typography variant="body2" color="textSecondary">
                          Match Score: {industry.matchScore}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResumeAnalysis;
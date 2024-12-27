// src/components/assessment/ResultsAnalysis.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Alert,
  Button,
  Divider
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const ResultsAnalysis = ({ assessmentId }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    fetchResults();
  }, [assessmentId]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/assessments/${assessmentId}/results`);
      const data = await response.json();
      setResults(data);
      generateInsights(data);
    } catch (err) {
      setError('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async (resultsData) => {
    try {
      const response = await fetch('/api/ai/analyze-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ results: resultsData })
      });
      const insights = await response.json();
      setInsights(insights);
    } catch (err) {
      console.error('Error generating insights:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Assessment Results Analysis
        </Typography>

        {/* Overview Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Average Score</Typography>
                <Typography variant="h3">
                  {results.averageScore}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Pass Rate</Typography>
                <Typography variant="h3">
                  {results.passRate}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Completion Rate</Typography>
                <Typography variant="h3">
                  {results.completionRate}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Avg. Time Taken</Typography>
                <Typography variant="h3">
                  {results.averageTime}m
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Score Distribution Chart */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Score Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={results.scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Question Performance Analysis */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Question Performance
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={results.questionPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="questionNumber" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="correctPercentage" 
                  stroke="#82ca9d" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AI Insights */}
        {insights && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI-Generated Insights
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {/* Key Findings */}
              <Typography variant="subtitle1" gutterBottom>
                Key Findings:
              </Typography>
              {insights.keyFindings.map((finding, index) => (
                <Alert 
                  severity="info" 
                  sx={{ mb: 1 }} 
                  key={index}
                >
                  {finding}
                </Alert>
              ))}

              {/* Skill Gap Analysis */}
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                Skill Gap Analysis:
              </Typography>
              {insights.skillGaps.map((skill, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">
                    {skill.name}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={skill.proficiency} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    Current Proficiency: {skill.proficiency}%
                  </Typography>
                </Box>
              ))}

              {/* Recommendations */}
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                Recommendations:
              </Typography>
              {insights.recommendations.map((rec, index) => (
                <Alert 
                  severity="success" 
                  sx={{ mb: 1 }} 
                  key={index}
                >
                  {rec}
                </Alert>
              ))}
            </CardContent>
          </Card>
        )}
      </Paper>
    </Box>
  );
};

export default ResultsAnalysis;
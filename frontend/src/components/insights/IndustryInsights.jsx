// src/components/insights/IndustryInsights.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Button,
  Divider
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { industryApi } from '../../services/api/industryApi';

const IndustryInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    industry: '',
    location: '',
    timeframe: '6months'
  });

  useEffect(() => {
    if (filters.industry && filters.location) {
      fetchInsights();
    }
  }, [filters]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/industry/insights?${new URLSearchParams(filters)}`);
      const data = await response.json();
      if (data.success) {
        setInsights(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch industry insights');
    } finally {
      setLoading(false);
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
          Industry Insights & Market Trends
        </Typography>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Industry"
              value={filters.industry}
              onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
            >
              <MenuItem value="technology">Technology</MenuItem>
              <MenuItem value="healthcare">Healthcare</MenuItem>
              <MenuItem value="finance">Finance</MenuItem>
              {/* Add more industries */}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Location"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Timeframe"
              value={filters.timeframe}
              onChange={(e) => setFilters({ ...filters, timeframe: e.target.value })}
            >
              <MenuItem value="3months">3 Months</MenuItem>
              <MenuItem value="6months">6 Months</MenuItem>
              <MenuItem value="1year">1 Year</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {insights && (
          <Grid container spacing={3}>
            {/* Skill Demand Trends */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Skill Demand Trends
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={insights.trends.skillDemand}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="demand" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Salary Insights */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Salary Trends
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={insights.trends.salaryRanges}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="role" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avgSalary" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Experience Distribution */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Experience Level Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={insights.trends.experienceLevels}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="level" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* AI-Generated Insights */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    AI-Generated Market Insights
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1" gutterBottom>
                        Emerging Trends
                      </Typography>
                      {insights.predictions.emergingTrends.map((trend, index) => (
                        <Alert severity="info" key={index} sx={{ mb: 1 }}>
                          {trend}
                        </Alert>
                      ))}
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1" gutterBottom>
                        Skill Recommendations
                      </Typography>
                      {insights.predictions.recommendedSkills.map((skill, index) => (
                        <Alert severity="success" key={index} sx={{ mb: 1 }}>
                          {skill}
                        </Alert>
                      ))}
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle1" gutterBottom>
                        Market Opportunities
                      </Typography>
                      {insights.predictions.opportunities.map((opportunity, index) => (
                        <Alert severity="info" key={index} sx={{ mb: 1 }}>
                          {opportunity}
                        </Alert>
                      ))}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Career Pathways */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Career Growth Pathways
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  {insights.pathways.map((pathway, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {pathway.title}
                      </Typography>
                      <Typography color="textSecondary" paragraph>
                        {pathway.description}
                      </Typography>
                      <Grid container spacing={2}>
                        {pathway.steps.map((step, stepIndex) => (
                          <Grid item xs={12} sm={6} md={3} key={stepIndex}>
                            <Card variant="outlined">
                              <CardContent>
                                <Typography variant="subtitle2" gutterBottom>
                                  Stage {stepIndex + 1}
                                </Typography>
                                <Typography variant="body2">
                                  {step.description}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  Timeline: {step.timeline}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default IndustryInsights;
// src/components/analytics/AnalyticsDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Grid,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    LinearProgress,
    Divider
} from '@mui/material';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const AnalyticsDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await fetch('/api/analytics/comprehensive');
            const data = await response.json();
            if (data.success) {
                setAnalytics(data.data);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to fetch analytics');
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
                    Performance Analytics Dashboard
                </Typography>

                <Grid container spacing={3}>
                    {/* Career Readiness Score */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Career Readiness Score
                                </Typography>
                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                    <CircularProgress
                                        variant="determinate"
                                        value={analytics.readiness.score}
                                        size={100}
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
                                        <Typography variant="h4" component="div">
                                            {analytics.readiness.score}%
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Skill Progress */}
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Skill Progress
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={analytics.progress.skillProgress}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="skill" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="currentLevel"
                                            stroke="#8884d8"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="initialLevel"
                                            stroke="#82ca9d"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Assessment Performance */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Assessment Performance
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={analytics.assessments.byTopic}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="topic" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="score" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Application Success */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Application Success Rate
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                {
                                                    name: 'Successful',
                                                    value: analytics.applications.successRate
                                                },
                                                {
                                                    name: 'Pending',
                                                    value: analytics.applications.pendingRate
                                                },
                                                {
                                                    name: 'Rejected',
                                                    value: 100 - analytics.applications.successRate - analytics.applications.pendingRate
                                                }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            label
                                        />
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Recommendations */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Improvement Recommendations
                                </Typography>
                                <Grid container spacing={2}>
                                    {analytics.readiness.recommendations.map((rec, index) => (
                                        <Grid item xs={12} md={4} key={index}>
                                            <Alert severity="info">
                                                {rec}
                                            </Alert>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default AnalyticsDashboard;
// src/components/skills/SkillRecommendations.jsx
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
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    Divider,
    LinearProgress
} from '@mui/material';
import {
    School as SchoolIcon,
    Code as CodeIcon,
    Assignment as AssignmentIcon,
    Timeline as TimelineIcon,
    Star as StarIcon
} from '@mui/icons-material';

const SkillRecommendations = () => {
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/skills/comprehensive');
            const data = await response.json();
            if (data.success) {
                setRecommendations(data.data);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to fetch recommendations');
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
                    Personalized Skill Development Plan
                </Typography>

                <Grid container spacing={3}>
                    {/* Learning Path */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Learning Path
                                </Typography>
                                <Stepper activeStep={activeStep} orientation="vertical">
                                    {recommendations?.learningPath.map((step, index) => (
                                        <Step key={index}>
                                            <StepLabel>
                                                <Typography variant="subtitle1">
                                                    {step.title}
                                                </Typography>
                                            </StepLabel>
                                            <StepContent>
                                                <Typography>{step.description}</Typography>
                                                <Box sx={{ mt: 2 }}>
                                                    <List>
                                                        {step.resources.map((resource, idx) => (
                                                            <ListItem key={idx}>
                                                                <ListItemIcon>
                                                                    <SchoolIcon />
                                                                </ListItemIcon>
                                                                <ListItemText
                                                                    primary={resource.title}
                                                                    secondary={resource.provider}
                                                                />
                                                                <Button
                                                                    variant="outlined"
                                                                    size="small"
                                                                    href={resource.url}
                                                                    target="_blank"
                                                                >
                                                                    Start Learning
                                                                </Button>
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Box>
                                            </StepContent>
                                        </Step>
                                    ))}
                                </Stepper>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Skill Improvements */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Skill Improvements
                                </Typography>
                                {recommendations?.improvements.map((improvement, index) => (
                                    <Box key={index} sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2">
                                            {improvement.skill}
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={improvement.currentLevel}
                                            sx={{ height: 8, borderRadius: 4, mb: 1 }}
                                        />
                                        <Typography variant="body2" color="textSecondary">
                                            Current Level: {improvement.currentLevel}%
                                        </Typography>
                                        <Alert severity="info" sx={{ mt: 1 }}>
                                            {improvement.recommendation}
                                        </Alert>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Project Suggestions */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Recommended Projects
                                </Typography>
                                {recommendations?.projects.map((project, index) => (
                                    <Card variant="outlined" sx={{ mb: 2 }} key={index}>
                                        <CardContent>
                                            <Typography variant="subtitle1" gutterBottom>
                                                {project.title}
                                            </Typography>
                                            <Typography variant="body2" paragraph>
                                                {project.description}
                                            </Typography>
                                            <Box sx={{ mb: 2 }}>
                                                {project.skills.map((skill, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        label={skill}
                                                        size="small"
                                                        sx={{ mr: 1, mb: 1 }}
                                                    />
                                                ))}
                                            </Box>
                                            <Typography variant="caption" color="textSecondary">
                                                Estimated Time: {project.estimatedTime}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default SkillRecommendations;
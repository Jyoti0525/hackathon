import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import questionGenerationService from '../../services/questionGenerationService'; // Adjust path to your actual service

const AssessmentManagement = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createDialog, setCreateDialog] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    title: '',
    skillCategory: '',
    difficulty: 'intermediate',
    timeLimit: 30,
    passingScore: 70
  });

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/assessments');
      const data = await response.json();
      setAssessments(data);
    } catch (err) {
      setError('Failed to fetch assessments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssessment = async () => {
    try {
      const questions = await generateQuestionsForAssessment(newAssessment);
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newAssessment,
          questions,
          createdBy: user.id
        })
      });

      if (response.ok) {
        setCreateDialog(false);
        fetchAssessments();
      }
    } catch (err) {
      setError('Failed to create assessment');
    }
  };

  const generateQuestionsForAssessment = async (config) => {
    const questions = await questionGenerationService.generateQuestions(
      config.skillCategory,
      config.difficulty,
      10 // Default number of questions
    );
    return questions;
  };

  const handleViewDetails = (assessmentId) => {
    // Logic for viewing assessment details
    console.log(`View details for assessment ID: ${assessmentId}`);
    // You might want to redirect to a details page or display modal
  };

  const handleStartAssessment = (assessmentId) => {
    // Logic for starting the assessment
    console.log(`Start assessment ID: ${assessmentId}`);
    // Redirect to a page or trigger assessment start actions
  };

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5">Assessment Management</Typography>
          <Button
            variant="contained"
            onClick={() => setCreateDialog(true)}
          >
            Create Assessment
          </Button>
        </Box>

        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab label="Active Assessments" />
          <Tab label="Completed Assessments" />
          <Tab label="Results Analysis" />
        </Tabs>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={3}>
            {assessments.map((assessment) => (
              <Grid item xs={12} md={6} key={assessment.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {assessment.title}
                    </Typography>
                    <Typography color="textSecondary">
                      Category: {assessment.skillCategory}
                    </Typography>
                    <Typography color="textSecondary">
                      Difficulty: {assessment.difficulty}
                    </Typography>
                    <Typography color="textSecondary">
                      Time Limit: {assessment.timeLimit} minutes
                    </Typography>
                    <Typography color="textSecondary">
                      Passing Score: {assessment.passingScore}%
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        sx={{ mr: 1 }}
                        onClick={() => handleViewDetails(assessment.id)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleStartAssessment(assessment.id)}
                      >
                        Start Assessment
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Create Assessment Dialog */}
      <Dialog
        open={createDialog}
        onClose={() => setCreateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Assessment</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Assessment Title"
                value={newAssessment.title}
                onChange={(e) => setNewAssessment({
                  ...newAssessment,
                  title: e.target.value
                })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Skill Category"
                value={newAssessment.skillCategory}
                onChange={(e) => setNewAssessment({
                  ...newAssessment,
                  skillCategory: e.target.value
                })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Difficulty Level</InputLabel>
                <Select
                  value={newAssessment.difficulty}
                  onChange={(e) => setNewAssessment({
                    ...newAssessment,
                    difficulty: e.target.value
                  })}
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Time Limit (minutes)"
                value={newAssessment.timeLimit}
                onChange={(e) => setNewAssessment({
                  ...newAssessment,
                  timeLimit: parseInt(e.target.value)
                })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Passing Score (%)"
                value={newAssessment.passingScore}
                onChange={(e) => setNewAssessment({
                  ...newAssessment,
                  passingScore: parseInt(e.target.value)
                })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateAssessment}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssessmentManagement;

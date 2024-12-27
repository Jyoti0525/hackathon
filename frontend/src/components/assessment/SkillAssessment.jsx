// src/components/assessment/SkillAssessment.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert
} from '@mui/material';
import axios from 'axios';

const SkillAssessment = ({ skill, onComplete }) => {
  const [assessment, setAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [showTest, setShowTest] = useState(false);

  useEffect(() => {
    fetchAssessment();
  }, [skill]);

  const fetchAssessment = async () => {
    try {
      const response = await axios.post('/api/ai/generate-assessment', {
        skill: skill
      });
      setAssessment(response.data);
    } catch (err) {
      setError('Failed to load assessment');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const submitAssessment = async () => {
    setSubmitting(true);
    try {
      const response = await axios.post('/api/ai/evaluate-assessment', {
        skillId: skill.id,
        answers: answers
      });
      setResult(response.data);
      if (onComplete) {
        onComplete(response.data);
      }
    } catch (err) {
      setError('Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {skill.name} Assessment
          </Typography>

          <Button
            variant="contained"
            onClick={() => setShowTest(true)}
            sx={{ mb: 3 }}
          >
            Start Assessment
          </Button>

          <Dialog 
            open={showTest} 
            onClose={() => setShowTest(false)}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle>
              {skill.name} Assessment - Question {currentQuestion + 1}
            </DialogTitle>
            
            <DialogContent>
              {assessment && (
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {assessment.questions[currentQuestion].question}
                  </Typography>

                  <FormControl component="fieldset" sx={{ mt: 2 }}>
                    <RadioGroup
                      value={answers[assessment.questions[currentQuestion].id] || ''}
                      onChange={(e) => handleAnswer(
                        assessment.questions[currentQuestion].id,
                        e.target.value
                      )}
                    >
                      {assessment.questions[currentQuestion].options.map((option, index) => (
                        <FormControlLabel
                          key={index}
                          value={option}
                          control={<Radio />}
                          label={option}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Box>
              )}
            </DialogContent>

            <DialogActions>
              <Button 
                onClick={() => setCurrentQuestion(prev => prev - 1)}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              {currentQuestion < assessment?.questions.length - 1 ? (
                <Button 
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  variant="contained"
                  disabled={!answers[assessment.questions[currentQuestion].id]}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={submitAssessment}
                  variant="contained"
                  disabled={submitting}
                >
                  Submit
                </Button>
              )}
            </DialogActions>
          </Dialog>

          {result && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Assessment Result
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h4" align="center" gutterBottom>
                        {result.score}%
                      </Typography>
                      <Typography variant="subtitle1" align="center" color="textSecondary">
                        Proficiency Level: {result.level}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Recommendations:
                  </Typography>
                  {result.recommendations.map((rec, index) => (
                    <Alert severity="info" key={index} sx={{ mb: 1 }}>
                      {rec}
                    </Alert>
                  ))}
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SkillAssessment;
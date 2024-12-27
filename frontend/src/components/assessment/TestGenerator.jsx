// src/components/assessment/TestGenerator.jsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import questionGenerationService from '../../services/questionGenerationService'; // Correct import path


const TestGenerator = () => {
  const [testConfig, setTestConfig] = useState({
    topic: '',
    difficulty: 'intermediate',
    questionCount: 5
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const generatedQuestions = await questionGenerationService.generateQuestions(
        testConfig.topic,
        testConfig.difficulty,
        testConfig.questionCount
      );
      setQuestions(generatedQuestions);
    } catch (err) {
      setError('Failed to generate questions. Please try again.');
      console.error('Question generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (field) => (event) => {
    setTestConfig({
      ...testConfig,
      [field]: event.target.value
    });
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          AI Test Generator
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Topic"
              value={testConfig.topic}
              onChange={handleConfigChange('topic')}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Difficulty Level</InputLabel>
              <Select
                value={testConfig.difficulty}
                onChange={handleConfigChange('difficulty')}
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Number of Questions"
              value={testConfig.questionCount}
              onChange={handleConfigChange('questionCount')}
              InputProps={{ inputProps: { min: 1, max: 20 } }}
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={loading || !testConfig.topic}
          sx={{ mt: 3 }}
        >
          {loading ? 'Generating...' : 'Generate Test'}
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {questions && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Generated Questions
          </Typography>

          {questions.map((question, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {index + 1}. {question.text}
                </Typography>

                <Grid container spacing={1}>
                  {question.options.map((option, optIndex) => (
                    <Grid item xs={12} sm={6} key={optIndex}>
                      <Typography>
                        {String.fromCharCode(65 + optIndex)}. {option}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>

                <Typography 
                  variant="body2" 
                  color="textSecondary" 
                  sx={{ mt: 2 }}
                >
                  Correct Answer: {String.fromCharCode(65 + question.correctIndex)}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  Explanation: {question.explanation}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default TestGenerator;
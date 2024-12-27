import React, { useState, useEffect } from 'react';
import {
  Grid, TextField, Chip, Paper, Typography, Box, Autocomplete,
  Alert
} from '@mui/material';
import axios from 'axios';

const Skills = ({ data, onUpdate }) => {
  const [skillInput, setSkillInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDelete = (skillToDelete) => {
    const newSkills = data.filter(skill => skill !== skillToDelete);
    onUpdate(newSkills);
  };

  const handleAdd = (newSkill) => {
    if (newSkill && !data.includes(newSkill)) {
      onUpdate([...data, newSkill]);
    }
  };

  // AI suggestion for related skills
  const getSkillSuggestions = async () => {
    if (data.length === 0) return;

    setLoading(true);
    try {
      const response = await axios.post('/api/ai/skill-suggestions', {
        currentSkills: data
      });
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Error getting skill suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data.length > 0) {
      getSkillSuggestions();
    }
  }, [data]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Skills
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Autocomplete
            freeSolo
            value={skillInput}
            onChange={(event, newValue) => {
              handleAdd(newValue);
              setSkillInput('');
            }}
            onInputChange={(event, newValue) => {
              setSkillInput(newValue);
            }}
            options={suggestions}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Add Skills"
                fullWidth
                helperText="Press enter to add a skill"
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {data.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                onDelete={() => handleDelete(skill)}
              />
            ))}
          </Paper>
        </Grid>

        {suggestions.length > 0 && (
          <Grid item xs={12}>
            <Alert severity="info">
              <Typography variant="subtitle2" gutterBottom>
                Recommended Skills Based on Your Profile:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {suggestions.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onClick={() => handleAdd(skill)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Skills;
import React from 'react';
import {
  Grid, TextField, Button, IconButton, Typography, Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const Education = ({ data, onUpdate }) => {
  const handleAdd = () => {
    onUpdate([...data, { degree: '', institution: '', year: '', cgpa: '' }]);
  };

  const handleRemove = (index) => {
    const newData = data.filter((_, i) => i !== index);
    onUpdate(newData);
  };

  const handleChange = (index, field, value) => {
    const newData = data.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onUpdate(newData);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Education Details
      </Typography>

      {data.map((edu, index) => (
        <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Degree"
              value={edu.degree}
              onChange={(e) => handleChange(index, 'degree', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Institution"
              value={edu.institution}
              onChange={(e) => handleChange(index, 'institution', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Year"
              value={edu.year}
              onChange={(e) => handleChange(index, 'year', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="CGPA"
              value={edu.cgpa}
              onChange={(e) => handleChange(index, 'cgpa', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={1}>
            <IconButton 
              onClick={() => handleRemove(index)}
              disabled={data.length === 1}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={handleAdd}
        variant="outlined"
        sx={{ mt: 2 }}
      >
        Add Education
      </Button>
    </Box>
  );
};

export default Education;
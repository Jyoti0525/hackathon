import React from 'react';
import {
  Grid, TextField, Button, IconButton, Typography, Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const Experience = ({ data, onUpdate }) => {
  const handleAdd = () => {
    onUpdate([...data, { title: '', company: '', duration: '', description: '' }]);
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
        Work Experience
      </Typography>

      {data.map((exp, index) => (
        <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Job Title"
              value={exp.title}
              onChange={(e) => handleChange(index, 'title', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company"
              value={exp.company}
              onChange={(e) => handleChange(index, 'company', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Duration"
              value={exp.duration}
              onChange={(e) => handleChange(index, 'duration', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={exp.description}
              onChange={(e) => handleChange(index, 'description', e.target.value)}
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
        Add Experience
      </Button>
    </Box>
  );
};

export default Experience;
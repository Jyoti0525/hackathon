import React from 'react';
import {
  Grid, TextField, Button, IconButton, Typography, Box,
  Chip, Autocomplete
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const Projects = ({ data, onUpdate }) => {
  const handleAdd = () => {
    onUpdate([...data, { 
      title: '', 
      description: '', 
      technologies: [], 
      link: '' 
    }]);
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

  const handleTechChange = (index, newTechs) => {
    handleChange(index, 'technologies', newTechs);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Projects
      </Typography>

      {data.map((project, index) => (
        <Grid container spacing={2} key={index} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Project Title"
              value={project.title}
              onChange={(e) => handleChange(index, 'title', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Project Link"
              value={project.link}
              onChange={(e) => handleChange(index, 'link', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Project Description"
              value={project.description}
              onChange={(e) => handleChange(index, 'description', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={11}>
            <Autocomplete
              multiple
              freeSolo
              value={project.technologies}
              onChange={(e, newValue) => handleTechChange(index, newValue)}
              options={[]}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Technologies Used"
                  placeholder="Add technology"
                />
              )}
            />
          </Grid>
          <Grid item xs={1}>
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
        Add Project
      </Button>
    </Box>
  );
};

export default Projects;
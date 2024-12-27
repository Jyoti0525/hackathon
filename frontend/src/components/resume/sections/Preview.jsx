import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Grid,
  Chip,
  Button
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const Preview = ({ data }) => {
  const downloadResume = () => {
    // Implementation for downloading resume
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={downloadResume}
        >
          Download Resume
        </Button>
      </Box>

      <Paper sx={{ p: 4 }}>
        {/* Personal Information */}
        <Typography variant="h4" gutterBottom>
          {data.personal.name}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          {data.personal.email} | {data.personal.phone}
        </Typography>
        {data.personal.linkedin && (
          <Typography color="textSecondary" gutterBottom>
            LinkedIn: {data.personal.linkedin}
          </Typography>
        )}
        <Typography paragraph sx={{ mt: 2 }}>
          {data.personal.summary}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Education */}
        <Typography variant="h5" gutterBottom>
          Education
        </Typography>
        {data.education.map((edu, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="h6">
              {edu.degree}
            </Typography>
            <Typography>
              {edu.institution} ({edu.year})
            </Typography>
            <Typography color="textSecondary">
              CGPA: {edu.cgpa}
            </Typography>
          </Box>
        ))}

        <Divider sx={{ my: 3 }} />

        {/* Experience */}
        <Typography variant="h5" gutterBottom>
          Experience
        </Typography>
        {data.experience.map((exp, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="h6">
              {exp.title}
            </Typography>
            <Typography>
              {exp.company} | {exp.duration}
            </Typography>
            <Typography color="textSecondary" sx={{ mt: 1 }}>
              {exp.description}
            </Typography>
          </Box>
        ))}

        <Divider sx={{ my: 3 }} />

        {/* Skills */}
        <Typography variant="h5" gutterBottom>
          Skills
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {data.skills.map((skill, index) => (
            <Chip key={index} label={skill} />
          ))}
        </Box>

        {/* Projects */}
        <Typography variant="h5" gutterBottom>
          Projects
        </Typography>
        {data.projects.map((project, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="h6">
              {project.title}
            </Typography>
            {project.link && (
              <Typography color="primary" component="a" href={project.link} target="_blank">
                Project Link
              </Typography>
            )}
            <Typography sx={{ mt: 1 }}>
              {project.description}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {project.technologies.map((tech, idx) => (
                <Chip key={idx} label={tech} size="small" variant="outlined" />
              ))}
            </Box>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default Preview;
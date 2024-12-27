// src/pages/LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid
} from '@mui/material';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Welcome to Talent Bridge
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center" color="textSecondary">
          Connecting Students, Universities, and Companies
        </Typography>

        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Students
              </Typography>
              <Typography paragraph>
                Find your dream job and showcase your skills
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/login')}
                fullWidth
              >
                Get Started
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Universities
              </Typography>
              <Typography paragraph>
                Manage student profiles and track placements
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/login')}
                fullWidth
              >
                Login
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Companies
              </Typography>
              <Typography paragraph>
                Find the best talent for your organization
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/login')}
                fullWidth
              >
                Post Jobs
              </Button>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/register')}
            sx={{ mr: 2 }}
          >
            Register
          </Button>
          <Button 
            variant="contained" 
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LandingPage;
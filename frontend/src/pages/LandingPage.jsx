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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#547C4C', // Darker green background from image
        color: 'white'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
          py: 2,
          backgroundColor: '#2C4C24' // Darker green header from image
        }}
      >
        
          <Typography
          variant="h4"
          component="div"
          sx={{ color: '#FFFFFF', fontWeight: 'bold', fontFamily: 'Arial', display: 'flex', alignItems: 'center' }}
        >
          <span style={{ backgroundColor: '#FFFFFF', color: '#356E3C', padding: '0.2rem 0.5rem', borderRadius: '5px' }}>T</span>B
        </Typography>
        
        <Box>
          {/* <Button 
            onClick={() => navigate('/')} 
            sx={{ 
              color: 'white', 
              textTransform: 'none', 
              fontSize: '1.2rem',
              fontFamily: 'Lexend, sans-serif',
              mr: 2 
            }}
          >
            Home
          </Button> */}
          <Button 
            onClick={() => navigate('/register')} 
            sx={{ 
              color: 'white', 
              textTransform: 'none', 
              fontSize: '1.2rem',
              fontFamily: 'Lexend, sans-serif',
              mr: 2 
            }}
          >
            Register
          </Button>
          <Button 
            onClick={() => navigate('/login')} 
            sx={{ 
              color: 'white', 
              textTransform: 'none', 
              fontSize: '1.2rem',
              fontFamily: 'Lexend, sans-serif'
            }}
          >
            Login
          </Button>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 8, flex: 1, display: 'flex' }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={7}>
            <Box sx={{ mb: 6 }}>
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  fontWeight: 'bold',
                  mb: 6,
                  mt: 6,
                  fontFamily: 'Lexend, autour-one',
                  fontSize: '6rem',
                  textAlign: 'center'
                }}
              >
                Welcome To Talent Bridge
              </Typography>
              <Typography 
                variant="h4" 
                component="h2" 
                sx={{
                  fontFamily: 'Lexend, autour-one',
                  fontSize: '2rem'
                }}
              >
                Connecting Students, Universities, and Companies
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <Grid container spacing={3}>
              {[
                {
                  title: 'Students',
                  description: 'Find your dream job and showcase your skills',
                  buttonText: 'Get started'
                },
                {
                  title: 'Universities',
                  description: 'Manage student profiles and track placements',
                  buttonText: 'Login'
                },
                {
                  title: 'Companies',
                  description: 'Find the best talent for your organization',
                  buttonText: 'Post jobs'
                }
              ].map((item, index) => (
                <Grid item xs={12} key={index}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      backgroundColor: '#DCE9D5',
                      borderRadius: '20px',
                      color: '#000'
                    }}
                  >
                    <Typography 
                      variant="h5" 
                      gutterBottom
                      sx={{ 
                        fontFamily: 'Lexend, sans-serif',
                        fontWeight: 'bold'
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography 
                      paragraph
                      sx={{ 
                        fontFamily: 'Lexend, sans-serif',
                        fontSize: '1.1rem',
                        mb: 3
                      }}
                    >
                      {item.description}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/login')}
                      sx={{
                        backgroundColor: '#D8A4A4',
                        color: '#000',
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        fontFamily: 'Lexend, sans-serif',
                        py: 1,
                        px: 4,
                        borderRadius: '25px',
                        ':hover': {
                          backgroundColor: '#C08B8B',
                        },
                      }}
                    >
                      {item.buttonText}
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;
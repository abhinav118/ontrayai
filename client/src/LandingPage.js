import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import InputForm from './InputForm';
import './LandingPage.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B6B',
    },
    secondary: {
      main: '#4ECDC4',
    },
    background: {
      default: '#F7FFF7',
    },
    text: {
      primary: '#2F3542',
      secondary: '#747D8C',
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default function LandingPage() {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const logoStyle = {
    width: isMobile ? '120px' : '140px',
    height: 'auto',
    cursor: 'pointer',
  };
  

  return (
    <ThemeProvider theme={theme}>
      {/* <CssBaseline /> */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
          padding: isMobile ? '20px 10px' : '20px 10px',
        }}
      >
        <Container 
          maxWidth="md" 
          sx={{ 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80%',
          }}
        >
          <Box sx={{ marginBottom: isMobile ? 2 : 4 }}>
            <img
              src="https://res.cloudinary.com/joyup/image/upload/v1721288009/a4yhgcvraq2zmxpnjsiy.png"
              style={logoStyle}
              alt="logo of ontray"
            />
          </Box>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            color="white" 
            paragraph 
            sx={{ 
              marginBottom: isMobile ? 3 : 4,
              maxWidth: '80%',
            }}
          >
            Your AI-Powered Meal Planner<br/>
            Coming Soon .. 
          </Typography>
          <Box sx={{ width: '100%', maxWidth: 500 }}>
            <InputForm />
           
   
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
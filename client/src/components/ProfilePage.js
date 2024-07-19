import React from 'react';
import { Container, Grid, Typography, Paper, Box, Avatar, TextField, Button, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const ProfileContainer = styled(Container)({
  marginTop: '20px',
  padding: '20px',
});

const SectionPaper = styled(Paper)({
  padding: '20px',
  marginBottom: '20px',
});

const ProfilePage = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 1) {
      navigate('/profile');
    } else if (newValue === 2) {
      navigate('/logout');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <ProfileContainer maxWidth="lg">
        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '20px' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Planner" />
            <Tab label="Profile" />
            <Tab label="Logout" />
          </Tabs>
        </Box>
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <SectionPaper>
              <Typography variant="h6" gutterBottom>
                Personal Info
              </Typography>
              <Box component="form" noValidate autoComplete="off">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      name="firstName"
                      autoComplete="given-name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="family-name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="phone"
                      label="Phone Number"
                      name="phone"
                      autoComplete="tel"
                    />
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                    Save
                  </Button>
                  <Button variant="outlined" color="secondary">
                    Cancel
                  </Button>
                </Box>
              </Box>
            </SectionPaper>
          </Grid>
        </Grid>
      </ProfileContainer>
    </Box>
  );
};

export default ProfilePage;

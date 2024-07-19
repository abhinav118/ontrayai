import React, { useState } from 'react';
import { Box, Container, Typography, Button, TextField, Grid, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { styled } from '@mui/system';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

const HomeContainer = styled(Container)({
  marginTop: '20px',
  padding: '20px',
  display: 'flex',
});

const ContentContainer = styled(Box)({
  flexGrow: 1,
  marginLeft: '240px',
});

const Home = () => {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('');
  const [goal, setGoal] = useState('');
  const [calorieIntake, setCalorieIntake] = useState('');
  const [mealsPerDay, setMealsPerDay] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [diet, setDiet] = useState('');

  const navigate = useNavigate();

  const handleGenerateClick = () => {
    // Add logic to generate the meal plan here

    // Navigate to the planner view
    navigate('/planner?view=daily');
  };

  return (
    <HomeContainer maxWidth="lg">
      <Sidebar selectedTab="Home" />
      <ContentContainer>
        <Typography variant="h4" gutterBottom>
          Meal Planner
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Height (cm)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Goal (kg)"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Calorie Intake"
              value={calorieIntake}
              onChange={(e) => setCalorieIntake(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Meals Per Day</InputLabel>
              <Select
                value={mealsPerDay}
                onChange={(e) => setMealsPerDay(e.target.value)}
              >
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4</MenuItem>
                <MenuItem value="5">5</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Activity Level</InputLabel>
              <Select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
              >
                <MenuItem value="sedentary">Sedentary</MenuItem>
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="moderate">Moderate</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="very active">Very Active</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Dietary Preferences</InputLabel>
              <Select
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="vegetarian">Vegetarian</MenuItem>
                <MenuItem value="vegan">Vegan</MenuItem>
                <MenuItem value="paleo">Paleo</MenuItem>
                <MenuItem value="ketogenic">Ketogenic</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateClick}
          >
            Generate
          </Button>
        </Box>
      </ContentContainer>
    </HomeContainer>
  );
};

export default Home;

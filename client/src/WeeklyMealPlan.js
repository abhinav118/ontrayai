import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Box, Typography, Grid } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const WeeklyMealPlan = ({ mealPlan }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const getMacronutrientData = (meals) => {
    const macronutrients = meals.reduce(
      (acc, meal) => {
        if (meal.macronutrients) {
          acc.protein += meal.macronutrients.protein || 0;
          acc.carbs += meal.macronutrients.carbs || 0;
          acc.fat += meal.macronutrients.fat || 0;
        }
        return acc;
      },
      { protein: 0, carbs: 0, fat: 0 }
    );

    return {
      labels: ['Protein', 'Carbohydrates', 'Fat'],
      datasets: [
        {
          data: [macronutrients.protein, macronutrients.carbs, macronutrients.fat],
          backgroundColor: ['#00ff00', '#ffff00', '#ff0000'],
        },
      ],
    };
  };

  return (
    <Box sx={{ width: '100%' }}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="weekly meal plan tabs">
          {days.map((day, index) => (
            <Tab label={day} key={index} />
          ))}
        </Tabs>
      </AppBar>
      {days.map((day, index) => (
        <TabPanel value={value} index={index} key={index}>
          <Typography variant="h6">{day}</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box>
                {mealPlan[day.toLowerCase()].map((meal, mealIndex) => (
                  <Box key={mealIndex} sx={{ mb: 2 }}>
                    <Typography variant="h6">{meal.name}</Typography>
                    <ul>
                      {meal.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                    <Typography variant="body1">Calories: {meal.calories}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Macronutrient Breakdown</Typography>
                <Pie data={getMacronutrientData(mealPlan[day.toLowerCase()])} />
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
      ))}
    </Box>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default WeeklyMealPlan;

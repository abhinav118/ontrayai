import React from 'react';
import { Grid, Card, CardContent, Typography, CardMedia } from '@mui/material';
import { styled } from '@mui/system';

const mealTimes = ['Morning', 'Noon', 'Evening'];
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const meals = {
  Monday: {
    Morning: { name: 'Your Basic Low Carb Breakfast', calories: 400, img: 'link_to_image' },
    Noon: { name: 'Curry Chicken Salad', calories: 500, img: 'link_to_image' },
    Evening: { name: 'Quick Goan Fish Curry', calories: 600, img: 'link_to_image' }
  },
  Tuesday: {
    Morning: { name: 'Coconut Bliss Smoothie', calories: 300, img: 'link_to_image' },
    Noon: { name: 'Spanish style salmon fillets', calories: 400, img: 'link_to_image' },
    Evening: { name: 'Boiled Egg Curry', calories: 500, img: 'link_to_image' }
  },
  // Add more days and meals here...
};

const WeeklyMealListContainer = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const MealCard = styled(Card)(({ theme }) => ({
  minWidth: 200,
  margin: theme.spacing(1),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
}));

const WeeklyMealList = () => {
  return (
    <WeeklyMealListContainer container spacing={2}>
      <Grid item xs={12}>
        <Grid container justifyContent="space-between">
          {daysOfWeek.map(day => (
            <Grid item key={day} xs>
              <Typography variant="h6" align="center">{day}</Typography>
            </Grid>
          ))}
        </Grid>
      </Grid>
      {mealTimes.map(time => (
        <Grid item xs={12} key={time}>
          <Grid container justifyContent="space-between">
            {daysOfWeek.map(day => (
              <Grid item key={day} xs>
                <MealCard>
                  {meals[day][time] && (
                    <>
                      <CardMedia
                        component="img"
                        height="140"
                        image={meals[day][time].img || 'default_image_link'}
                        alt={meals[day][time].name}
                      />
                      <CardContent>
                        <Typography variant="subtitle1">{time} ({meals[day][time].calories} Calories)</Typography>
                        <Typography variant="body2">{meals[day][time].name || 'No Meal'}</Typography>
                      </CardContent>
                    </>
                  )}
                </MealCard>
              </Grid>
            ))}
          </Grid>
        </Grid>
      ))}
    </WeeklyMealListContainer>
  );
};

export default WeeklyMealList;

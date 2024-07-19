import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Box, Grid } from '@mui/material';

const weeklyMeals = {
  monday: [
    { name: 'Breakfast', calories: 517, items: [{ name: 'Oatmeal banana pancakes', servings: '2 pancakes', img: 'oatmeal.jpg' }, { name: 'Cinnamon Banana Mug Cake', servings: '1 serving', img: 'mugcake.jpg' }] },
    { name: 'Lunch', calories: 492, items: [{ name: 'Vanilla Banana Protein Shake', servings: '1 serving', img: 'shake.jpg' }, { name: 'Peach and Peanut Butter Snack', servings: '1 serving', img: 'peachsnack.jpg' }] },
    { name: 'Dinner', calories: 676, items: [{ name: 'Mushroom, Spinach, and Tomato Pita Pizza', servings: '1 serving', img: 'pizza.jpg' }, { name: 'Green Pea & Almond Salad', servings: '1 serving', img: 'salad.jpg' }] },
    { name: 'Snack', calories: 249, items: [{ name: 'Turkey, Ham, and Avocado on Rye', servings: '1 sandwich', img: 'sandwich.jpg' }] }
  ],
  tuesday: [
    { name: 'Breakfast', calories: 517, items: [{ name: 'Oatmeal banana pancakes', servings: '2 pancakes', img: 'oatmeal.jpg' }, { name: 'Cinnamon Banana Mug Cake', servings: '1 serving', img: 'mugcake.jpg' }] },
    { name: 'Lunch', calories: 492, items: [{ name: 'Vanilla Banana Protein Shake', servings: '1 serving', img: 'shake.jpg' }, { name: 'Peach and Peanut Butter Snack', servings: '1 serving', img: 'peachsnack.jpg' }] },
    { name: 'Dinner', calories: 676, items: [{ name: 'Mushroom, Spinach, and Tomato Pita Pizza', servings: '1 serving', img: 'pizza.jpg' }, { name: 'Green Pea & Almond Salad', servings: '1 serving', img: 'salad.jpg' }] },
    { name: 'Snack', calories: 249, items: [{ name: 'Turkey, Ham, and Avocado on Rye', servings: '1 sandwich', img: 'sandwich.jpg' }] }
  ],
  // Add meals for other days...
};

const WeeklyMealList = () => {
  return (
    <Box mt={2}>
      <Grid container spacing={2}>
        {Object.entries(weeklyMeals).map(([day, meals], index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Typography variant="h6" sx={{ textTransform: 'capitalize', marginBottom: '16px' }}>
              {day}
            </Typography>
            {meals.map((meal, idx) => (
              <Paper key={idx} elevation={3} sx={{ padding: '20px', marginBottom: '20px' }}>
                <Typography variant="subtitle1">{meal.name} ({meal.calories} Calories)</Typography>
                <List>
                  {meal.items.map((item, itemIdx) => (
                    <ListItem key={itemIdx}>
                      <ListItemAvatar>
                        <Avatar alt={item.name} src={`/static/images/meals/${item.img}`} />
                      </ListItemAvatar>
                      <ListItemText primary={item.name} secondary={item.servings} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            ))}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WeeklyMealList;

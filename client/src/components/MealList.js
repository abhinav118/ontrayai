import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Box } from '@mui/material';

const meals = [
  {
    name: 'Breakfast',
    calories: 517,
    items: [
      { name: 'Oatmeal banana pancakes', servings: '2 pancakes', img: 'oatmeal.jpg' },
      { name: 'Cinnamon Banana Mug Cake', servings: '1 serving', img: 'mugcake.jpg' },
    ],
  },
  {
    name: 'Lunch',
    calories: 492,
    items: [
      { name: 'Vanilla Banana Protein Shake', servings: '1 serving', img: 'shake.jpg' },
      { name: 'Peach and Peanut Butter Snack', servings: '1 serving', img: 'peachsnack.jpg' },
    ],
  },
  {
    name: 'Dinner',
    calories: 676,
    items: [
      { name: 'Mushroom, Spinach, and Tomato Pita Pizza', servings: '1 serving', img: 'pizza.jpg' },
      { name: 'Green Pea & Almond Salad', servings: '1 serving', img: 'salad.jpg' },
    ],
  },
  {
    name: 'Snack',
    calories: 249,
    items: [
      { name: 'Turkey, Ham, and Avocado on Rye', servings: '1 sandwich', img: 'sandwich.jpg' },
    ],
  },
];

const MealList = () => {
  return (
    <Box mt={2}>
      {meals.map((meal, index) => (
        <Paper key={index} elevation={3} sx={{ padding: '20px', marginBottom: '20px' }}>
          <Typography variant="h6">{meal.name} ({meal.calories} Calories)</Typography>
          <List>
            {meal.items.map((item, idx) => (
              <ListItem key={idx}>
                <ListItemAvatar>
                  <Avatar alt={item.name} src={`/static/images/meals/${item.img}`} />
                </ListItemAvatar>
                <ListItemText primary={item.name} secondary={item.servings} />
              </ListItem>
            ))}
          </List>
        </Paper>
      ))}
    </Box>
  );
};

export default MealList;

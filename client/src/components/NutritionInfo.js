import React from 'react';
import { Paper, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Protein', value: 21, color: '#8884d8' },
  { name: 'Carbs', value: 41, color: '#82ca9d' },
  { name: 'Fat', value: 38, color: '#ffc658' },
];

const NutritionInfo = () => {
  return (
    <Paper elevation={3} sx={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h6">Nutrition</Typography>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={80}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <Box mt={2}>
        <Typography variant="body1">Calories: 1933</Typography>
        <Typography variant="body1">Carbs: 204.4g</Typography>
        <Typography variant="body1">Fat: 85.1g</Typography>
        <Typography variant="body1">Protein: 108.2g</Typography>
        <Typography variant="body1">Fiber: 46g</Typography>
        <Typography variant="body1">Sodium: 2470mg</Typography>
        <Typography variant="body1">Cholesterol: 239mg</Typography>
      </Box>
    </Paper>
  );
};

export default NutritionInfo;

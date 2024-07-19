import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import HotelIcon from '@mui/icons-material/Hotel';
import RepeatIcon from '@mui/icons-material/Repeat';
import { Typography, Paper } from '@mui/material';

const CustomizedTimeline = ({ day, meals }) => {
  return (
    <Timeline>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot>
            <Typography variant="h6" component="span">
              {day}
            </Typography>
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent></TimelineContent>
      </TimelineItem>
      {meals.map((meal, mealIndex) => (
        <TimelineItem key={mealIndex}>
          <TimelineSeparator>
            <TimelineDot color="primary">
              {meal.name === "Breakfast" && <FastfoodIcon />}
              {meal.name === "Lunch" && <LaptopMacIcon />}
              {meal.name === "Dinner" && <HotelIcon />}
              {meal.name === "Snack" && <RepeatIcon />}
            </TimelineDot>
            {mealIndex < meals.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <Paper elevation={3} sx={{ padding: '6px 16px' }}>
              <Typography variant="h6" component="span">
                {meal.name}
              </Typography>
              <Typography>{meal.items.join(', ')}</Typography>
              <Typography>Calories: {meal.calories}</Typography>
              <Typography>Protein: {meal.macronutrients.protein}g</Typography>
              <Typography>Carbs: {meal.macronutrients.carbs}g</Typography>
              <Typography>Fat: {meal.macronutrients.fat}g</Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default CustomizedTimeline;

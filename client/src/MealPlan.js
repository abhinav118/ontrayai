import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import WeeklyMealPlan from './WeeklyMealPlan'; // Add this line to import WeeklyMealPlan
import './MealPlan.css'; // Add this line for CSS
import { Tabs, Tab, AppBar, Box ,Typography } from '@mui/material';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export function MealPlan() {
  const [visible, setVisible] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [mealPlan, setMealPlan] = useState(null);
  const [partialMealPlan, setPartialMealPlan] = useState([]);

  useEffect(() => {
    setVisible(true);
    const eventSource = new EventSource('/api/generate-meal-plan');
    eventSource.onmessage = (event) => {
      const newMealPlan = JSON.parse(event.data);
      setPartialMealPlan((prev) => [...prev, newMealPlan]);
    };
    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      eventSource.close();
    };
    return () => {
      eventSource.close();
    };
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const macronutrients = mealPlan?.macronutrients || {
    protein: 30,
    carbs: 50,
    fat: 20,
  };

  const data = {
    labels: ['Protein', 'Carbohydrates', 'Fat'],
    datasets: [
      {
        data: [macronutrients.protein, macronutrients.carbs, macronutrients.fat],
        backgroundColor: ['#00ff00', '#ffff00', '#ff0000'],
      },
    ],
  };

  return (
    <div className={`meal-plan-container ${visible ? 'slide-in' : ''}`}>
      <AppBar position="static">
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Daily Plan" />
          <Tab label="Weekly Plan" />
        </Tabs>
      </AppBar>
      <TabPanel value={tabIndex} index={0}>
        <div className="meal-plan-content">
          <div className="pie-chart-container">
            <Pie data={data} />
          </div>
          <div className="meal-details">
            <h2>Meals:</h2>
            {partialMealPlan.map((meal, index) => (
              <div key={index}>
                <h3>{meal.name}</h3>
                <ul>
                  {meal.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
                <p>Calories: {meal.calories}</p>
              </div>
            ))}
            {mealPlan?.snacks?.length > 0 && (
              <div>
                <h2>Snacks (optional):</h2>
                <ul>
                  {mealPlan.snacks.map((snack, idx) => (
                    <li key={idx}>{snack.item} ({snack.calories} calories)</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <WeeklyMealPlan mealPlan={mealPlan} />
      </TabPanel>
    </div>
  );
}

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

export default MealPlan;

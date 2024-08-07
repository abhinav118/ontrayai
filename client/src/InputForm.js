import React, { useState } from 'react';
import { CircularProgress, Button, MenuItem, TextField, Select, FormControl, Radio, RadioGroup, FormControlLabel, FormLabel, Box, Paper, useMediaQuery, useTheme, Typography } from '@mui/material';
import './InputForm.css';
import JSONAutocomplete from 'json-autocomplete';

function InputForm() {
  const [profile, setProfile] = useState({
    age: '',
    weight: '',
    height: '',
    gender: '',
    goal: '',
    diet: 'anything',
    calorieIntake: '',
    mealsPerDay: '',
    activityLevel: 'light'
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [mealPlan, setMealPlan] = useState(null);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleDietChange = (diet) => {
    setProfile({ ...profile, diet });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');
    let prev='',a;
    try {
      const eventSource = new EventSource(`http://localhost:5050/api/generate-meal-plan?prompt=${encodeURIComponent(JSON.stringify(profile))}`);
      const jsonResponseFromGPT = // your partially streamed JSON response from GPT;
      eventSource.onmessage = (event) => {
        if (event.data === '[DONE]') {
          eventSource.close();
          setLoading(false);
        } else {
          prev = prev + event.data;
          const completeJsonString = JSONAutocomplete(prev);
          // const parsedJson = JSON.parse(completeJsonString);
          if (completeJsonString) {
            
            try {
                a = JSON.parse(completeJsonString);
                console.log(completeJsonString,"---parsedJson: ",a);
                setMealPlan(a);
            } catch (e) {
                return console.error(e); // error in the above string (in this case, yes)!
            }
        }
          // console.log("---parsedJson: ",parsedJson,completeJsonString);
         
          setResponse((prevResponse) => prevResponse + event.data);
          // setResponse(parsedJson);
        }
      };

      eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
        eventSource.close();
        setLoading(false);
        setResponse((prevResponse) => prevResponse + '\nError: Connection failed.');
      };
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred while processing your request.');
      setLoading(false);
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden', maxWidth: 500, margin: '0 auto', width: '100%' }}>
      <form onSubmit={handleSubmit} className="diet-form">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', p: 2, bgcolor: 'rgba(255,255,255,0.1)' }}>
          {['anything', 'paleo', 'vegetarian', 'vegan', 'ketogenic'].map((diet) => (
            <Button
              key={diet}
              onClick={() => handleDietChange(diet)}
              className={profile.diet === diet ? 'selected' : ''}
              sx={{
                m: 0.5,
                minWidth: isMobile ? '45%' : 'auto',
                fontSize: isMobile ? '0.7rem' : '0.8rem',
                padding: isMobile ? '4px' : '4px 8px',
              }}
            >
              {diet.toUpperCase()}
            </Button>
          ))}
        </Box>

        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 2 }}>
            <TextField name="age" value={profile.age} onChange={handleChange} label="Age" fullWidth size="small" />
            <TextField name="weight" value={profile.weight} onChange={handleChange} label="Weight (kg)" fullWidth size="small" />
            <TextField name="height" value={profile.height} onChange={handleChange} label="Height (cm)" fullWidth size="small" />
            <FormControl fullWidth size="small">
              <Select name="gender" value={profile.gender} onChange={handleChange} displayEmpty>
                <MenuItem value="" disabled>Gender</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField name="goal" value={profile.goal} onChange={handleChange} label="Goal (kg)" fullWidth size="small" sx={{ mt: 2 }} />
          <TextField name="calorieIntake" value={profile.calorieIntake} onChange={handleChange} label="I want to eat (Calories)" fullWidth size="small" sx={{ mt: 2 }} />

          <FormControl fullWidth size="small" sx={{ mt: 2 }}>
            <Select name="mealsPerDay" value={profile.mealsPerDay} onChange={handleChange} displayEmpty>
              <MenuItem value="" disabled>Meals per day</MenuItem>
              <MenuItem value={1}>1 meal</MenuItem>
              <MenuItem value={2}>2 meals</MenuItem>
              <MenuItem value={3}>3 meals</MenuItem>
            </Select>
          </FormControl>

          <FormControl component="fieldset" fullWidth sx={{ mt: 2 }}>
            <FormLabel component="legend">How Active Are You?</FormLabel>
            <RadioGroup row name="activityLevel" value={profile.activityLevel} onChange={handleChange}>
              <FormControlLabel value="sedentary" control={<Radio size="small" />} label="Sedentary" />
              <FormControlLabel value="light" control={<Radio size="small" />} label="Light Activity" />
              <FormControlLabel value="moderate" control={<Radio size="small" />} label="Moderate Activity" />
              <FormControlLabel value="very" control={<Radio size="small" />} label="Very Active" />
            </RadioGroup>
          </FormControl>

          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'GENERATE'}
          </Button>
        </Box>
      </form>
      
      {mealPlan && mealPlan.meals && (
        <Box sx={{ mt: 5  }}>
          {mealPlan.meals.map((meal, index) => (
            <Paper key={index} sx={{ p: 1, mb: 1 }}>
              <Typography variant="h6">{meal.name && meal.name}</Typography>
              <Typography><ul>
                  {meal.items && meal.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul></Typography>
                <Typography>Calories: {meal.calories}</Typography>
              {/* <Typography>{meal.food}</Typography>
              <Typography>Calories: {meal.calories}</Typography>
              <Typography>Carbohydrates: {meal.carbohydrates}</Typography>
              <Typography>Proteins: {meal.proteins}</Typography>
              <Typography>Fats: {meal.fats}</Typography> */}
            </Paper> 
           ))} 
       </Box>
       )}
    </Paper>
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
export default InputForm;
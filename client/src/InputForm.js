import React, { useState } from 'react';
import axios from 'axios';
import { CircularProgress, Button, MenuItem, TextField, Select, InputLabel, FormControl, Radio, RadioGroup, FormControlLabel, FormLabel, Dialog, DialogTitle, DialogContent, IconButton, Box, Paper,useMediaQuery, useTheme } from '@mui/material';
import { Fastfood, Restaurant, LunchDining, DinnerDining, Apple, SaveAlt } from '@mui/icons-material';
import { MealPlan } from './MealPlan'; // Import the MealPlan component
import { jsPDF } from 'jspdf';
import './InputForm.css'; // Add this line for CSS

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
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleDietChange = (diet) => {
    setProfile({ ...profile, diet });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMealPlan(null); // Clear the meal plan before making the API call
    setLoading(true);
    axios.post('/api/generate-meal-plan', profile)
      .then(response => {
        setMealPlan(response.data);
        setLoading(false);
        setOpen(true); // Open the dialog
      })
      .catch(error => {
        console.error('There was an error generating the meal plan!', error);
        alert(`Error: ${error.message}\n\n${JSON.stringify(error.response?.data, null, 2)}`);
        setLoading(false);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const margin = 10;
    let y = margin;

    doc.setFontSize(16);
    doc.text("Meal Plan", margin, y);
    y += 10;

    doc.setFontSize(12);
    if (mealPlan) {
      mealPlan.meals.forEach((meal, index) => {
        doc.text(`${meal.name}`, margin, y);
        y += 7;
        meal.items.forEach((item, idx) => {
          doc.text(`- ${item}`, margin + 10, y);
          y += 7;
        });
        doc.text(`Calories: ${meal.calories}`, margin + 10, y);
        y += 10;
      });

      if (mealPlan.snacks.length > 0) {
        doc.text("Snacks", margin, y);
        y += 7;
        mealPlan.snacks.forEach((snack, idx) => {
          doc.text(`- ${snack.item} (${snack.calories} calories)`, margin + 10, y);
          y += 7;
        });
      }
    }

    doc.save("meal-plan.pdf");
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
          
          {/* <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            GENERATE
          </Button> */}
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
             {loading ? <CircularProgress size={24} /> : 'GENERATE'}
          </Button>
        </Box>
      </form>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
         <DialogTitle>
           Meal Plan
           <IconButton onClick={exportToPDF} style={{ position: 'absolute', right: 16, top: 16 }}>
             <SaveAlt />
           </IconButton>
         </DialogTitle>
         <DialogContent>
           {mealPlan && <MealPlan mealPlan={mealPlan} />}
         </DialogContent>
       </Dialog>
    
    </Paper>
  );
}

export default InputForm;
//   return (
//     <div className="form-container">
//       <form onSubmit={handleSubmit} className="diet-form">
//         <div className="diet-icons">
//           <Button
//             startIcon={<Fastfood />}
//             onClick={() => handleDietChange('anything')}
//             className={profile.diet === 'anything' ? 'selected' : ''}
//           >
//             ANYTHING
//           </Button>
//           <Button
//             startIcon={<Restaurant />}
//             onClick={() => handleDietChange('paleo')}
//             className={profile.diet === 'paleo' ? 'selected' : ''}
//           >
//             PALEO
//           </Button>
//           <Button
//             startIcon={<LunchDining />}
//             onClick={() => handleDietChange('vegetarian')}
//             className={profile.diet === 'vegetarian' ? 'selected' : ''}
//           >
//             VEGETARIAN
//           </Button>
//           <Button
//             startIcon={<DinnerDining />}
//             onClick={() => handleDietChange('vegan')}
//             className={profile.diet === 'vegan' ? 'selected' : ''}
//           >
//             VEGAN
//           </Button>
//           <Button
//             startIcon={<Apple />}
//             onClick={() => handleDietChange('ketogenic')}
//             className={profile.diet === 'ketogenic' ? 'selected' : ''}
//           >
//             KETOGENIC
//           </Button>
//         </div>
        
//         <div className="form-grid">
//           <TextField
//             name="age"
//             value={profile.age}
//             onChange={handleChange}
//             placeholder="Age"
//             label="Age"
//             fullWidth
//             size="small"
//           />
//           <TextField
//             name="weight"
//             value={profile.weight}
//             onChange={handleChange}
//             placeholder="Weight (kg)"
//             label="Weight (kg)"
//             fullWidth
//             size="small"
//           />
//           <TextField
//             name="height"
//             value={profile.height}
//             onChange={handleChange}
//             placeholder="Height (cm)"
//             label="Height (cm)"
//             fullWidth
//             size="small"
//           />
//           <FormControl fullWidth size="small">
//             <InputLabel id="gender-label">Gender</InputLabel>
//             <Select
//               labelId="gender-label"
//               name="gender"
//               value={profile.gender}
//               onChange={handleChange}
//               label="Gender"
//             >
//               <MenuItem value="male">Male</MenuItem>
//               <MenuItem value="female">Female</MenuItem>
//             </Select>
//           </FormControl>
//         </div>

//         <TextField
//           name="goal"
//           value={profile.goal}
//           onChange={handleChange}
//           placeholder="Goal"
//           label="Goal (kg)"
//           fullWidth
//           size="small"
//         />
//         <TextField 
//           name="calorieIntake"
//           value={profile.calorieIntake}
//           onChange={handleChange}
//           placeholder="#### Calories"
//           label="I want to eat (Calories)"
//           fullWidth
//           size="small"
//         />
        
//         <FormControl fullWidth size="small">
//           <InputLabel id="meals-per-day-label">Meals per day</InputLabel>
//           <Select
//             labelId="meals-per-day-label"
//             name="mealsPerDay"
//             value={profile.mealsPerDay}
//             onChange={handleChange}
//             label="Meals per day"
//           >
//             <MenuItem value={1}>1 meal</MenuItem>
//             <MenuItem value={2}>2 meals</MenuItem>
//             <MenuItem value={3}>3 meals</MenuItem>
//           </Select>
//         </FormControl>

//         <FormControl component="fieldset" fullWidth>
//           <FormLabel component="legend">How Active Are You?</FormLabel>
//           <RadioGroup
//             row
//             name="activityLevel"
//             value={profile.activityLevel}
//             onChange={handleChange}
//           >
//             <FormControlLabel value="sedentary" control={<Radio size="small" />} label="Sedentary" />
//             <FormControlLabel value="light" control={<Radio size="small" />} label="Light Activity" />
//             <FormControlLabel value="moderate" control={<Radio size="small" />} label="Moderate Activity" />
//             <FormControlLabel value="very" control={<Radio size="small" />} label="Very Active" />
//           </RadioGroup>
//         </FormControl>
        
//         <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
//           {loading ? <CircularProgress size={24} /> : 'GENERATE'}
//         </Button>
//       </form>

//       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
//         <DialogTitle>
//           Meal Plan
//           <IconButton onClick={exportToPDF} style={{ position: 'absolute', right: 16, top: 16 }}>
//             <SaveAlt />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent>
//           {mealPlan && <MealPlan mealPlan={mealPlan} />}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// export default InputForm;

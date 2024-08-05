// import React, { useState } from 'react';
// import { CircularProgress, Button, MenuItem, TextField, Select, FormControl, Radio, RadioGroup, FormControlLabel, FormLabel, Dialog, DialogTitle, DialogContent, IconButton, Box, Paper, useMediaQuery, useTheme, Typography } from '@mui/material';
// import { SaveAlt } from '@mui/icons-material';
// import { MealPlan } from './MealPlan'; // Import the MealPlan component
// import { jsPDF } from 'jspdf';
// import './InputForm.css';

// function InputForm() {
//   const [profile, setProfile] = useState({
//     age: '',
//     weight: '',
//     height: '',
//     gender: '',
//     goal: '',
//     diet: 'anything',
//     calorieIntake: '',
//     mealsPerDay: '',
//     activityLevel: 'light'
//   });
//   const [mealPlan, setMealPlan] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);

//   const handleChange = (e) => {
//     setProfile({ ...profile, [e.target.name]: e.target.value });
//   };

//   const handleDietChange = (diet) => {
//     setProfile({ ...profile, diet });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setMealPlan(null); // Clear the meal plan before making the API call
//     setLoading(true);

//     const eventSource = new EventSource('/api/generate-meal-plan');
//     const decoder = new TextDecoder();
//     const responseData = [];

//     fetch('/api/generate-meal-plan', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(profile)
//     })
//       .then(response => {
//         const reader = response.body.getReader();
//         return new ReadableStream({
//           start(controller) {
//             function push() {
//               reader.read().then(({ done, value }) => {
//                 if (done) {
//                   controller.close();
//                   return;
//                 }
//                 const chunk = decoder.decode(value, { stream: true });
//                 responseData.push(chunk);
//                 controller.enqueue(value);
//                 push();
//               });
//             }
//             push();
//           }
//         });
//       })
//       .then(() => {
//         const responseText = responseData.join('');
//         const newMealPlan = JSON.parse(responseText);
//         setMealPlan(newMealPlan);
//         setLoading(false);
//         setOpen(true); // Open the dialog
//       })
//       .catch(error => {
//         console.error('There was an error generating the meal plan!', error);
//         alert(`Error: ${error.message}\n\n${JSON.stringify(error.response?.data, null, 2)}`);
//         setLoading(false);
//       });
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     const margin = 10;
//     let y = margin;

//     doc.setFontSize(16);
//     doc.text("Meal Plan", margin, y);
//     y += 10;

//     doc.setFontSize(12);
//     if (mealPlan) {
//       mealPlan.meals.forEach((meal, index) => {
//         doc.text(`${meal.name}`, margin, y);
//         y += 7;
//         meal.items.forEach((item, idx) => {
//           doc.text(`- ${item}`, margin + 10, y);
//           y += 7;
//         });
//         doc.text(`Calories: ${meal.calories}`, margin + 10, y);
//         y += 10;
//       });

//       if (mealPlan.snacks.length > 0) {
//         doc.text("Snacks", margin, y);
//         y += 7;
//         mealPlan.snacks.forEach((snack, idx) => {
//           doc.text(`- ${snack.item} (${snack.calories} calories)`, margin + 10, y);
//           y += 7;
//         });
//       }
//     }

//     doc.save("meal-plan.pdf");
//   };

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   return (
//     <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden', maxWidth: 500, margin: '0 auto', width: '100%' }}>
//       <form onSubmit={handleSubmit} className="diet-form">
//         <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', p: 2, bgcolor: 'rgba(255,255,255,0.1)' }}>
//           {['anything', 'paleo', 'vegetarian', 'vegan', 'ketogenic'].map((diet) => (
//             <Button
//               key={diet}
//               onClick={() => handleDietChange(diet)}
//               className={profile.diet === diet ? 'selected' : ''}
//               sx={{
//                 m: 0.5,
//                 minWidth: isMobile ? '45%' : 'auto',
//                 fontSize: isMobile ? '0.7rem' : '0.8rem',
//                 padding: isMobile ? '4px' : '4px 8px',
//               }}
//             >
//               {diet.toUpperCase()}
//             </Button>
//           ))}
//         </Box>

//         <Box sx={{ p: 3 }}>
//           <Box sx={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 2 }}>
//             <TextField name="age" value={profile.age} onChange={handleChange} label="Age" fullWidth size="small" />
//             <TextField name="weight" value={profile.weight} onChange={handleChange} label="Weight (kg)" fullWidth size="small" />
//             <TextField name="height" value={profile.height} onChange={handleChange} label="Height (cm)" fullWidth size="small" />
//             <FormControl fullWidth size="small">
//               <Select name="gender" value={profile.gender} onChange={handleChange} displayEmpty>
//                 <MenuItem value="" disabled>Gender</MenuItem>
//                 <MenuItem value="male">Male</MenuItem>
//                 <MenuItem value="female">Female</MenuItem>
//               </Select>
//             </FormControl>
//           </Box>

//           <TextField name="goal" value={profile.goal} onChange={handleChange} label="Goal (kg)" fullWidth size="small" sx={{ mt: 2 }} />
//           <TextField name="calorieIntake" value={profile.calorieIntake} onChange={handleChange} label="I want to eat (Calories)" fullWidth size="small" sx={{ mt: 2 }} />

//           <FormControl fullWidth size="small" sx={{ mt: 2 }}>
//             <Select name="mealsPerDay" value={profile.mealsPerDay} onChange={handleChange} displayEmpty>
//               <MenuItem value="" disabled>Meals per day</MenuItem>
//               <MenuItem value={1}>1 meal</MenuItem>
//               <MenuItem value={2}>2 meals</MenuItem>
//               <MenuItem value={3}>3 meals</MenuItem>
//             </Select>
//           </FormControl>

//           <FormControl component="fieldset" fullWidth sx={{ mt: 2 }}>
//             <FormLabel component="legend">How Active Are You?</FormLabel>
//             <RadioGroup row name="activityLevel" value={profile.activityLevel} onChange={handleChange}>
//               <FormControlLabel value="sedentary" control={<Radio size="small" />} label="Sedentary" />
//               <FormControlLabel value="light" control={<Radio size="small" />} label="Light Activity" />
//               <FormControlLabel value="moderate" control={<Radio size="small" />} label="Moderate Activity" />
//               <FormControlLabel value="very" control={<Radio size="small" />} label="Very Active" />
//             </RadioGroup>
//           </FormControl>

//           <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
//             {loading ? <CircularProgress size={24} /> : 'GENERATE'}
//           </Button>
//         </Box>
//       </form>
//       <Typography variant="h6" style={{ marginTop: '20px' }}>
//         Meal Plan
//       </Typography>
//       <Button onClick={exportToPDF} variant="outlined" startIcon={<SaveAlt />} style={{ marginTop: '10px' }}>
//         Export to PDF
//       </Button>
//       {mealPlan && <MealPlan mealPlan={mealPlan} />}
//     </Paper>
//   );
// }

import React, { useState } from 'react';
import { CircularProgress, Button, MenuItem, TextField, Select, FormControl, Radio, RadioGroup, FormControlLabel, FormLabel, Dialog, DialogTitle, DialogContent, IconButton, Box, Paper, useMediaQuery, useTheme, Typography } from '@mui/material';
import { SaveAlt } from '@mui/icons-material';
import { MealPlan } from './MealPlan'; // Import the MealPlan component
import { jsPDF } from 'jspdf';
import './InputForm.css';

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
  const [response, setResponse] = useState('');

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
    setResponse('');
    // console.log("---Profile: ", profile);
    try {
      const eventSource = new EventSource(`http://localhost:5050/api/generate-meal-plan?prompt=${profile}`);

      eventSource.onmessage = (event) => {
        if (event.data === '[DONE]') {
          eventSource.close();
          setLoading(false);
        } else {
          setResponse((prevResponse) => prevResponse + event.data);
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

          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'GENERATE'}
          </Button>
        </Box>
      </form>
      <Typography variant="h6" style={{ marginTop: '20px' }}>
        Meal Plan
      </Typography>
      {/* <Button onClick={exportToPDF} variant="outlined" startIcon={<SaveAlt />} style={{ marginTop: '10px' }}>
        Export to PDF
      </Button> */}
      {response}
    </Paper>
  );
}

export default InputForm;

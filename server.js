const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();
const bodyParser = require('body-parser');
const connectDB = require('./db');
const UserProfile = require('./models/UserProfile');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});




// app.use(bodyParser.json());

// const configuration = new Configuration({
//   apiKey: process.env.OPEN_AI_KEY,
// });

// const openai = new OpenAIApi(configuration);

app.post('/api/user', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  
  try {
    const newUser = new UserProfile({
      firstName,
      lastName,
      email,
      password, // Ensure you hash the password before saving in a real application
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/api/generate-meal-plan', async (req, res) => {
  const { prompt } = req.query;
  // const { age, weight, height, gender, goal, diet, calorieIntake, mealsPerDay, activityLevel } = req.body;


  const example_json_op = {
    "meals": [
      {
        "name": "Breakfast",
        "items": [
          "2 Boiled Eggs",
          "1 Whole Wheat Toast",
          "1/2 Avocado",
          "1 cup of Mixed Berries"
        ],
        "calories": 400,
        "macronutrients": {
          "protein": 30,
          "carbs": 50,
          "fat": 20
        }
      },
      {
        "name": "Lunch/Dinner",
        "items": [
          "Grilled Chicken Breast (200g)",
          "Quinoa (1/2 cup cooked)",
          "Roasted Vegetables (1 cup)",
          "Mixed Green Salad with Olive Oil and Balsamic Vinegar"
        ],
        "calories": 460,
        "macronutrients": {
          "protein": 30,
          "carbs": 50,
          "fat": 20
        }
      }
    ],
    "snacks": [
      {
        "item": "1 small apple",
        "calories": 80,
        "macronutrients": {
          "protein": 30,
          "carbs": 50,
          "fat": 20
        }
      }
    ],
    "monday": [
      {
        "name": "Breakfast",
        "items": ["Oatmeal", "Banana"],
        "calories": 300,
        "macronutrients": {
          "protein": 30,
          "carbs": 50,
          "fat": 20
        }
      },
      {
        "name": "Lunch",
        "items": ["Grilled Chicken", "Salad"],
        "calories": 400,
        "macronutrients": {
          "protein": 30,
          "carbs": 50,
          "fat": 20
        }
      }
    ],
    "tuesday": [
      {
        "name": "Breakfast",
        "items": ["Smoothie"],
        "calories": 250,
        "macronutrients": {
          "protein": 30,
          "carbs": 50,
          "fat": 20
        }
      },
      {
        "name": "Lunch",
        "items": ["Turkey Sandwich", "Carrot Sticks"],
        "calories": 350,
        "macronutrients": {
          "protein": 30,
          "carbs": 50,
          "fat": 20
        }
      }
    ],
    "wednesday": [
      {
        "name": "Breakfast",
        "items": ["Yogurt", "Granola"],
        "calories": 200,
        "macronutrients": {
          "protein": 30,
          "carbs": 50,
          "fat": 20
        }
      },
      {
        "name": "Lunch",
        "items": ["Salmon", "Quinoa"],
        "calories": 450,
        "macronutrients": {
          "protein": 30,
          "carbs": 50,
          "fat": 20
        }
      }
    ],
    "thursday": [
      {
        "name": "Breakfast",
        "items": ["Pancakes", "Strawberries"],
        "calories": 300,
        "macronutrients": {
          "protein": 30,
          "carbs": 50,
          "fat": 20
        }
      },
      {
        "name": "Lunch",
        "items": ["Chicken Wrap", "Apple Slices"],
        "calories": 400,
        "macronutrients": {
          "protein": 30,
          "carbs": 50,
          "fat": 20
        }
      }
    ],
    "friday": [
      {
        "name": "Breakfast",
        "items": ["Eggs", "Toast"],
        "calories": 250,
        "macronutrients": {
          "protein": 30,
          "carbs": 50,
          "fat": 20
        }
      },
      {
        "name": "Lunch",
        "items": ["Beef Stir Fry", "Brown Rice"],
        "calories": 500,
        "macronutrients": {
          "protein": 30,
          "carbs": 50,
          "fat": 20
        }
      }
    ],
    "saturday": [
      {
        "name": "Breakfast",
        "items": ["Smoothie Bowl"],
        "calories": 300,
        "macronutrients": {
          "protein": 30,
          "carbs": 50,
          "fat": 20
        }
      },
      {
        "name": "Lunch",
        "items": ["Grilled Cheese", "Tomato Soup"],
        "calories": 350,
        "macronutrients": {
          "protein": 30,
          "carbs": 50,
          "fat": 20
        }
      }
    ],
    "sunday": [
      {
        "name": "Breakfast",
        "items": ["French Toast", "Blueberries"],
        "calories": 350,
        "macronutrients": {
          "protein": 30,
          "carbs": 50,
          "fat": 20
        }
      },
      {
        "name": "Lunch",
        "items": ["Chicken Salad"],
        "calories": 400,
        "macronutrients": {
          "protein": 30,
          "carbs": 50,
          "fat": 20
        }
      }
    ]
  };
  const csv_op = `Breakfast
- 100g Oats
- 2 tablespoons Chia Seeds - 1 Banana
- 1 cup Blueberries Calories: 500
Lunch/Dinner
- 200g Grilled Chicken Breast - 1 cup cooked Brown Rice
- 2 cups Steamed Broccoli
- 1 tsp Olive Oil
Calories: 600`
  // console.log('Received request body:', req.body);

  // const prompt = `Generate a meal plan for a ${gender} aged ${age} with a weight of ${weight}kg and height of ${height}cm. The goal is ${goal}. Preferences: ${diet}. Total calories: ${calorieIntake}. Meals per day: ${mealsPerDay}. With Activity level: ${activityLevel}`;
  // console.log('PROMPT :', prompt);

  const messages = [
    {
      role: 'system',
      content: `You are a meal planner that outputs meal plan with meals, snacks and macronutrients. Only respond with this output by meal type and ingredient list format as:${csv_op})}`,
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  console.log('Messages CONSTRUCTED :', messages);

  res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });
  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      stream: true,
    });

    for await (const chunk of stream) {
      // console.log('CHUNK CONSTRUCTED :', JSON.stringify(chunk));

      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${content}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Error:', error);
    res.write(`data: Error: ${error.message}\n\n`);
    res.end();
  }
  

});

// function parseMealPlan(responseText) {
//   const response = JSON.parse(responseText);
//   console.log('-->PARSED RESPONSE :', response);

//   const mealPlan = { meals: [], snacks: [], monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: [] };

//   response.meals.forEach(meal => {
//     const mealDetails = {
//       name: meal.name,
//       items: meal.items,
//       calories: meal.calories,
//       macronutrients: meal.macronutrients
//     };

//     if (meal.name.toLowerCase() === 'snack') {
//       mealPlan.snacks.push(mealDetails);
//     } else {
//       mealPlan.meals.push(mealDetails);
//     }
//   });

//   if (response.meals) {
//     ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach(day => {
//       if (response[day]) {
//         response[day].forEach(meal => {
//           const mealDetails = {
//             name: meal.name,
//             items: meal.items,
//             calories: meal.calories,
//             macronutrients: meal.macronutrients
//           };
//           mealPlan[day].push(mealDetails);
//         });
//       }
//     });
//   }

//   console.log('-->CONSTRUCTED mealPlan', mealPlan);

//   return mealPlan;
// }

// app.listen(5050, () => {
//   console.log('Server running on port 5050');
// });

// app.get('/api/generate-meal-plan', async (req, res) => {
//   const { prompt } = req.query;

//   res.writeHead(200, {
//     'Content-Type': 'text/event-stream',
//     'Cache-Control': 'no-cache',
//     'Connection': 'keep-alive',
//   });

//   try {
//     const stream = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [{ role: 'user', content: prompt }],
//       stream: true,
//     });

//     for await (const chunk of stream) {
//       const content = chunk.choices[0]?.delta?.content || '';
//       if (content) {
//         res.write(`data: ${content}\n\n`);
//       }
//     }

//     res.write('data: [DONE]\n\n');
//     res.end();
//   } catch (error) {
//     console.error('Error:', error);
//     res.write(`data: Error: ${error.message}\n\n`);
//     res.end();
//   }
// });

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
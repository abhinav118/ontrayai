const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();
const connectDB = require('./db');
const UserProfile = require('./models/UserProfile');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const cors = require('cors');

const app = express();
app.use(cors()); // Add this line to enable CORS

app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

connectDB();

app.post('/api/user', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  check('phone', 'Phone number is required').exists()
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, phone, password } = req.body;
  console.log('--/api/user Received request body:', req.body);

  try {
    let user = await UserProfile.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new UserProfile({
      firstName,
      lastName,
      email,
      phone,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, jwtSecret, { expiresIn: '5 days' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error',err.message);
  }
});

app.post('/api/auth', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await UserProfile.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, jwtSecret, { expiresIn: '5 days' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/api/generate-meal-plan', async (req, res) => {
  const { age, weight, height, gender, goal, diet, calorieIntake, mealsPerDay, activityLevel } = req.body;

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
  }

  console.log('Received request body:', req.body);

  const prompt = `Generate a meal plan for a ${gender} aged ${age} with a weight of ${weight}kg and height of ${height}cm. The goal is ${goal}. Preferences: ${diet}. Total calories: ${calorieIntake}. Meals per day: ${mealsPerDay}. With Activity level: ${activityLevel}`;
  console.log('PROMPT CONSTRUCTED :', prompt);

  const messages = [
    {
      role: 'system',
      content: `You are a meal planner that outputs meal plan with meals, snacks and macronutrients in a valid json. Only respond with this JSON data schema:${JSON.stringify(example_json_op)}`,
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: messages,
      max_tokens: 7000,
    });
    const responseText = completion.data.choices[0].message.content;
    console.log('-->OPENAI response:', responseText);

    const mealPlan = parseMealPlan(responseText);

    res.json(mealPlan);
  } catch (error) {
    console.error('Error generating chat completion:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    res.status(500).send('Error generating chat completion');
  }
});

function parseMealPlan(responseText) {
  const response = JSON.parse(responseText);
  console.log('-->PARSED RESONSE :', response);

  const mealPlan = {
    meals: [], snacks: [],
    monday: [], tuesday:[], wednesday:[], thursday:[], friday:[], saturday:[], sunday:[]
  };

  response.meals.forEach(meal => {
    const mealDetails = {
      name: meal.name,
      items: meal.items,
      calories: meal.calories,
      macronutrients: meal.macronutrients
    };

    if (meal.name.toLowerCase() === 'snack') {
      mealPlan.snacks.push(mealDetails);
    } else {
      mealPlan.meals.push(mealDetails);
    }
  });

  if (response.meals) {
    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach(day => {
      if (response[day]) {
        response[day].forEach(meal => {
          const mealDetails = {
            name: meal.name,
            items: meal.items,
            calories: meal.calories,
            macronutrients: meal.macronutrients
          };
          mealPlan[day].push(mealDetails);
        });
      }
    });
  }

  console.log('-->CONSTRUCTED mealPlan', mealPlan);

  return mealPlan;
}

app.listen(5050, () => {
  console.log('Server running on port 5050');
});

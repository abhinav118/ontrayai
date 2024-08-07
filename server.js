const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();
const bodyParser = require('body-parser');
const connectDB = require('./db');
const UserProfile = require('./models/UserProfile');
const { makeStreamingJsonRequest } = require('http-streaming-request');
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
  const p = JSON.parse(prompt);
  const { age, weight, height, gender, goal, diet, calorieIntake, mealsPerDay, activityLevel } = p;

  console.log('PROMPT :', JSON.stringify(p));
  console.log("age, weight, height, gender, goal, diet, calorieIntake, mealsPerDay, activityLevel", age, weight, height, gender, goal, diet, calorieIntake, mealsPerDay, activityLevel);
  // const ex_op= "Breakfast\n
  // - 100g Oats\n
  // - 2 tablespoons Chia Seeds\n
  // - 1 Banana\n
  // - 1 cup Blueberries\n
  // Calories: 500\n
  // \n
  // Lunch/Dinner\n
  // - 200g Grilled Chicken Breast\n
  // - 1 cup cooked Brown Rice\n
  // - 2 cups Steamed Broccoli\n
  // - 1 tsp Olive Oil\n
  // Calories: 600\n";
  const ex_json={ "meals": [
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
      "name": "Lunch",
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
    },
    {
      "name": "Dinner",
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
  ]
  }
  const prompt1 = `Generate a meal plan for a ${gender} aged ${age} with a weight of ${weight}kg and height of ${height}cm. The goal is ${goal}. Preferences: ${diet}. Total calories: ${calorieIntake}. Meals per day: ${mealsPerDay}. With Activity level: ${activityLevel}`;
  console.log('PROMPT CONSTRUCTED :', prompt1);
  const messages = [
    {
      role: 'system',
      content: `You are a meal planner that outputs meal plan with meals and macronutrients in a valid json. Only respond with this JSON data schema:${JSON.stringify(ex_json)}`,

    },
    {
      role: 'user',
      content: prompt1,
    },
  ];

  console.log('Messages CONSTRUCTED :', JSON.stringify(messages));

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  try {
   
    // const stream = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   stream: true,
    //   messages: messages,
    // });
  
    // let data = ''; // To accumulate the chunks of response data
  
    // for await (const chunk of stream) {
    //   const chunk1 = chunk.choices[0].delta.content || "";
    //   data += chunk1// accumulate
  
    //   const endIndex = data.indexOf('}');
    //   if (endIndex !== -1) {
    //     const startIndex = data.indexOf('{');
  
    //     const jsonObject = data.slice(startIndex, endIndex + 1); // Extract the JSON object
    //     data = data.slice(endIndex + 1); // Remove the extracted JSON object from the accumulated data
    //     try {
    //       const parsedObject = JSON.parse(jsonObject);
    //       console.log(parsedObject); // Handle the parsed JSON object here
    //       res.write(jsonObject);
  
    //       // Make an API call
    //     } catch (err) {
    //       console.error('Error while parsing JSON:', err);
    //     }
    //   }
    // }
    const stream = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      // console.log('-->PARSED content :', content);

      if (content) {
        // let revertedContent = content.slice(-1)==','?content.slice(-1).replace(",", ",\"\""):content;
        // // revertedContent=revertedContent.replace(/\\/g, '//');
        // // revertedContent=revertedContent.replace('//', '\\\\');
        // console.log("---revertedTestData2: ",revertedContent);
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
const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  const messages = [
    {
      role: 'system',
      content: 'You are a helpful assistant.',
    },
    {
      role: 'user',
      content: message,
    },
  ];

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 150,
    });

    res.json({ response: completion.data.choices[0].message.content });
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
// main();

app.listen(5051, () => {
  console.log('Server running on port 5051');
});

const express = require('express');
const cors = require('cors');
const OpenAI = require('openai'); // Updated import
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create OpenAI API client using API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // API key passed directly
});

// API route to handle chatbot requests
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: 'No message provided.' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });

    const chatbotReply = response.choices[0].message.content;
    res.json({ reply: chatbotReply });
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    res.status(500).json({ reply: 'Error connecting to the chatbot service.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

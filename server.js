const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');  // Import cors package
dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors({
    origin: '*',  // Allow all origins (for local development, this is fine)
    methods: ['*'], // Allow GET and POST methods
    //allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
    optionsSuccessStatus: 200  // For legacy browser support
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle chat requests
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    const apiKey = process.env.OPENAI_API_KEY;  // Store your API key in a .env file

    if (!apiKey) {
        return res.status(500).send({ error: 'API key not configured' });
    }

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4",
            messages: [{ role: "user", content: userMessage }]
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);  // Send OpenAI response back to frontend
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to communicate with OpenAI' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running.`);
});

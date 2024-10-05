import fetch from 'node-fetch';
import express from 'express';
import dotenv from 'dotenv';

const app = express();
const port = process.env.PORT || 3000;

// Load environment variables
dotenv.config();

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Weather App API! Use /api/weather to get weather data.');
});

// Proxy route to get weather data
app.get('/api/weather', async (req, res) => {
    const { lat, lon, city } = req.query;
    const API_KEY = process.env.WEATHER_API_KEY;

    let apiUrl = `http://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}`;

    if (lat && lon) {
        apiUrl += `&lat=${lat}&lon=${lon}`;
    } else if (city) {
        apiUrl += `&q=${city}`;
    } else {
        return res.status(400).json({ message: "Missing required parameters" });
    }

    try {
        const response = await fetch(apiUrl);
        
        // Check if the response is successful
        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ message: errorData.message });
        }

        const weatherData = await response.json();
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
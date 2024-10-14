import fetch from 'node-fetch';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Load environment variables
dotenv.config();

// Use CORS
app.use(cors({
    origin: 'https://weatherapp-production-acf5.up.railway.app/', 
}));

// Root route: Simple endpoint to confirm the API is running
app.get('/', (req, res) => {
    res.send('Welcome to the Weather App API! Use /api/weather to get weather data.');
});

// Proxy route to get weather data from OpenWeatherMap API
app.get('/api/weather', async (req, res) => {
    // Extracting query parameters: latitude, longitude, and city name
    const { lat, lon, city } = req.query;
    const API_KEY = process.env.WEATHER_API_KEY;

    // Base URL for the OpenWeatherMap API
    let apiUrl = `http://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}`;

    // Constructing the API URL based on the provided parameters
    if (lat && lon) {
        apiUrl += `&lat=${lat}&lon=${lon}`;
    } else if (city) {
        apiUrl += `&q=${city}`;
    } else {
        return res.status(400).json({ message: "Missing required parameters" });
    }

    try {
        // Making the API call to OpenWeatherMap
        const response = await fetch(apiUrl);
        
        // Check if the response is successful
        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ message: errorData.message });
        }

        // Parse the weather data from the response
        const weatherData = await response.json();
        // Return the weather data as JSON
        res.json(weatherData);
    } catch (error) {
        // Catch any errors that occur during the fetch and return a 500 error with the error message
        res.status(500).json({ message: error.message });
    }
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
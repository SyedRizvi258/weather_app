import fetch from 'node-fetch';
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Load environment variables
require('dotenv').config();

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
    const weatherData = await response.json();
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
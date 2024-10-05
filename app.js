// SELECT ELEMENTS
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
const toggleUnitButton = document.getElementById("toggle-unit");
const getWeatherButton = document.getElementById("get-weather");
const cityInput = document.getElementById("city-input");

// App data
const weather = {
    temperature: { unit: "celsius" }
};

// APP CONSTS AND VARS
const KELVIN = 273;
const backendUrl = "https://weather-app-backend-zvr5.onrender.com/api/weather";

// CHECK IF BROWSER SUPPORTS GEOLOCATION
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't support Geolocation</p>";
}

// SET USER'S POSITION
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
    document.getElementById("retry").style.display = "block";
}

// GET WEATHER FROM BACKEND (BY LATITUDE & LONGITUDE)
function getWeather(latitude, longitude) {
    let api = `${backendUrl}?lat=${latitude}&lon=${longitude}`; 

    fetch(api)
        .then(response => response.json())
        .then(data => {
            setWeatherData(data);
            displayWeather();
        })
        .catch(error => {
            notificationElement.style.display = "block";
            notificationElement.innerHTML = `<p>${error.message}</p>`;
        });
}

// GET WEATHER BY CITY NAME
function getWeatherByCity(city) {
    let api = `${backendUrl}?city=${city}`; // Call your backend API

    fetch(api)
        .then(response => {
            if (!response.ok) throw new Error("City not found");
            return response.json();
        })
        .then(data => {
            setWeatherData(data);
            displayWeather();
        })
        .catch(error => {
            notificationElement.style.display = "block";
            notificationElement.innerHTML = `<p>${error.message}</p>`;
        });
}

// SET WEATHER DATA
function setWeatherData(data) {
    weather.temperature.value = Math.floor(data.main.temp - KELVIN);
    weather.description = data.weather[0].description;
    weather.iconId = data.weather[0].icon;
    weather.city = data.name;
    weather.country = data.sys.country;
}

// DISPLAY WEATHER TO UI
function displayWeather() {
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

// C to F conversion
function celsiusToFahrenheit(temperature) {
    return (temperature * 9/5) + 32;
}

// Handle unit switch when the toggle button is clicked
if (toggleUnitButton) {
    toggleUnitButton.addEventListener("click", function () {
        if (weather.temperature.unit === "celsius") {
            let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
            tempElement.innerHTML = `${Math.floor(fahrenheit)}°<span>F</span>`;
            weather.temperature.unit = "fahrenheit";
        } else {
            tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
            weather.temperature.unit = "celsius";
        }
    });
}

// Handle city weather retrieval when the button is clicked
if (getWeatherButton) {
    getWeatherButton.addEventListener("click", function () {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherByCity(city);
        } else {
            notificationElement.style.display = "block";
            notificationElement.innerHTML = "<p>Please enter a city name</p>";
        }
    });
}
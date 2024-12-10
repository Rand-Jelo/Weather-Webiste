// API Key
const API_KEY = 'b4d90c57db8e12eb0ea4c37d335ed061';

// Fallback to london if no location can be found
const defaultLocation = {
    lat: 51.5074,
    lon: -0.1278
};

// Weather Card select element
const locationNameEl = document.querySelector('.location-name');
const weatherDescEl = document.querySelector('.weather-description');
const temperatureEl = document.querySelector('.temperature');


// Fetch user location
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const {
                latitude,
                longitude
            } = position.coords;
            fetchWeatherData(latitude, longitude);
        }, () => {
            // If user denies location, fall back to default
            fetchWeatherData(defaultLocation.lat, defaultLocation.lon);
        });
    } else {
        // If geolocation not supported
        fetchWeatherData(defaultLocation.lat, defaultLocation.lon);
    }
}

// Fetch current weather weather for location
async function fetchWeatherData(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch current weather.');
        }

        let data = await response.json();
        displayCurrentWeather(data);
    } catch (error) {
        console.error(error);
        // If fetch fails and we're not already using default,
        // fallback to default location
        if (lat !== defaultLocation.lat || lon !== defaultLocation.lon) {
            fetchWeatherData(defaultLocation.lat, defaultLocation.lon);
        } else {
            // If even default fails, show error message
            locationNameEl.textContent = "Location Unavailable";
            weatherDescEl.textContent = "";
            temperatureEl.textContent = "";
        }
    }
}

// Display current weather on weather card
function displayCurrentWeather(data) {
    const cityName = data.name;
    const description = data.weather[0].description;
    const temp = data.main.temp;
  
    locationNameEl.textContent = cityName;
    weatherDescEl.textContent = description;
    temperatureEl.textContent = `${Math.round(temp)}°C`;
  }


  getUserLocation();

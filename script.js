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

// Hourly forecast select element
const hourlyContainer = document.querySelector('.hourly-container');

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

// Fetch current weather and hourly forecast
async function fetchWeatherData(lat, lon) {
    try {
        // Fetch current weather
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        let currentWeatherRes = await fetch(currentWeatherUrl);
        if (!currentWeatherRes.ok) {
            throw new Error('Failed to fetch current weather.');
        }
        let currentWeatherData = await currentWeatherRes.json();
        const cityName = currentWeatherData.name;

        // Fetch hourly forecast
        const oneCallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&exclude=minutely,daily,alerts`;
        let oneCallRes = await fetch(oneCallUrl);
        if (!oneCallRes.ok) {
            throw new Error(`Failed to fetch One Call data. Status: ${oneCallRes.status}`);
        }
        let oneCallData = await oneCallRes.json();

        // Display current weather and hourly forecast
        displayCurrentWeather(currentWeatherData);
        displayHourlyForecast(oneCallData.hourly);

    } catch (error) {
        console.error(error);
        // If fetch fails and we're not on default, fallback to default
        if (lat !== defaultLocation.lat || lon !== defaultLocation.lon) {
            fetchWeatherData(defaultLocation.lat, defaultLocation.lon);
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

// Display hourly forecast for the next 24 hours
function displayHourlyForecast(hourlyData) {
    hourlyContainer.innerHTML = '';
    const nextHours = hourlyData.slice(0, 24);
    nextHours.forEach(hourData => {
        const date = new Date(hourData.dt * 1000);
        const hour = date.getHours();
        const formattedHour = `${hour}:00`;
        const temp = Math.round(hourData.temp);
        const weatherIcon = hourData.weather[0].icon;

        const card = document.createElement('div');
        card.classList.add('hour-card');
        card.innerHTML = `
            <h4>${formattedHour}</h4>
            <p>${temp}°C</p>
        `;

        hourlyContainer.appendChild(card);
    });
}


getUserLocation();
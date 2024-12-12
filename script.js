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

// Advice form select element
const adviceBtn = document.querySelector('.advice-btn');
const adviceFormContainer = document.querySelector('.advice-form-container');
const adviceForm = document.querySelector('.advice-form');
const adviceResult = document.querySelector('.advice-result');

let storedHourlyData = null;

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

        // Hourly data for advice form use
        storedHourlyData = oneCallData.hourly;

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
        const iconClass = getWeatherIconClass(weatherIcon);

        const card = document.createElement('div');
        card.classList.add('hour-card');
        card.innerHTML = `
            <h4>${formattedHour}</h4>
            <i class="${iconClass}"></i>
            <p>${temp}°C</p>
        `;

        hourlyContainer.appendChild(card);
    });
}

// Font Awesome icons dynamic based on day or night and weather
function getWeatherIconClass(weatherIcon) {
    const code = weatherIcon.slice(0, 2);
    const isDay = weatherIcon.endsWith('d');

    switch (code) {
        case '01':
            return isDay ? 'fas fa-sun' : 'fas fa-moon';
        case '02':
            return isDay ? 'fas fa-cloud-sun' : 'fas fa-cloud-moon';
        case '03':
            return 'fas fa-cloud';
        case '04':
            return 'fas fa-cloud-meatball';
        case '09':
            return 'fas fa-cloud-showers-heavy';
        case '10':
            return 'fas fa-cloud-rain';
        case '11':
            return 'fas fa-bolt';
        case '13':
            return 'fas fa-snowflake';
        case '50':
            return 'fas fa-smog';
        default:
            return 'fas fa-cloud';
    }
}

// Toggle advice form visibility
adviceBtn.addEventListener('click', () => {
    adviceFormContainer.style.display = (adviceFormContainer.style.display === 'none' || adviceFormContainer.style.display === '') ? 'block' : 'none';
});

// Handle advice form submission
adviceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const time = parseInt(document.getElementById('time-input').value, 10);
    provideClothingAdvice(time);
});

// Provide clothing advice based on the forecasted hour
function provideClothingAdvice(hour) {
    if (!storedHourlyData) {
        adviceResult.textContent = "No data available yet.";
        return;
    }

    if (hour < 0 || hour > 23 || hour >= storedHourlyData.length) {
        adviceResult.textContent = "Please enter a valid hour within the available forecast range (0-23).";
        return;
    }

    const forecast = storedHourlyData[hour];
    const temp = forecast.temp;
    const weatherCondition = forecast.weather[0].description.toLowerCase();
    const isRainy = weatherCondition.includes('rain') || weatherCondition.includes('shower');
    const isSnowy = weatherCondition.includes('snow');

    let tempAdvice;
    if (temp < 0) {
        tempAdvice = "It's freezing; wear a heavy coat, scarf, and gloves.";
    } else if (temp < 10) {
        tempAdvice = "It's quite cold; a warm jacket and maybe a beanie would be good.";
    } else if (temp < 20) {
        tempAdvice = "It's cool; a light jacket or sweater should suffice.";
    } else if (temp < 25) {
        tempAdvice = "The temperature is mild; a long-sleeve shirt or light clothing is fine.";
    } else {
        tempAdvice = "It's warm; wear something light and breathable.";
    }

    let weatherAdvice = "";
    if (isRainy) {
        weatherAdvice += " Also, since it's going to rain, don't forget an umbrella!";
    } else if (isSnowy) {
        weatherAdvice += " It's snowy; wear warm, waterproof boots and dress in layers.";
    }

    const hourLabel = hour.toString().padStart(2, '0') + ":00";
    adviceResult.textContent = `At ${hourLabel}, it's expected to be ${Math.round(temp)}°C with ${weatherCondition}. ${tempAdvice}${weatherAdvice}`;
}


getUserLocation();
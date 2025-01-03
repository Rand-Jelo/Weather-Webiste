// API Key
const API_KEY = "b4d90c57db8e12eb0ea4c37d335ed061";

// Fallback to london if no location can be found
const defaultLocation = {
  lat: 51.5074,
  lon: -0.1278,
};

// Weather Card select element
const locationNameEl = document.querySelector(".location-name");
const weatherDescEl = document.querySelector(".weather-description");
const temperatureEl = document.querySelector(".temperature");

// Hourly forecast select element
const hourlyContainer = document.querySelector(".hourly-container");

// Advice form select element
const adviceBtn = document.querySelector(".advice-btn");
const adviceFormContainer = document.querySelector(".advice-form-container");
const adviceForm = document.querySelector(".advice-form");
const adviceResult = document.querySelector(".advice-result");

// Modal select elements
const modalOverlay = document.querySelector(".modal-overlay");
const modalYesBtn = document.querySelector(".modal-yes-btn");
const modalNoBtn = document.querySelector(".modal-no-btn");

// Hourly button select elements
const showHourlyBtn = document.querySelector(".show-hourly-btn");
const forecastTitle = document.querySelector(".forecast-title");

let storedHourlyData = null;

let showingHourly = false;

// Show the modal on page load
window.addEventListener("load", () => {
  modalOverlay.style.display = "flex";
});

// If the user clicks "Yes", attempt geolocation again
modalYesBtn.addEventListener("click", () => {
  modalOverlay.style.display = "none";
  getUserLocation();
});

// If the user clicks "No", fall back to the default location immediately
modalNoBtn.addEventListener("click", () => {
  modalOverlay.style.display = "none";
  fetchWeatherData(defaultLocation.lat, defaultLocation.lon);
});

// Fetch user location
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(latitude, longitude);
      },
      () => {
        // If user denies location, fall back to default
        fetchWeatherData(defaultLocation.lat, defaultLocation.lon);
      },
    );
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
      throw new Error("Failed to fetch current weather.");
    }
    let currentWeatherData = await currentWeatherRes.json();
    const cityName = currentWeatherData.name;

    // Fetch hourly forecast
    const oneCallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&exclude=minutely,daily,alerts`;
    let oneCallRes = await fetch(oneCallUrl);
    if (!oneCallRes.ok) {
      throw new Error(
        `Failed to fetch One Call data. Status: ${oneCallRes.status}`,
      );
    }
    let oneCallData = await oneCallRes.json();

    // Display current weather

    displayCurrentWeather(currentWeatherData);

    storedHourlyData = oneCallData.hourly;

    // Display Today's Weather by default 

    displayKeyTimesForecast(storedHourlyData);

    forecastTitle.textContent = "Today's Weather";

    showHourlyBtn.textContent = "Show Hourly Weather";

    showingHourly = false;
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

// Display full hourly forecast for the next 24 hours

function displayHourlyForecast(hourlyData) {
  hourlyContainer.innerHTML = "";

  const nextHours = hourlyData.slice(0, 24);

  nextHours.forEach((hourData) => {
    const date = new Date(hourData.dt * 1000);

    const hour = date.getHours();

    const formattedHour = `${hour.toString().padStart(2, "0")}:00`;

    const temp = Math.round(hourData.temp);

    const weatherIcon = hourData.weather[0].icon;

    const iconClass = getWeatherIconClass(weatherIcon);

    const card = document.createElement("div");

    card.classList.add("hour-card");

    card.innerHTML = `

            <h4>${formattedHour}</h4>

            <i class="${iconClass}"></i>

            <p>${temp}°C</p>

        `;

    hourlyContainer.appendChild(card);
  });
}

// Display key times: midnight (0), morning (6), noon (12), evening (18)

function displayKeyTimesForecast(hourlyData) {
  hourlyContainer.innerHTML = "";

  const keyHours = [0, 6, 12, 18];

  keyHours.forEach((targetHour) => {
    const forecastForHour = findClosestHourForecast(hourlyData, targetHour);

    if (forecastForHour) {
      const date = new Date(forecastForHour.dt * 1000);

      const hour = date.getHours();

      const formattedHour = `${hour.toString().padStart(2, "0")}:00`;

      const temp = Math.round(forecastForHour.temp);

      const weatherIcon = forecastForHour.weather[0].icon;

      const iconClass = getWeatherIconClass(weatherIcon);

      const card = document.createElement("div");

      card.classList.add("hour-card");

      card.innerHTML = `

                <h4>${formattedHour}</h4>

                <i class="${iconClass}"></i>

                <p>${temp}°C</p>

            `;

      hourlyContainer.appendChild(card);
    }
  });
}

// Find closest hour forecast

function findClosestHourForecast(hourlyData, targetHour) {
  let chosenForecast = null;

  let smallestDiff = 24;

  hourlyData.forEach((fh) => {
    const forecastDate = new Date(fh.dt * 1000);

    const forecastHour = forecastDate.getHours();

    const diff = Math.abs(forecastHour - targetHour);

    if (diff < smallestDiff) {
      smallestDiff = diff;

      chosenForecast = fh;
    }
  });

  return chosenForecast;
}

// Font Awesome icons dynamic based on day or night and weather
function getWeatherIconClass(weatherIcon) {
  const code = weatherIcon.slice(0, 2);
  const isDay = weatherIcon.endsWith("d");

  switch (code) {
    case "01":
      return isDay ? "fas fa-sun" : "fas fa-moon";
    case "02":
      return isDay ? "fas fa-cloud-sun" : "fas fa-cloud-moon";
    case "03":
      return "fas fa-cloud";
    case "04":
      return "fas fa-cloud-meatball";
    case "09":
      return "fas fa-cloud-showers-heavy";
    case "10":
      return "fas fa-cloud-rain";
    case "11":
      return "fas fa-bolt";
    case "13":
      return "fas fa-snowflake";
    case "50":
      return "fas fa-smog";
    default:
      return "fas fa-cloud";
  }
}

// Toggle advice form visibility
adviceBtn.addEventListener("click", () => {
  adviceFormContainer.style.display =
    adviceFormContainer.style.display === "none" ||
    adviceFormContainer.style.display === ""
      ? "block"
      : "none";
});

// Handle advice form submission
adviceForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const time = parseInt(document.getElementById("time-input").value, 10);
  provideClothingAdvice(time);
});

// Provide clothing advice based on the forecasted hour
function provideClothingAdvice(hour) {
  if (!storedHourlyData) {
    adviceResult.textContent = "No data available yet.";
    return;
  }

  const currentHour = new Date().getHours();
  let index = hour - currentHour;

  // For wrapping around midnight
  if (index < 0) {
    index += 24;
  }

  if (index < 0 || index >= storedHourlyData.length) {
    adviceResult.textContent =
      "Please enter a valid hour within the available forecast range (0-23).";
    return;
  }

  const forecast = storedHourlyData[index];
  const temp = forecast.temp;
  const weatherCondition = forecast.weather[0].description.toLowerCase();
  const isRainy =
    weatherCondition.includes("rain") || weatherCondition.includes("shower");
  const isSnowy = weatherCondition.includes("snow");

  let tempAdvice;
  if (temp < 0) {
    tempAdvice = "It's freezing! Wear a heavy coat, scarf, and gloves.";
  } else if (temp < 10) {
    tempAdvice =
      "It's quite cold. A warm jacket and maybe a beanie would be good.";
  } else if (temp < 20) {
    tempAdvice = "Comfortable but slightly cool. Long sleeves or a light jacket will do.";
  } else if (temp < 25) {
    tempAdvice = "Warm and pleasant! Short sleeves or light layers are fine.";
  } else {
    tempAdvice = "It's very hot! Wear breathable clothes and stay hydrated.";
  }

  let weatherAdvice = "";
  if (isRainy) {
    weatherAdvice +=
      " Also, since it's going to rain, don't forget an umbrella!";
  } else if (isSnowy) {
    weatherAdvice +=
      " It's snowy; wear warm, waterproof boots and dress in layers.";
  }

  const hourLabel = hour.toString().padStart(2, "0") + ":00";
  adviceResult.textContent = `At ${hourLabel}, it's expected to be ${Math.round(temp)}°C with ${weatherCondition}. ${tempAdvice}${weatherAdvice}`;
}

// Toggle button for showing highlights vs hourly forecast

showHourlyBtn.addEventListener("click", () => {
  hourlyContainer.innerHTML = "";

  if (showingHourly) {
    // Currently showing hourly, switch to highlights

    displayKeyTimesForecast(storedHourlyData);

    forecastTitle.textContent = "Today's Weather";

    showHourlyBtn.textContent = "Show Hourly Weather";

    showingHourly = false;
  } else {
    // Currently showing highlights, switch to hourly

    displayHourlyForecast(storedHourlyData);

    forecastTitle.textContent = "Hourly Forecast";

    showHourlyBtn.textContent = "Show Today's Weather";

    showingHourly = true;
  }
});

getUserLocation();
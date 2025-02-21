const API_KEY = '565e5c2dc32b488db71110400251902';
let isCelsius = true;

// DOM Elements
const elements = {
    cityInput: document.getElementById('city-input'),
    searchBtn: document.getElementById('search-btn'),
    unitToggle: document.getElementById('unit-toggle'),
    cityName: document.getElementById('city-name'),
    currentTemp: document.getElementById('current-temp'),
    weatherDescription: document.getElementById('weather-description'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('wind-speed'),
    forecastContainer: document.getElementById('forecast-container'),
};

// Event Listeners
elements.searchBtn.addEventListener('click', fetchWeather);
elements.unitToggle.addEventListener('click', toggleUnits);

async function fetchWeather() {
    const city = elements.cityInput.value.trim();
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    try {
        const currentData = await getWeatherData(city);
        const forecastData = await getForecastData(city);
        if (!currentData || !forecastData) {
            throw new Error('Invalid response from API');
        }
        updateUI(currentData, forecastData);
    } catch (error) {
        alert('City not found! Please check the spelling and try again.');
    }
}

async function getWeatherData(city) {
    try {
        const response = await fetch(
            `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=yes`
        );
        if (!response.ok) throw new Error('Failed to fetch data');
        return response.json();
    } catch (error) {
        return null;
    }
}

async function getForecastData(city) {
    try {
        const response = await fetch(
            `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=5&aqi=yes&alerts=no`
        );
        if (!response.ok) throw new Error('Failed to fetch data');
        return response.json();
    } catch (error) {
        return null;
    }
}

function updateUI(current, forecast) {
    if (!current || !forecast) {
        alert('Error fetching weather data. Please try again later.');
        return;
    }

    // Update current weather
    elements.cityName.textContent = `${current.location.name}, ${current.location.country}`;
    elements.currentTemp.textContent = formatTemp(current.current.temp_c, current.current.temp_f);
    elements.weatherDescription.textContent = current.current.condition.text;
    elements.humidity.textContent = `${current.current.humidity}%`;
    elements.windSpeed.textContent = `${current.current.wind_kph} kph`;

    // Update forecast
    elements.forecastContainer.innerHTML = forecast.forecast.forecastday.map(day => `
        <div class="forecast-day">
            <div>${new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}</div>
            <div class="weather-icon">${getWeatherIcon(day.day.condition.text)}</div>
            <div>${formatTemp(day.day.avgtemp_c, day.day.avgtemp_f)}</div>
        </div>
    `).join('');
}

function toggleUnits() {
    isCelsius = !isCelsius;
    elements.unitToggle.textContent = isCelsius ? '°C/°F' : '°F/°C';
    fetchWeather();
}

function formatTemp(tempC, tempF) {
    return isCelsius ? `${Math.round(tempC)}°C` : `${Math.round(tempF)}°F`;
}

function getWeatherIcon(condition) {
    const icons = {
        "Sunny": '☀️',
        "Partly cloudy": '🌤️',
        "Cloudy": '☁️',
        "Overcast": '☁️',
        "Mist": '🌫️',
        "Patchy rain possible": '🌦️',
        "Rain": '🌧️',
        "Snow": '❄️',
        "Thunderstorm": '⛈️',
    };
    return icons[condition] || '🌈';
}

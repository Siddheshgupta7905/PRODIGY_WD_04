const apiKey = '0a593d80cf04f866b3fa7832077069ee';
const weatherInfo = document.getElementById('weatherInfo');
const searchBtn = document.getElementById('searchBtn');
const locationInput = document.getElementById('locationInput');

function displayWeather(data) {
    weatherInfo.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>${data.weather[0].description}</p>
    <p>Temperature: ${data.main.temp} °C</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
  `;
}

function fetchWeatherByCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(() => {
            weatherInfo.innerHTML = '<p>Failed to fetch weather data.</p>';
        });
}

function fetchWeatherByCity(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayWeather(data);
            } else {
                weatherInfo.innerHTML = `<p>${data.message}</p>`;
            }
        })
        .catch(() => {
            weatherInfo.innerHTML = '<p>Failed to fetch weather data.</p>';
        });
}

// Get location on load
window.onload = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
            },
            () => {
                weatherInfo.innerHTML = '<p>Location access denied. Please enter a city.</p>';
            }
        );
    } else {
        weatherInfo.innerHTML = '<p>Geolocation is not supported by this browser.</p>';
    }
};

// Search button click
searchBtn.addEventListener('click', () => {
    const city = locationInput.value.trim();
    if (city) {
        fetchWeatherByCity(city);
    }
});

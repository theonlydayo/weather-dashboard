const API_KEY = "7b529020478c4adf876153910262207";
const BASE_URL = "https://api.weatherapi.com/v1/forecast.json";
const searchInput = document.getElementById("search-input");

searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        const city = searchInput.value.trim();

        if (city !== "") {
            getWeather(city);
            searchInput.value = "";
        }
    }
});

async function getWeather(city) {
    try {
        const response = await fetch(
            `${BASE_URL}?key=${API_KEY}&q=${city}&days=5&aqi=no&alerts=no`
        );

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();

        updateCurrentWeather(data);
        updateForecast(data);
    } catch (error) {
        alert(error.message);
        console.error(error);
    }
}

function updateCurrentWeather(data) {
    document.getElementById("city").textContent = `${data.location.name}, ${data.location.country}`;

    const today = new Date(data.location.localtime);

    document.getElementById("day").textContent =
        today.toLocaleDateString("en-US", {
            weekday: "long"
        });

    document.getElementById("date").textContent =
        today.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    
    document.getElementById("weather-icon").src = "https:" + data.current.condition.icon;
    document.getElementById("temperature").textContent = `${Math.round(data.current.temp_c)}°C`;
    document.getElementById("min-temp").textContent = `/${Math.round(data.forecast.forecastday[0].day.mintemp_c)}°C`;    
    document.getElementById("condition").textContent = data.current.condition.text;    
    document.getElementById("feels-like").textContent = `Feels like ${Math.round(data.current.feelslike_c)}°`;
    document.getElementById("wind").innerHTML = `${data.current.wind_kph} <small>km/h</small>`;
    document.getElementById("humidity").textContent = `${data.current.humidity}%`;
    document.getElementById("uv").textContent = `${data.current.uv} UV`;
    document.getElementById("visibility").textContent = `${data.current.vis_km} km`;
    document.getElementById("sunrise").textContent = data.forecast.forecastday[0].astro.sunrise;
    document.getElementById("sunset").textContent = data.forecast.forecastday[0].astro.sunset;
}

function updateForecast(data) {
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";

    data.forecast.forecastday.forEach(day => {
        const date = new Date(day.date);

        forecastContainer.innerHTML += `
            <div class="day">
                <p>${date.toLocaleDateString("en-US", {weekday: "short"})}</p>
                <img src="https:${day.day.condition.icon}" alt="Weather Icon">
                <h3>${Math.round(day.day.avgtemp_c)}°C</h3>
            </div>
        `;
    });
}

window.onload = () => {getWeather("Lagos");};
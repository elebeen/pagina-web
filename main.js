const API_KEY = "TU_API_KEY_AQUI"; 
const BASE_URL = "https://api.weatherapi.com/v1/current.json";

// Elementos del DOM
const searchInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");

const conditionEl = document.getElementById("weather-condition");
const iconEl = document.getElementById("weather-icon");
const tempEl = document.getElementById("temperature");
const cityEl = document.getElementById("city-name");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind-speed");

// Función principal para consultar la API
async function fetchWeather(city) {
  if (!city.trim()) return;

  try {
    // WeatherAPI soporta parámetro 'lang=es' para traducir las descripciones
    const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(city)}&lang=es`;
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Ciudad no encontrada o error en la petición (${response.status})`);
    }

    const data = await response.json();
    updateUI(data);

  } catch (error) {
    console.error("Error al obtener el clima:", error);
    conditionEl.textContent = "Ciudad no encontrada";
    tempEl.textContent = "--°C";
    cityEl.textContent = "--";
    iconEl.style.display = "none";
    humidityEl.textContent = "--%";
    windEl.textContent = "-- km/h";
  }
}

// Función para actualizar la interfaz gráfica con la respuesta
function updateUI(data) {
  const { current, location } = data;

  // Actualizar textos
  conditionEl.textContent = current.condition.text;
  tempEl.textContent = `${Math.round(current.temp_c)}°C`;
  cityEl.textContent = location.name;
  humidityEl.textContent = `${current.humidity}%`;
  windEl.textContent = `${current.wind_kph} km/h`;

  // Actualizar icono (WeatherAPI entrega URLs relativas como "//cdn.weatherapi.com/...")
  iconEl.src = `https:${current.condition.icon}`;
  iconEl.alt = current.condition.text;
  iconEl.style.display = "block";
}

// ==========================================
// EVENT LISTENERS
// ==========================================

// Click en el botón de búsqueda
searchBtn.addEventListener("click", () => {
  fetchWeather(searchInput.value);
});

// Presionar "Enter" dentro del input
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    fetchWeather(searchInput.value);
  }
});

// Cargar "Huancayo" por defecto al abrir la página
document.addEventListener("DOMContentLoaded", () => {
  fetchWeather("Huancayo");
});
import React, { useState, useEffect } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const apiKey = "04b005fc2679b9517ade52b96b19abfb";

  // 🌍 Auto-fetch user's current location weather
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await fetchWeatherByCoords(latitude, longitude);
        },
        (err) => {
          console.error("Geolocation error:", err);
        }
      );
    }
  }, []);

  // 🌐 Get weather by coordinates (for auto-location)
  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const res = await fetch(weatherUrl);
      const data = await res.json();

      if (data.cod === 200) {
        setWeather(data);
        setError("");
      } else {
        setWeather(null);
        setError(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to get location-based weather.");
    }
  };

  // 🔍 Search weather by city name only
  const fetchWeather = async () => {
    if (!city) return;

    try {
      const findUrl = `https://api.openweathermap.org/data/2.5/find?q=${city.trim()}&appid=${apiKey}&units=metric`;
      const locationRes = await fetch(findUrl);
      const locationData = await locationRes.json();

      if (!locationData.list || locationData.list.length === 0) {
        setError("City not found.");
        setWeather(null);
        return;
      }

      const { lat, lon } = locationData.list[0].coord;
      await fetchWeatherByCoords(lat, lon);
    } catch (err) {
      console.error(err);
      setError("Network error");
      setWeather(null);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>🌤️ Weather Dashboard</h1>

      <input
        type="text"
        placeholder="Enter city (e.g., Birgunj, Paris, Tokyo)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ padding: "0.5rem", marginRight: "0.5rem" }}
      />
      <button onClick={fetchWeather} style={{ padding: "0.5rem 1rem" }}>
        Get Weather
      </button>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      {weather && (
        <div style={{ marginTop: "2rem" }}>
          <h3>📍 Today’s Weather</h3>
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          <p>🌡 Temperature: {weather.main.temp}°C</p>
          <p>🌬 Wind: {weather.wind.speed} m/s</p>
          <p>☁ Condition: {weather.weather[0].description}</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
        </div>
      )}
    </div>
  );
}

export default App;

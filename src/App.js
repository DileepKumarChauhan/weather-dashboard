import React, { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = "04b005fc2679b9517ade52b96b19abfb";

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
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
      setError("Failed to get weather.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUseMyLocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (err) => {
          console.error(err);
          setError("Location permission denied.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported.");
    }
  };

  const fetchWeather = async () => {
    if (!city) return;
    try {
      setLoading(true);
      const findUrl = `https://api.openweathermap.org/data/2.5/find?q=${city.trim()}&appid=${apiKey}&units=metric`;
      const res = await fetch(findUrl);
      const data = await res.json();

      if (!data.list || data.list.length === 0) {
        setError("City not found.");
        setWeather(null);
      } else {
        const { lat, lon } = data.list[0].coord;
        fetchWeatherByCoords(lat, lon);
      }
    } catch (err) {
      console.error(err);
      setError("Network error");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>🌤️ Weather Dashboard</h1>

      <input
        type="text"
        placeholder="Enter city (e.g., Birgunj, Paris)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ padding: "0.5rem", marginRight: "0.5rem" }}
      />
      <button onClick={fetchWeather} style={{ padding: "0.5rem 1rem" }}>
        Get Weather
      </button>

      <br />
      <button
        onClick={handleUseMyLocation}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        📍 Use My Location
      </button>

      {loading && <p style={{ marginTop: "1rem" }}>🔄 Loading weather...</p>}

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      {weather && !loading && (
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

      {/* 👇 Dileep Footer Branding */}
      <div style={{ marginTop: "3rem" }}>
        <img
          src="/Dileep.jpg"
          alt="Dileep Logo"
          style={{ height: "50px", marginBottom: "0.5rem" }}
        />
        <p style={{ fontSize: "14px", color: "#666" }}>
        🙋🏻‍♂ Created by <strong>Dileep</strong>
        </p>
      </div>
    </div>
  );
}

export default App;

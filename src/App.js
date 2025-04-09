import React, { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city) return;
    const apiKey = "04b005fc2679b9517ade52b96b19abfb"; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      console.log("Response:", data); 

      if (data.cod === 200) {
        setWeather(data);
        setError("");
      } else {
        setWeather(null);
        setError("City not found.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>🌤️ Weather Dashboard</h1>
      <input
        type="text"
        placeholder="Enter city"
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
          <h2>{weather.name}</h2>
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

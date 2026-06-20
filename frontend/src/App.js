import React, { useState, useEffect } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import LiveCharts from "./LiveCharts";
import "./dashboard.css";

const API_URL = import.meta.env.VITE_API_URL;

export const areaMapping = {
  "560001": "Sampangi Rama Nagar",
  "560002": "Corporation",
  "562129": "Nelamangala (Project Site)",
  "560064": "Yelahanka",
  "560004": "Basavanagudi",
};

function App() {
  const [data, setData] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeLocation, setActiveLocation] = useState("562129");

  const syncField = async (loc) => {
    if (!loc || loc.trim() === "") {
      alert("Please enter a location or PIN code");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}/api/latest?city=${loc}`
      );

      console.log("Received data:", response.data);

      setData(response.data);

      // Use fieldId returned from backend
      setActiveLocation(response.data.fieldId || loc);
    } catch (error) {
      console.error("API Sync Error:", error);
      alert("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncField("562129");
  }, []);

  const displayAreaName =
    areaMapping[activeLocation] || activeLocation;

  return (
    <div className="app-container">
      <header className="header">
        <h1>🌾 Smart Farming IoT Dashboard</h1>

        <form
          className="search-bar"
          onSubmit={(e) => {
            e.preventDefault();
            syncField(query);
          }}
        >
          <input
            type="text"
            placeholder="Village Name or 6-Digit PIN..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button type="submit">Sync Field</button>
        </form>

        <div className="status-indicator">
          <span className="pulse-dot"></span>
          Active Node: <strong>{displayAreaName}</strong>
        </div>
      </header>

      <Dashboard
        data={data}
        loading={loading}
        location={displayAreaName}
      />

      <h2 className="section-title">Temporal Analytics</h2>

      <div className="single-chart-container">
        <LiveCharts location={activeLocation} />
      </div>

      <footer className="footer">
        Research Ref: IoT-Integrated Precision Irrigation System
      </footer>
    </div>
  );
}

export default App;
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
  "560004": "Basavanagudi"
};

function App() {
  const [data, setData] = useState(null);
  const [query, setQuery] = useState("560001");
  const [loading, setLoading] = useState(true);
  const [activeLocation, setActiveLocation] = useState("560001");

  const syncField = async (loc) => {
    if (!loc) return;

    setLoading(true);

    try {
      const res = await axios.get(
        `${API_URL}/api/latest?city=${loc}`
      );

      setData(res.data);
      setActiveLocation(res.data.fieldId || loc);
    } catch (err) {
      console.error("API Error:", err);
      alert("Failed to fetch sensor data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncField("560001");
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
            placeholder="Enter PIN"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button type="submit">
            Sync Field
          </button>
        </form>

        <div className="status-indicator">
          <span className="pulse-dot"></span>
          Active Node:
          <strong> {displayAreaName}</strong>
        </div>
      </header>

      <Dashboard
        data={data}
        loading={loading}
      />

      <h2 className="section-title">
        Temporal Analytics
      </h2>

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
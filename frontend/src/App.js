import React, { useState, useEffect } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import LiveCharts from "./LiveCharts";
import "./dashboard.css";

// ✅ NAMED EXPORT: This allows other files to import the mapping
export const areaMapping = {
  "560001": "Sampangi Rama Nagar",
  "560002": "Corporation",
  "562129": "Nelamangala (Project Site)", 
  "560064": "Yelahanka",
  "560004": "Basavanagudi"
};

function App() {
  const [data, setData] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeLocation, setActiveLocation] = useState("562129"); // Default to project site

  const syncField = async (loc) => {
    if (!loc || loc.trim() === "") {
      alert("Please enter a location or PIN code");
      return;
    }

    setLoading(true);
    try {
      // Fetching the latest environmental telemetry
      const res = await axios.get(`http://localhost:5000/api/latest?city=${loc}`);
      setData(res.data);
      setActiveLocation(res.data.location || loc);
    } catch (err) {
      console.error("API Sync Error:", err);
      alert("Node not found or network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncField("562129"); // Initialize with the site from image_e634da.png
  }, []);

  const displayAreaName = areaMapping[activeLocation] || activeLocation;

  return (
    <div className="app-container">
      <header className="header">
        <h1>🌾 Smart Farming IoT Dashboard</h1>

        <form onSubmit={(e) => { e.preventDefault(); syncField(query); }} className="search-bar">
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

      {/* Passing location and data to sub-components[cite: 1] */}
      <Dashboard data={data} loading={loading} location={activeLocation} />

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
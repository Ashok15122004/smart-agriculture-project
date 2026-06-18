import React from "react";
import Recommendation from "./Recommendation";
import { areaMapping } from "./App";
function Dashboard({ data, loading}) {
  if (loading && !data) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Fetching Perception Layer Data...</p>
      </div>
    );
  }

  return (
    <main className="dashboard-content">
      {/* ✅ New Location Header */}
      <div className="location-header">
        <h2>📍 Field Node: {data?.location || "Unknown Location"}</h2>
      </div>

      <div className="card-container">
        {/* Weather Node */}
        <div className="card">
          <div className="card-icon">🌤</div>
          <h3>Atmospheric Node</h3>
          <p>Temp: <strong>{data?.temperature}°C</strong></p>
          <p>Humidity: <strong>{data?.humidity}%</strong></p>
        </div>

        {/* Soil Node - Matches VWC Objective */}
        <div className="card">
          <div className="card-icon">🌱</div>
          <h3>Soil (VWC)</h3>
          <p>Moisture: <strong>{data?.soilMoisture}%</strong></p>
          <p>Status: <span className={data?.soilMoisture < 30 ? "status-alert" : "status-ok"}>
            {data?.soilMoisture < 30 ? "⚠️ Water Deficit" : "✅ Optimal"}
          </span></p>
        </div>

        {/* Actuator Node */}
        <div className="card">
          <div className="card-icon">⚙️</div>
          <h3>Actuator Status</h3>
          <p>Pump: <strong className={data?.pumpStatus === "ON" ? "pump-on" : "pump-off"}>
            {data?.pumpStatus === "ON" ? "RUNNING" : "STOPPED"}
          </strong></p>
          <div className={data?.pumpStatus === "ON" ? "spinning-icon" : "idle-icon"}>
            {data?.pumpStatus === "ON" ? "💧" : "💤"}
          </div>
        </div>
        
        {/* Intelligence Card */}
        <div className="card intelligence">
          <Recommendation message={data?.recommendation} />
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
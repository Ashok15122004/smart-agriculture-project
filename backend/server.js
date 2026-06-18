const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// Render uses dynamic port
const PORT = process.env.PORT || 5000;

// ==============================
// PIN → LOCATION MAPPING
// ==============================
const pinMap = {
  "560001": "Bengaluru",
  "560002": "Bengaluru",
  "560003": "Bengaluru",
  "570001": "Mysuru",
  "575001": "Mangaluru",
  "577001": "Davangere",
  "580001": "Hubballi",
  "590001": "Belagavi",
  "562129": "Nelamangala (Project Site)"
};

// ==============================
// LIVE DATA API
// ==============================
app.get("/api/live", (req, res) => {
  res.json({
    temperature: Number((20 + Math.random() * 10).toFixed(2)),
    humidity: Number((40 + Math.random() * 20).toFixed(2)),
    soilMoisture: Math.floor(Math.random() * 100),
    pumpStatus: Math.random() > 0.5 ? "RUNNING" : "STOPPED"
  });
});

// ==============================
// LATEST DATA API
// ==============================
app.get("/api/latest", (req, res) => {

  const city = req.query.city || "562129";

  const locationName = pinMap[city] || "Unknown Location";

  res.json({
    fieldId: city,
    location: locationName,
    temperature: Number((20 + Math.random() * 10).toFixed(2)),
    humidity: Number((40 + Math.random() * 20).toFixed(2)),
    soilMoisture: Math.floor(Math.random() * 100),
    pumpStatus: Math.random() > 0.5 ? "RUNNING" : "STOPPED",
    status: "Optimal"
  });
});

// ==============================
// HISTORY API
// ==============================
app.get("/api/history/:location", (req, res) => {

  const location = req.params.location;

  let logs = [];

  for (let i = 10; i >= 1; i--) {
    logs.push({
      timestamp: new Date(Date.now() - i * 60000),
      temperature: Number((20 + Math.random() * 10).toFixed(2)),
      humidity: Number((40 + Math.random() * 20).toFixed(2)),
      soilMoisture: Math.floor(Math.random() * 100),
      location
    });
  }

  res.json(logs);
});

// ==============================
// RECOMMENDATION API
// ==============================
app.get("/api/recommendation", (req, res) => {

  const soilMoisture = Math.floor(Math.random() * 100);
  const temperature = Number((20 + Math.random() * 10).toFixed(2));
  const humidity = Number((40 + Math.random() * 20).toFixed(2));

  let recommendation = "";

  if (soilMoisture < 30) {
    recommendation = "Water the crops";
  } else if (temperature > 30) {
    recommendation = "Use irrigation";
  } else if (humidity < 40) {
    recommendation = "Increase humidity level";
  } else {
    recommendation = "Conditions are optimal";
  }

  res.json({
    temperature,
    humidity,
    soilMoisture,
    recommendation
  });
});

// ==============================
// DEFAULT ROUTE
// ==============================
app.get("/", (req, res) => {
  res.send("🌾 Smart Farming Backend is Running...");
});

// ==============================
// START SERVER
// ==============================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
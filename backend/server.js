const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ==============================
// MongoDB Connection
// ==============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// ==============================
// Sensor Schema
// ==============================
const sensorSchema = new mongoose.Schema({
  fieldId: String,
  location: String,
  temperature: Number,
  humidity: Number,
  soilMoisture: Number,
  pumpStatus: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const SensorData = mongoose.model("SensorData", sensorSchema);

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
// Latest API
// ==============================
app.get("/api/latest", async (req, res) => {
  try {
    const city = req.query.city || "562129";

    const data = {
      fieldId: city,
      location: pinMap[city] || "Unknown Location",
      temperature: Number((20 + Math.random() * 10).toFixed(2)),
      humidity: Number((40 + Math.random() * 20).toFixed(2)),
      soilMoisture: Math.floor(Math.random() * 100),
      pumpStatus: Math.random() > 0.5 ? "RUNNING" : "STOPPED"
    };

    await SensorData.create(data);

    res.json({
      ...data,
      status: data.soilMoisture < 30 ? "Dry" : "Optimal"
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ==============================
// History API
// ==============================
app.get("/api/history/:location", async (req, res) => {
  try {
    const logs = await SensorData.find({
      location: req.params.location
    })
      .sort({ timestamp: -1 })
      .limit(20);

    res.json(logs.reverse());

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ==============================
// Recommendation API
// ==============================
app.get("/api/recommendation", async (req, res) => {
  try {

    const latest = await SensorData.findOne()
      .sort({ timestamp: -1 });

    if (!latest) {
      return res.json({
        recommendation: "No data available"
      });
    }

    let recommendation = "Conditions are optimal";

    if (latest.soilMoisture < 30) {
      recommendation = "Water the crops";
    } else if (latest.temperature > 30) {
      recommendation = "Use irrigation";
    } else if (latest.humidity < 40) {
      recommendation = "Increase humidity level";
    }

    res.json({
      fieldId: latest.fieldId,
      location: latest.location,
      temperature: latest.temperature,
      humidity: latest.humidity,
      soilMoisture: latest.soilMoisture,
      pumpStatus: latest.pumpStatus,
      status: latest.soilMoisture < 30 ? "Dry" : "Optimal",
      recommendation
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ==============================
// Root Route
// ==============================
app.get("/", (req, res) => {
  res.send("🌾 Smart Farming Backend Running...");
});

// ==============================
// Start Server
// ==============================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
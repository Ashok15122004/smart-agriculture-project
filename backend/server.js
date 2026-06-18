
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = 5000;

// ==============================
// ✅ PIN → LOCATION MAPPING
// ==============================
const pinMap = {
    "560001": "Bengaluru",
    "560002": "Bengaluru",
    "560003": "Bengaluru",
    "570001": "Mysuru",
    "575001": "Mangaluru",
    "577001": "Davangere",
    "580001": "Hubballi",
    "590001": "Belagavi"
};

// ==============================
// ✅ 1. LIVE DATA API
// ==============================
app.get('/api/live', (req, res) => {
    res.json({
        soilMoisture: Math.floor(Math.random() * 100),
        temperature: (20 + Math.random() * 10).toFixed(2),
        humidity: (40 + Math.random() * 20).toFixed(2)
    });
});

// ==============================
// ✅ 2. LATEST DATA API (PIN → NAME)
// ==============================
app.get('/api/latest', (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: "City or PIN required" });
    }

    const locationName = pinMap[city] || city;

    res.json({
        location: locationName,
        soilMoisture: Math.floor(Math.random() * 100),
        temperature: (20 + Math.random() * 10).toFixed(2),
        humidity: (40 + Math.random() * 20).toFixed(2)
    });
});

// ==============================
// ✅ 3. HISTORY API (FOR CHARTS)
// ==============================
app.get('/api/history/:location', (req, res) => {
    const location = req.params.location;

    const logs = [];

    // Generate last 10 time records
    for (let i = 10; i >= 1; i--) {
        logs.push({
            timestamp: new Date(Date.now() - i * 60000), // last 10 minutes
            temperature: (20 + Math.random() * 10).toFixed(2),
            soilMoisture: Math.floor(Math.random() * 100),
            humidity: (40 + Math.random() * 20).toFixed(2),
            location
        });
    }

    res.json(logs);
});

// ==============================
// ✅ 4. RECOMMENDATION API
// ==============================
app.get('/api/recommendation', (req, res) => {
    const soilMoisture = Math.floor(Math.random() * 100);
    const temperature = (20 + Math.random() * 10).toFixed(2);
    const humidity = (40 + Math.random() * 20).toFixed(2);

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
        soilMoisture,
        temperature,
        humidity,
        recommendation
    });
});

// ==============================
// ✅ 5. DEFAULT ROUTE
// ==============================
app.get('/', (req, res) => {
    res.send("🌾 Smart Farming Backend is Running...");
});

// ==============================
// ✅ 6. START SERVER
// ==============================
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});


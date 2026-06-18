const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./farming.db");

const locations = ["Singanayakanahalli", "Legislators Home"];

db.serialize(() => {
    locations.forEach(loc => {
        for (let i = 20; i > 0; i--) {
            const time = new Date(Date.now() - i * 1800000).toISOString(); // 30-min intervals
            const temp = (25 + Math.random() * 10).toFixed(2);
            const hum = (40 + Math.random() * 20).toFixed(2);
            const soil = (20 + Math.random() * 15).toFixed(2); // VWC simulation [cite: 345]
            const pump = soil < 30 ? "ON" : "OFF";

            db.run(`INSERT INTO readings (timestamp, location, temperature, humidity, soilMoisture, pumpStatus) 
                    VALUES (?, ?, ?, ?, ?, ?)`, [time, loc, temp, hum, soil, pump]);
        }
    });
    console.log("✅ Past data seeded for research nodes.");
});
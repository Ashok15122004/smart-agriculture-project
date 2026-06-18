// fuzzyLogic.js
const processFuzzyLogic = (moisture, temp, hum) => {
    let status = "Normal";
    let rec = "Optimal Conditions: Standby";
    let pump = "OFF";

    if (moisture < 25) {
        status = "Dry";
        pump = "ON";
        rec = temp > 35 ? "Irrigation: Long Duration (High Evapotranspiration)" : "Irrigation: Medium Duration";
    } else if (moisture > 45 || hum > 80) {
        status = "Wet";
        pump = "OFF";
        rec = "No Irrigation: Moisture Level Adequate";
    }
    
    return { status, rec, pump };
};

module.exports = processFuzzyLogic;
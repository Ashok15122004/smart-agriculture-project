// logic.test.js
const processFuzzyLogic = require('./fuzzyLogic');

describe('Mamdani Fuzzy Logic Controller Tests', () => {

    test('SCENARIO: Critical Water Deficit (Dry soil, High Temp)', () => {
        const result = processFuzzyLogic(15, 40, 30); // 15% Moisture, 40°C
        
        expect(result.status).toBe("Dry");
        expect(result.pump).toBe("ON");
        expect(result.rec).toContain("Long Duration");
    });

    test('SCENARIO: Optimal Conditions (Normal moisture)', () => {
        const result = processFuzzyLogic(35, 28, 50); // 35% Moisture, 28°C
        
        expect(result.status).toBe("Normal");
        expect(result.pump).toBe("OFF");
        expect(result.rec).toBe("Optimal Conditions: Standby");
    });

    test('SCENARIO: Saturation/High Humidity (Wet conditions)', () => {
        const result = processFuzzyLogic(50, 22, 85); // 50% Moisture, 85% Humidity
        
        expect(result.status).toBe("Wet");
        expect(result.pump).toBe("OFF");
        expect(result.rec).toContain("Moisture Level Adequate");
    });

});
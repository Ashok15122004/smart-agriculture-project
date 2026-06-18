import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { areaMapping } from "./App"; 
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, Title, Tooltip, Legend, Filler
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function LiveCharts({ location }) {
    const [chartData, setChartData] = useState(null);

    const fetchHistory = async () => {
        if (!location) return;
        try {
            const res = await axios.get(`http://localhost:5000/api/history/${location}`);
            const logs = res.data;

            if (logs.length > 0) {
                // Formatting labels for a 30-minute history window
                const labels = logs.map(l => {
                    const dateObj = new Date(l.timestamp);
                    return dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
                           ', ' + 
                           dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                });

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: "Temperature (°C)",
                            data: logs.map(l => l.temperature),
                            borderColor: "#ff4757",
                            backgroundColor: "rgba(255, 71, 87, 0.1)",
                            fill: true,
                            tension: 0.4,
                            pointRadius: 3,
                        },
                        {
                            label: "Soil (VWC %)",
                            data: logs.map(l => l.soilMoisture),
                            borderColor: "#1e90ff",
                            backgroundColor: "rgba(30, 144, 255, 0.1)",
                            fill: true,
                            tension: 0.4,
                            pointRadius: 3,
                        }
                    ]
                });
            }
        } catch (err) {
            console.error("Telemetry retrieval error:", err);
        }
    };

    useEffect(() => {
        fetchHistory();
        // UPDATED: Set interval to 30 minutes (1,800,000 ms) per Methodology Section 4.2
        const interval = setInterval(fetchHistory, 1800000); 
        return () => clearInterval(interval);
    }, [location]);

    const areaName = areaMapping[location] || location;

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true,
                text: `30-Minute Node Analytics: ${areaName}`, // Title reflects the interval
                font: { size: 18, weight: 'bold' }
            }
        },
        scales: {
            x: {
                ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                    autoSkip: true,
                    maxTicksLimit: 12 // Adjusted for better visibility of 30-min steps
                },
                title: { display: true, text: "Timeline (30-Minute Intervals)" }
            },
            y: { 
                type: "linear", 
                position: "left", 
                title: { display: true, text: "Temperature (°C)" },
                suggestedMin: 15,
                suggestedMax: 45
            },
            y1: { 
                type: "linear", 
                position: "right", 
                title: { display: true, text: "Percentage (%)" },
                grid: { drawOnChartArea: false },
                min: 0,
                max: 100
            }
        }
    };

    return (
        <div className="chart-instance" style={{ height: '450px', marginBottom: '40px' }}>
            {chartData ? (
                <Line data={chartData} options={options} />
            ) : (
                <div className="chart-loading">Initializing 30-Minute Data for {areaName}...</div>
            )}
        </div>
    );
}

export default LiveCharts;
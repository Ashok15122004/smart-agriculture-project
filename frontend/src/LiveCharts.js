import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { areaMapping } from "./App";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const API_URL = import.meta.env.VITE_API_URL;

function LiveCharts({ location }) {
  const [chartData, setChartData] = useState(null);

  const fetchHistory = async () => {
    if (!location) return;

    try {
      const response = await axios.get(
        `${API_URL}/api/history/${location}`
      );

      const logs = response.data;

      if (logs && logs.length > 0) {
        setChartData({
          labels: logs.map((log) =>
            new Date(log.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          ),

          datasets: [
            {
              label: "Temperature (°C)",
              data: logs.map((log) => log.temperature),
              borderColor: "#ff4757",
              backgroundColor: "rgba(255,71,87,0.15)",
              fill: true,
              tension: 0.4,
            },

            {
              label: "Soil Moisture (%)",
              data: logs.map((log) => log.soilMoisture),
              borderColor: "#1e90ff",
              backgroundColor: "rgba(30,144,255,0.15)",
              fill: true,
              tension: 0.4,
            },

            {
              label: "Humidity (%)",
              data: logs.map((log) => log.humidity),
              borderColor: "#2ed573",
              backgroundColor: "rgba(46,213,115,0.15)",
              fill: true,
              tension: 0.4,
            },
          ],
        });
      }
    } catch (error) {
      console.error("History API Error:", error);
    }
  };

  useEffect(() => {
    fetchHistory();

    const interval = setInterval(fetchHistory, 30000);

    return () => clearInterval(interval);
  }, [location]);

  const areaName =
    areaMapping[location] || location || "Unknown Location";

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top",
      },

      title: {
        display: true,
        text: `Live Analytics: ${areaName}`,
      },
    },

    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div
      className="chart-instance"
      style={{
        height: "450px",
        background: "#fff",
        padding: "15px",
        borderRadius: "12px",
      }}
    >
      {chartData ? (
        <Line data={chartData} options={options} />
      ) : (
        <div className="chart-loading">
          Loading analytics for {areaName}...
        </div>
      )}
    </div>
  );
}

export default LiveCharts;
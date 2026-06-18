import React, { useState, useEffect, useRef } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Recommendation() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const lastSpokenStatus = useRef("");

  const speakStatus = (text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const fetchRecommendation = async () => {
    try {
      const response = await fetch(`${API_URL}/api/recommendation`);

      if (!response.ok) {
        throw new Error("Failed to fetch recommendation data.");
      }

      const result = await response.json();

      const currentStatus =
        result.status ||
        (result.soilMoisture < 30 ? "Dry" : "Optimal");

      const currentRecommendation =
        result.recommendation || "Conditions are optimal";

      const currentPump =
        result.pumpStatus ||
        (result.soilMoisture < 30 ? "RUNNING" : "STOPPED");

      if (currentStatus !== lastSpokenStatus.current) {
        speakStatus(
          `Attention. Current status is ${currentStatus}. ${currentRecommendation}`
        );
        lastSpokenStatus.current = currentStatus;
      }

      setData({
        temperature: result.temperature,
        humidity: result.humidity,
        soilMoisture: result.soilMoisture,
        status: currentStatus,
        recommendation: currentRecommendation,
        pumpStatus: currentPump,
      });

      setError(null);
    } catch (err) {
      console.error("Recommendation error:", err);
      setError("Unable to retrieve live recommendation.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendation();

    const interval = setInterval(fetchRecommendation, 10000);

    return () => {
      clearInterval(interval);

      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (loading || !data) {
    return (
      <div style={styles.centerNotification}>
        <h3>Monitoring IoT Nodes...</h3>
        <p>Connecting to backend...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.centerNotification}>
        <h3 style={{ color: "#d32f2f" }}>System Error</h3>
        <p>{error}</p>

        <button
          style={styles.button}
          onClick={fetchRecommendation}
        >
          Retry
        </button>
      </div>
    );
  }

  const alertState =
    data.status === "Dry" ||
    data.pumpStatus === "RUNNING";

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.recBox,
          borderColor: alertState ? "#d32f2f" : "#2e7d32",
          backgroundColor: alertState ? "#fff8f8" : "#f8fff8",
        }}
      >
        <h3 style={styles.statusTitle}>
          Current Status: {data.status}
        </h3>

        <p style={styles.recText}>
          {data.recommendation}
        </p>

        <div style={styles.pumpBadge}>
          Pump Status:{" "}
          <span
            style={{
              color:
                data.pumpStatus === "RUNNING"
                  ? "#d32f2f"
                  : "#2e7d32",
            }}
          >
            {data.pumpStatus}
          </span>
        </div>
      </div>

      <button
        style={styles.button}
        onClick={() =>
          speakStatus(
            `Current status is ${data.status}. ${data.recommendation}`
          )
        }
      >
        📢 Play Audio Status
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    borderRadius: "15px",
    backgroundColor: "#fff",
  },

  centerNotification: {
    textAlign: "center",
    padding: "20px",
  },

  recBox: {
    padding: "20px",
    borderLeft: "10px solid",
    borderRadius: "10px",
  },

  statusTitle: {
    marginBottom: "10px",
  },

  recText: {
    lineHeight: "1.5",
  },

  pumpBadge: {
    marginTop: "15px",
    fontWeight: "bold",
  },

  button: {
    marginTop: "20px",
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2e7d32",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Recommendation;
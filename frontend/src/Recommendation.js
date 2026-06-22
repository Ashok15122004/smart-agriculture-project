import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function Recommendation({ message }) {
  const [recommendation, setRecommendation] = useState(
    "Connecting to backend..."
  );

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/recommendation`
        );

        setRecommendation(
          res.data.recommendation
        );
      } catch (error) {
        console.error(error);

        setRecommendation(
          "Unable to connect to backend"
        );
      }
    };

    fetchRecommendation();

    const interval = setInterval(
      fetchRecommendation,
      30000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3>Monitoring IoT Nodes...</h3>

      <p>
        {message || recommendation}
      </p>
    </div>
  );
}

export default Recommendation;
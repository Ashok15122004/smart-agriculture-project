import React, { useState, useEffect, useRef } from 'react';

const Recommendation = () => {
    // Initialized safely to prevent null-mapping exceptions on initial render
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Memory reference tracking the previous iteration status
    const lastSpokenStatus = useRef("");

    // Text-to-Speech Engine
    const speakStatus = (text) => {
        if (!window.speechSynthesis) return;
        
        // Cancel ongoing speech to prevent queues from stacking up during fast changes
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; // Keeping language context uniform
        utterance.rate = 0.9;     // Steady rate for clear comprehension
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    };

    const fetchRecommendation = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/recommendation');
            if (!response.ok) {
                throw new Error("Failed to pull data from backend nodes.");
            }
            const result = await response.json();

            // CRITICAL FIX: Direct fallback assignment to prevent reading undefined variables
            const currentStatus = result.status || (result.soilMoisture < 30 ? "Dry" : "Optimal");
            const systemRecommendation = result.recommendation || result.rec || "Conditions stable.";
            const currentPump = result.pumpStatus || result.pump || (result.soilMoisture < 30 ? "ON" : "OFF");

            // Automatic speech trigger evaluates only when the status transitions to a new value
            if (currentStatus !== lastSpokenStatus.current) {
                const message = `Attention. The system status changed to ${currentStatus}. Recommendation is: ${systemRecommendation}`;
                speakStatus(message);
                lastSpokenStatus.current = currentStatus;
            }

            // Standardize dataset into state variables
            setData({
                soilMoisture: result.soilMoisture !== undefined ? result.soilMoisture : "--",
                temperature: result.temperature !== undefined ? result.temperature : "--",
                humidity: result.humidity !== undefined ? result.humidity : "--",
                status: currentStatus,
                recommendation: systemRecommendation,
                pumpStatus: currentPump
            });
            setError(null);
        } catch (err) {
            console.error("Data tracking exception handled:", err);
            setError("Could not update live data streams.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendation();
        
        // Dynamic interval execution checking every 10 seconds for new values
        const interval = setInterval(fetchRecommendation, 10000); 
        
        return () => {
            clearInterval(interval);
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // Guard mechanism blocking render phase while payload is null
    if (loading || !data) {
        return (
            <div style={styles.centerNotification}>
                <h3>Monitoring IoT Nodes...</h3>
                <p style={{ color: '#666', fontSize: '14px' }}>Connecting to data pipeline server...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.centerNotification}>
                <h3 style={{ color: '#d32f2f' }}>System Interruption</h3>
                <p>{error}</p>
                <button onClick={fetchRecommendation} style={{ ...styles.button, width: 'auto', padding: '10px 20px' }}>
                    Retry Connection
                </button>
            </div>
        );
    }

    const isAlertState = data.status === "Dry" || data.pumpStatus === "ON";

    return (
        <div style={styles.container}>
             {/* Decision Analysis Output Display Box */}
            <div style={{
                ...styles.recBox, 
                borderColor: isAlertState ? "#d32f2f" : "#2e7d32",
                backgroundColor: isAlertState ? "#fff8f8" : "#f8fff8"
            }}>
                <h3 style={styles.statusTitle}>Current Status: {data.status}</h3>
                <p style={styles.recText}>{data.recommendation}</p>
                
                <div style={styles.pumpBadge}>
                    Pump Control Relay: <span style={{ color: data.pumpStatus === "ON" ? "#d32f2f" : "#2e7d32" }}>
                        {data.pumpStatus}
                    </span>
                </div>
            </div>

            {/* Manual Playback Override Access */}
            <button onClick={() => speakStatus(`Current status is ${data.status}. ${data.recommendation}`)} style={styles.button}>
                📢 Play Audio Status
            </button>

        </div>
    );
};

const styles = {
    container: { 
        padding: '30px', 
        maxWidth: '600px', 
        margin: '40px auto', 
        fontFamily: 'Segoe UI, Tahoma, sans-serif', 
        border: '1px solid #eee', 
        borderRadius: '16px', 
        boxShadow: '0 12px 28px rgba(0,0,0,0.06)',
        backgroundColor: '#ffffff'
    },
    header: { 
        textAlign: 'center', 
        borderBottom: '2px solid #f9f9f9', 
        marginBottom: '25px', 
        paddingBottom: '15px' 
    },
    centerNotification: {
        textAlign: 'center', 
        marginTop: '100px', 
        fontFamily: 'Segoe UI, sans-serif'
    },
    statsGrid: { 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '25px' 
    },
    card: { 
        flex: 1, 
        background: '#fcfcfc', 
        padding: '12px', 
        borderRadius: '10px', 
        textAlign: 'center',
        border: '1px solid #f0f0f0'
    },
    label: { 
        display: 'block', 
        fontSize: '11px', 
        color: '#777', 
        fontWeight: 'bold',
        marginBottom: '6px'
    },
    value: { 
        fontSize: '20px', 
        fontWeight: 'bold',
        color: '#333'
    },
    recBox: { 
        padding: '20px', 
        borderRadius: '12px', 
        borderLeft: '10px solid', 
        textAlign: 'left',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
    },
    statusTitle: { 
        margin: '0 0 12px 0', 
        fontSize: '18px',
        color: '#222'
    },
    recText: { 
        fontSize: '15px', 
        color: '#444', 
        lineHeight: '1.5',
        margin: '0 0 15px 0'
    },
    pumpBadge: { 
        paddingTop: '10px',
        borderTop: '1px solid #eef2ed',
        fontWeight: 'bold', 
        fontSize: '14px' 
    },
    button: { 
        marginTop: '25px', 
        width: '100%', 
        padding: '14px', 
        borderRadius: '8px', 
        border: 'none', 
        backgroundColor: '#2e7d32', 
        color: 'white', 
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '15px',
        transition: 'background-color 0.2s ease'
    },
    helperText: {
        textAlign: 'center',
        fontSize: '11px',
        color: '#999',
        marginTop: '12px'
    }
};

export default Recommendation;
import React, { useState, useEffect } from 'react';

export default function App() {
  const [weather, setWeather] = useState(null);
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch Weather on Load
  useEffect(() => {
    fetch('http://localhost:5000/api/weather?city=Chennai')
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch((err) => console.error('Error fetching weather:', err));
  }, []);

  // Handle Gemini AI Consultation
  const handleAIAnalysis = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/analyze-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptData: query }),
      });
      const data = await res.json();
      setAiResponse(data.analysis);
    } catch (err) {
      console.error('AI Error:', err);
      setAiResponse('Failed to get AI recommendation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <h1>🌱 AgriVision AI Dashboard</h1>
      
      {/* Weather Widget */}
      <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Live Farm Weather (OpenWeather API)</h3>
        {weather ? (
          <div>
            <p><strong>Location:</strong> {weather.name}</p>
            <p><strong>Temperature:</strong> {weather.main.temp}°C</p>
            <p><strong>Condition:</strong> {weather.weather[0].description}</p>
            <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
          </div>
        ) : (
          <p>Loading weather data...</p>
        )}
      </div>

      {/* Gemini AI Assistant Section */}
      <div style={{ background: '#f1f8e9', padding: '15px', borderRadius: '8px' }}>
        <h3>Gemini AI Crop & Disease Advisor</h3>
        <form onSubmit={handleAIAnalysis}>
          <textarea
            rows="3"
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            placeholder="Describe symptoms, soil moisture levels, or ask for irrigation recommendations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" disabled={loading} style={{ padding: '10px 20px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {loading ? 'Analyzing with Gemini...' : 'Get AI Recommendation'}
          </button>
        </form>

        {aiResponse && (
          <div style={{ marginTop: '15px', background: '#fff', padding: '10px', borderRadius: '5px', border: '1px solid #c8e6c9' }}>
            <h4>AI Insights:</h4>
            <p style={{ whiteSpace: 'pre-wrap' }}>{aiResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
}

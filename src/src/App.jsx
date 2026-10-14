import React, { useState, useEffect } from 'react';

export default function App() {
  const [weather, setWeather] = useState(null);
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // API Keys configuration
  const OPENWEATHER_API_KEY = '1bd24c09f5d8675f2e77a3366efb85f4';
  const GEMINI_API_KEY = 'AQ.Ab8RN6KSeg0kHIbBVzdLdQ6GO0nfNJkUDcb2RTCb8AqOlLNHUQ'; // Replace with your Gemini API key

  // Fetch Live Weather on Load
  useEffect(() => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=Chennai&units=metric&appid=${OPENWEATHER_API_KEY}`)
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch((err) => console.error('Weather fetch error:', err));
  }, []);

  // Handle Gemini AI Consultation via REST API
  const handleAIQuery = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are AgriVision AI, an expert agricultural assistant handling precision farming, crop health, and drone monitoring. Analyze this query: ${query}` }] }]
        })
      });

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
      setAiResponse(text);
    } catch (err) {
      console.error('AI error:', err);
      setAiResponse('Error connecting to Gemini AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h1>🌱 AgriVision AI Dashboard</h1>

      {/* Weather Module */}
      <div style={{ background: '#e0f7fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Live Farm Weather (OpenWeather API)</h3>
        {weather && weather.main ? (
          <div>
            <p><strong>City:</strong> {weather.name}</p>
            <p><strong>Temp:</strong> {weather.main.temp}°C</p>
            <p><strong>Condition:</strong> {weather.weather[0].description}</p>
            <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
          </div>
        ) : (
          <p>Loading weather data...</p>
        )}
      </div>

      {/* Gemini AI Module */}
      <div style={{ background: '#f1f8e9', padding: '15px', borderRadius: '8px' }}>
        <h3>Gemini AI Crop Health Advisor</h3>
        <form onSubmit={handleAIQuery}>
          <textarea
            rows="3"
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            placeholder="Ask about crop diseases, soil moisture, or smart irrigation recommendations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" disabled={loading} style={{ background: '#2e7d32', color: '#fff', padding: '10px 15px', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
            {loading ? 'Analyzing with Gemini...' : 'Ask Gemini AI'}
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

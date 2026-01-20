import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a photo first!");
    
    const formData = new FormData();
    formData.append('receipt', file);

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData);
      setResult(response.data); 
    } catch (err) {
      alert("Error: Make sure your Node.js server is running on port 5000!");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Smart Expense Tracker</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Scanning..." : "Scan Receipt"}
      </button>

      {result && (
        <div style={{ marginTop: '20px', color: 'green' }}>
          <h2>Total: {result.currency} {result.total}</h2>
          <p>Status: {result.status}</p>
        </div>
      )}
    </div>
  );
}

export default App;
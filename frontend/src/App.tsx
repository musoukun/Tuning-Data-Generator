import React, { useState } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [theme, setTheme] = useState('');
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/generate', { theme, count });
      setData(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Error generating data:', error);
    }
    setLoading(false);
  };

  const handleDownload = () => {
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'finetuning_data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">AI Fine-tuning Data Generator</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="theme" className="block text-white mb-2">Theme</label>
            <input
              type="text"
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-600 text-white placeholder-gray-300"
              placeholder="Enter a theme"
              required
            />
          </div>
          <div>
            <label htmlFor="count" className="block text-white mb-2">Number of Data Points</label>
            <input
              type="number"
              id="count"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              min="1"
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-600 text-white placeholder-gray-300"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Data'}
          </button>
        </form>
        {data && (
          <div className="mt-6">
            <button
              onClick={handleDownload}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50"
            >
              Download JSON
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
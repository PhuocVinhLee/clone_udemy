"use client"
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [source, setSource] = useState('');
  const [lang, setLang] = useState('PYTHON');
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [userId, setUserId] = useState('');
  const [jobId, setJobId] = useState('');
  const [heId, setHeId] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/hackerearth', { source, lang, input, userId, jobId });
      setResult(response.data);
      setHeId(response.data.he_id);  // Save the he_id for later status checks
    } catch (error) {
      console.error('Error:', error);
      setResult(error as any);
    }
  };

  const handleCheckStatus = async () => {
    try {
      const response = await axios.get(`/api/hackerearth/${heId}`);
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
      setResult( error as any);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white shadow-md rounded p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Code Evaluator</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Language:</label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="PYTHON">Python</option>
              <option value="JAVA">Java</option>
              <option value="C">C</option>
              <option value="CPP">C++</option>
              {/* Add more languages as needed */}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Source Code:</label>
            <textarea
              value={source}
              onChange={(e) => setSource(e.target.value)}
              rows={10}
              className="w-full p-2 border rounded mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Input:</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={5}
              className="w-full p-2 border rounded mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">User ID:</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full p-2 border rounded mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Job ID:</label>
            <input
              type="text"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              className="w-full p-2 border rounded mt-1"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded mt-4"
          >
            Evaluate
          </button>
        </form>
        {heId && (
          <button
            onClick={handleCheckStatus}
            className="w-full bg-green-500 text-white p-2 rounded mt-4"
          >
            Check Status
          </button>
        )}
        {result && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Result:</h2>
            <pre className="bg-gray-100 p-4 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

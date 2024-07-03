// components/CodeEvaluator.tsx
"use client"
import { useState, FormEvent } from 'react';
import axios from 'axios';

const CodeEvaluator = () => {
  const [source, setSource] = useState('');
  const [lang, setLang] = useState('PYTHON');
  const [input, setInput] = useState('');
  const [callback, setCallback] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('/api/hackerearth', {
        source,
        lang,
        input,
        callback,
      });

      setResult(response.data);
    } catch (err) {
    //  setError(err || 'An error occurred');
    console.log(" some thin went wrong",err)
    }
  };

  return (
    <div>
      <h1>Code Evaluator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Language</label>
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="PYTHON">Python</option>
            <option value="JAVA">Java</option>
            <option value="C">C</option>
            <option value="CPP">C++</option>
            <option value="JAVASCRIPT_NODE">JavaScript (Node.js)</option>
            {/* Add other languages as needed */}
          </select>
        </div>
        <div>
          <label>Source Code</label>
          <textarea value={source} onChange={(e) => setSource(e.target.value)}></textarea>
        </div>
        <div>
          <label>Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)}></textarea>
        </div>
        <div>
          <label>Callback URL (Optional)</label>
          <input type="text" value={callback} onChange={(e) => setCallback(e.target.value)} />
        </div>
        <button type="submit">Evaluate Code</button>
      </form>
      {result && (
        <div>
          <h2>Result</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      {error && (
        <div>
          <h2>Error</h2>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeEvaluator;

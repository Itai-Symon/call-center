import React, { useState } from 'react';

// API Configuration
const API_BASE = 'http://localhost:8000';

const ApiTest: React.FC = () => {
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const testApi = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(API_BASE + '/test');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: { message?: string } = await res.json();
      setResponse(data.message ?? 'No message returned');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-2">API Connectivity Test</h2>
      <button
        onClick={testApi}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Call /test Endpoint'}
      </button>

      {response && <p className="mt-4 text-green-700">Response: {response}</p>}
      {error && <p className="mt-4 text-red-600">Error: {error}</p>}
    </div>
  );
};

export default ApiTest;

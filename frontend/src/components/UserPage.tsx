import { useState, useEffect } from 'react';
import { Modal} from './Modal';
import type { Tag, Call, Task } from "../types/index";
import { api } from "./API";

const UserPage = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [showCreateCallModal, setShowCreateCallModal] = useState(false);
  const [newCallName, setNewCallName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCalls();
  }, []);

  const loadCalls = async () => {
    try {
      setError('');
      const data = await api.getCalls();
      setCalls(data);
      console.log('Loaded calls:', data);
    } catch (error) {
      console.error('Error loading calls:', error);
      setError('Failed to load calls. Make sure your backend is running.');
    }
  };

  const handleCreateCall = async () => {
    if (!newCallName.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const newCall = await api.createCall(newCallName.trim());
      console.log('Created call:', newCall);
      setNewCallName('');
      setShowCreateCallModal(false);
      loadCalls();
      setSelectedCall(newCall); // Auto-select the new call
    } catch (error) {
      console.error('Error creating call:', error);
      setError('Failed to create call. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section - Calls List (1/4 width) */}
      <div className="w-1/4 border-r border-gray-300 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Calls</h2>
          <button
            onClick={() => setShowCreateCallModal(true)}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        
        {/* Calls List */}
        <div className="space-y-2">
          {calls.length === 0 ? (
            <p className="text-gray-500 text-sm">No calls yet. Create your first call!</p>
          ) : (
            calls.map((call) => (
              <div
                key={call.id}
                onClick={() => setSelectedCall(call)}
                className={`p-3 rounded-md cursor-pointer text-center transition-colors ${
                  selectedCall?.id === call.id 
                    ? 'bg-blue-100 border-2 border-blue-500' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {call.title}
              </div>
            ))
          )}
        </div>

        {/* Debug Info */}
        <div className="mt-4 p-2 bg-gray-50 rounded text-xs">
          <p>Calls loaded: {calls.length}</p>
          <p>Selected: {selectedCall ? selectedCall.title : 'None'}</p>
        </div>
      </div>

      {/* Right Section - Call Details (3/4 width) */}
      <div className="w-3/4 p-4">
        {!selectedCall ? (
          <div className="flex items-center justify-center h-full">
            <button
              onClick={() => setShowCreateCallModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-lg"
            >
              Create new call
            </button>
          </div>
        ) : (
          <div className="h-full">
            <h2 className="text-xl font-bold mb-4">Call {selectedCall.title}</h2>
            
            <div className="p-4 border border-gray-300 rounded-md">
              <h3 className="font-semibold mb-2">Call Details:</h3>
              <p><strong>ID:</strong> {selectedCall.id}</p>
              <p><strong>Title:</strong> {selectedCall.title}</p>
              <p><strong>Tags:</strong> {selectedCall.tags ? selectedCall.tags.length : 0}</p>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 rounded-md">
              <p className="text-sm text-yellow-800">
                🚧 Tags and Tasks functionality will be added in the next stages.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Create Call Modal */}
      <Modal
        isOpen={showCreateCallModal}
        onClose={() => setShowCreateCallModal(false)}
        title="Create New Call"
      >
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={newCallName}
              onChange={(e) => setNewCallName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter call name"
              disabled={loading}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateCall()}
            />
          </div>
          <div className="flex justify-start">
            <button
              onClick={handleCreateCall}
              disabled={loading || !newCallName.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Submit'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserPage; 
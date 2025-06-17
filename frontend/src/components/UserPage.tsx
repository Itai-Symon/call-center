import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Modal} from './Modal';
import type { Tag, Call, Task, TaskStatus } from "../types/index";
import { api } from "./API";

const UserPage = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [selectedCallDetails, setSelectedCallDetails] = useState<Call | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateCallModal, setShowCreateCallModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [newCallName, setNewCallName] = useState('');
  const [newTaskName, setNewTaskName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTagModal, setShowTagModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  useEffect(() => {
    loadCalls();
    loadTags();
  }, []);

  useEffect(() => {
    if (selectedCall) {
      loadCallDetails(selectedCall.id);
    }
  }, [selectedCall]);

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

  const loadTags = async () => {
    try {
      const data = await api.getTags();
      setTags(data);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const loadCallDetails = async (callId: number) => {
    try {
      const callData = await api.getCall(callId);
      setSelectedCallDetails(callData);
      // Load tasks for this call
      const allTasks = await api.getTasks();
      const callTasks = allTasks.filter(task => task.call_id === callId);
      setTasks(callTasks);
    } catch (error) {
      console.error('Error loading call details:', error);
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
      setSelectedCall(newCall);
    } catch (error) {
      console.error('Error creating call:', error);
      setError('Failed to create call. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskName.trim() || !selectedCall) return;
    
    setLoading(true);
    try {
      await api.createTask(newTaskName.trim(), selectedCall.id);
      setNewTaskName('');
      setShowCreateTaskModal(false);
      loadCallDetails(selectedCall.id);
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskStatusChange = async (taskId: number, newStatus: TaskStatus) => {
    if (!selectedCall) return;
    
    try {
      await api.updateTask(taskId, { status: newStatus });
      loadCallDetails(selectedCall.id);
    } catch (error) {
      console.error('Error updating task status:', error);
      setError('Failed to update task status');
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTagAssignment = async () => {
    if (!selectedCall) return;
    
    try {
      await api.updateCall(selectedCall.id, {
        title: selectedCall.title,
        tag_ids: selectedTags
      });
      loadCallDetails(selectedCall.id);
      setShowTagModal(false);
    } catch (error) {
      console.error('Error updating tags:', error);
      setError('Failed to update tags');
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
          <div className="h-full flex flex-col">
            {/* Call Header (1/4 height) */}
            <div className="h-1/4 border-b border-gray-300 pb-4 mb-4">
              <h2 className="text-xl font-bold mb-3">Call {selectedCallDetails?.title}</h2>
              
              {/* Tags Section */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">Tags:</span>
                  {selectedCallDetails?.tags?.map((tag) => (
                    <span key={tag.id} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                      {tag.name}
                    </span>
                  ))}
                  <button 
                    onClick={() => {
                      setSelectedTags(selectedCallDetails?.tags?.map(t => t.id) || []);
                      setShowTagModal(true);
                    }}
                    className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Tasks Section (3/4 height) */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Tasks</h3>
                <button
                  onClick={() => setShowCreateTaskModal(true)}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                >
                  New
                </button>
              </div>
              
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border border-gray-300 rounded-md">
                    <span className="font-medium">{task.name}</span>
                    <select
                      value={task.status}
                      onChange={(e) => handleTaskStatusChange(task.id, e.target.value as TaskStatus)}
                      className={`px-2 py-1 rounded-md text-sm ${getStatusColor(task.status)}`}
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No tasks created yet</p>
                )}
              </div>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter call name"
              disabled={loading}
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

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        title="Create New Task"
      >
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task name"
              disabled={loading}
            />
          </div>
          <div className="flex justify-start">
            <button
              onClick={handleCreateTask}
              disabled={loading || !newTaskName.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Submit'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Tag Assignment Modal */}
      <Modal
        isOpen={showTagModal}
        onClose={() => setShowTagModal(false)}
        title="Assign Tags"
      >
        <div className="space-y-4">
          <div className="max-h-60 overflow-y-auto">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTags([...selectedTags, tag.id]);
                    } else {
                      setSelectedTags(selectedTags.filter(id => id !== tag.id));
                    }
                  }}
                  className="rounded text-blue-600"
                />
                <span>{tag.name}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowTagModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleTagAssignment}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserPage;
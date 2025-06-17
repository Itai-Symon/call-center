import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Tag {
  id: number;
  name: string;
}

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};
const API_BASE = 'http://localhost:8000';

const api = {
  getTags: (): Promise<Tag[]> => fetch(`${API_BASE}/tags/`).then(r => r.json()),
  createTag: (name: string): Promise<Tag>  => fetch(`${API_BASE}/tags/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  }).then(r => r.json()),
  updateTag: (id:number, name:string): Promise<Tag>  => fetch(`${API_BASE}/tags/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  }).then(r => r.json()),
};

// Admin Page Component
const AdminPage = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editTagName, setEditTagName] = useState('');

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setError('');
      const data = await api.getTags();
      setTags(data);
      console.log('Loaded tags:', data);
    } catch (error) {
      console.error('Error loading tags:', error);
      setError('Failed to load tags. Make sure your backend is running on http://localhost:8000');
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const newTag = await api.createTag(newTagName.trim());
      console.log('Created tag:', newTag);
      setNewTagName('');
      loadTags(); // Reload tags
    } catch (error) {
      console.error('Error creating tag:', error);
      setError('Failed to create tag. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTag = async () => {
    if (!editingTag || !editTagName.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      await api.updateTag(editingTag.id, editTagName.trim());
      setEditingTag(null);
      setEditTagName('');
      loadTags(); // Reload tags
    } catch (error) {
      console.error('Error updating tag:', error);
      setError('Failed to update tag. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* Tags Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Tags</h2>
        
        {/* Create Tag Form */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Tag name"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="px-3 py-2 border text-white border-gray-300 rounded-md flex-1"
            disabled={loading}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
          />
          <button
            onClick={handleCreateTag}
            disabled={loading || !newTagName.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Submit'}
          </button>
        </div>
        
        {/* Existing Tags */}
        <div className="border border-gray-300 rounded-md p-4 min-h-64">
          {tags.length === 0 ? (
            <p className="text-gray-500">No tags created yet</p>
          ) : (
            <div className="space-y-2">
              {tags.map((tag) => (
                <div key={tag.id} className="p-2 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="font-medium text-center">{tag.name}</span>
                  <button
                  onClick={() => {
                    setEditingTag(tag);
                    setEditTagName(tag.name);
                  }}
                  className="ml-2 px-2 py-1 text-sm hover:opacity-80 bg-gray-100"
                  aria-label="Edit tag"
                >
                  ✏️
                </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <Modal
        isOpen={!!editingTag}
        onClose={() => {
          setEditingTag(null);
          setEditTagName('');
        }}
        title="Edit Tag"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={editTagName}
            onChange={(e) => setEditTagName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-white"
            placeholder="Enter new tag name"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setEditingTag(null);
                setEditTagName('');
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleEditTag}
              disabled={loading || !editTagName.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>
      </div>

      {/* Debug Info */}
      <div className="mt-8 p-4 bg-gray-100 rounded-md">
        <h3 className="font-semibold mb-2">Debug Info:</h3>
        <p className="text-sm">API Base: {API_BASE}</p>
        <p className="text-sm">Tags Count: {tags.length}</p>
        <p className="text-sm">Loading: {loading ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

// Modal Component
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Main App
const App = () => {
  const [currentPage, setCurrentPage] = useState<| 'user' | 'admin'>('admin'); 

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Call Center Management</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentPage('user')}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                User
              </button>
              <button
                onClick={() => setCurrentPage('admin')}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {currentPage === 'admin' ? (
          <AdminPage />
        ) : (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>
            <p>User page coming next...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
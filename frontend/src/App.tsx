import { useState } from 'react';
import { X } from 'lucide-react';
import ApiTest from './ApiTest';

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
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

// Test Component to verify Modal works
const TestModal = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Test Modal Component</h2>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Open Test Modal
      </button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Test Modal"
      >
        <p className="text-black">This is a test modal. The modal component is working!</p>
        <button
          onClick={() => setShowModal(false)}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

// Main App
const App = () => {
  const [currentPage, setCurrentPage] = useState('user');

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
              <button
                onClick={() => setCurrentPage('test')}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 'test'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Test
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {currentPage === 'admin' && (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
            <p>Admin page will go here...</p>
          </div>
        )}
        {currentPage === 'user' && (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>
            <p>User page will go here...</p>
          </div>
        )}
        
        {currentPage === 'test' && (
          <>
            <TestModal />
            <ApiTest />
          </>
        )}
      </main>
    </div>
  );
};

export default App;
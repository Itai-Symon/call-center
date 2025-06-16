import { useState } from 'react';

const App = () => {
  const [currentPage, setCurrentPage] = useState('user');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
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

      {/* Page Content */}
      <main>
        {currentPage === 'admin' ? (
          <div className="p-6">
            <h1 className="text-xl font-bold mb-6 text-gray-800">Admin Panel</h1>
            <p>Admin page will go here...</p>
          </div>
        ) : (
          <div className="p-6">
            <h1 className="text-xl font-bold mb-6 text-gray-800">User Dashboard</h1>
            <p>User page will go here...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
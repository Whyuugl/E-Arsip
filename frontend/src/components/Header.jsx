import React, { useState } from 'react';

const Header = ({ onLogout, user }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const currentDate = new Date();
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  const formattedDate = currentDate.toLocaleDateString('id-ID', options);

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="px-6 py-4">
      <div className="flex justify-between items-center">
        <div style={{ marginTop: '18px', marginLeft: '45px' }}>
          <h2 className="text-lg font-semibold text-white">Selamat datang, {user?.username || 'User'}!</h2>
          <p className="text-sm text-gray-200">{formattedDate}</p>
        </div>
        <div className="flex items-center space-x-3" style={{ marginTop: '18px', marginRight: '50px' }}>
          <div className="text-right">
            <p className="text-sm font-medium text-white">{user?.username || 'User'}</p>
            <p className="text-xs text-gray-300 capitalize">{user?.role || 'user'}</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z"/>
                    </svg>
                    Logout
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default Header;

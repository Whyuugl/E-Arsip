import React from 'react';

const Header = () => {
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

  return (
    <div className="px-6 py-4">
      <div className="flex justify-between items-center">
        <div style={{ marginTop: '18px', marginLeft: '65px' }}>
          <h2 className="text-lg font-semibold text-white">Selamat datang, Rizki!</h2>
          <p className="text-sm text-gray-200">{formattedDate}</p>
        </div>
        <div className="flex items-center space-x-3" style={{ marginTop: '38px', marginRight: '50px' }}>
          <div className="text-right">
            <p className="text-sm font-medium text-white">Admin Rizki</p>
          </div>
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0" style={{ background: 'linear-gradient(180deg, #5D71E2 39.9%, #333E7C 100%)' }}>
        {/* Header */}
        <Header />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Dashboard />
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default App;

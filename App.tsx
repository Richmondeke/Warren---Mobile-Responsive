
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Directory from './components/Directory';
import DealFlow from './components/DealFlow';
import News from './components/News';
import Financials from './components/Financials';
import Portfolio from './components/Portfolio';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('directory');

  const renderContent = () => {
    switch (activeTab) {
      case 'directory':
        return <Directory />;
      case 'dealflow':
        return <DealFlow />;
      case 'portfolio':
        return <Portfolio />;
      case 'financials':
        return <Financials />;
      case 'news':
        return <News />;
      default:
        return <Directory />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans text-slate-900 flex">
      {/* Sidebar Navigation Component */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 md:pl-72 pt-16 md:pt-0">
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto w-full">
            {renderContent()}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="py-8 mt-auto">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-slate-400 text-xs font-medium">&copy; {new Date().getFullYear()} Warren Intelligence. All rights reserved.</p>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default App;

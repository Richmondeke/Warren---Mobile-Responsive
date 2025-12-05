
import React from 'react';
import { Search, Briefcase, Newspaper, Menu, X, LogOut, TrendingUp, PieChart, Settings, MessageSquare, CreditCard, LayoutGrid } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const mainNavItems = [
    { id: 'dealflow', label: 'Flow Deck', icon: LayoutGrid }, // Renamed to match screenshot
    { id: 'directory', label: 'Startup Directory', icon: Search },
    { id: 'portfolio', label: 'Covenant / Portfolio', icon: FileTextIcon },
  ];

  const otherNavItems = [
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'financials', label: 'Payment & Transfer', icon: CreditCard },
  ];

  const Logo = () => (
    <div className="flex items-center font-bold text-xl tracking-wider select-none cursor-pointer" onClick={() => setActiveTab('directory')}>
      <span className="text-slate-900">WARREN</span>
      <span className="text-blue-600 ml-1">INTELLIGENCE</span>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white z-50 flex items-center justify-between px-4 shadow-sm border-b border-slate-100">
        <Logo />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-600 hover:text-slate-900 focus:outline-none p-2 rounded-md hover:bg-slate-50 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 z-40 md:hidden backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 bottom-0 z-50 w-72 bg-white text-slate-600 
          transition-transform duration-300 ease-in-out flex flex-col border-r border-slate-100
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Profile Area (Top) - Matching Screenshot Style */}
        <div className="p-6 pb-2 pt-8">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                 <img 
                   src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                   alt="Profile" 
                   className="w-full h-full object-cover"
                 />
              </div>
              <div>
                 <h3 className="text-slate-900 font-bold text-base">Kevin Orelly</h3>
                 <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full font-mono">2249720275</span>
              </div>
           </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 space-y-8">
          
          {/* Main Group */}
          <div>
            <div className="px-4 mb-3 text-sm font-medium text-slate-400">Main</div>
            <div className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200
                      ${isActive 
                        ? 'bg-[#0F172A] text-white shadow-md shadow-slate-200' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Other Group */}
          <div>
            <div className="px-4 mb-3 text-sm font-medium text-slate-400">Other</div>
            <div className="space-y-1">
              {otherNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200
                      ${isActive 
                        ? 'bg-[#0F172A] text-white shadow-md shadow-slate-200' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom Logo Area */}
        <div className="p-6 border-t border-slate-50 hidden md:block">
           <Logo />
        </div>
      </aside>
    </>
  );
};

// Helper icon component since Lucide might typically be imported directly
const FileTextIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" height="24" viewBox="0 0 24 24" 
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" x2="8" y1="13" y2="13"/>
    <line x1="16" x2="8" y1="17" y2="17"/>
    <line x1="10" x2="8" y1="9" y2="9"/>
  </svg>
);

export default Navbar;

import React, { useState } from 'react';
import Sidebar from '../chat/Sidebar';
import { Menu, MessageSquare } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-dark-950 text-slate-100 font-sans">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Responsive Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Dashboard Canvas */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden relative">
        {/* Top Header Panel */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/50 px-4 md:px-6 bg-dark-900/30 backdrop-blur-md z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 md:hidden transition-colors"
              aria-label="Open sidebar menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="bg-brand-500/10 p-1.5 rounded-lg border border-brand-500/20 text-brand-400">
                <MessageSquare size={16} />
              </div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">
                Qobo Assistant
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col items-end justify-center">
              <span className="text-xs font-semibold text-slate-200">{user?.name}</span>
              <span className="text-[10px] text-slate-400 font-medium">{user?.email}</span>
            </div>
            <button
              onClick={logout}
              className="text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-800 hover:border-slate-700/80 hover:bg-slate-800/40 text-slate-300 hover:text-slate-100 transition-all active:scale-[0.98]"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Dynamic page target content */}
        <main className="flex-1 h-full min-h-0 relative bg-dark-950">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

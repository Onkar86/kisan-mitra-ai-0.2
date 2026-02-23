
import React from 'react';
import { AppView, UserProfile } from '../types';

interface LayoutProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  userProfile: UserProfile | null;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setView, userProfile, children }) => {
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: '📊' },
    { id: AppView.DIAGNOSTIC, label: 'AI Diagnostic', icon: '📸' },
    { id: AppView.ADVISOR, label: 'Smart Advisor', icon: '🤖' },
    { id: AppView.LIVE_VOICE, label: 'Kisan Mitra AI', icon: '🎙️' },
    { id: AppView.HISTORY, label: 'My History', icon: '📁' },
    { id: AppView.RAJIV_WISDOM, label: 'Natural Wisdom', icon: '🌿' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-stone-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-green-700 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <h1 className="font-black text-xl tracking-tight">Kisan <span className="text-lime-400">Mitra</span></h1>
        <div className="flex items-center gap-3">
           {userProfile && <span className="text-[10px] font-black opacity-80 uppercase tracking-widest">{userProfile.name.split(' ')[0]}</span>}
           <button onClick={() => setView(AppView.PROFILE)} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">👤</button>
        </div>
      </header>

      {/* Sidebar */}
      <nav className="w-full md:w-72 bg-green-950 text-white flex-shrink-0 flex md:flex-col sticky top-0 h-auto md:h-screen overflow-x-auto md:overflow-y-auto z-40 scrollbar-hide border-r border-green-900 shadow-2xl">
        <div className="hidden md:flex p-8 border-b border-green-900 items-center justify-between">
          <h1 className="text-2xl font-black tracking-tighter">Kisan <span className="text-lime-400">Mitra AI</span></h1>
          <div className="w-3 h-3 rounded-full bg-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.5)]"></div>
        </div>
        
        <div className="flex flex-row md:flex-col p-3 md:p-6 gap-2 w-full">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all whitespace-nowrap group ${
                currentView === item.id 
                  ? 'bg-lime-500 text-green-950 font-black shadow-xl ring-4 ring-lime-500/20' 
                  : 'hover:bg-green-900/50 text-stone-300'
              }`}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto p-6 hidden md:block border-t border-green-900">
          {userProfile && (
            <button 
              onClick={() => setView(AppView.PROFILE)}
              className="w-full flex items-center gap-4 p-4 bg-green-900/40 rounded-3xl hover:bg-green-900 transition-all text-left border border-white/5 mb-4"
            >
              <div className="w-12 h-12 bg-lime-400 rounded-2xl flex items-center justify-center text-2xl text-green-950 font-black shadow-inner">
                {userProfile.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="font-black text-sm truncate">{userProfile.name}</p>
                <p className="text-[10px] text-lime-400 font-bold uppercase tracking-widest opacity-70">Pro Account • {userProfile.farmSize} Ac</p>
              </div>
            </button>
          )}
          <div className="text-center">
            <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.3em] mb-1">Developed By</p>
            <p className="text-sm font-black text-lime-400">Onkar Mahamuni</p>
            <p className="text-[8px] text-white/30 mt-2 uppercase tracking-widest">© 2025 All Rights Reserved</p>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto flex flex-col">
        <div className="max-w-6xl mx-auto flex-1 w-full">
          {children}
        </div>
        <footer className="mt-12 py-6 border-t border-stone-200 text-center">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
            Crafted with Precision by <span className="text-green-700">Onkar Mahamuni</span>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Layout;

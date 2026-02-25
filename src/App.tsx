
import React, { useState, useEffect } from 'react';
import { AppView, UserProfile, DiagnosisResult } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DiagnosticTool from './components/DiagnosticTool';
import SmartAdvisor from './components/SmartAdvisor';
import RajivWisdom from './components/RajivWisdom';
import Onboarding from './components/Onboarding';
import History from './components/History';
import Profile from './components/Profile';
import VoiceAssistant from './components/VoiceAssistant';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<DiagnosisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedProfile = localStorage.getItem('kisan_mitra_profile');
    const savedHistory = localStorage.getItem('kisan_mitra_history');
    if (savedProfile) setUserProfile(JSON.parse(savedProfile));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    setIsLoading(false);
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('kisan_mitra_profile', JSON.stringify(profile));
  };

  const handleSaveHistory = (result: DiagnosisResult) => {
    const newHistory = [result, ...history];
    setHistory(newHistory);
    localStorage.setItem('kisan_mitra_history', JSON.stringify(newHistory));
  };

  const handleLogout = () => {
    if (confirm("Sign out? Data on this device will be cleared.")) {
      localStorage.removeItem('kisan_mitra_profile');
      setUserProfile(null);
      setView(AppView.DASHBOARD);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-950 flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 border-8 border-lime-500/20 rounded-full"></div>
          <div className="absolute inset-0 w-24 h-24 border-8 border-lime-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-center">
          <p className="text-lime-400 font-black tracking-[0.3em] text-xs uppercase animate-pulse">Kisan Mitra AI</p>
          <p className="text-white/20 text-[8px] font-black uppercase tracking-[0.5em] mt-2">By Onkar Mahamuni</p>
        </div>
      </div>
    );
  }

  if (!userProfile?.onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const renderView = () => {
    switch (view) {
      case AppView.DASHBOARD:
        return <Dashboard userProfile={userProfile} setView={setView} />;
      case AppView.DIAGNOSTIC:
        return <DiagnosticTool userProfile={userProfile} onSaveHistory={handleSaveHistory} />;
      case AppView.ADVISOR:
        return <SmartAdvisor userProfile={userProfile} />;
      case AppView.RAJIV_WISDOM:
        return <RajivWisdom />;
      case AppView.HISTORY:
        return <History history={history} />;
      case AppView.PROFILE:
        return <Profile userProfile={userProfile} onUpdate={handleOnboardingComplete} onLogout={handleLogout} />;
      case AppView.LIVE_VOICE:
        return <VoiceAssistant userProfile={userProfile} />;
      default:
        return <Dashboard userProfile={userProfile} setView={setView} />;
    }
  };

  return (
    <Layout currentView={view} setView={setView} userProfile={userProfile}>
      {renderView()}
      {/* Floating Action for Voice if not on the Voice Page */}
      {view !== AppView.LIVE_VOICE && (
        <button 
          onClick={() => setView(AppView.LIVE_VOICE)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-green-700 text-white rounded-full shadow-2xl flex items-center justify-center text-3xl hover:bg-green-800 transition-all active:scale-90 z-40 border-4 border-white"
        >
          🎙️
        </button>
      )}
    </Layout>
  );
};

export default App;

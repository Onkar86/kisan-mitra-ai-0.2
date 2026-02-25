
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
import FarmAIChat from './components/FarmAIChat';
import EmergencyCropHelp from './components/EmergencyCropHelp';
import Auth from './components/Auth';
import { 
  subscribeToAuthState, 
  getUserProfile, 
  getUserHistory, 
  saveUserProfile, 
  saveDiagnosisResult,
  logout as firebaseLogout
} from './services/firebaseService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<DiagnosisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Subscribe to authentication state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUserId(user.uid);
        
        // Load user profile from Firebase
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setUserProfile(profile);
          
          // Load user history from Firebase
          const userHistory = await getUserHistory(user.uid);
          setHistory(userHistory);
        } else {
          // New user - will complete onboarding
          setUserProfile(null);
        }
      } else {
        setIsAuthenticated(false);
        setUserId(null);
        setUserProfile(null);
        setHistory([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = () => {
    // Auth state will be handled by the subscription above
  };

  const handleOnboardingComplete = async (profile: UserProfile) => {
    if (!userId) return;
    
    const updatedProfile = {
      ...profile,
      uid: userId,
      onboarded: true
    };
    
    setUserProfile(updatedProfile);
    
    // Save to Firebase
    try {
      await saveUserProfile(updatedProfile);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleSaveHistory = async (result: DiagnosisResult) => {
    if (!userId) return;
    
    try {
      const docId = await saveDiagnosisResult(userId, result);
      const newHistory = [{ ...result, id: docId }, ...history];
      setHistory(newHistory);
    } catch (error) {
      console.error("Error saving diagnosis:", error);
    }
  };

  const handleLogout = async () => {
    if (confirm("Sign out? You will need to sign in again.")) {
      try {
        await firebaseLogout();
        setUserProfile(null);
        setHistory([]);
        setUserId(null);
        setIsAuthenticated(false);
        setView(AppView.DASHBOARD);
      } catch (error) {
        console.error("Error signing out:", error);
      }
    }
  };

  // Loading state
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

  // Not authenticated - show login
  if (!isAuthenticated) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  // Authenticated but not onboarded - show onboarding
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
      case AppView.FARM_AI_CHAT:
        return <FarmAIChat userProfile={userProfile} onEmergency={() => setView(AppView.EMERGENCY_HELP)} />;
      case AppView.EMERGENCY_HELP:
        return <EmergencyCropHelp userProfile={userProfile} onBack={() => setView(AppView.FARM_AI_CHAT)} />;
      default:
        return <Dashboard userProfile={userProfile} setView={setView} />;
    }
  };

  return (
    <Layout currentView={view} setView={setView} userProfile={userProfile}>
      {renderView()}
      {/* Floating Action for Voice if not on the Voice/Chat Pages */}
      {view !== AppView.LIVE_VOICE && view !== AppView.FARM_AI_CHAT && view !== AppView.EMERGENCY_HELP && (
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

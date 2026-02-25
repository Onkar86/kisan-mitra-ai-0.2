
import React from 'react';
import { UserProfile, AIProvider } from '../types';

interface ProfileProps {
  userProfile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ userProfile, onUpdate, onLogout }) => {
  const toggleAIProvider = () => {
    const nextProvider = userProfile.aiProvider === AIProvider.GEMINI ? AIProvider.OPENAI : AIProvider.GEMINI;
    onUpdate({ ...userProfile, aiProvider: nextProvider });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      <header className="text-center">
        <div className="w-24 h-24 bg-green-800 text-white rounded-full mx-auto flex items-center justify-center text-4xl font-black mb-4 shadow-xl ring-8 ring-stone-100">
          {userProfile.name.charAt(0)}
        </div>
        <h2 className="text-3xl font-black text-stone-800">{userProfile.name}</h2>
        <p className="text-stone-500">Farm Member since 2025</p>
      </header>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-200 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Mobile Number</p>
            <p className="font-bold text-stone-800">{userProfile.mobile}</p>
          </div>
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Farm Location</p>
            <p className="font-bold text-stone-800">{userProfile.address}</p>
          </div>
        </div>

        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">AI Advisor Engine</p>
          <div className="flex items-center justify-between mt-2">
            <p className="font-bold text-stone-800">
              {userProfile.aiProvider === AIProvider.GEMINI ? 'Google Gemini' : 'OpenAI ChatGPT'}
            </p>
            <button 
              onClick={toggleAIProvider}
              className="text-xs font-black text-green-700 uppercase tracking-widest hover:underline"
            >
              Switch Engine
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-lime-50 rounded-2xl border border-lime-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">☁️</span>
            <div>
              <p className="font-bold text-green-900">Cloud Sync Active</p>
              <p className="text-xs text-green-600">Your data is being saved to private storage.</p>
            </div>
          </div>
          <div className="w-12 h-6 bg-green-700 rounded-full relative p-1 flex items-center justify-end">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-100 flex flex-col gap-4">
          <button className="w-full py-4 bg-stone-100 text-stone-600 font-bold rounded-2xl hover:bg-stone-200 transition-colors">
            Edit Details
          </button>
          <button 
            onClick={onLogout}
            className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;


import React, { useState } from 'react';
import { UserProfile, SupportedLanguage, LANGUAGE_LABELS, AIProvider } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0); // Step 0 is Language
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    mobile: '',
    farmSize: '',
    crops: '',
    language: 'hi' as SupportedLanguage,
    aiProvider: AIProvider.GEMINI
  });

  const handleLanguageSelect = (lang: SupportedLanguage) => {
    setFormData({ ...formData, language: lang });
    setStep(1);
  };

  const handleGoogleLogin = () => {
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      ...formData,
      isLoggedIn: true,
      onboarded: true,
      syncEnabled: true
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-green-950 p-4 overflow-y-auto">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-lime-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="glass-card w-full max-w-xl p-8 md:p-12 rounded-[3rem] shadow-2xl relative z-10 animate-fadeInScale my-8">
        
        {step === 0 && (
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-black text-stone-800 tracking-tight">Select Language</h2>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(LANGUAGE_LABELS) as SupportedLanguage[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageSelect(lang)}
                  className="p-4 bg-white border border-stone-200 rounded-2xl font-bold hover:bg-lime-50 hover:border-lime-400 transition-all text-sm"
                >
                  {LANGUAGE_LABELS[lang]}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="text-center space-y-8">
            <div className="w-24 h-24 bg-lime-400 mx-auto rounded-3xl flex items-center justify-center text-5xl shadow-lg rotate-3">🌱</div>
            <div>
              <h1 className="text-4xl font-black text-stone-800 tracking-tight">Kisan Mitra AI</h1>
              <p className="text-stone-500 mt-4 text-lg font-medium">Empowering Farmers with Advanced Intelligence & Rajiv Dixit's Natural Wisdom.</p>
            </div>
            <div className="space-y-4 pt-6">
              <button 
                onClick={handleGoogleLogin}
                className="w-full py-4 bg-white border border-stone-200 rounded-2xl font-bold flex items-center justify-center gap-4 hover:bg-stone-50 transition-all shadow-sm"
              >
                <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-6 h-6" alt="Google" />
                Continue with Google
              </button>
              <button 
                onClick={() => setStep(2)}
                className="w-full py-4 bg-green-700 text-white rounded-2xl font-bold text-lg hover:bg-green-800 transition-all shadow-xl"
              >
                Enter Details Manually
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <header className="text-center mb-4">
              <h2 className="text-2xl font-black text-stone-800 tracking-tight">Tell us about your Farm</h2>
              <p className="text-stone-500 text-sm">We'll personalize our AI advice for your specific land.</p>
            </header>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 px-1">Full Name</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-stone-100 rounded-xl focus:ring-4 focus:ring-lime-100 text-sm" placeholder="e.g. Rajesh Kumar" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 px-1">Mobile No.</label>
                  <input required type="tel" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className="w-full p-3 bg-stone-100 rounded-xl focus:ring-4 focus:ring-lime-100 text-sm" placeholder="+91 98XXX XXXX" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 px-1">Farm Location / Village</label>
                <input required type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-3 bg-stone-100 rounded-xl focus:ring-4 focus:ring-lime-100 text-sm" placeholder="Address, Village, District" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 px-1">Farm Size (in Acres)</label>
                  <input required type="number" step="0.1" value={formData.farmSize} onChange={(e) => setFormData({...formData, farmSize: e.target.value})} className="w-full p-3 bg-stone-100 rounded-xl focus:ring-4 focus:ring-lime-100 text-sm" placeholder="e.g. 5.5" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 px-1">Crops you plant</label>
                  <input required type="text" value={formData.crops} onChange={(e) => setFormData({...formData, crops: e.target.value})} className="w-full p-3 bg-stone-100 rounded-xl focus:ring-4 focus:ring-lime-100 text-sm" placeholder="e.g. Wheat, Rice, Cotton" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 px-1">AI Advisor Engine</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, aiProvider: AIProvider.GEMINI})}
                    className={`p-3 rounded-xl border-2 transition-all text-sm font-bold ${formData.aiProvider === AIProvider.GEMINI ? 'border-green-600 bg-green-50 text-green-700' : 'border-stone-200 bg-white text-stone-500'}`}
                  >
                    Gemini AI
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, aiProvider: AIProvider.OPENAI})}
                    className={`p-3 rounded-xl border-2 transition-all text-sm font-bold ${formData.aiProvider === AIProvider.OPENAI ? 'border-green-600 bg-green-50 text-green-700' : 'border-stone-200 bg-white text-stone-500'}`}
                  >
                    ChatGPT AI
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-green-700 text-white rounded-[1.5rem] font-black text-lg hover:bg-green-800 transition-all shadow-xl mt-4">
              Start Smart Farming
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Onboarding;

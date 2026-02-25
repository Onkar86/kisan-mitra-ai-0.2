
import React, { useState } from 'react';
import { getFarmerAdviceUnified } from '../services/aiService';
import { Recommendation, UserProfile } from '../types';

const SmartAdvisor: React.FC<{userProfile: UserProfile}> = ({ userProfile }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Recommendation | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const advice = await getFarmerAdviceUnified(query, userProfile);
      setResult(advice);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please check your query.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h2 className="text-3xl font-black text-stone-800 tracking-tight">Smart Farming Advisor</h2>
        <p className="text-stone-500 font-medium">Equipped with AI & Real-time Google Search data.</p>
      </header>

      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-stone-100">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Ask about your ${userProfile.crops} or anything else...`}
            className="w-full h-40 p-6 bg-stone-50 rounded-[2rem] border border-stone-100 focus:ring-4 focus:ring-lime-100 focus:border-lime-400 transition-all resize-none text-lg font-medium"
          />
          <button 
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute bottom-4 right-4 py-4 px-10 bg-green-700 text-white rounded-2xl font-black hover:bg-green-800 transition-all disabled:opacity-50 shadow-xl flex items-center gap-2"
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Grounding Info...</>
            ) : (
              <><span className="text-xl">✨</span> Get Advice</>
            )}
          </button>
        </form>

        {result && (
          <div className="mt-12 space-y-10 animate-fadeInUp">
            <div className="border-b border-stone-100 pb-6">
              <h3 className="text-2xl font-black text-stone-800">Results for: "{result.issue}"</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-amber-50/50 p-8 rounded-[2.5rem] border border-amber-100 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm">🧪</div>
                  <h4 className="text-xl font-black text-stone-800 uppercase tracking-tighter">Chemical Route</h4>
                </div>
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-2xl border border-stone-100">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Recommendation</p>
                    <p className="font-bold text-stone-800 text-lg">{result.chemicalSolution.product}</p>
                    <p className="text-sm text-stone-600 mt-2">{result.chemicalSolution.dosage}</p>
                  </div>
                  <div className="p-5 bg-red-100/50 text-red-900 text-sm rounded-2xl border border-red-200">
                    <p className="font-black uppercase text-[10px] mb-2 tracking-widest opacity-60">Critical Warnings</p>
                    {result.chemicalSolution.precautions}
                  </div>
                </div>
              </div>

              <div className="bg-lime-50 p-8 rounded-[2.5rem] border border-lime-200 space-y-6 shadow-sm ring-4 ring-lime-500/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-lime-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm">🌿</div>
                  <h4 className="text-xl font-black text-green-900 uppercase tracking-tighter">Natural Wisdom</h4>
                </div>
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-2xl border border-lime-100">
                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1">{result.naturalSolution.name}</p>
                    <p className="font-bold text-green-900 italic text-lg leading-snug">"{result.naturalSolution.philosophy}"</p>
                  </div>
                  <div className="p-6 bg-white border border-lime-100 rounded-2xl">
                    <p className="text-[10px] font-black text-green-800 uppercase tracking-widest mb-2">Preparation Guide</p>
                    <p className="text-sm text-green-700 leading-relaxed whitespace-pre-wrap font-medium">{result.naturalSolution.preparation}</p>
                  </div>
                </div>
              </div>
            </div>

            {result.groundingSources && result.groundingSources.length > 0 && (
              <div className="bg-stone-50 p-6 rounded-[2rem] border border-stone-200">
                <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-4">Verified Sources & Research</h4>
                <div className="flex flex-wrap gap-3">
                  {result.groundingSources.map((source, i) => (
                    <a 
                      key={i} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white border border-stone-200 rounded-full text-xs font-bold text-blue-600 hover:border-blue-400 transition-all flex items-center gap-2 shadow-sm"
                    >
                      <span>🌐</span> {source.title || 'View Source'}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartAdvisor;

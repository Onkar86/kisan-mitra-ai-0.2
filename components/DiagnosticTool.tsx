
import React, { useState, useRef } from 'react';
import { analyzeCropImageUnified } from '../services/aiService';
import { DiagnosisResult, UserProfile } from '../types';

interface DiagnosticToolProps {
  userProfile: UserProfile;
  onSaveHistory: (result: DiagnosisResult) => void;
}

const DiagnosticTool: React.FC<DiagnosticToolProps> = ({ userProfile, onSaveHistory }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const base64Data = image.split(',')[1];
      const diagnosis = await analyzeCropImageUnified(base64Data, userProfile);
      
      const completeResult: DiagnosisResult = {
        ...diagnosis,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        image: image
      };

      setResult(completeResult);
      onSaveHistory(completeResult);
    } catch (error) {
      console.error("Diagnosis failed", error);
      alert("Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <header className="text-center">
        <h2 className="text-3xl font-black text-stone-800">Crop Health Scanner</h2>
        <p className="text-stone-500 mt-2">Instant AI analysis for plant diseases and pests.</p>
      </header>

      <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-sm border border-stone-100">
        <div className="flex flex-col items-center">
          {!image ? (
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-96 border-4 border-dashed border-stone-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 hover:border-lime-400 hover:bg-lime-50 transition-all group overflow-hidden bg-stone-50"
            >
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl shadow-sm group-hover:scale-110 transition-transform">📸</div>
              <div className="text-center px-6">
                <p className="font-black text-2xl text-stone-800">Tap to Capture Crop</p>
                <p className="text-stone-400 mt-2">Take a clear photo of the leaf or affected area</p>
              </div>
            </button>
          ) : (
            <div className="w-full space-y-6">
              <div className="relative group">
                <img src={image} alt="Crop scan" className="w-full h-[28rem] object-cover rounded-[2.5rem] shadow-inner" />
                <button 
                  onClick={() => setImage(null)}
                  className="absolute top-6 right-6 bg-white/90 backdrop-blur w-12 h-12 flex items-center justify-center rounded-full shadow-lg hover:bg-white text-red-500 font-bold"
                >
                  ✕
                </button>
              </div>
              
              {!result && (
                <button 
                  onClick={handleScan}
                  disabled={loading}
                  className="w-full py-5 bg-green-700 text-white rounded-[2rem] font-black text-xl hover:bg-green-800 disabled:opacity-50 shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-95"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      Consulting Expert AI...
                    </>
                  ) : (
                    'Diagnose Problem'
                  )}
                </button>
              )}
            </div>
          )}
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        </div>

        {result && (
          <div className="mt-12 space-y-10 animate-fadeInUp">
            <div className="p-8 bg-stone-50 border border-stone-200 rounded-[2.5rem] relative">
               <div className="absolute -top-4 left-8 px-4 py-1 bg-green-700 text-white rounded-full text-xs font-black uppercase tracking-widest">Diagnosis</div>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <h3 className="text-3xl font-black text-stone-800">{result.disease}</h3>
                <div className="flex items-center gap-3">
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-stone-400 uppercase">AI Confidence</p>
                      <p className="font-black text-green-600">{Math.round(result.confidence * 100)}%</p>
                   </div>
                   <div className="w-12 h-12 rounded-full border-4 border-green-100 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-green-600" style={{clipPath: `inset(${(1 - result.confidence) * 100}% 0 0 0)`}}></div>
                   </div>
                </div>
              </div>
              <p className="mt-6 text-stone-600 leading-relaxed text-lg">{result.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-amber-50/50 border border-amber-100 rounded-[2.5rem] p-8 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl">🧪</div>
                  <h4 className="font-black text-xl text-stone-800 uppercase tracking-tight">Chemical Option</h4>
                </div>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-stone-100">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Product</p>
                    <p className="font-bold text-stone-800">{result.solutions.chemicalSolution.product}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-stone-100">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Dosage</p>
                    <p className="font-bold text-stone-800">{result.solutions.chemicalSolution.dosage}</p>
                  </div>
                  <div className="p-5 bg-red-100/50 text-red-900 text-sm rounded-2xl border border-red-200 leading-snug">
                    <p className="font-black uppercase text-[10px] mb-2 tracking-widest opacity-60">Critical Precautions</p>
                    {result.solutions.chemicalSolution.precautions}
                  </div>
                </div>
              </div>

              <div className="bg-lime-50 border border-lime-200 rounded-[2.5rem] p-8 hover:shadow-md transition-shadow shadow-sm ring-4 ring-lime-500/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-lime-100 rounded-2xl flex items-center justify-center text-2xl">🌿</div>
                  <h4 className="font-black text-xl text-green-900 uppercase tracking-tight">Swadeshi Wisdom</h4>
                </div>
                <div className="space-y-4">
                   <div className="bg-white p-4 rounded-2xl border border-lime-100">
                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1">Natural Formula</p>
                    <p className="font-black text-green-900 text-lg">{result.solutions.naturalSolution.name}</p>
                  </div>
                  <div className="p-4 bg-green-900 text-lime-100 rounded-2xl italic font-medium">
                    "{result.solutions.naturalSolution.philosophy}"
                  </div>
                  <div className="p-5 bg-white border border-lime-100 rounded-2xl text-sm">
                    <p className="font-black text-green-800 uppercase text-[10px] mb-2 tracking-widest">Preparation Guide</p>
                    <p className="text-green-700 leading-relaxed whitespace-pre-wrap">{result.solutions.naturalSolution.preparation}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center py-6">
               <button onClick={() => setImage(null)} className="text-stone-400 font-bold hover:text-stone-800 transition-colors">Start New Scan →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticTool;

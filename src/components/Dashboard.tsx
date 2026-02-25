
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SoilMetric, UserProfile, AppNotification, AppView } from '../types';
import { getQuickAgriTipUnified } from '../services/aiService';

const soilData: SoilMetric[] = [
  { name: 'Nitrogen (N)', value: 45, unit: 'kg/ha', status: 'Fair' },
  { name: 'Phosphorus (P)', value: 12, unit: 'kg/ha', status: 'Critical' },
  { name: 'Potassium (K)', value: 65, unit: 'kg/ha', status: 'Good' },
  { name: 'Soil pH', value: 6.8, unit: 'pH', status: 'Good' },
];

const mockNotifications: AppNotification[] = [
  { id: '1', type: 'weather', title: 'Heavy Rain Alert', message: 'Expect 20mm rainfall in your area tomorrow. Ensure proper drainage.', time: Date.now() },
  { id: '2', type: 'pest', title: 'Yellow Rust Warning', message: 'Reported in nearby districts for Wheat crops. Inspect your field.', time: Date.now() - 3600000 },
];

const Dashboard: React.FC<{userProfile: UserProfile | null, setView: (view: AppView) => void}> = ({ userProfile, setView }) => {
  const [tip, setTip] = useState<string>("Loading your daily smart tip...");
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);

  useEffect(() => {
    if (userProfile) {
      getQuickAgriTipUnified(userProfile).then(setTip);
    }
  }, [userProfile]);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Banner with Tip */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-lime-400/10 rounded-full blur-3xl"></div>
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-lime-400 rounded-2xl flex items-center justify-center text-2xl shadow-inner text-green-950">💡</div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-lime-400">Smart Advice • मुख्य जानकारी</p>
              <p className="text-lg font-bold leading-tight mt-1">{tip}</p>
           </div>
        </div>
      </div>

      {/* Simplified 3-Button Launcher */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => setView(AppView.LIVE_VOICE)}
          className="bg-white p-8 rounded-[3rem] border border-stone-100 shadow-xl hover:shadow-2xl transition-all group flex flex-col items-center text-center space-y-4"
        >
          <div className="w-20 h-20 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">🎙️</div>
          <div>
            <h4 className="text-xl font-black text-stone-800">SPEAK</h4>
            <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">बोल के पूछो</p>
          </div>
        </button>

        <button 
          onClick={() => setView(AppView.DIAGNOSTIC)}
          className="bg-white p-8 rounded-[3rem] border border-stone-100 shadow-xl hover:shadow-2xl transition-all group flex flex-col items-center text-center space-y-4"
        >
          <div className="w-20 h-20 bg-lime-100 text-green-800 rounded-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">📸</div>
          <div>
            <h4 className="text-xl font-black text-stone-800">PHOTO</h4>
            <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">पत्ती दिखाओ</p>
          </div>
        </button>

        <button 
          onClick={() => setView(AppView.RAJIV_WISDOM)}
          className="bg-white p-8 rounded-[3rem] border border-stone-100 shadow-xl hover:shadow-2xl transition-all group flex flex-col items-center text-center space-y-4"
        >
          <div className="w-20 h-20 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">📚</div>
          <div>
            <h4 className="text-xl font-black text-stone-800">LIBRARY</h4>
            <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">ज्ञान कोश</p>
          </div>
        </button>
      </section>

      {/* Critical Alerts */}
      <section className="space-y-4">
        <h3 className="text-xs font-black text-stone-400 uppercase tracking-[0.2em] px-2">Recent Alerts • जरुरी अलर्ट</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notifications.map(n => (
            <div key={n.id} className={`p-5 rounded-[2rem] border shadow-sm flex items-start gap-4 ${n.type === 'weather' ? 'bg-blue-50 border-blue-100' : 'bg-red-50 border-red-100'}`}>
               <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${n.type === 'weather' ? 'bg-blue-200 text-blue-800' : 'bg-red-200 text-red-800'}`}>
                  {n.type === 'weather' ? '🌧️' : '🦠'}
               </div>
               <div>
                  <p className={`font-black text-sm ${n.type === 'weather' ? 'text-blue-900' : 'text-red-900'}`}>{n.title}</p>
                  <p className="text-xs text-stone-600 mt-1 font-medium">{n.message}</p>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Soil Check */}
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-stone-100">
        <h3 className="text-xl font-black text-stone-800 mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-sm">🌱</span> Soil Health Tracker
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {soilData.map((stat) => (
            <div key={stat.name} className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">{stat.name}</p>
              <p className="text-xl font-black text-stone-800">{stat.value} {stat.unit}</p>
              <p className={`text-[10px] font-black mt-1 ${stat.status === 'Good' ? 'text-green-600' : stat.status === 'Fair' ? 'text-amber-600' : 'text-red-600'}`}>{stat.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

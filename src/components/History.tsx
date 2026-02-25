
import React from 'react';
import { DiagnosisResult } from '../types';

interface HistoryProps {
  history: DiagnosisResult[];
}

const History: React.FC<HistoryProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="text-6xl">📁</div>
        <h3 className="text-2xl font-bold text-stone-800">No History Found</h3>
        <p className="text-stone-500">Your previous crop scans will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h2 className="text-3xl font-bold text-stone-800">Diagnosis History</h2>
        <p className="text-stone-500">Review your past scans and follow-up advice.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-200 hover:shadow-lg transition-all flex flex-col">
            {item.image && (
              <img src={item.image} alt={item.disease} className="w-full h-48 object-cover" />
            )}
            <div className="p-6 space-y-4 flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-xl text-stone-800 leading-tight">{item.disease}</h4>
                <span className="text-[10px] font-bold bg-lime-100 text-green-700 px-2 py-1 rounded-full uppercase tracking-tighter">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-stone-500 line-clamp-2">{item.description}</p>
              
              <div className="pt-4 mt-auto border-t border-stone-100 flex gap-2">
                <span className="px-3 py-1 bg-stone-100 text-stone-600 rounded-lg text-xs font-semibold">
                  🧪 {item.solutions.chemicalSolution.product.split(' ')[0]}
                </span>
                <span className="px-3 py-1 bg-lime-50 text-green-700 rounded-lg text-xs font-semibold">
                  🌿 {item.solutions.naturalSolution.name.split(' ')[0]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;

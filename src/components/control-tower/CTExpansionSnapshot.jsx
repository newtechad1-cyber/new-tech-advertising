import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function CTExpansionSnapshot({ data }) {
  return (
    <div className="bg-[#0d1526] border border-slate-800/60 rounded-3xl p-6 mb-8">
      <h2 className="text-sm font-bold text-slate-200 mb-4">Expansion Initiative Snapshot</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-700/30">
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">Active Playbooks</p>
          <p className="text-3xl font-black text-white mb-2">{data.activePlaybooks}</p>
          <p className="text-[9px] text-slate-500">expansion initiatives underway</p>
        </div>

        <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-700/30">
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">Territories Gaining Traction</p>
          <p className="text-3xl font-black text-white mb-2">{data.territoriesTrending}</p>
          <p className="text-[9px] text-slate-500">new territory momentum</p>
        </div>

        <div className="bg-emerald-900/40 rounded-2xl p-4 border border-emerald-700/50">
          <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-400 mb-2">Projected Expansion MRR</p>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-black text-emerald-300">${data.projectedExpansionMRR.toLocaleString()}</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-[9px] text-emerald-400/80">next 6 months</p>
        </div>

      </div>
    </div>
  );
}
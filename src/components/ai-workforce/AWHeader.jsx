import React from 'react';
import { Plus, PauseCircle, Sliders, List, Activity, Cpu } from 'lucide-react';

export default function AWHeader({ kpis, globalPaused, onDeploy, onPauseAll, onPriorityClick, onQueueClick }) {
  return (
    <div className="bg-gradient-to-r from-slate-950 via-cyan-950/15 to-slate-950 border-b border-slate-800 px-6 py-5">
      <div className="flex items-start justify-between gap-6 flex-wrap mb-5">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <h1 className="text-white text-2xl font-black">AI Workforce Orchestrator</h1>
            <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
              globalPaused ? 'bg-amber-900/30 border border-amber-700/40 text-amber-400' : 'bg-green-900/30 border border-green-700/40 text-green-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${globalPaused ? 'bg-amber-400' : 'bg-green-400 animate-pulse'}`} />
              {globalPaused ? 'Paused' : 'Operational'}
            </span>
          </div>
          <p className="text-slate-400 text-sm">Agent monitoring · Job queue control · Workload automation · Fulfillment stability</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={onDeploy} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors">
            <Plus className="w-4 h-4" /> Deploy Agent
          </button>
          <button onClick={onPauseAll}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold border transition-colors ${
              globalPaused ? 'border-green-700/50 text-green-400 hover:bg-green-900/20' : 'border-amber-700/50 text-amber-400 hover:bg-amber-900/20'
            }`}>
            <PauseCircle className="w-4 h-4" /> {globalPaused ? 'Resume All' : 'Pause All'}
          </button>
          <button onClick={onPriorityClick} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-300 border border-slate-700 hover:bg-slate-800 transition-colors">
            <Sliders className="w-4 h-4" /> Workload Priority
          </button>
          <button onClick={onQueueClick} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-300 border border-slate-700 hover:bg-slate-800 transition-colors">
            <List className="w-4 h-4" /> Job Queue
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-300 border border-slate-700 hover:bg-slate-800 transition-colors">
            <Activity className="w-4 h-4" /> System Health
          </button>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-6 gap-3">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-slate-900/70 border border-slate-800 rounded-xl px-4 py-3">
            <p className="text-slate-500 text-xs mb-1">{kpi.label}</p>
            <p className="font-black text-xl" style={{ color: kpi.color }}>{kpi.value}</p>
            {kpi.sub && <p className="text-slate-600 text-xs mt-0.5">{kpi.sub}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
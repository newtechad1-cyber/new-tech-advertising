import React, { useState } from 'react';
import { Plus, Map, DollarSign, BarChart2, ExternalLink, ChevronDown } from 'lucide-react';

export default function RSHeader({ stats, onAddReseller, onAssignTerritory }) {
  return (
    <div className="bg-gradient-to-r from-slate-950 via-purple-950/15 to-slate-950 border-b border-slate-800 px-6 py-5">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-white text-2xl font-black">Reseller Command Center</h1>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-900/40 border border-purple-700/40 text-purple-300">
              Partner Network
            </span>
          </div>
          <p className="text-slate-400 text-sm">Territory ownership · Pricing governance · Revenue share · Brand control</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={onAddReseller}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors">
            <Plus className="w-4 h-4" /> Add Reseller
          </button>
          <button onClick={onAssignTerritory}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-300 border border-slate-700 hover:bg-slate-800 transition-colors">
            <Map className="w-4 h-4" /> Assign Territory
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-300 border border-slate-700 hover:bg-slate-800 transition-colors">
            <DollarSign className="w-4 h-4" /> Pricing Rules
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-300 border border-slate-700 hover:bg-slate-800 transition-colors">
            <BarChart2 className="w-4 h-4" /> Revenue Share
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-green-400 border border-green-800/50 bg-green-900/20 hover:bg-green-900/40 transition-colors">
            <ExternalLink className="w-4 h-4" /> Reseller Portal
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-5 gap-4 mt-5">
        {[
          { label: 'Active Resellers', value: stats.activeResellers, color: '#8b5cf6' },
          { label: 'Partner MRR', value: `$${(stats.partnerMRR / 1000).toFixed(0)}k`, color: '#10b981' },
          { label: 'Total Territories', value: stats.territories, color: '#3b82f6' },
          { label: 'Pipeline Value', value: `$${(stats.pipelineValue / 1000).toFixed(0)}k`, color: '#f59e0b' },
          { label: 'Platform Revenue Share', value: `${stats.platformSharePct}%`, color: '#ec4899' },
        ].map((kpi, i) => (
          <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3">
            <p className="text-slate-500 text-xs mb-1">{kpi.label}</p>
            <p className="font-black text-xl" style={{ color: kpi.color }}>{kpi.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
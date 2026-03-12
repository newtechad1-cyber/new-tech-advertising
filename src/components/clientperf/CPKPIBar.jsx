import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ChevronDown, FileText, Calendar, Megaphone, AlertTriangle, Search, Minus } from 'lucide-react';

const KPITile = ({ label, value, trend, sub, color, urgent, onClick }) => (
  <div onClick={onClick}
    className={`flex flex-col px-4 py-2.5 border-r border-slate-700 hover:bg-slate-800/60 transition-colors min-w-[130px] cursor-pointer ${urgent ? 'border-b-2 border-b-red-500' : ''}`}>
    <span className="text-[10px] text-slate-500 uppercase tracking-wider whitespace-nowrap">{label}</span>
    <span className={`text-xl font-bold leading-tight mt-0.5 ${color}`}>{value}</span>
    {sub && (
      <span className={`flex items-center gap-0.5 text-[10px] mt-0.5 ${trend > 0 ? 'text-emerald-400' : trend < 0 ? 'text-red-400' : 'text-slate-500'}`}>
        {trend > 0 ? <TrendingUp className="w-3 h-3" /> : trend < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
        {sub}
      </span>
    )}
  </div>
);

export default function CPKPIBar({ kpis = {}, onFilterChange }) {
  const [open, setOpen] = useState(false);

  const tiles = [
    { label: 'Avg ROI Score', value: kpis.avgRoi ?? '82', trend: 1, sub: '+4 vs last month', color: 'text-emerald-300' },
    { label: 'Growth Momentum', value: kpis.growthMomentum ?? 18, trend: 1, sub: 'clients accelerating', color: 'text-teal-300' },
    { label: 'Performance Decline', value: kpis.declining ?? 4, trend: -1, sub: 'need intervention', color: 'text-red-300', urgent: (kpis.declining ?? 4) >= 4 },
    { label: 'Upsell Detected', value: kpis.upsellCount ?? 9, trend: 1, sub: 'opportunities', color: 'text-amber-300' },
    { label: 'Retention Risk', value: kpis.retentionRisk ?? 3, trend: -1, sub: 'at-risk clients', color: (kpis.retentionRisk ?? 3) >= 3 ? 'text-red-300' : 'text-orange-300', urgent: (kpis.retentionRisk ?? 3) >= 3 },
    { label: 'Engagement Velocity', value: kpis.engagementVelocity ?? '↑ 22%', trend: 1, sub: 'avg across portfolio', color: 'text-violet-300' },
  ];

  const actions = [
    { label: 'Generate ROI Report', icon: FileText },
    { label: 'Schedule Performance Review', icon: Calendar },
    { label: 'Launch Upsell Campaign', icon: Megaphone },
    { label: 'Flag Client Risk', icon: AlertTriangle },
    { label: 'Open Client Deep Analysis', icon: Search },
  ];

  return (
    <div className="sticky top-0 z-40 bg-slate-900/97 backdrop-blur border-b border-slate-700 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-stretch overflow-x-auto">
          <div className="flex items-center px-4 py-3 border-r border-slate-700 shrink-0 gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white whitespace-nowrap">Client Performance</span>
          </div>
          {tiles.map(t => <KPITile key={t.label} {...t} onClick={() => onFilterChange?.(t.label)} />)}
        </div>
        <div className="relative flex-shrink-0 pr-3">
          <button onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 rounded-lg text-xs font-medium text-white transition-colors">
            Actions <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden">
                {actions.map(a => (
                  <button key={a.label} onClick={() => setOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-left">
                    <a.icon className="w-4 h-4 text-emerald-400" />{a.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
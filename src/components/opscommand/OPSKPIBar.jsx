import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ChevronDown, Plus, Video, RefreshCw, CheckSquare, PauseCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const KPITile = ({ label, value, trend, trendLabel, color, urgent, onClick }) => (
  <div onClick={onClick} className={`flex flex-col px-4 py-2.5 border-r border-slate-700 hover:bg-slate-800/60 transition-colors min-w-[120px] cursor-pointer ${urgent ? 'border-b-2 border-b-red-500' : ''}`}>
    <span className="text-[10px] text-slate-500 uppercase tracking-wider whitespace-nowrap">{label}</span>
    <span className={`text-xl font-bold ${color} leading-tight mt-0.5`}>{value}</span>
    {trendLabel && (
      <span className={`flex items-center gap-0.5 text-[10px] mt-0.5 ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
        {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {trendLabel}
      </span>
    )}
  </div>
);

export default function OPSKPIBar({ kpis = {}, onFilterChange }) {
  const [open, setOpen] = useState(false);

  const tiles = [
    { label: 'Queued', value: kpis.queued ?? 24, trend: 4, trendLabel: '+4 new', color: 'text-blue-300' },
    { label: 'Running', value: kpis.running ?? 8, trend: 1, trendLabel: 'active now', color: 'text-violet-300' },
    { label: 'Completed Today', value: kpis.completed ?? 47, trend: 11, trendLabel: '+11 vs yesterday', color: 'text-emerald-300' },
    { label: 'Failed', value: kpis.failed ?? 3, trend: -1, trendLabel: '1 resolved', color: 'text-red-300', urgent: (kpis.failed ?? 3) >= 3 },
    { label: 'Avg Process Time', value: `${kpis.avgTime ?? '4.2'}m`, trend: -1, trendLabel: '-0.8m faster', color: 'text-cyan-300' },
    { label: 'Approval Queue', value: kpis.approvalQueue ?? 11, trend: 3, trendLabel: '+3 pending', color: (kpis.approvalQueue ?? 11) > 10 ? 'text-amber-300' : 'text-slate-300', urgent: (kpis.approvalQueue ?? 11) > 12 },
  ];

  const actions = [
    { label: 'Queue New Content Batch', icon: Plus },
    { label: 'Trigger Video Render', icon: Video },
    { label: 'Retry Failed Jobs', icon: RefreshCw },
    { label: 'Open Approval Queue', icon: CheckSquare },
    { label: 'Pause Production Category', icon: PauseCircle },
  ];

  return (
    <div className="sticky top-0 z-40 bg-slate-900/97 backdrop-blur border-b border-slate-700 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-stretch overflow-x-auto">
          <div className="flex items-center px-4 py-3 border-r border-slate-700 shrink-0 gap-2">
            <AlertCircle className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold text-white whitespace-nowrap">AI Production Ops</span>
          </div>
          {tiles.map(t => <KPITile key={t.label} {...t} onClick={() => onFilterChange?.(t.label)} />)}
        </div>
        <div className="relative flex-shrink-0 pr-3">
          <Button size="sm" className="bg-orange-700 hover:bg-orange-600 gap-1 text-xs" onClick={() => setOpen(!open)}>
            Actions <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
          </Button>
          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-60 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden">
                {actions.map(a => (
                  <button key={a.label} onClick={() => setOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-left">
                    <a.icon className="w-4 h-4 text-orange-400" />{a.label}
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
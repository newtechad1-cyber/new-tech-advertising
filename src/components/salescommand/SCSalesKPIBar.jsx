import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Plus, FileText, Calendar, BarChart2, ChevronDown, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

const KPITile = ({ label, value, trend, trendLabel, color, warning }) => (
  <div className={`flex flex-col px-4 py-2.5 border-r border-slate-700 hover:bg-slate-800/60 transition-colors min-w-[130px] cursor-pointer`}>
    <span className="text-[10px] text-slate-500 uppercase tracking-wider whitespace-nowrap">{label}</span>
    <span className={`text-xl font-bold ${warning ? 'text-red-300' : color} leading-tight mt-0.5`}>{value}</span>
    <span className={`flex items-center gap-0.5 text-[10px] mt-0.5 ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
      {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {trendLabel}
    </span>
  </div>
);

export default function SCSalesKPIBar({ kpis = {} }) {
  const [open, setOpen] = useState(false);

  const tiles = [
    { label: 'Pipeline Value', value: `$${((kpis.pipelineValue || 284600) / 1000).toFixed(0)}k`, trend: 18, trendLabel: '+18% MoM', color: 'text-violet-300' },
    { label: 'Closing This Month', value: kpis.closingThisMonth || 11, trend: 3, trendLabel: '+3 vs last mo', color: 'text-blue-300' },
    { label: 'Avg Deal Size', value: `$${((kpis.avgDealSize || 16800) / 1000).toFixed(1)}k`, trend: 7, trendLabel: '+7% vs Q4', color: 'text-cyan-300' },
    { label: 'Demo→Close Rate', value: `${kpis.demoCloseRate || 34}%`, trend: 4, trendLabel: '+4pts vs avg', color: 'text-emerald-300' },
    { label: 'New Leads/Week', value: kpis.newLeadsWeek || 24, trend: -2, trendLabel: '-2 vs last wk', color: 'text-amber-300', warning: (kpis.newLeadsWeek || 24) < 15 },
    { label: 'Closed This Month', value: `$${((kpis.closedRevenue || 48200) / 1000).toFixed(0)}k`, trend: 22, trendLabel: '+22% vs target', color: 'text-emerald-300' },
  ];

  const actions = [
    { label: 'Add New Lead', icon: Plus },
    { label: 'Create Deal', icon: Target },
    { label: 'Generate Proposal', icon: FileText },
    { label: 'Schedule Demo', icon: Calendar },
    { label: 'View Forecast', icon: BarChart2 },
  ];

  return (
    <div className="sticky top-0 z-40 bg-slate-900/97 backdrop-blur border-b border-slate-700 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-stretch overflow-x-auto">
          <div className="flex items-center px-4 py-3 border-r border-slate-700 shrink-0 gap-2">
            <Target className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-bold text-white whitespace-nowrap">Sales Command</span>
          </div>
          {tiles.map(t => <KPITile key={t.label} {...t} />)}
        </div>
        <div className="relative flex-shrink-0 pr-3">
          <Button size="sm" className="bg-violet-600 hover:bg-violet-700 gap-1 text-xs" onClick={() => setOpen(!open)}>
            Quick Actions <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
          </Button>
          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-52 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden">
                {actions.map(a => (
                  <button key={a.label} onClick={() => setOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-left">
                    <a.icon className="w-4 h-4 text-violet-400" />{a.label}
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
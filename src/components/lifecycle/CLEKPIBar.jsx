import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ChevronDown, Zap, AlertTriangle, Play, BarChart2, Star, Flag, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const KPITile = ({ label, value, trend, trendLabel, color, urgent }) => (
  <div className={`flex flex-col px-4 py-2.5 border-r border-slate-700 hover:bg-slate-800/60 transition-colors min-w-[130px] cursor-pointer ${urgent ? 'border-b-2 border-b-red-500' : ''}`}>
    <span className="text-[10px] text-slate-500 uppercase tracking-wider whitespace-nowrap">{label}</span>
    <span className={`text-xl font-bold ${color} leading-tight mt-0.5`}>{value}</span>
    <span className={`flex items-center gap-0.5 text-[10px] mt-0.5 ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
      {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {trendLabel}
    </span>
  </div>
);

export default function CLEKPIBar({ kpis = {} }) {
  const [open, setOpen] = useState(false);

  const tiles = [
    { label: 'New Clients/Month', value: kpis.newClients || 8, trend: 2, trendLabel: '+2 vs last mo', color: 'text-violet-300' },
    { label: 'Onboarding Now', value: kpis.onboardingNow || 12, trend: 3, trendLabel: '+3 active', color: 'text-blue-300' },
    { label: 'In Production', value: kpis.inProduction || 34, trend: 5, trendLabel: '+5 this week', color: 'text-cyan-300' },
    { label: 'Upsell Eligible', value: kpis.upsellEligible || 9, trend: 2, trendLabel: '+2 detected', color: 'text-amber-300' },
    { label: 'At Churn Risk', value: kpis.churnRisk || 4, trend: -1, trendLabel: '1 resolved', color: 'text-red-300', urgent: (kpis.churnRisk || 4) >= 3 },
    { label: 'Lifecycle Velocity', value: `${kpis.velocity || 18}d`, trend: -2, trendLabel: '2d faster avg', color: 'text-emerald-300' },
  ];

  const actions = [
    { label: 'Start Onboarding Workflow', icon: Play },
    { label: 'Trigger Performance Review', icon: BarChart2 },
    { label: 'Launch Upsell Campaign', icon: Star },
    { label: 'Flag Client Risk', icon: Flag },
    { label: 'Open Client Command Panel', icon: LayoutDashboard },
  ];

  return (
    <div className="sticky top-0 z-40 bg-slate-900/97 backdrop-blur border-b border-slate-700 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-stretch overflow-x-auto">
          <div className="flex items-center px-4 py-3 border-r border-slate-700 shrink-0 gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white whitespace-nowrap">Client Lifecycle</span>
          </div>
          {tiles.map(t => <KPITile key={t.label} {...t} />)}
        </div>
        <div className="relative flex-shrink-0 pr-3">
          <Button size="sm" className="bg-emerald-700 hover:bg-emerald-600 gap-1 text-xs" onClick={() => setOpen(!open)}>
            Quick Actions <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
          </Button>
          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden">
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
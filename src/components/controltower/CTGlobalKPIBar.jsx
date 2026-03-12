import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Plus, FileText, Rocket, BarChart2, Users, AlertTriangle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const KPITile = ({ label, value, trend, trendLabel, color, onClick }) => {
  const isUp = trend >= 0;
  return (
    <button
      onClick={onClick}
      className={`flex flex-col px-4 py-2 border-r border-slate-700 hover:bg-slate-800/60 transition-colors text-left group min-w-[120px]`}
    >
      <span className="text-xs text-slate-500 whitespace-nowrap">{label}</span>
      <span className={`text-xl font-bold ${color} leading-tight`}>{value}</span>
      <span className={`flex items-center gap-0.5 text-xs mt-0.5 ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
        {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {trendLabel}
      </span>
    </button>
  );
};

export default function CTGlobalKPIBar({ data = {} }) {
  const [actionsOpen, setActionsOpen] = useState(false);

  const kpis = [
    { label: 'Monthly MRR', value: `$${((data.mrr || 124800) / 1000).toFixed(1)}k`, trend: 12, trendLabel: '+12% MoM', color: 'text-emerald-300' },
    { label: 'New Deals', value: data.newDeals || 18, trend: 5, trendLabel: '+5 vs last mo', color: 'text-blue-300' },
    { label: 'Active Clients', value: data.activeClients || 94, trend: 3, trendLabel: '+3 this month', color: 'text-violet-300' },
    { label: 'AI Jobs Today', value: data.aiJobsToday || 347, trend: 22, trendLabel: '+22% vs avg', color: 'text-amber-300' },
    { label: 'Published Today', value: data.publishedToday || 61, trend: 8, trendLabel: '+8 vs yesterday', color: 'text-cyan-300' },
    { label: 'Risk Alerts', value: data.riskAlerts || 4, trend: -2, trendLabel: '↓ from 6', color: data.riskAlerts > 5 ? 'text-red-300' : 'text-orange-300' },
  ];

  const actions = [
    { label: 'Add New Client', icon: Plus },
    { label: 'Create Proposal', icon: FileText },
    { label: 'Launch Expansion Campaign', icon: Rocket },
    { label: 'Trigger ROI Report Batch', icon: BarChart2 },
    { label: 'Open Sales Pipeline', icon: Users },
  ];

  return (
    <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-700 shadow-xl">
      <div className="flex items-center justify-between px-2">
        {/* KPI tiles */}
        <div className="flex items-stretch overflow-x-auto scrollbar-hide">
          <div className="flex items-center px-4 py-3 border-r border-slate-700 shrink-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">NTA Control Tower</span>
          </div>
          {kpis.map((kpi) => (
            <KPITile key={kpi.label} {...kpi} />
          ))}
        </div>

        {/* Founder quick actions */}
        <div className="relative flex-shrink-0 pr-3">
          <Button
            size="sm"
            className="bg-violet-600 hover:bg-violet-700 text-white gap-1 text-xs"
            onClick={() => setActionsOpen(!actionsOpen)}
          >
            Founder Actions <ChevronDown className={`w-3 h-3 transition-transform ${actionsOpen ? 'rotate-180' : ''}`} />
          </Button>

          {actionsOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setActionsOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden">
                {actions.map((action) => (
                  <button
                    key={action.label}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-left"
                    onClick={() => setActionsOpen(false)}
                  >
                    <action.icon className="w-4 h-4 text-violet-400" />
                    {action.label}
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
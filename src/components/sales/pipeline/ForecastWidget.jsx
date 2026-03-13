import React from 'react';
import { DollarSign, TrendingUp, Target, Award, AlertTriangle } from 'lucide-react';

const STAGE_PROBABILITY = {
  new_lead: 0.05, contacted: 0.10, discovery: 0.20,
  demo_scheduled: 0.35, demo_completed: 0.50, proposal_sent: 0.65,
  verbal_yes: 0.85, closed_won: 1.0, closed_lost: 0.0,
};

const fmt = (n) => {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n}`;
};

export default function ForecastWidget({ opportunities }) {
  const active = opportunities.filter(o => o.stage !== 'closed_won' && o.stage !== 'closed_lost');
  const closedWon = opportunities.filter(o => o.stage === 'closed_won');
  const closedLost = opportunities.filter(o => o.stage === 'closed_lost');

  const totalPipeline = active.reduce((s, o) => s + (o.deal_value || 0), 0);
  const weighted = active.reduce((s, o) => s + (o.deal_value || 0) * (STAGE_PROBABILITY[o.stage] || 0), 0);
  const total = closedWon.length + closedLost.length;
  const winRate = total > 0 ? Math.round((closedWon.length / total) * 100) : 0;

  const today = new Date();
  const atRisk = active.filter(o => o.next_step_due && new Date(o.next_step_due) < today).length;

  const stats = [
    { label: 'Total Pipeline', value: fmt(totalPipeline), icon: DollarSign, accent: '#3b82f6', sub: `${active.length} active deals` },
    { label: 'Weighted Forecast', value: fmt(weighted), icon: TrendingUp, accent: '#10b981', sub: 'Probability adjusted' },
    { label: 'Closed Won (MTD)', value: fmt(closedWon.reduce((s, o) => s + (o.deal_value || 0), 0)), icon: Award, accent: '#f59e0b', sub: `${closedWon.length} deals closed` },
    { label: 'Win Rate', value: `${winRate}%`, icon: Target, accent: '#8b5cf6', sub: `${total} total decisions` },
    { label: 'At-Risk Deals', value: atRisk, icon: AlertTriangle, accent: '#ef4444', sub: 'Overdue follow-up' },
  ];

  return (
    <div className="grid grid-cols-5 gap-3">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={i} className="bg-slate-900 border border-slate-700/60 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg flex-shrink-0" style={{ background: `${s.accent}22` }}>
              <Icon className="w-5 h-5" style={{ color: s.accent }} />
            </div>
            <div className="min-w-0">
              <p className="text-slate-400 text-xs font-medium truncate">{s.label}</p>
              <p className="text-white text-lg font-bold leading-tight">{s.value}</p>
              <p className="text-slate-500 text-xs truncate">{s.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
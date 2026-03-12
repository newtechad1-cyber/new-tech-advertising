import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, UserCheck, Calendar, Gift, TrendingDown, Eye, BarChart2, LogIn } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const RISK_CONFIG = {
  critical: { badge: 'bg-red-950 text-red-300', border: 'border-l-red-600', dot: 'bg-red-500 animate-pulse' },
  high: { badge: 'bg-orange-950 text-orange-300', border: 'border-l-orange-500', dot: 'bg-orange-500' },
  medium: { badge: 'bg-amber-950 text-amber-300', border: 'border-l-amber-500', dot: 'bg-amber-500' },
  low: { badge: 'bg-slate-700 text-slate-400', border: 'border-l-slate-600', dot: 'bg-slate-500' },
};

const SIGNALS_MAP = [
  { key: 'declining_content_output', icon: BarChart2, label: 'Content Declining' },
  { key: 'falling_engagement', icon: TrendingDown, label: 'Falling Engagement' },
  { key: 'ranking_stagnation', icon: Eye, label: 'Rank Stagnation' },
  { key: 'low_login_activity', icon: LogIn, label: 'Low Login Activity' },
  { key: 'negative_satisfaction', icon: AlertTriangle, label: 'Negative Sentiment' },
];

const FALLBACK = [
  { client_name: 'CoolBreeze HVAC', vertical: 'HVAC', churn_probability: 72, risk_level: 'critical', declining_content_output: true, falling_engagement: true, ranking_stagnation: true, low_login_activity: false, negative_satisfaction: false, primary_signal: 'Content production stalled for 3 weeks, engagement dropped 44%', days_until_renewal: 28, mrr: 800, intervention_status: 'none' },
  { client_name: 'Blue Ridge Roofing', vertical: 'Home Services', churn_probability: 58, risk_level: 'high', declining_content_output: true, falling_engagement: false, ranking_stagnation: true, low_login_activity: true, negative_satisfaction: false, primary_signal: 'Missing seasonal campaign window; login activity near zero last 2 weeks', days_until_renewal: 45, mrr: 1400, intervention_status: 'none' },
  { client_name: 'Taco Loco Franchise', vertical: 'Restaurant', churn_probability: 38, risk_level: 'medium', declining_content_output: false, falling_engagement: true, ranking_stagnation: false, low_login_activity: true, negative_satisfaction: false, primary_signal: 'Engagement slipping — social content approval delays increasing', days_until_renewal: 62, mrr: 900, intervention_status: 'triggered' },
];

export default function CPRetentionPanel({ risks = [], onRefresh }) {
  const data = risks.length > 0 ? risks : FALLBACK;
  const critical = data.filter(r => r.risk_level === 'critical').length;
  const totalMrr = data.reduce((s, r) => s + (r.mrr || 0), 0);

  const handleAction = async (risk, action) => {
    const map = { campaign: 'triggered', in_progress: 'in_progress', resolved: 'resolved' };
    if (map[action] && risk.id && risks.length > 0) {
      await base44.entities.RetentionRiskSignal.update(risk.id, { intervention_status: map[action] }).catch(() => {});
      onRefresh?.();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Retention Risk Monitoring Panel</h2>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-red-950/30 border border-red-700/40 rounded-xl px-3 py-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs font-bold text-red-300">{critical} critical risks</span>
          </div>
          <div className="flex items-center gap-2 bg-amber-950/30 border border-amber-700/40 rounded-xl px-3 py-1.5">
            <span className="text-xs font-bold text-amber-300">${totalMrr.toLocaleString()} MRR at risk</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((risk, i) => {
          const cfg = RISK_CONFIG[risk.risk_level] || RISK_CONFIG.medium;
          const activeSignals = SIGNALS_MAP.filter(s => risk[s.key]);
          return (
            <div key={i} className={`bg-slate-800/60 border border-slate-700 border-l-2 ${cfg.border} rounded-xl p-4`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5 ${cfg.dot}`} />
                  <div>
                    <p className="text-sm font-bold text-white">{risk.client_name}</p>
                    <p className="text-[10px] text-slate-400">{risk.vertical} · ${risk.mrr?.toLocaleString()}/mo · {risk.days_until_renewal}d until renewal</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm font-bold text-red-300">{risk.churn_probability}%</span>
                  <Badge className={`text-[9px] px-1.5 ${cfg.badge}`}>{risk.risk_level}</Badge>
                </div>
              </div>

              <p className="text-xs text-slate-300 mb-3 italic">"{risk.primary_signal}"</p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {activeSignals.map((s, j) => (
                  <span key={j} className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-red-950/30 border border-red-700/30 text-red-300">
                    <s.icon className="w-2.5 h-2.5" />{s.label}
                  </span>
                ))}
              </div>

              <div className="flex gap-2 flex-wrap">
                {[
                  { action: 'campaign', icon: Gift, label: 'Retention Campaign', color: 'border-emerald-700/50 text-emerald-300 hover:bg-emerald-950/30' },
                  { action: 'in_progress', icon: UserCheck, label: 'Assign Manager', color: 'border-blue-700/50 text-blue-300 hover:bg-blue-950/30' },
                  { action: 'resolved', icon: Calendar, label: 'Performance Review', color: 'border-violet-700/50 text-violet-300 hover:bg-violet-950/30' },
                ].map(a => (
                  <button key={a.action} onClick={() => handleAction(risk, a.action)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border bg-transparent text-[10px] font-medium transition-colors ${a.color}`}>
                    <a.icon className="w-3 h-3" />{a.label}
                  </button>
                ))}
                {risk.intervention_status !== 'none' && (
                  <Badge className="bg-violet-950 text-violet-300 text-[9px]">
                    Intervention: {risk.intervention_status}
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
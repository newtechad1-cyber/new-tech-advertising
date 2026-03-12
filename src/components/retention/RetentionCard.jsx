import React from 'react';
import { AlertTriangle, AlertCircle, AlertOctagon, ChevronRight } from 'lucide-react';

const RISK_REASON_CONFIG = {
  low_content_activity: { label: 'Low Content Activity', icon: '📝' },
  slow_approvals: { label: 'Slow Approvals', icon: '⏱️' },
  low_reporting_engagement: { label: 'Low Reporting Engagement', icon: '📊' },
  performance_concern: { label: 'Performance Concern', icon: '📉' },
  pricing_objection: { label: 'Pricing Objection', icon: '💰' },
  competitor_pressure: { label: 'Competitor Pressure', icon: '🎯' },
};

const SEVERITY_CONFIG = {
  watch: {
    label: 'Watch',
    color: 'text-slate-400',
    bg: 'bg-slate-600/20',
    border: 'border-slate-700',
    icon: AlertCircle,
  },
  moderate: {
    label: 'Moderate',
    color: 'text-amber-400',
    bg: 'bg-amber-600/20',
    border: 'border-amber-700',
    icon: AlertTriangle,
  },
  high: {
    label: 'High',
    color: 'text-orange-400',
    bg: 'bg-orange-600/20',
    border: 'border-orange-700',
    icon: AlertTriangle,
  },
  critical: {
    label: 'Critical',
    color: 'text-rose-400',
    bg: 'bg-rose-600/20',
    border: 'border-rose-700',
    icon: AlertOctagon,
  },
};

const STATUS_CONFIG = {
  planned: { label: 'Planned', color: 'text-slate-400' },
  outreach_sent: { label: 'Outreach Sent', color: 'text-blue-400' },
  in_discussion: { label: 'In Discussion', color: 'text-amber-400' },
  resolved: { label: 'Resolved', color: 'text-emerald-400' },
  escalated: { label: 'Escalated', color: 'text-rose-400' },
};

function fmt(n) {
  if (!n) return '$0';
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;
}

export default function RetentionCard({ intervention, onClick }) {
  const sevCfg = SEVERITY_CONFIG[intervention.risk_severity] || SEVERITY_CONFIG.moderate;
  const riskCfg = RISK_REASON_CONFIG[intervention.risk_reason] || RISK_REASON_CONFIG.low_content_activity;
  const statusCfg = STATUS_CONFIG[intervention.intervention_status] || STATUS_CONFIG.planned;
  const Icon = sevCfg.icon;

  return (
    <div
      onClick={() => onClick(intervention)}
      className={`bg-[#0d1526] border rounded-2xl p-5 cursor-pointer transition-all group hover:border-violet-700/50 ${sevCfg.border}`}
    >
      {/* Header with severity */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-black text-white group-hover:text-violet-200 transition-colors">
            {intervention.client_name}
          </h3>
        </div>
        <Icon className={`w-5 h-5 ${sevCfg.color} flex-shrink-0`} />
      </div>

      {/* Risk reason */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-sm">{riskCfg.icon}</span>
        <span className="text-xs text-slate-400 font-semibold">{riskCfg.label}</span>
      </div>

      {/* MRR at risk */}
      <div className="mb-3">
        <p className="text-[10px] text-slate-600 font-semibold mb-0.5">MRR at Risk</p>
        <p className="text-sm font-black text-rose-400">{fmt(intervention.projected_mrr_at_risk)}/mo</p>
      </div>

      {/* Manager + Status */}
      <div className="space-y-2 mb-3">
        {intervention.assigned_success_manager && (
          <p className="text-[10px] text-slate-500">
            <span className="font-semibold text-slate-400">Manager:</span> {intervention.assigned_success_manager}
          </p>
        )}
        <div className="flex items-center gap-1.5">
          <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full border border-current/30 ${statusCfg.color}`}>
            {statusCfg.label}
          </span>
          <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full border ${sevCfg.bg} ${sevCfg.color}`}>
            {sevCfg.label}
          </span>
        </div>
      </div>

      {/* View detail hint */}
      <div className="flex items-center gap-1 text-[10px] text-violet-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-3 h-3" /> View details
      </div>
    </div>
  );
}
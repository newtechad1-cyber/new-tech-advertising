import React from 'react';
import { TrendingUp, ChevronRight } from 'lucide-react';

const OPPORTUNITY_CONFIG = {
  premium_video: { label: 'Premium Video', icon: '🎥', color: '#f59e0b' },
  authority_content: { label: 'Authority Content', icon: '📚', color: '#3b82f6' },
  multi_location: { label: 'Multi-Location', icon: '📍', color: '#10b981' },
  seasonal_campaign: { label: 'Seasonal Campaign', icon: '🎯', color: '#ec4899' },
  pricing_upgrade: { label: 'Pricing Upgrade', icon: '💰', color: '#8b5cf6' },
  enterprise_package: { label: 'Enterprise Package', icon: '🏢', color: '#f43f5e' },
};

const STATUS_CONFIG = {
  identified: { label: 'Identified', color: 'text-slate-400', bg: 'bg-slate-600/20' },
  conversation_started: { label: 'In Conversation', color: 'text-blue-400', bg: 'bg-blue-600/20' },
  proposal_sent: { label: 'Proposal Sent', color: 'text-amber-400', bg: 'bg-amber-600/20' },
  converted: { label: 'Converted', color: 'text-emerald-400', bg: 'bg-emerald-600/20' },
  declined: { label: 'Declined', color: 'text-slate-500', bg: 'bg-slate-600/10' },
};

function readinessColor(score) {
  if (score >= 75) return { bar: '#10b981', text: 'text-emerald-400' };
  if (score >= 50) return { bar: '#f59e0b', text: 'text-amber-400' };
  return               { bar: '#64748b', text: 'text-slate-400' };
}

function fmt(n) {
  if (!n) return '+$0';
  return n >= 1000 ? `+$${(n / 1000).toFixed(1)}k` : `+$${n}`;
}

export default function ExpansionCard({ opportunity, onClick }) {
  const opp = OPPORTUNITY_CONFIG[opportunity.opportunity_type] || OPPORTUNITY_CONFIG.premium_video;
  const status = STATUS_CONFIG[opportunity.expansion_status] || STATUS_CONFIG.identified;
  const readiness = opportunity.readiness_score || 60;
  const rc = readinessColor(readiness);

  return (
    <div
      onClick={() => onClick(opportunity)}
      className="bg-[#0d1526] border border-slate-800/60 hover:border-emerald-700/50 rounded-2xl p-5 cursor-pointer transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-black text-white group-hover:text-emerald-200 transition-colors leading-snug">
            {opportunity.client_name}
          </h3>
        </div>
      </div>

      {/* Opportunity Type */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-lg">{opp.icon}</span>
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: opp.color }}>
          {opp.label}
        </span>
      </div>

      {/* Readiness Score */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-slate-500 font-semibold">Readiness</span>
          <span className={`text-sm font-black ${rc.text}`}>{readiness}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${readiness}%`, background: rc.bar }} />
        </div>
      </div>

      {/* Projected MRR */}
      <div className="mb-3">
        <p className="text-[10px] text-slate-600 font-semibold mb-0.5">Projected MRR Increase</p>
        <p className="text-sm font-black text-emerald-400">{fmt(opportunity.projected_mrr_increase)}/mo</p>
      </div>

      {/* Status + Confidence */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full border border-current/30 ${status.color}`}>
            {status.label}
          </span>
          <span className="text-[9px] font-bold text-slate-400">
            {opportunity.confidence_level}% confidence
          </span>
        </div>
      </div>

      {/* View detail hint */}
      <div className="mt-3 flex items-center gap-1 text-[10px] text-emerald-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
        <TrendingUp className="w-3 h-3" /> View details
      </div>
    </div>
  );
}
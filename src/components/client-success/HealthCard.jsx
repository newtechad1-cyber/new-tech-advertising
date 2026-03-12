import React from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';

function healthColor(score) {
  if (score >= 75) return { bg: 'bg-emerald-400', border: 'border-emerald-800' };
  if (score >= 50) return { bg: 'bg-amber-400', border: 'border-amber-800' };
  return               { bg: 'bg-rose-400',   border: 'border-rose-800'   };
}

const STAGE_CONFIG = {
  onboarding:      { label: 'Onboarding',      color: 'text-blue-300',   bg: 'bg-blue-600/20'      },
  stabilizing:     { label: 'Stabilizing',     color: 'text-slate-300',  bg: 'bg-slate-600/20'     },
  growing:         { label: 'Growing',         color: 'text-emerald-300', bg: 'bg-emerald-600/20'  },
  expansion_ready: { label: 'Expansion Ready', color: 'text-violet-300', bg: 'bg-violet-600/20'    },
  at_risk:         { label: 'At Risk',         color: 'text-rose-300',   bg: 'bg-rose-600/20'      },
};

const RISK_CONFIG = {
  low:    { label: 'Low Risk',    color: 'text-emerald-400' },
  medium: { label: 'Medium Risk', color: 'text-amber-400' },
  high:   { label: 'High Risk',   color: 'text-rose-400' },
};

function fmt(n) {
  if (!n) return '$0';
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;
}

export default function HealthCard({ profile, onClick }) {
  const health = profile.health_score || 70;
  const hc = healthColor(health);
  const stage = STAGE_CONFIG[profile.lifecycle_stage] || STAGE_CONFIG.growing;
  const riskCfg = RISK_CONFIG[profile.churn_risk_level] || RISK_CONFIG.low;

  return (
    <div
      onClick={() => onClick(profile)}
      className={`bg-[#0d1526] border rounded-2xl p-5 cursor-pointer transition-all group hover:border-violet-700/50 ${hc.border}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-black text-white group-hover:text-violet-200 transition-colors leading-snug">
            {profile.client_name}
          </h3>
          {profile.industry_vertical && (
            <p className="text-[10px] text-slate-500 mt-1">{profile.industry_vertical}</p>
          )}
        </div>
        {profile.churn_risk_level === 'high' && (
          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
        )}
      </div>

      {/* MRR */}
      <div className="mb-3">
        <p className="text-[10px] text-slate-600 font-semibold">Account Value</p>
        <p className="text-sm font-black text-emerald-400">{fmt(profile.account_value_mrr)}/mo</p>
      </div>

      {/* Health Score */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-slate-500 font-semibold">Health Score</span>
          <span className="text-sm font-black" style={{ color: healthColor(health).bg.includes('emerald') ? '#10b981' : healthColor(health).bg.includes('amber') ? '#f59e0b' : '#f43f5e' }}>
            {health}
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${health}%`, background: hc.bg.includes('emerald') ? '#10b981' : hc.bg.includes('amber') ? '#f59e0b' : '#f43f5e' }}
          />
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full border ${stage.bg} ${stage.color}`}>
          {stage.label}
        </span>
        <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full border border-current/30 ${riskCfg.color}`}>
          {riskCfg.label}
        </span>
      </div>

      {/* View detail hint */}
      <div className="mt-3 flex items-center gap-1 text-[10px] text-violet-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
        <TrendingUp className="w-3 h-3" /> View details
      </div>
    </div>
  );
}
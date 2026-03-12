import React from 'react';
import { AlertTriangle, TrendingUp, ChevronRight } from 'lucide-react';

const RISK_CONFIG = {
  low: { label: 'Low Risk', color: 'text-emerald-400', bg: 'bg-emerald-600/20' },
  moderate: { label: 'Moderate Risk', color: 'text-amber-400', bg: 'bg-amber-600/20' },
  high: { label: 'High Risk', color: 'text-rose-400', bg: 'bg-rose-600/20' },
};

function utilizationColor(percent) {
  if (percent >= 85) return { bar: '#ef4444', text: 'text-rose-400' };
  if (percent >= 65) return { bar: '#f59e0b', text: 'text-amber-400' };
  return { bar: '#10b981', text: 'text-emerald-400' };
}

export default function CapacityCard({ profile, onClick }) {
  const risk = RISK_CONFIG[profile.burnout_risk_level] || RISK_CONFIG.low;
  const util = profile.capacity_utilization_percent || 0;
  const uc = utilizationColor(util);

  return (
    <div
      onClick={() => onClick(profile)}
      className="bg-[#0d1526] border border-slate-800/60 hover:border-purple-700/50 rounded-2xl p-5 cursor-pointer transition-all group"
    >
      {/* Role Title */}
      <h3 className="text-sm font-black text-white group-hover:text-purple-200 transition-colors mb-3 leading-snug">
        {profile.team_role}
      </h3>

      {/* Hours Summary */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-semibold">Available Hours</span>
          <span className="text-xs font-black text-slate-300">{profile.total_available_hours_week}h</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-semibold">Assigned Hours</span>
          <span className="text-xs font-black text-slate-300">{profile.assigned_hours_week}h</span>
        </div>
      </div>

      {/* Utilization Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-slate-500 font-semibold">Utilization</span>
          <span className={`text-sm font-black ${uc.text}`}>{util}%</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${util}%`, background: uc.bar }} />
        </div>
      </div>

      {/* Backlog */}
      {profile.backlog_hours > 0 && (
        <div className="mb-3">
          <p className="text-[10px] text-slate-500 font-semibold">Backlog Hours</p>
          <p className="text-xs font-bold text-amber-400">{profile.backlog_hours}h pending</p>
        </div>
      )}

      {/* Risk + Efficiency */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <span className={`text-[9px] font-bold px-2 py-1 rounded-full border border-current/30 ${risk.color}`}>
            {risk.label}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
          <TrendingUp className="w-3 h-3" />
          Efficiency: {profile.efficiency_score}/100
        </div>
      </div>

      {/* View detail hint */}
      <div className="mt-3 flex items-center gap-1 text-[10px] text-purple-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-3 h-3" /> View workload
      </div>
    </div>
  );
}
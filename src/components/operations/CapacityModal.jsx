import React from 'react';
import { X, Users, TrendingUp, AlertTriangle } from 'lucide-react';

const RISK_CONFIG = {
  low: 'Low Burnout Risk',
  moderate: 'Moderate Burnout Risk',
  high: 'High Burnout Risk',
};

function getRiskInsight(risk, util, backlog) {
  if (risk === 'high') return `This role is at critical capacity. ${backlog}h backlog + ${util}% utilization = burnout trajectory. Recommend immediate workload rebalancing or hiring.`;
  if (risk === 'moderate') return `Moderate pressure detected. Backlog is building and utilization is climbing. Monitor closely and consider capacity planning.`;
  return `This role has healthy capacity levels. Continue monitoring to maintain sustainable workload.`;
}

export default function CapacityModal({ profile, onClose }) {
  if (!profile) return null;
  const util = profile.capacity_utilization_percent || 0;
  const availableCapacity = Math.max(0, profile.total_available_hours_week - profile.assigned_hours_week);
  const weeksToCompleteBacklog = profile.backlog_hours > 0 && availableCapacity > 0 
    ? Math.ceil(profile.backlog_hours / availableCapacity) 
    : 0;

  const insight = getRiskInsight(profile.burnout_risk_level, util, profile.backlog_hours);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0d1526] border border-slate-700/60 rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800/60">
          <div>
            <p className="text-[10px] text-purple-400 uppercase font-bold tracking-wider mb-1">Capacity Profile</p>
            <h2 className="text-xl font-black text-white">{profile.team_role}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* Hours Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/60 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Available/Week</p>
              <p className="text-xl font-black text-blue-400">{profile.total_available_hours_week}h</p>
            </div>
            <div className="bg-slate-900/60 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Assigned/Week</p>
              <p className="text-xl font-black text-purple-400">{profile.assigned_hours_week}h</p>
            </div>
            <div className="bg-slate-900/60 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Available Capacity</p>
              <p className="text-xl font-black text-emerald-400">{availableCapacity}h</p>
            </div>
            <div className="bg-slate-900/60 rounded-2xl p-4 text-center">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Backlog</p>
              <p className="text-xl font-black text-amber-400">{profile.backlog_hours}h</p>
            </div>
          </div>

          {/* Utilization */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Capacity Utilization</p>
              <span className="text-sm font-black" style={{ color: util >= 85 ? '#ef4444' : util >= 65 ? '#f59e0b' : '#10b981' }}>
                {util}%
              </span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${util}%`, background: util >= 85 ? '#ef4444' : util >= 65 ? '#f59e0b' : '#10b981' }} />
            </div>
          </div>

          {/* Backlog Timeline */}
          {profile.backlog_hours > 0 && weeksToCompleteBacklog > 0 && (
            <div className="bg-amber-600/20 border border-amber-700/50 rounded-2xl p-4">
              <p className="text-[10px] text-amber-400 uppercase font-bold mb-1">Backlog Clearance Timeline</p>
              <p className="text-lg font-black text-amber-300">{weeksToCompleteBacklog} weeks</p>
              <p className="text-[10px] text-amber-300/80 mt-1">
                At current available capacity ({availableCapacity}h/week)
              </p>
            </div>
          )}

          {/* Efficiency & Risk */}
          <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-700/30 space-y-2">
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Efficiency Score</span>
              <span className="text-sm font-black text-slate-300">{profile.efficiency_score}/100</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-700/40">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Burnout Risk</span>
              <span className="text-xs font-bold text-slate-300">{RISK_CONFIG[profile.burnout_risk_level]}</span>
            </div>
          </div>

          {/* Capacity Insight */}
          <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-700/30">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Capacity Insight</p>
            <p className="text-sm text-slate-300 leading-relaxed">{insight}</p>
          </div>

          {/* Suggested Actions */}
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-3">Suggested Actions</p>
            <div className="space-y-2">
              {profile.burnout_risk_level === 'high' && (
                <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-rose-600/20 border border-rose-700/50 rounded-xl text-xs font-bold text-rose-300 hover:bg-rose-600/30 transition-colors">
                  <AlertTriangle className="w-4 h-4" /> Rebalance Workload
                </button>
              )}
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600/20 border border-blue-700/50 rounded-xl text-xs font-bold text-blue-300 hover:bg-blue-600/30 transition-colors">
                <Users className="w-4 h-4" /> Flag Hiring Need
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600/20 border border-emerald-700/50 rounded-xl text-xs font-bold text-emerald-300 hover:bg-emerald-600/30 transition-colors">
                <TrendingUp className="w-4 h-4" /> Mark Optimized
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
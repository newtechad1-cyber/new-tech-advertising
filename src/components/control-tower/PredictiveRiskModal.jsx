import React, { useState } from 'react';
import { X, AlertTriangle, Shield, TrendingUp } from 'lucide-react';

const CATEGORY_LABELS = {
  revenue: 'Revenue Risk',
  churn: 'Churn Risk',
  sales: 'Sales Risk',
  operations: 'Operations Risk',
  expansion: 'Expansion Risk',
  pricing: 'Pricing Risk',
};

const STATUS_LABELS = {
  emerging: 'Emerging',
  watch: 'Under Watch',
  intervention: 'Active Intervention',
  stabilized: 'Stabilized',
};

export default function PredictiveRiskModal({ risk, onClose }) {
  if (!risk) return null;
  const [newStatus, setNewStatus] = useState(risk.monitoring_status);

  const prob = risk.probability_score || 50;
  const impact = risk.impact_severity || 50;
  const riskScore = Math.round((prob * impact) / 100);

  const nextStatuses = {
    emerging: ['watch'],
    watch: ['intervention', 'stabilized'],
    intervention: ['stabilized'],
    stabilized: [],
  }[risk.monitoring_status] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0d1526] border border-slate-700/60 rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800/60 bg-rose-950/20">
          <div>
            <p className="text-[10px] text-rose-400 uppercase font-bold tracking-wider mb-1">Predictive Risk Alert</p>
            <h2 className="text-xl font-black text-white">{risk.risk_title}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* Risk Summary */}
          <div className="bg-slate-900/60 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Category</span>
              <span className="text-xs font-bold text-slate-300">{CATEGORY_LABELS[risk.risk_category]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Status</span>
              <span className="text-xs font-bold text-slate-300">{STATUS_LABELS[risk.monitoring_status]}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-700/40">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Risk Score</span>
              <span className="text-xs font-black text-rose-400">{riskScore}/100</span>
            </div>
          </div>

          {/* Probability & Impact Assessment */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`rounded-2xl p-4 border ${prob >= 75 ? 'bg-rose-600/20 border-rose-700/50' : 'bg-slate-900/40 border-slate-700/30'}`}>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Probability</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className={`text-2xl font-black ${prob >= 75 ? 'text-rose-300' : 'text-slate-300'}`}>{prob}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${prob}%`, background: prob >= 75 ? '#ef4444' : prob >= 50 ? '#f59e0b' : '#eab308' }} />
              </div>
            </div>

            <div className={`rounded-2xl p-4 border ${impact >= 75 ? 'bg-rose-600/20 border-rose-700/50' : 'bg-slate-900/40 border-slate-700/30'}`}>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Impact</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className={`text-2xl font-black ${impact >= 75 ? 'text-rose-300' : 'text-slate-300'}`}>{impact}</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${impact}%`, background: impact >= 75 ? '#ef4444' : impact >= 50 ? '#f59e0b' : '#3b82f6' }} />
              </div>
            </div>
          </div>

          {/* Risk Reasoning */}
          {risk.risk_reasoning && (
            <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-700/30">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Risk Analysis</p>
              <p className="text-sm text-slate-300 leading-relaxed">{risk.risk_reasoning}</p>
            </div>
          )}

          {/* Recommended Action */}
          <div className="bg-emerald-900/20 rounded-2xl p-4 border border-emerald-700/40">
            <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider mb-2">Preventive Strategy</p>
            <p className="text-sm text-emerald-100 leading-relaxed">{risk.recommended_preventive_action}</p>
          </div>

          {/* Vertical or Playbook Context */}
          {(risk.affected_vertical || risk.related_playbook) && (
            <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-700/30">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Context</p>
              {risk.affected_vertical && <p className="text-xs text-slate-300">Vertical: <span className="font-bold">{risk.affected_vertical}</span></p>}
              {risk.related_playbook && <p className="text-xs text-slate-300 mt-1">Playbook: <span className="font-bold">{risk.related_playbook}</span></p>}
            </div>
          )}

          {/* Status Transition */}
          {nextStatuses.length > 0 && (
            <div className="border-t border-slate-800/60 pt-4">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-3">Update Risk Status</p>
              <div className="space-y-2">
                {nextStatuses.map(status => (
                  <button
                    key={status}
                    onClick={() => setNewStatus(status)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-bold transition-colors border flex items-center gap-2 ${
                      newStatus === status
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-slate-800/40 border-slate-700 text-slate-300 hover:border-emerald-700'
                    }`}
                  >
                    <Shield className="w-3 h-3" /> Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
              {newStatus !== risk.monitoring_status && (
                <button className="mt-3 w-full px-3 py-2 bg-rose-600 hover:bg-rose-500 rounded-xl text-xs font-bold text-white transition-colors">
                  Confirm Status Update
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
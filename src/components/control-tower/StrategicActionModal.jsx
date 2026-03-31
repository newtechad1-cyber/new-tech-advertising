import React, { useState } from 'react';
import { X, Zap, CheckCircle2, AlertCircle, Play } from 'lucide-react';

const CATEGORY_LABELS = {
  expansion_activation: 'Expansion Activation',
  sales_push: 'Sales Push',
  retention_intervention: 'Retention Intervention',
  pricing_adjustment: 'Pricing Adjustment',
  operational_optimization: 'Operational Optimization',
  campaign_acceleration: 'Campaign Acceleration',
};

const STATUS_LABELS = {
  planned: 'Planned',
  launched: 'Launched',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const URGENCY_LABELS = {
  low: 'Low Priority',
  medium: 'Medium Priority',
  high: 'High Priority',
  critical: 'Critical',
};

export default function StrategicActionModal({ initiative, onClose }) {
  const [newStatus, setNewStatus] = useState(initiative?.execution_status);
  if (!initiative) return null;

  const impact = initiative.projected_revenue_impact || 0;

  const nextStatuses = {
    planned: ['launched'],
    launched: ['in_progress'],
    in_progress: ['completed'],
    completed: [],
  }[initiative.execution_status] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0d1526] border border-slate-700/60 rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800/60 bg-blue-950/20">
          <div>
            <p className="text-[10px] text-blue-400 uppercase font-bold tracking-wider mb-1">Strategic Initiative</p>
            <h2 className="text-xl font-black text-white">{initiative.initiative_title}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* Initiative Summary */}
          <div className="bg-slate-900/60 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Category</span>
              <span className="text-xs font-bold text-slate-300">{CATEGORY_LABELS[initiative.action_category]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Status</span>
              <span className="text-xs font-bold text-slate-300">{STATUS_LABELS[initiative.execution_status]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Urgency</span>
              <span className="text-xs font-bold text-slate-300">{URGENCY_LABELS[initiative.urgency_level]}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-700/40">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Owner</span>
              <span className="text-xs font-bold text-slate-300">{initiative.assigned_owner_role}</span>
            </div>
          </div>

          {/* Revenue Impact */}
          {impact > 0 && (
            <div className="bg-emerald-600/20 border border-emerald-700/50 rounded-2xl p-4">
              <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider mb-2">Projected Revenue Impact</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-300">${(impact / 1000).toFixed(1)}k</span>
                <span className="text-xs text-emerald-400">in new MRR</span>
              </div>
            </div>
          )}

          {/* Action Notes */}
          {initiative.action_notes && (
            <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-700/30">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Execution Strategy</p>
              <p className="text-sm text-slate-300 leading-relaxed">{initiative.action_notes}</p>
            </div>
          )}

          {/* Vertical or Playbook Context */}
          {(initiative.related_vertical || initiative.related_playbook) && (
            <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-700/30">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Context</p>
              {initiative.related_vertical && <p className="text-xs text-slate-300">Vertical: <span className="font-bold">{initiative.related_vertical}</span></p>}
              {initiative.related_playbook && <p className="text-xs text-slate-300 mt-1">Playbook: <span className="font-bold">{initiative.related_playbook}</span></p>}
            </div>
          )}

          {/* Status Progression */}
          {nextStatuses.length > 0 && (
            <div className="border-t border-slate-800/60 pt-4">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-3">Update Execution Status</p>
              <div className="space-y-2">
                {nextStatuses.map(status => (
                  <button
                    key={status}
                    onClick={() => setNewStatus(status)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-bold transition-colors border flex items-center gap-2 ${
                      newStatus === status
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-slate-800/40 border-slate-700 text-slate-300 hover:border-blue-700'
                    }`}
                  >
                    {status === 'launched' && <Play className="w-3 h-3" />}
                    {status === 'in_progress' && <AlertCircle className="w-3 h-3" />}
                    {status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                    Mark as {status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
              {newStatus !== initiative.execution_status && (
                <button className="mt-3 w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white transition-colors">
                  Confirm Status Update
                </button>
              )}
            </div>
          )}

          {/* Escalate Priority */}
          {initiative.urgency_level !== 'critical' && (
            <button className="w-full px-3 py-2 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-700/40 rounded-xl text-xs font-bold text-rose-300 transition-colors flex items-center justify-center gap-2">
              <AlertCircle className="w-3 h-3" /> Escalate to Critical
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { X, CheckCircle2, AlertTriangle, TrendingUp, Zap, Star, Activity, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STAGES = [
  { key: 'deal_closed', label: 'Deal Closed', color: 'border-slate-600', bg: 'bg-slate-800/30', dot: 'bg-slate-400' },
  { key: 'onboarding_initiated', label: 'Onboarding', color: 'border-blue-700/50', bg: 'bg-blue-950/10', dot: 'bg-blue-400' },
  { key: 'assets_collected', label: 'Assets Collected', color: 'border-indigo-700/50', bg: 'bg-indigo-950/10', dot: 'bg-indigo-400' },
  { key: 'strategy_approved', label: 'Strategy Approved', color: 'border-violet-700/50', bg: 'bg-violet-950/10', dot: 'bg-violet-400' },
  { key: 'content_production', label: 'Content Production', color: 'border-cyan-700/50', bg: 'bg-cyan-950/10', dot: 'bg-cyan-400' },
  { key: 'publishing_active', label: 'Publishing Active', color: 'border-emerald-700/50', bg: 'bg-emerald-950/10', dot: 'bg-emerald-400' },
  { key: 'performance_optimization', label: 'Performance Opt.', color: 'border-teal-700/50', bg: 'bg-teal-950/10', dot: 'bg-teal-400' },
  { key: 'expansion_opportunity', label: 'Expansion', color: 'border-amber-700/50', bg: 'bg-amber-950/10', dot: 'bg-amber-400' },
  { key: 'renewal_retention', label: 'Renewal/Retention', color: 'border-orange-700/50', bg: 'bg-orange-950/10', dot: 'bg-orange-400' },
];

const URGENCY_CONFIG = {
  urgent: 'bg-red-950 text-red-300',
  stalled: 'bg-amber-950 text-amber-300',
  normal: 'bg-slate-700 text-slate-300',
  on_track: 'bg-emerald-950 text-emerald-300',
};

const SATISFACTION_ICON = {
  positive: <TrendingUp className="w-3 h-3 text-emerald-400" />,
  neutral: <Activity className="w-3 h-3 text-slate-400" />,
  at_risk: <AlertTriangle className="w-3 h-3 text-amber-400" />,
  negative: <AlertTriangle className="w-3 h-3 text-red-400" />,
};

const ProgressBar = ({ value, color = 'bg-emerald-500' }) => (
  <div className="h-1 bg-slate-700 rounded-full mt-2">
    <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(value || 0, 100)}%` }} />
  </div>
);

const ClientModal = ({ client, onClose }) => {
  const checklist = [
    { label: 'Brand assets uploaded', done: client.onboarding_completion >= 20 },
    { label: 'Google Business connected', done: client.onboarding_completion >= 40 },
    { label: 'Content voice configured', done: client.onboarding_completion >= 60 },
    { label: 'Video style selected', done: client.onboarding_completion >= 80 },
    { label: 'Market targeting set', done: client.onboarding_completion >= 100 },
  ];

  const quickActions = [
    { label: 'Assign Task', color: 'border-blue-700/50 text-blue-300 hover:bg-blue-950/30' },
    { label: 'Trigger AI Batch', color: 'border-violet-700/50 text-violet-300 hover:bg-violet-950/30' },
    { label: 'Performance Review', color: 'border-cyan-700/50 text-cyan-300 hover:bg-cyan-950/30' },
    { label: 'Retention Workflow', color: 'border-amber-700/50 text-amber-300 hover:bg-amber-950/30' },
    { label: 'Expansion Ready', color: 'border-emerald-700/50 text-emerald-300 hover:bg-emerald-950/30' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[88vh] overflow-y-auto">
        <div className="flex items-start justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-sm font-bold text-white">
              {client.company_name?.[0]}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{client.company_name}</h2>
              <p className="text-xs text-slate-400">{client.vertical} · {client.assigned_manager || 'Unassigned'} · ${(client.mrr || 0).toLocaleString()}/mo</p>
            </div>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-500 hover:text-white" /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Scores */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'ROI Confidence', value: `${client.roi_confidence || 0}%`, color: (client.roi_confidence || 0) >= 70 ? 'text-emerald-300' : 'text-amber-300' },
              { label: 'Upsell Probability', value: `${client.upsell_probability || 0}%`, color: 'text-violet-300' },
              { label: 'Churn Risk', value: `${client.churn_risk_score || 0}%`, color: (client.churn_risk_score || 0) >= 50 ? 'text-red-300' : 'text-slate-300' },
            ].map(m => (
              <div key={m.label} className="bg-slate-800 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-500 mb-1">{m.label}</p>
                <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Onboarding checklist */}
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-300">Onboarding Checklist</p>
              <span className="text-xs text-emerald-300 font-bold">{client.onboarding_completion || 0}%</span>
            </div>
            <div className="space-y-2">
              {checklist.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${item.done ? 'text-emerald-400' : 'text-slate-700'}`} />
                  <span className={`text-xs ${item.done ? 'text-slate-300' : 'text-slate-600'}`}>{item.label}</span>
                </div>
              ))}
            </div>
            <ProgressBar value={client.onboarding_completion} />
          </div>

          {/* Publishing / content score */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800 rounded-xl p-3">
              <p className="text-[10px] text-slate-500 mb-1">Content Output Score</p>
              <p className="text-lg font-bold text-cyan-300">{client.content_output_score || 0}<span className="text-xs text-slate-500">/100</span></p>
              <ProgressBar value={client.content_output_score} color="bg-cyan-500" />
            </div>
            <div className="bg-slate-800 rounded-xl p-3">
              <p className="text-[10px] text-slate-500 mb-1">Satisfaction Signal</p>
              <div className="flex items-center gap-2 mt-1">
                {SATISFACTION_ICON[client.satisfaction_signal] || SATISFACTION_ICON.neutral}
                <span className="text-sm font-semibold text-white capitalize">{client.satisfaction_signal?.replace('_', ' ') || 'Neutral'}</span>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {quickActions.map(a => (
              <button key={a.label} className={`px-2 py-2 rounded-xl border bg-transparent text-xs font-medium transition-colors ${a.color}`}>
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ClientCard = ({ client, onClick, onDragStart }) => (
  <div draggable onDragStart={onDragStart} onClick={onClick}
    className="bg-slate-800 border border-slate-700 rounded-lg p-3 cursor-pointer hover:border-slate-500 transition-all group select-none">
    <div className="flex items-start justify-between mb-1.5">
      <p className="text-xs font-semibold text-white leading-tight group-hover:text-emerald-200 transition-colors truncate pr-1">{client.company_name}</p>
      {SATISFACTION_ICON[client.satisfaction_signal]}
    </div>
    <p className="text-[10px] text-slate-500 mb-2">{client.vertical}</p>
    <Badge className={`text-[9px] px-1.5 mb-2 ${URGENCY_CONFIG[client.lifecycle_urgency] || URGENCY_CONFIG.normal}`}>
      {client.lifecycle_urgency || 'normal'}
    </Badge>
    <ProgressBar value={client.onboarding_completion} color={client.onboarding_completion >= 80 ? 'bg-emerald-500' : client.onboarding_completion >= 40 ? 'bg-blue-500' : 'bg-amber-500'} />
    <div className="flex items-center justify-between mt-1.5">
      <span className="text-[10px] text-slate-500">Ob: {client.onboarding_completion || 0}%</span>
      <span className="text-[10px] text-cyan-400">Score: {client.content_output_score || 0}</span>
    </div>
  </div>
);

export default function CLEPipelineBoard({ clients = [], onClientUpdate }) {
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [selected, setSelected] = useState(null);

  const byStage = STAGES.reduce((acc, s) => {
    acc[s.key] = clients.filter(c => (c.stage || 'deal_closed') === s.key);
    return acc;
  }, {});

  const handleDrop = async (stageKey) => {
    if (!dragging || dragging.stage === stageKey) { setDragging(null); setDragOver(null); return; }
    await base44.entities.ClientLifecycleStage.update(dragging.id, { stage: stageKey }).catch(() => {});
    onClientUpdate?.();
    setDragging(null); setDragOver(null);
  };

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Lifecycle Pipeline Board</h2>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3 min-w-max">
          {STAGES.map(stage => {
            const stageClients = byStage[stage.key] || [];
            return (
              <div key={stage.key}
                className={`w-44 flex-shrink-0 rounded-xl border ${stage.color} ${dragOver === stage.key ? 'ring-2 ring-emerald-500' : ''} transition-all`}
                onDragOver={e => { e.preventDefault(); setDragOver(stage.key); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => handleDrop(stage.key)}>
                <div className={`${stage.bg} rounded-t-xl px-3 py-2 border-b ${stage.color}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stage.dot}`} />
                    <p className="text-xs font-semibold text-slate-300 truncate">{stage.label}</p>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-0.5 ml-4">{stageClients.length} clients</p>
                </div>
                <div className="p-2 space-y-2 min-h-[100px] max-h-[400px] overflow-y-auto">
                  {stageClients.map((client, i) => (
                    <ClientCard key={client.id || i} client={client}
                      onClick={() => setSelected(client)}
                      onDragStart={() => setDragging(client)} />
                  ))}
                  {stageClients.length === 0 && (
                    <div className="flex items-center justify-center h-10 text-[10px] text-slate-700 border border-dashed border-slate-700 rounded-lg">Drop here</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {selected && <ClientModal client={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
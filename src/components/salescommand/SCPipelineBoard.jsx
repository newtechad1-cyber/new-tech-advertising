import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, ThermometerSun, Snowflake, X, Phone, DollarSign, FileText, Star, User, Building2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STAGES = [
  { key: 'new_lead', label: 'New Lead', color: 'border-slate-600', bg: 'bg-slate-800/30' },
  { key: 'contacted', label: 'Contacted', color: 'border-blue-700/50', bg: 'bg-blue-950/10' },
  { key: 'demo_scheduled', label: 'Demo Sched.', color: 'border-violet-700/50', bg: 'bg-violet-950/10' },
  { key: 'demo_completed', label: 'Demo Done', color: 'border-cyan-700/50', bg: 'bg-cyan-950/10' },
  { key: 'proposal_sent', label: 'Proposal Sent', color: 'border-amber-700/50', bg: 'bg-amber-950/10' },
  { key: 'negotiation', label: 'Negotiation', color: 'border-orange-700/50', bg: 'bg-orange-950/10' },
  { key: 'closed_won', label: 'Closed Won', color: 'border-emerald-700/50', bg: 'bg-emerald-950/10' },
  { key: 'closed_lost', label: 'Closed Lost', color: 'border-red-700/50', bg: 'bg-red-950/10' },
];

const URGENCY_ICONS = {
  hot: <Flame className="w-3 h-3 text-red-400" />,
  warm: <ThermometerSun className="w-3 h-3 text-amber-400" />,
  cold: <Snowflake className="w-3 h-3 text-blue-400" />,
};

const VERTICAL_COLORS = {
  'HVAC': 'bg-blue-950 text-blue-300',
  'Restaurant': 'bg-orange-950 text-orange-300',
  'Home Services': 'bg-emerald-950 text-emerald-300',
  'Roofing': 'bg-slate-700 text-slate-300',
  'Dental': 'bg-cyan-950 text-cyan-300',
  'Legal': 'bg-violet-950 text-violet-300',
  'MedSpa': 'bg-pink-950 text-pink-300',
};

const DealCard = ({ deal, onClick, onDragStart }) => (
  <div
    draggable
    onDragStart={onDragStart}
    onClick={onClick}
    className="bg-slate-800 border border-slate-700 rounded-lg p-3 cursor-pointer hover:border-slate-500 hover:bg-slate-750 transition-all group select-none"
  >
    <div className="flex items-start justify-between mb-2">
      <p className="text-xs font-semibold text-white leading-tight group-hover:text-violet-200 transition-colors">{deal.company_name}</p>
      {URGENCY_ICONS[deal.urgency] || URGENCY_ICONS.warm}
    </div>
    <Badge className={`text-[9px] px-1.5 mb-2 ${VERTICAL_COLORS[deal.vertical] || 'bg-slate-700 text-slate-300'}`}>
      {deal.vertical}
    </Badge>
    <div className="flex items-center justify-between mt-2">
      <span className="text-xs font-bold text-emerald-300">${((deal.deal_value || 0) / 1000).toFixed(0)}k</span>
      <span className="text-[10px] text-slate-500">{deal.close_probability}%</span>
    </div>
    <p className="text-[10px] text-slate-500 mt-1">{deal.assigned_rep}</p>
  </div>
);

const DealModal = ({ deal, onClose, onSave }) => {
  const [note, setNote] = useState('');
  const [priority, setPriority] = useState(deal.urgency === 'hot');

  const handleAction = async (action) => {
    if (action === 'priority') {
      setPriority(true);
      await base44.entities.RevenueDeal.update(deal.id, { urgency: 'hot' }).catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-sm font-bold text-white">
              {deal.company_name?.[0]}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{deal.company_name}</h2>
              <p className="text-xs text-slate-400">{deal.vertical} · {deal.assigned_rep}</p>
            </div>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-500 hover:text-white" /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Key metrics */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Deal Value', value: `$${((deal.deal_value || 0) / 1000).toFixed(1)}k`, color: 'text-emerald-300' },
              { label: 'Win Prob.', value: `${deal.close_probability || 0}%`, color: deal.close_probability >= 70 ? 'text-emerald-300' : deal.close_probability >= 40 ? 'text-amber-300' : 'text-red-300' },
              { label: 'Stage', value: deal.stage?.replace(/_/g, ' ') || '—', color: 'text-blue-300' },
              { label: 'Urgency', value: deal.urgency || 'warm', color: deal.urgency === 'hot' ? 'text-red-300' : deal.urgency === 'cold' ? 'text-blue-300' : 'text-amber-300' },
            ].map(m => (
              <div key={m.label} className="bg-slate-800 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-500 mb-1">{m.label}</p>
                <p className={`text-sm font-bold capitalize ${m.color}`}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* AI Win Probability */}
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-300">AI Win Probability Score</p>
              <Badge className={`text-xs ${deal.close_probability >= 70 ? 'bg-emerald-950 text-emerald-300' : deal.close_probability >= 40 ? 'bg-amber-950 text-amber-300' : 'bg-red-950 text-red-300'}`}>
                {deal.close_probability >= 70 ? 'High Confidence' : deal.close_probability >= 40 ? 'Moderate' : 'Low Confidence'}
              </Badge>
            </div>
            <div className="h-2 bg-slate-700 rounded-full">
              <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-emerald-500 transition-all"
                style={{ width: `${deal.close_probability || 0}%` }} />
            </div>
          </div>

          {/* Upsell signal */}
          {deal.deal_type === 'upsell' && (
            <div className="bg-amber-950/30 border border-amber-700/40 rounded-xl p-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              <p className="text-xs text-amber-300">Upsell opportunity detected — high expansion potential</p>
            </div>
          )}

          {/* Notes */}
          {deal.notes && (
            <div className="bg-slate-800 rounded-xl p-3">
              <p className="text-xs text-slate-500 mb-1">Notes</p>
              <p className="text-xs text-slate-300">{deal.notes}</p>
            </div>
          )}

          {/* Quick note */}
          <div>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Record call summary or notes..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-slate-300 placeholder:text-slate-600 resize-none focus:outline-none focus:border-violet-500 h-20"
            />
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: 'Log Call', icon: Phone, action: 'call', color: 'text-blue-400 border-blue-700/50 hover:bg-blue-950/30' },
              { label: 'Adjust Price', icon: DollarSign, action: 'price', color: 'text-emerald-400 border-emerald-700/50 hover:bg-emerald-950/30' },
              { label: 'Send Proposal', icon: FileText, action: 'proposal', color: 'text-amber-400 border-amber-700/50 hover:bg-amber-950/30' },
              { label: 'High Priority', icon: Star, action: 'priority', color: 'text-red-400 border-red-700/50 hover:bg-red-950/30' },
            ].map(a => (
              <button key={a.label} onClick={() => handleAction(a.action)}
                className={`flex items-center justify-center gap-2 p-2 rounded-xl border bg-transparent transition-colors text-xs font-medium ${a.color}`}>
                <a.icon className="w-3.5 h-3.5" />{a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SCPipelineBoard({ deals = [], onDealUpdate }) {
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [selectedDeal, setSelectedDeal] = useState(null);

  const dealsByStage = STAGES.reduce((acc, s) => {
    acc[s.key] = deals.filter(d => (d.stage || 'new_lead') === s.key);
    return acc;
  }, {});

  const handleDrop = async (stageKey) => {
    if (!dragging || dragging.stage === stageKey) { setDragging(null); setDragOver(null); return; }
    try {
      await base44.entities.RevenueDeal.update(dragging.id, { stage: stageKey });
      onDealUpdate?.();
    } catch (e) { console.warn(e); }
    setDragging(null);
    setDragOver(null);
  };

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Visual Pipeline Board</h2>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3 min-w-max">
          {STAGES.map(stage => {
            const stageDeals = dealsByStage[stage.key] || [];
            const stageValue = stageDeals.reduce((s, d) => s + (d.deal_value || 0), 0);
            return (
              <div key={stage.key}
                className={`w-44 flex-shrink-0 rounded-xl border ${stage.color} ${dragOver === stage.key ? 'ring-2 ring-violet-500' : ''} transition-all`}
                onDragOver={e => { e.preventDefault(); setDragOver(stage.key); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => handleDrop(stage.key)}
              >
                {/* Column header */}
                <div className={`${stage.bg} rounded-t-xl px-3 py-2 border-b ${stage.color}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-300">{stage.label}</p>
                    <span className="text-xs text-slate-500 bg-slate-900/50 rounded-full px-2">{stageDeals.length}</span>
                  </div>
                  {stageValue > 0 && (
                    <p className="text-[10px] text-slate-500 mt-0.5">${(stageValue / 1000).toFixed(0)}k</p>
                  )}
                </div>

                {/* Cards */}
                <div className="p-2 space-y-2 min-h-[120px] max-h-[420px] overflow-y-auto">
                  {stageDeals.map((deal, i) => (
                    <DealCard key={deal.id || i} deal={deal}
                      onClick={() => setSelectedDeal(deal)}
                      onDragStart={() => setDragging(deal)}
                    />
                  ))}
                  {stageDeals.length === 0 && (
                    <div className="flex items-center justify-center h-12 text-[10px] text-slate-700 border border-dashed border-slate-700 rounded-lg">
                      Drop here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedDeal && (
        <DealModal deal={selectedDeal} onClose={() => setSelectedDeal(null)} />
      )}
    </div>
  );
}
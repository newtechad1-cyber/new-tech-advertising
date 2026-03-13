import React from 'react';
import { Building2, MapPin, DollarSign, Tag, ArrowRight, ExternalLink, FileText, CheckSquare, Calendar, Play } from 'lucide-react';

const STAGE_LABELS = {
  new_lead: 'New Lead', contacted: 'Contacted', discovery: 'Discovery',
  demo_scheduled: 'Demo Scheduled', demo_completed: 'Demo Completed',
  proposal_sent: 'Proposal Sent', verbal_yes: 'Verbal Yes',
  closed_won: 'Closed Won', closed_lost: 'Closed Lost',
};

const STAGE_COLORS = {
  demo_scheduled: '#f59e0b', demo_completed: '#fb923c', proposal_sent: '#c084fc',
  verbal_yes: '#34d399', closed_won: '#10b981', new_lead: '#94a3b8',
  contacted: '#60a5fa', discovery: '#818cf8', closed_lost: '#ef4444',
};

const fmt = (n) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n || 0}`;

export default function DemoHeader({ opportunity, onAction, demoActive, setDemoActive }) {
  if (!opportunity) return null;
  const stageColor = STAGE_COLORS[opportunity.stage] || '#94a3b8';

  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 px-6 py-5">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        {/* Company info */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold tracking-tight">{opportunity.company_name}</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-slate-400 flex-wrap">
              {opportunity.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{opportunity.city}</span>}
              {opportunity.industry && <span className="flex items-center gap-1 capitalize"><Tag className="w-3 h-3" />{opportunity.industry.replace('_', ' ')}</span>}
              <span className="flex items-center gap-1 text-white font-semibold"><DollarSign className="w-3 h-3 text-green-400" />{fmt(opportunity.deal_value)}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: `${stageColor}22`, color: stageColor }}>
                {STAGE_LABELS[opportunity.stage]}
              </span>
            </div>
          </div>
        </div>

        {/* Primary actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setDemoActive(s => !s)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
              demoActive
                ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/40 shadow-lg'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40 shadow-lg'
            }`}
          >
            <Play className="w-4 h-4" />
            {demoActive ? 'Demo Running' : 'Start Guided Demo'}
          </button>
          <button onClick={() => onAction('deal_room')} className="flex items-center gap-2 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition-colors">
            <ExternalLink className="w-4 h-4" /> Deal Room
          </button>
          <button onClick={() => onAction('generate_proposal')} className="flex items-center gap-2 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition-colors">
            <FileText className="w-4 h-4" /> Proposal
          </button>
          <button onClick={() => onAction('log_outcome')} className="flex items-center gap-2 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition-colors">
            <CheckSquare className="w-4 h-4" /> Log Outcome
          </button>
          <button onClick={() => onAction('schedule_followup')} className="flex items-center gap-2 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition-colors">
            <Calendar className="w-4 h-4" /> Follow-Up
          </button>
        </div>
      </div>
    </div>
  );
}
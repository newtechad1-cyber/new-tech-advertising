import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import { RefreshCw, ChevronRight, AlertTriangle, Clock, Plus } from 'lucide-react';

const GROUPS = [
  { key: 'new',        label: 'New Leads',        stages: ['new_lead'],                              color: 'border-slate-700 bg-slate-900' },
  { key: 'audit',      label: 'Needs Audit',       stages: ['audit_pending'],                         color: 'border-amber-800 bg-amber-950/20' },
  { key: 'audit_rdy',  label: 'Audit Ready',       stages: ['audit_ready'],                           color: 'border-yellow-800 bg-yellow-950/20' },
  { key: 'outreach',   label: 'Outreach Ready',    stages: ['outreach_ready'],                        color: 'border-blue-800 bg-blue-950/20' },
  { key: 'followup',   label: 'Follow-Up',         stages: ['outreach_sent', 'followup_in_progress'], color: 'border-violet-800 bg-violet-950/20' },
  { key: 'closing',    label: 'Closing',           stages: ['demo_scheduled', 'proposal_sent'],       color: 'border-teal-800 bg-teal-950/20' },
  { key: 'done',       label: 'Won / Lost',        stages: ['closed_won', 'closed_lost'],             color: 'border-emerald-800 bg-emerald-950/20' },
];

const NEXT_ACTION = {
  new_lead:             'Start Audit',
  audit_pending:        'Generate Audit',
  audit_ready:          'Approve Audit',
  outreach_ready:       'Send Outreach',
  outreach_sent:        'Start Follow-Up',
  followup_in_progress: 'Follow Up',
  demo_scheduled:       'Mark Demo Done',
  proposal_sent:        'Close Deal',
  closed_won:           '✓ Won',
  closed_lost:          '✗ Lost',
};

const PRIORITY_COLORS = {
  urgent: 'text-red-400 bg-red-900/30',
  high:   'text-orange-400 bg-orange-900/30',
  medium: 'text-blue-400 bg-blue-900/30',
  low:    'text-slate-400 bg-slate-800',
};

function fmt(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isOverdue(due) {
  if (!due) return false;
  return new Date(due) < new Date();
}

export default function LeadWizardList() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.LeadWorkflow.list('-created_date', 300);
      setWorkflows(data);
    } finally {
      setLoading(false);
    }
  };

  const active = workflows.filter(w => !['closed_won', 'closed_lost'].includes(w.current_stage)).length;
  const won    = workflows.filter(w => w.current_stage === 'closed_won').length;
  const overdue = workflows.filter(w => w.due_date && isOverdue(w.due_date) && !['closed_won','closed_lost'].includes(w.current_stage)).length;

  return (
    <AgencyLayout>
      <div className="p-6 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Lead Wizard</h1>
            <p className="text-slate-500 text-sm mt-0.5">Guided workflow from lead to close</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-blue-400">{active}</p>
            <p className="text-slate-500 text-xs mt-0.5">Active</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-amber-400">{overdue}</p>
            <p className="text-slate-500 text-xs mt-0.5">Overdue</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-emerald-400">{won}</p>
            <p className="text-slate-500 text-xs mt-0.5">Won</p>
          </div>
        </div>

        {loading && <div className="text-center py-16 text-slate-500">Loading workflows...</div>}

        {!loading && workflows.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <p className="text-slate-400 font-medium mb-2">No lead workflows yet.</p>
            <p className="text-slate-600 text-sm">Workflows are created automatically from new Submissions or Opportunities, or from the NTA pipeline.</p>
          </div>
        )}

        {!loading && GROUPS.map(group => {
          const items = workflows.filter(w => group.stages.includes(w.current_stage));
          if (items.length === 0) return null;
          return (
            <div key={group.key}>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wide">{group.label}</h2>
                <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map(wf => (
                  <LeadCard key={wf.id} wf={wf} group={group} />
                ))}
              </div>
            </div>
          );
        })}

      </div>
    </AgencyLayout>
  );
}

function LeadCard({ wf, group }) {
  const action  = NEXT_ACTION[wf.current_stage] || 'Continue';
  const overdue = isOverdue(wf.due_date);
  const isWon   = wf.current_stage === 'closed_won';
  const isLost  = wf.current_stage === 'closed_lost';

  return (
    <Link to={`/agency/lead-wizard/${wf.id}`}
      className={`flex items-center justify-between gap-4 border rounded-xl px-4 py-3 hover:border-blue-700 transition-colors group ${group.color}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-white text-sm truncate">{wf.company_name || wf.title}</p>
          {wf.priority && wf.priority !== 'medium' && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PRIORITY_COLORS[wf.priority]}`}>{wf.priority}</span>
          )}
          {overdue && !isWon && !isLost && (
            <span className="flex items-center gap-1 text-xs text-red-400"><AlertTriangle className="w-3 h-3" />Overdue</span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          {wf.lead_source && <span className="text-xs text-slate-500">{wf.lead_source}</span>}
          {wf.due_date && (
            <span className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-400' : 'text-slate-500'}`}>
              <Clock className="w-3 h-3" />{fmt(wf.due_date)}
            </span>
          )}
          {wf.deal_value && (
            <span className="text-xs text-emerald-400">${wf.deal_value?.toLocaleString()}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
          isWon  ? 'bg-emerald-600 border-emerald-500 text-white' :
          isLost ? 'bg-slate-700 border-slate-600 text-slate-400' :
          'bg-blue-900/30 text-blue-400 border-blue-800 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600'
        }`}>
          {action}
        </span>
        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
      </div>
    </Link>
  );
}
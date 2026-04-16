import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import { RefreshCw, ChevronRight, AlertTriangle, Clock } from 'lucide-react';

const STAGE_GROUPS = [
  { key: 'script_needed',     label: 'Script Needed',      stages: ['topic_created'],           color: 'border-slate-700 bg-slate-900' },
  { key: 'script_review',     label: 'Script Review',      stages: ['script_ready'],             color: 'border-amber-800 bg-amber-950/30' },
  { key: 'heygen_ready',      label: 'Ready for HeyGen',   stages: ['script_approved'],          color: 'border-blue-800 bg-blue-950/30' },
  { key: 'video_ready',       label: 'Video Ready',        stages: ['heygen_pending','video_ready'], color: 'border-purple-800 bg-purple-950/30' },
  { key: 'caption_needed',    label: 'Needs Caption',      stages: ['video_ready'],              color: 'border-violet-800 bg-violet-950/30' },
  { key: 'ready_to_post',     label: 'Ready to Post',      stages: ['caption_ready','approved_for_posting'], color: 'border-teal-800 bg-teal-950/30' },
  { key: 'published',         label: 'Published',          stages: ['scheduled','published'],    color: 'border-emerald-800 bg-emerald-950/30' },
];

// Fix: video_ready appears in two groups intentionally for display grouping
const STAGE_TO_ACTION = {
  topic_created:        'Generate Script',
  script_ready:         'Review Script',
  script_approved:      'Send to HeyGen',
  heygen_pending:       'Enter Video URL',
  video_ready:          'Generate Caption',
  caption_ready:        'Approve for Posting',
  approved_for_posting: 'Schedule / Post',
  scheduled:            'Mark as Posted',
  published:            '✓ Complete',
};

const PRIORITY_COLORS = {
  urgent: 'text-red-400 bg-red-900/30',
  high: 'text-orange-400 bg-orange-900/30',
  medium: 'text-blue-400 bg-blue-900/30',
  low: 'text-slate-400 bg-slate-800',
};

function fmt(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isOverdue(due) {
  if (!due) return false;
  return new Date(due) < new Date();
}

export default function ContentWizardList() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientFilter, setClientFilter] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const wf = await base44.entities.ContentWorkflow.list('-created_date', 200);
      setWorkflows(wf);
    } finally {
      setLoading(false);
    }
  };

  const filtered = clientFilter
    ? workflows.filter(w => w.client === clientFilter || w.client_id === clientFilter)
    : workflows;

  const clientNames = [...new Set(workflows.map(w => w.client).filter(Boolean))];

  const totalActive = filtered.filter(w => w.current_stage !== 'published').length;
  const totalPublished = filtered.filter(w => w.current_stage === 'published').length;

  return (
    <AgencyLayout>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Content Wizard</h1>
            <p className="text-slate-500 text-sm mt-0.5">Step-by-step production pipeline</p>
          </div>
          <div className="flex items-center gap-2">
            <select value={clientFilter} onChange={e => setClientFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white appearance-none focus:outline-none">
              <option value="">All Clients</option>
              {clientNames.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-blue-400">{totalActive}</p>
            <p className="text-slate-500 text-xs mt-0.5">In Progress</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-amber-400">
              {filtered.filter(w => w.due_date && isOverdue(w.due_date) && w.current_stage !== 'published').length}
            </p>
            <p className="text-slate-500 text-xs mt-0.5">Overdue</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-emerald-400">{totalPublished}</p>
            <p className="text-slate-500 text-xs mt-0.5">Published</p>
          </div>
        </div>

        {loading && (
          <div className="text-center py-16 text-slate-500">Loading workflows...</div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <p className="text-slate-400 font-medium">No workflows yet.</p>
            <p className="text-slate-600 text-sm mt-1">Create a content topic on the <Link to="/agency/content" className="text-blue-400 hover:underline">Content Center</Link> to get started.</p>
          </div>
        )}

        {!loading && STAGE_GROUPS.map(group => {
          const items = filtered.filter(w => group.stages.includes(w.current_stage));
          if (items.length === 0) return null;
          return (
            <div key={group.key}>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wide">{group.label}</h2>
                <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map(wf => (
                  <WizardCard key={wf.id} wf={wf} group={group} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AgencyLayout>
  );
}

function WizardCard({ wf, group }) {
  const action = STAGE_TO_ACTION[wf.current_stage] || 'Continue';
  const overdue = isOverdue(wf.due_date);

  return (
    <Link to={`/agency/content-wizard/${wf.id}`}
      className={`flex items-center justify-between gap-4 border rounded-xl px-4 py-3 hover:border-blue-700 transition-colors group ${group.color}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-white text-sm truncate">{wf.title}</p>
          {wf.priority && wf.priority !== 'medium' && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PRIORITY_COLORS[wf.priority]}`}>{wf.priority}</span>
          )}
          {overdue && <span className="flex items-center gap-1 text-xs text-red-400"><AlertTriangle className="w-3 h-3" />Overdue</span>}
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-xs text-slate-500">{wf.client || '—'}</span>
          {wf.due_date && (
            <span className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-400' : 'text-slate-500'}`}>
              <Clock className="w-3 h-3" />{fmt(wf.due_date)}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-xs font-semibold text-blue-400 bg-blue-900/30 px-3 py-1.5 rounded-lg border border-blue-800 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
          {action}
        </span>
        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
      </div>
    </Link>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Circle, ArrowRight, AlertTriangle } from 'lucide-react';

const STEP_KEYS = [
  { key: 'intake_form_completed',       label: 'Business Basics' },
  { key: 'services_defined',            label: 'Services' },
  { key: 'website_info_completed',      label: 'Website/Brand' },
  { key: 'channels_connected',          label: 'Channels' },
  { key: 'approval_settings_completed', label: 'Approvals' },
  { key: 'client_portal_ready',         label: 'Portal' },
  { key: 'campaign_defaults_completed', label: 'Campaigns' },
  { key: 'content_settings_completed',  label: 'Content' },
  { key: 'kickoff_notes_completed',     label: 'Kickoff' },
];

const STATUS_COLORS = {
  'Completed':        'bg-emerald-900/50 text-emerald-300',
  'Ready for Kickoff':'bg-teal-900/50 text-teal-300',
  'In Progress':      'bg-blue-900/50 text-blue-300',
  'Waiting on Client':'bg-amber-900/50 text-amber-300',
  'Blocked':          'bg-red-900/50 text-red-300',
  'Not Started':      'bg-slate-800 text-slate-500',
};

export default function ClientSetupStatusCard({ clientId, setup, inferredStatus = {} }) {
  if (!setup && !clientId) return null;

  const merged = { ...inferredStatus, ...(setup || {}) };
  const done = STEP_KEYS.filter(s => merged[s.key]).length;
  const pct = setup?.percent_complete ?? Math.round((done / STEP_KEYS.length) * 100);
  const status = setup?.setup_status || (done === 0 ? 'Not Started' : done === STEP_KEYS.length ? 'Completed' : 'In Progress');
  const missing = STEP_KEYS.filter(s => !merged[s.key]).map(s => s.label);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Setup Status</p>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[status] || 'bg-slate-800 text-slate-500'}`}>{status}</span>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-black ${pct >= 80 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{pct}%</p>
          <p className="text-xs text-slate-600">{done}/{STEP_KEYS.length} steps</p>
        </div>
      </div>

      <div className="w-full bg-slate-800 rounded-full h-1.5 mb-4">
        <div className={`h-1.5 rounded-full transition-all ${pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-blue-500'}`}
          style={{ width: `${pct}%` }} />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {STEP_KEYS.map(s => (
          <span key={s.key} className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${merged[s.key] ? 'bg-emerald-900/40 text-emerald-400' : 'bg-slate-800 text-slate-600'}`}>
            {merged[s.key] ? <CheckCircle className="w-2.5 h-2.5" /> : <Circle className="w-2.5 h-2.5" />}
            {s.label}
          </span>
        ))}
      </div>

      {missing.length > 0 && missing.length < STEP_KEYS.length && (
        <div className="flex items-start gap-2 text-xs text-amber-400 bg-amber-950/20 border border-amber-900/30 rounded-lg px-3 py-2 mb-3">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>Missing: {missing.join(', ')}</span>
        </div>
      )}

      <Link to={`/agency/clients/${clientId}/setup`}
        className="flex items-center justify-between w-full px-4 py-2.5 bg-blue-700 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors">
        <span>{done === 0 ? 'Start Setup Wizard' : done === STEP_KEYS.length ? 'View Setup Summary' : 'Continue Setup'}</span>
        <ArrowRight className="w-4 h-4" />
      </Link>

      {setup?.assigned_owner && (
        <p className="text-xs text-slate-600 mt-2 text-center">Owner: {setup.assigned_owner}</p>
      )}
    </div>
  );
}
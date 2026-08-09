import { useEffect, useMemo, useState } from 'react';
import OpsLayout from '@/components/ops-dashboard/OpsLayout';
import { base44 } from '@/api/base44Client';
import {
  CalendarClock, Globe, Mail, MapPin, Phone, Plus, RefreshCw,
  Search, X
} from 'lucide-react';

const CLOSED_STATUSES = new Set(['closed_won', 'closed_lost', 'no_response']);

const STATUS_OPTIONS = [
  'new',
  'contacted',
  'replied',
  'audit_requested',
  'audit_sent',
  'interested',
  'proposal_sent',
  'closed_won',
  'closed_lost',
  'no_response'
];

const STATUS_COLORS = {
  new: 'bg-blue-900/40 text-blue-300',
  contacted: 'bg-amber-900/40 text-amber-300',
  replied: 'bg-cyan-900/40 text-cyan-300',
  audit_requested: 'bg-purple-900/40 text-purple-300',
  audit_sent: 'bg-violet-900/40 text-violet-300',
  interested: 'bg-emerald-900/40 text-emerald-300',
  proposal_sent: 'bg-indigo-900/40 text-indigo-300',
  closed_won: 'bg-green-900/40 text-green-300',
  closed_lost: 'bg-red-900/40 text-red-300',
  no_response: 'bg-slate-800 text-slate-500'
};

const EMPTY_FORM = {
  business_name: '',
  contact_name: '',
  email: '',
  phone: '',
  website: '',
  industry: '',
  city: '',
  state: 'IA',
  status: 'new',
  priority: 'medium',
  next_follow_up: '',
  notes: ''
};

const safe = (request, fallback = []) => request.catch(() => fallback);

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const todayKey = () => new Date().toISOString().slice(0, 10);

const isLocalDirectory = (prospect) =>
  String(prospect.notes || '').toLowerCase().startsWith('local directory research');

function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[status] || 'bg-slate-800 text-slate-400'}`}>
      {String(status || 'new').replaceAll('_', ' ')}
    </span>
  );
}

function ProspectModal({ prospect, onSaved, onClose }) {
  const [form, setForm] = useState(prospect ? { ...EMPTY_FORM, ...prospect } : EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const set = (key, value) => setForm(previous => ({ ...previous, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.business_name.trim()) return;
    setSaving(true);
    const payload = {
      ...form,
      business_name: form.business_name.trim(),
      archived: false
    };
    if (prospect?.id) {
      await base44.entities.SalesLead.update(prospect.id, payload);
    } else {
      await base44.entities.SalesLead.create(payload);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">SalesLead record</p>
            <h2 className="mt-1 text-lg font-bold text-white">{prospect ? 'Edit prospect' : 'Add prospect'}</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['business_name', 'Business name *'],
              ['contact_name', 'Contact name'],
              ['email', 'Email'],
              ['phone', 'Phone'],
              ['website', 'Website'],
              ['industry', 'Industry'],
              ['city', 'City'],
              ['state', 'State']
            ].map(([key, label]) => (
              <label key={key} className="block">
                <span className="mb-1 block text-xs text-slate-400">{label}</span>
                <input
                  required={key === 'business_name'}
                  value={form[key] || ''}
                  onChange={event => set(key, event.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                />
              </label>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-xs text-slate-400">Status</span>
              <select value={form.status || 'new'} onChange={event => set('status', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white">
                {STATUS_OPTIONS.map(status => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-slate-400">Priority</span>
              <select value={form.priority || 'medium'} onChange={event => set('priority', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white">
                {['low', 'medium', 'high'].map(priority => <option key={priority} value={priority}>{priority}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-slate-400">Next follow-up</span>
              <input type="date" value={form.next_follow_up || ''} onChange={event => set('next_follow_up', event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs text-slate-400">Notes</span>
            <textarea value={form.notes || ''} onChange={event => set('notes', event.target.value)} rows={4} className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
          </label>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-slate-700 py-2 text-sm text-slate-400 hover:bg-slate-800">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-cyan-600 py-2 text-sm font-bold text-white hover:bg-cyan-500 disabled:opacity-50">
              {saving ? 'Saving…' : 'Save prospect'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OpsProspects() {
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('active');
  const [statusFilter, setStatusFilter] = useState('all');
  const [scopeFilter, setScopeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await safe(base44.entities.SalesLead.list('-updated_date', 500));
    setProspects(data.filter(prospect => prospect.archived !== true));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const activeProspects = useMemo(
    () => prospects.filter(prospect => !CLOSED_STATUSES.has(prospect.status)),
    [prospects]
  );

  const dueCount = useMemo(() => {
    const today = todayKey();
    return activeProspects.filter(prospect => prospect.next_follow_up && String(prospect.next_follow_up).slice(0, 10) <= today).length;
  }, [activeProspects]);

  const localCount = activeProspects.filter(isLocalDirectory).length;
  const newCount = activeProspects.filter(prospect => prospect.status === 'new').length;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return prospects.filter(prospect => {
      const isClosed = CLOSED_STATUSES.has(prospect.status);
      const matchesView = view === 'all' || (view === 'active' ? !isClosed : isClosed);
      const matchesStatus = statusFilter === 'all' || prospect.status === statusFilter;
      const matchesScope = scopeFilter === 'all' ||
        (scopeFilter === 'local' ? isLocalDirectory(prospect) : !isLocalDirectory(prospect));
      const matchesPriority = priorityFilter === 'all' || prospect.priority === priorityFilter;
      const haystack = [
        prospect.business_name,
        prospect.contact_name,
        prospect.email,
        prospect.phone,
        prospect.city,
        prospect.state,
        prospect.industry
      ].join(' ').toLowerCase();
      return matchesView && matchesStatus && matchesScope && matchesPriority && (!query || haystack.includes(query));
    });
  }, [prospects, search, view, statusFilter, scopeFilter, priorityFilter]);

  return (
    <OpsLayout>
      <div className="mx-auto max-w-6xl space-y-5 p-4 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Sales workspace</p>
            <h1 className="mt-1 text-2xl font-black text-white">Prospects</h1>
            <p className="mt-1 text-sm text-slate-500">The cleaned, active prospect list used by the daily dashboard.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} disabled={loading} className="rounded-xl border border-slate-700 p-2.5 text-slate-400 hover:border-slate-500 hover:text-white disabled:opacity-40">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => setModal({})} className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-cyan-500">
              <Plus className="h-4 w-4" /> Add prospect
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ['Active prospects', activeProspects.length, 'text-cyan-300'],
            ['Local list', localCount, 'text-blue-300'],
            ['New / untouched', newCount, 'text-violet-300'],
            ['Follow-ups due', dueCount, dueCount ? 'text-red-300' : 'text-emerald-300']
          ].map(([label, value, color]) => (
            <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              <p className="mt-1 text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-cyan-900/50 bg-cyan-950/20 p-4 text-sm text-cyan-100">
          This is now the working list for real prospecting. The old demo/sample records are excluded, and the local directory businesses are separate searchable records.
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search business, city, industry…" className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-cyan-500" />
          </div>
          <select value={view} onChange={event => setView(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white">
            <option value="active">Active only</option>
            <option value="all">All records</option>
            <option value="closed">Closed / archived outcome</option>
          </select>
          <select value={scopeFilter} onChange={event => setScopeFilter(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white">
            <option value="all">All sources</option>
            <option value="local">Local directory</option>
            <option value="other">Other sources</option>
          </select>
          <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white">
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map(status => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}
          </select>
          <select value={priorityFilter} onChange={event => setPriorityFilter(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white">
            <option value="all">All priorities</option>
            {['high', 'medium', 'low'].map(priority => <option key={priority} value={priority}>{priority} priority</option>)}
          </select>
        </div>

        {loading ? (
          <div className="space-y-2">{[...Array(6)].map((_, index) => <div key={index} className="h-20 animate-pulse rounded-xl bg-slate-900" />)}</div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="hidden grid-cols-[minmax(0,1.4fr)_minmax(130px,0.8fr)_minmax(120px,0.7fr)_auto] gap-4 border-b border-slate-800 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 md:grid">
              <span>Business</span><span>Location / type</span><span>Next step</span><span />
            </div>
            {filtered.map(prospect => (
              <div key={prospect.id} className="grid gap-3 border-b border-slate-800/80 px-4 py-4 last:border-b-0 md:grid-cols-[minmax(0,1.4fr)_minmax(130px,0.8fr)_minmax(120px,0.7fr)_auto] md:items-center md:gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <button onClick={() => setModal(prospect)} className="truncate text-left text-sm font-bold text-white hover:text-cyan-300">{prospect.business_name || 'Unnamed business'}</button>
                    <StatusBadge status={prospect.status} />
                    {isLocalDirectory(prospect) && <span className="rounded-full bg-cyan-900/40 px-2 py-0.5 text-xs font-semibold text-cyan-300">local list</span>}
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-500">{prospect.contact_name || 'No contact name'}{prospect.email ? ` · ${prospect.email}` : ''}</p>
                </div>
                <div className="text-xs text-slate-400">
                  <p className="flex items-center gap-1">{prospect.city ? <MapPin className="h-3 w-3 text-slate-600" /> : null}{[prospect.city, prospect.state].filter(Boolean).join(', ') || 'Location not set'}</p>
                  <p className="mt-1 text-slate-500">{prospect.industry || 'Industry not set'} · <span className="capitalize">{prospect.priority || 'medium'} priority</span></p>
                </div>
                <div className="text-xs">
                  {prospect.next_follow_up ? (
                    <p className={`flex items-center gap-1 ${String(prospect.next_follow_up).slice(0, 10) <= todayKey() && !CLOSED_STATUSES.has(prospect.status) ? 'text-red-300' : 'text-slate-400'}`}>
                      <CalendarClock className="h-3 w-3" />{formatDate(prospect.next_follow_up)}
                    </p>
                  ) : <p className="text-slate-600">No follow-up set</p>}
                  <p className="mt-1 text-slate-600">Updated {formatDate(prospect.updated_date || prospect.created_date)}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {prospect.phone && <a href={`tel:${prospect.phone}`} aria-label={`Call ${prospect.business_name}`} className="rounded-lg bg-emerald-900/40 p-2 text-emerald-300 hover:bg-emerald-900/70"><Phone className="h-3.5 w-3.5" /></a>}
                  {prospect.email && <a href={`mailto:${prospect.email}`} aria-label={`Email ${prospect.business_name}`} className="rounded-lg bg-blue-900/40 p-2 text-blue-300 hover:bg-blue-900/70"><Mail className="h-3.5 w-3.5" /></a>}
                  {prospect.website && <a href={/^https?:\/\//i.test(prospect.website) ? prospect.website : `https://${prospect.website}`} target="_blank" rel="noreferrer" aria-label={`Open ${prospect.business_name} website`} className="rounded-lg bg-slate-800 p-2 text-slate-300 hover:bg-slate-700"><Globe className="h-3.5 w-3.5" /></a>}
                  <button onClick={() => setModal(prospect)} className="rounded-lg bg-slate-800 px-2.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700">Edit</button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="p-12 text-center text-sm text-slate-500">No prospects match these filters.</div>}
          </div>
        )}
      </div>

      {modal !== null && <ProspectModal prospect={modal?.id ? modal : null} onSaved={() => { setModal(null); load(); }} onClose={() => setModal(null)} />}
    </OpsLayout>
  );
}

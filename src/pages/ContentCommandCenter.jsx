import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, ChevronDown, AlertTriangle, CheckCircle, Clock, Zap, FileText, RefreshCw, X, Eye } from 'lucide-react';
import CRMLayout from '../components/crm-dashboard/CRMLayout';

const ASSET_OPTIONS = [
  { value: 'blog', label: 'Blog Article' },
  { value: 'landing_page', label: 'Landing Page' },
  { value: 'video_script', label: 'Video Script' },
  { value: 'social_series', label: 'Social Series' },
  { value: 'gbp_post', label: 'GBP Post' },
  { value: 'email', label: 'Email' },
];

const STATUS_COLORS = {
  idea: 'bg-slate-700 text-slate-300',
  queued: 'bg-blue-900 text-blue-300',
  processing: 'bg-amber-900 text-amber-300',
  ready_for_review: 'bg-violet-900 text-violet-300',
  published: 'bg-emerald-900 text-emerald-300',
  error: 'bg-red-900 text-red-300',
  pending: 'bg-slate-700 text-slate-300',
  completed: 'bg-emerald-900 text-emerald-300',
  failed: 'bg-red-900 text-red-300',
  draft: 'bg-slate-700 text-slate-300',
  approved: 'bg-teal-900 text-teal-300',
  open: 'bg-red-900 text-red-300',
  resolved: 'bg-emerald-900 text-emerald-300',
};

const TABS = ['intake', 'topics', 'jobs', 'review', 'published', 'errors'];
const TAB_LABELS = { intake: '➕ New Topic', topics: '📋 Topics', jobs: '⚙️ AI Jobs', review: '👁 Review', published: '✅ Published', errors: '🚨 Errors' };

export default function ContentCommandCenter() {
  const [tab, setTab] = useState('intake');
  const [clients, setClients] = useState([]);
  const [topics, setTopics] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [assets, setAssets] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [clientFilter, setClientFilter] = useState('');
  const [expandedAsset, setExpandedAsset] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '', client: '', primary_keyword: '', market: '',
    service_type: '', notes: '', priority: 'medium', requested_assets: [],
  });

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    const [c, t, j, a, al] = await Promise.all([
      base44.entities.AgencyClient.filter({ archived: false }),
      base44.entities.ContentTopics.list('-created_date', 100),
      base44.entities.AIJobs.list('-created_date', 200),
      base44.entities.ContentAssets.list('-created_date', 200),
      base44.entities.AutomationAlerts.filter({ status: 'open' }),
    ]);
    setClients(c);
    setTopics(t);
    setJobs(j);
    setAssets(a);
    setAlerts(al);
  };

  const toggleAsset = (val) => {
    setForm(p => ({
      ...p,
      requested_assets: p.requested_assets.includes(val)
        ? p.requested_assets.filter(a => a !== val)
        : [...p.requested_assets, val],
    }));
  };

  const submitTopic = async () => {
    if (!form.title.trim() || !form.client) return;
    setSubmitting(true);
    const topic = await base44.entities.ContentTopics.create({ ...form, status: 'idea' });
    setTopics(prev => [topic, ...prev]);
    // Trigger pipeline
    await base44.functions.invoke('onContentTopicCreated', { data: topic });
    setForm({ title: '', client: '', primary_keyword: '', market: '', service_type: '', notes: '', priority: 'medium', requested_assets: [] });
    setSubmitting(false);
    setTab('topics');
    setTimeout(loadAll, 2000);
  };

  const resolveAlert = async (id) => {
    await base44.entities.AutomationAlerts.update(id, { status: 'resolved' });
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const updateAssetStatus = async (id, status) => {
    await base44.entities.ContentAssets.update(id, { status });
    setAssets(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const filteredTopics = clientFilter ? topics.filter(t => t.client === clientFilter) : topics;
  const filteredJobs = clientFilter ? jobs.filter(j => j.client === clientFilter) : jobs;
  const reviewAssets = assets.filter(a => a.status === 'ready_for_review' && (!clientFilter || a.client === clientFilter));
  const publishedAssets = assets.filter(a => a.status === 'published' && (!clientFilter || a.client === clientFilter));
  const failedJobs = filteredJobs.filter(j => j.status === 'failed');

  const clientNames = [...new Set([...clients.map(c => c.name), ...topics.map(t => t.client)])].filter(Boolean);

  return (
    <CRMLayout>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Content Command Center</h1>
            <p className="text-slate-400 text-sm mt-0.5">AI content pipeline for all clients</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Client filter */}
            <div className="relative">
              <select value={clientFilter} onChange={e => setClientFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white appearance-none pr-8 focus:outline-none focus:border-blue-500">
                <option value="">All Clients</option>
                {clientNames.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
            <button onClick={loadAll} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Active Topics', value: topics.filter(t => !['published','error'].includes(t.status)).length, color: 'text-blue-400' },
            { label: 'Jobs Running', value: jobs.filter(j => j.status === 'processing').length, color: 'text-amber-400' },
            { label: 'Pending Jobs', value: jobs.filter(j => j.status === 'pending').length, color: 'text-slate-300' },
            { label: 'Ready for Review', value: reviewAssets.length, color: 'text-violet-400' },
            { label: 'Open Alerts', value: alerts.length, color: 'text-red-400' },
          ].map(s => (
            <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-slate-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 flex-wrap">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        {/* ── INTAKE TAB ── */}
        {tab === 'intake' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-2xl">
            <h2 className="text-sm font-bold text-white mb-5">New Content Topic</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Topic Title *">
                  <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Summer HVAC Maintenance Tips" className={inputCls} />
                </Field>
                <Field label="Client *">
                  <div className="relative">
                    <select value={form.client} onChange={e => setForm(p => ({ ...p, client: e.target.value }))} className={`${inputCls} pr-8 appearance-none`}>
                      <option value="">Select client...</option>
                      {clientNames.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </Field>
                <Field label="Primary Keyword">
                  <input value={form.primary_keyword} onChange={e => setForm(p => ({ ...p, primary_keyword: e.target.value }))}
                    placeholder="e.g. hvac repair mason city ia" className={inputCls} />
                </Field>
                <Field label="Market / City">
                  <input value={form.market} onChange={e => setForm(p => ({ ...p, market: e.target.value }))}
                    placeholder="e.g. Mason City, IA" className={inputCls} />
                </Field>
                <Field label="Service Type">
                  <input value={form.service_type} onChange={e => setForm(p => ({ ...p, service_type: e.target.value }))}
                    placeholder="e.g. AC Installation" className={inputCls} />
                </Field>
                <Field label="Priority">
                  <div className="relative">
                    <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} className={`${inputCls} pr-8 appearance-none`}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </Field>
              </div>
              <Field label="Notes">
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Any context, tone instructions, or special requirements..."
                  rows={3} className={inputCls} />
              </Field>
              <Field label="Requested Assets">
                <div className="flex flex-wrap gap-2 mt-1">
                  {ASSET_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => toggleAsset(opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${form.requested_assets.includes(opt.value) ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
            <button onClick={submitTopic} disabled={submitting || !form.title.trim() || !form.client}
              className="mt-5 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-colors">
              <Zap className="w-4 h-4" />
              {submitting ? 'Creating Pipeline...' : 'Create Content Pipeline'}
            </button>
          </div>
        )}

        {/* ── TOPICS TAB ── */}
        {tab === 'topics' && (
          <DataTable
            rows={filteredTopics}
            columns={[
              { label: 'Client', render: r => r.client },
              { label: 'Title', render: r => <span className="font-medium text-white">{r.title}</span> },
              { label: 'Keyword', render: r => <span className="text-slate-500 text-xs">{r.primary_keyword || '—'}</span> },
              { label: 'Status', render: r => <StatusBadge status={r.status} /> },
              { label: 'Assets', render: r => <span className="text-xs text-slate-400">{(r.requested_assets || []).join(', ')}</span> },
              { label: 'Created', render: r => <span className="text-xs text-slate-500">{fmtDate(r.created_date)}</span> },
            ]}
            empty="No topics yet. Use the intake form to create your first content pipeline."
          />
        )}

        {/* ── JOBS TAB ── */}
        {tab === 'jobs' && (
          <DataTable
            rows={filteredJobs}
            columns={[
              { label: 'Client', render: r => r.client },
              { label: 'Topic', render: r => <span className="font-medium text-white text-xs">{r.topic_title}</span> },
              { label: 'Job Type', render: r => <span className="text-slate-300 text-xs capitalize">{r.job_type?.replace('_', ' ')}</span> },
              { label: 'Status', render: r => <StatusBadge status={r.status} /> },
              { label: 'Created', render: r => <span className="text-xs text-slate-500">{fmtDate(r.created_date)}</span> },
              { label: 'Completed', render: r => <span className="text-xs text-slate-500">{r.completed_at ? fmtDate(r.completed_at) : '—'}</span> },
              { label: 'Error', render: r => r.error_message ? <span className="text-xs text-red-400 truncate max-w-[160px] block">{r.error_message}</span> : <span className="text-slate-600 text-xs">—</span> },
            ]}
            empty="No AI jobs yet."
          />
        )}

        {/* ── REVIEW TAB ── */}
        {tab === 'review' && (
          <div className="space-y-3">
            {reviewAssets.length === 0 && <EmptyState text="No content ready for review." />}
            {reviewAssets.map(asset => (
              <AssetCard key={asset.id} asset={asset} onView={() => setExpandedAsset(asset)}
                onApprove={() => updateAssetStatus(asset.id, 'approved')}
                onPublish={() => updateAssetStatus(asset.id, 'published')} />
            ))}
          </div>
        )}

        {/* ── PUBLISHED TAB ── */}
        {tab === 'published' && (
          <div className="space-y-3">
            {publishedAssets.length === 0 && <EmptyState text="No published content yet." />}
            {publishedAssets.map(asset => (
              <AssetCard key={asset.id} asset={asset} onView={() => setExpandedAsset(asset)} published />
            ))}
          </div>
        )}

        {/* ── ERRORS TAB ── */}
        {tab === 'errors' && (
          <div className="space-y-4">
            {failedJobs.length === 0 && alerts.length === 0 && <EmptyState text="No errors. All clear!" />}
            {failedJobs.map(job => (
              <div key={job.id} className="bg-slate-900 border border-red-900/50 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white">Failed Job: {job.job_type?.replace('_', ' ')} for "{job.topic_title}"</p>
                  <p className="text-xs text-red-400 mt-1">{job.error_message || 'No error message'}</p>
                  <p className="text-xs text-slate-500 mt-1">Client: {job.client} · {fmtDate(job.created_date)}</p>
                </div>
              </div>
            ))}
            {alerts.map(alert => (
              <div key={alert.id} className="bg-slate-900 border border-amber-900/50 rounded-xl p-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-white">{alert.automation_name}</p>
                    <p className="text-xs text-amber-300 mt-1">{alert.message}</p>
                    <p className="text-xs text-slate-500 mt-1">{fmtDate(alert.created_date)}</p>
                  </div>
                </div>
                <button onClick={() => resolveAlert(alert.id)} className="text-xs text-emerald-400 hover:text-emerald-300 flex-shrink-0">Resolve</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Asset Detail Drawer */}
      {expandedAsset && (
        <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-slate-900 border-l border-slate-800 z-50 overflow-y-auto shadow-2xl">
          <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-white">{expandedAsset.title || expandedAsset.asset_type}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400">{expandedAsset.client}</span>
                <StatusBadge status={expandedAsset.status} />
              </div>
            </div>
            <button onClick={() => setExpandedAsset(null)} className="p-2 text-slate-500 hover:text-white rounded-lg"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-5">
            <div className="flex gap-2 mb-4">
              {expandedAsset.status === 'ready_for_review' && (
                <button onClick={() => { updateAssetStatus(expandedAsset.id, 'approved'); setExpandedAsset(a => ({ ...a, status: 'approved' })); }}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-lg">Approve</button>
              )}
              {['ready_for_review', 'approved'].includes(expandedAsset.status) && (
                <button onClick={() => { updateAssetStatus(expandedAsset.id, 'published'); setExpandedAsset(a => ({ ...a, status: 'published' })); }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg">Mark Published</button>
              )}
            </div>
            <pre className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-800 rounded-xl p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
              {expandedAsset.content || 'No content generated.'}
            </pre>
          </div>
        </div>
      )}
    </CRMLayout>
  );
}

const inputCls = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-400 block mb-1">{label}</label>
      {children}
    </div>
  );
}

function StatusBadge({ status }) {
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[status] || 'bg-slate-700 text-slate-300'}`}>{status}</span>;
}

function DataTable({ rows, columns, empty }) {
  return rows.length === 0
    ? <EmptyState text={empty} />
    : (
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              {columns.map(c => (
                <th key={c.label} className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows.map((row, i) => (
              <tr key={row.id || i} className="hover:bg-slate-800/50 transition-colors">
                {columns.map(c => (
                  <td key={c.label} className="px-3 py-3">{c.render(row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}

function AssetCard({ asset, onView, onApprove, onPublish, published }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-white text-sm truncate">{asset.title || asset.asset_type}</p>
          <StatusBadge status={asset.status} />
        </div>
        <p className="text-xs text-slate-500 mt-1">{asset.client} · {asset.asset_type?.replace('_', ' ')} · {fmtDate(asset.created_date)}</p>
        <p className="text-xs text-slate-600 mt-1 truncate">{asset.content?.slice(0, 120)}...</p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button onClick={onView} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" /> View
        </button>
        {onApprove && <button onClick={onApprove} className="px-3 py-1.5 bg-teal-700 hover:bg-teal-600 text-white text-xs font-medium rounded-lg transition-colors">Approve</button>}
        {onPublish && <button onClick={onPublish} className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium rounded-lg transition-colors">Publish</button>}
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
      <p className="text-slate-500 text-sm">{text}</p>
    </div>
  );
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
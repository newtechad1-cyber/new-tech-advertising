import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Plus, RefreshCw, ChevronDown, X, Eye, Zap, AlertTriangle, Clock } from 'lucide-react';
import AgencyLayout from '../components/agency/AgencyLayout';

const ASSET_OPTS = ['blog', 'landing_page', 'video_script', 'social_series', 'gbp_post', 'email'];
const ASSET_LABELS = { blog: 'Blog', landing_page: 'Landing Page', video_script: 'Video Script', social_series: 'Social Series', gbp_post: 'GBP Post', email: 'Email' };

const STATUS_STYLES = {
  idea: 'bg-slate-700 text-slate-300',
  queued: 'bg-blue-900 text-blue-300',
  processing: 'bg-amber-900 text-amber-300',
  ready_for_review: 'bg-violet-900 text-violet-300',
  approved: 'bg-teal-900 text-teal-300',
  published: 'bg-emerald-900 text-emerald-300',
  error: 'bg-red-900 text-red-300',
  pending: 'bg-slate-700 text-slate-300',
  completed: 'bg-emerald-900 text-emerald-300',
  failed: 'bg-red-900 text-red-300',
  draft: 'bg-slate-700 text-slate-300',
};

const TABS = ['intake', 'topics', 'review', 'published', 'errors'];
const TAB_LABELS = { intake: '+ New Topic', topics: 'Topics', review: 'Review', published: 'Published', errors: 'Errors' };

const BLANK_FORM = { title: '', client_id: '', client: '', primary_keyword: '', market: '', service_type: '', notes: '', priority: 'medium', requested_assets: [] };

export default function AgencyContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') || 'intake');
  const [clients, setClients] = useState([]);
  const [topics, setTopics] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [assets, setAssets] = useState([]);
  const [clientFilter, setClientFilter] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [form, setForm] = useState(BLANK_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const [c, t, j, a] = await Promise.all([
      base44.entities.Clients.filter({ archived: false }),
      base44.entities.ContentTopics.list('-created_date', 100),
      base44.entities.AIJobs.list('-created_date', 200),
      base44.entities.ContentAssets.list('-created_date', 200),
    ]);
    setClients(c);
    setTopics(t);
    setJobs(j);
    setAssets(a);
  };

  const switchTab = (t) => {
    setTab(t);
    setSearchParams({ tab: t });
  };

  const toggleAsset = (val) => setForm(p => ({
    ...p,
    requested_assets: p.requested_assets.includes(val) ? p.requested_assets.filter(a => a !== val) : [...p.requested_assets, val],
  }));

  const submit = async () => {
    if (!form.title.trim() || !form.client_id) return;
    setSubmitting(true);
    const topic = await base44.entities.ContentTopics.create({ ...form, status: 'idea' });
    setTopics(prev => [topic, ...prev]);
    await base44.functions.invoke('onContentTopicCreated', { data: topic });
    setForm(BLANK_FORM);
    setSubmitting(false);
    switchTab('topics');
    setTimeout(loadAll, 2000);
  };

  const updateAsset = async (id, status) => {
    await base44.entities.ContentAssets.update(id, { status });
    setAssets(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const filt = (list) => clientFilter ? list.filter(x => x.client === clientFilter || x.client_id === clientFilter) : list;

  const reviewAssets = filt(assets).filter(a => a.status === 'ready_for_review');
  const publishedAssets = filt(assets).filter(a => a.status === 'published');
  const failedJobs = filt(jobs).filter(j => j.status === 'failed');
  const filtTopics = filt(topics);

  const clientNames = clients.map(c => c.business_name);

  return (
    <AgencyLayout>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Content Center</h1>
            <p className="text-slate-500 text-sm mt-0.5">Create → Generate → Review → Publish</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select value={clientFilter} onChange={e => setClientFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white appearance-none pr-8 focus:outline-none">
                <option value="">All Clients</option>
                {clientNames.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
            <button onClick={loadAll} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg"><RefreshCw className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Topics Active', value: filtTopics.filter(t => !['published','error'].includes(t.status)).length, color: 'text-blue-400' },
            { label: 'Jobs Running', value: filt(jobs).filter(j => j.status === 'processing').length, color: 'text-amber-400' },
            { label: 'For Review', value: reviewAssets.length, color: 'text-violet-400' },
            { label: 'Errors', value: failedJobs.length, color: failedJobs.length > 0 ? 'text-red-400' : 'text-slate-500' },
          ].map(s => (
            <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 flex-wrap">
          {TABS.map(t => (
            <button key={t} onClick={() => switchTab(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {TAB_LABELS[t]}
              {t === 'review' && reviewAssets.length > 0 && <span className="ml-1.5 bg-violet-500 text-white text-xs px-1.5 py-0.5 rounded-full">{reviewAssets.length}</span>}
              {t === 'errors' && failedJobs.length > 0 && <span className="ml-1.5 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{failedJobs.length}</span>}
            </button>
          ))}
        </div>

        {/* INTAKE */}
        {tab === 'intake' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-xl">
            <h2 className="text-sm font-bold text-white mb-4">New Content Topic</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FieldInput label="Topic Title *" value={form.title} onChange={v => setForm(p => ({ ...p, title: v }))} placeholder="e.g. Summer AC Tips" />
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Client *</label>
                  <div className="relative">
                    <select value={form.client_id} onChange={e => {
                      const c = clients.find(c => c.id === e.target.value);
                      setForm(p => ({ ...p, client_id: e.target.value, client: c?.business_name || '' }));
                    }} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white appearance-none pr-8 focus:outline-none focus:border-blue-500">
                      <option value="">Select client...</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>
                <FieldInput label="Primary Keyword" value={form.primary_keyword} onChange={v => setForm(p => ({ ...p, primary_keyword: v }))} placeholder="e.g. hvac repair iowa" />
                <FieldInput label="Market / City" value={form.market} onChange={v => setForm(p => ({ ...p, market: v }))} placeholder="e.g. Mason City, IA" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2}
                  placeholder="Tone, special instructions..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-2">Requested Assets</label>
                <div className="flex flex-wrap gap-2">
                  {ASSET_OPTS.map(opt => (
                    <button key={opt} onClick={() => toggleAsset(opt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${form.requested_assets.includes(opt) ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}>
                      {ASSET_LABELS[opt]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={submit} disabled={submitting || !form.title.trim() || !form.client_id}
              className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm px-5 py-2.5 rounded-lg">
              <Zap className="w-4 h-4" />{submitting ? 'Creating...' : 'Create & Generate'}
            </button>
          </div>
        )}

        {/* TOPICS */}
        {tab === 'topics' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            {filtTopics.length === 0 ? <Empty text="No topics yet." /> : (
              <table className="w-full text-sm">
                <thead><tr className="border-b border-slate-800">
                  {['Client', 'Title', 'Keyword', 'Status', 'Created'].map(h => (
                    <th key={h} className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody className="divide-y divide-slate-800">
                  {filtTopics.map(t => (
                    <tr key={t.id} className="hover:bg-slate-800/40">
                      <td className="px-3 py-3 text-slate-400 text-xs">{t.client || '—'}</td>
                      <td className="px-3 py-3 font-medium text-white text-xs">{t.title}</td>
                      <td className="px-3 py-3 text-slate-500 text-xs">{t.primary_keyword || '—'}</td>
                      <td className="px-3 py-3"><StatusBadge s={t.status} /></td>
                      <td className="px-3 py-3 text-slate-500 text-xs">{fmt(t.created_date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* REVIEW */}
        {tab === 'review' && (
          <div className="space-y-3">
            {reviewAssets.length === 0 && <Empty text="Nothing pending review. Nice work." />}
            {reviewAssets.map(a => (
              <AssetRow key={a.id} asset={a} onView={() => setExpanded(a)}
                onApprove={() => { updateAsset(a.id, 'approved'); }}
                onPublish={() => { updateAsset(a.id, 'published'); }} />
            ))}
          </div>
        )}

        {/* PUBLISHED */}
        {tab === 'published' && (
          <div className="space-y-3">
            {publishedAssets.length === 0 && <Empty text="No published content yet." />}
            {publishedAssets.map(a => <AssetRow key={a.id} asset={a} onView={() => setExpanded(a)} readonly />)}
          </div>
        )}

        {/* ERRORS */}
        {tab === 'errors' && (
          <div className="space-y-3">
            {failedJobs.length === 0 && <Empty text="No errors. All clear!" />}
            {failedJobs.map(job => (
              <div key={job.id} className="bg-slate-900 border border-red-900/50 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white">Failed: {ASSET_LABELS[job.job_type] || job.job_type} — "{job.topic_title}"</p>
                  <p className="text-xs text-red-400 mt-1">{job.error_message || 'No error message captured.'}</p>
                  <p className="text-xs text-slate-500 mt-1">{job.client} · {fmt(job.created_date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Asset drawer */}
      {expanded && (
        <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-slate-900 border-l border-slate-800 z-50 overflow-y-auto shadow-2xl">
          <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-white">{expanded.title || expanded.asset_type}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400">{expanded.client}</span>
                <StatusBadge s={expanded.status} />
              </div>
            </div>
            <button onClick={() => setExpanded(null)} className="p-2 text-slate-500 hover:text-white rounded-lg"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-5">
            {['ready_for_review', 'approved'].includes(expanded.status) && (
              <div className="flex gap-2 mb-4">
                {expanded.status === 'ready_for_review' && (
                  <button onClick={() => { updateAsset(expanded.id, 'approved'); setExpanded(a => ({ ...a, status: 'approved' })); }}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-lg">Approve</button>
                )}
                <button onClick={() => { updateAsset(expanded.id, 'published'); setExpanded(a => ({ ...a, status: 'published' })); }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg">Mark Published</button>
              </div>
            )}
            <pre className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-800 rounded-xl p-4 max-h-[calc(100vh-220px)] overflow-y-auto">
              {expanded.content || 'No content generated.'}
            </pre>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
}

function FieldInput({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-400 block mb-1">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
    </div>
  );
}

function StatusBadge({ s }) {
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[s] || 'bg-slate-700 text-slate-300'}`}>{s?.replace('_', ' ')}</span>;
}

function AssetRow({ asset, onView, onApprove, onPublish, readonly }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-white text-sm truncate">{asset.title || asset.asset_type}</p>
          <StatusBadge s={asset.status} />
        </div>
        <p className="text-xs text-slate-500 mt-1">{asset.client} · {ASSET_LABELS[asset.asset_type] || asset.asset_type} · {fmt(asset.created_date)}</p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button onClick={onView} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> View</button>
        {!readonly && onApprove && <button onClick={onApprove} className="px-3 py-1.5 bg-teal-700 hover:bg-teal-600 text-white text-xs font-medium rounded-lg">Approve</button>}
        {!readonly && onPublish && <button onClick={onPublish} className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium rounded-lg">Publish</button>}
      </div>
    </div>
  );
}

function Empty({ text }) {
  return <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center"><p className="text-slate-500 text-sm">{text}</p></div>;
}

function fmt(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
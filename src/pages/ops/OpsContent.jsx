import React, { useState, useEffect } from 'react';
import OpsLayout from '../../components/ops-dashboard/OpsLayout';
import { base44 } from '@/api/base44Client';
import { Plus, RefreshCw, Zap, CheckCircle2, Search } from 'lucide-react';

const STATUS_COLORS = { draft: 'text-slate-400', ready: 'text-blue-400', scheduled: 'text-yellow-400', published: 'text-emerald-400', archived: 'text-slate-600' };
const APPROVAL_COLORS = { pending: 'text-yellow-400', approved: 'text-emerald-400', rejected: 'text-red-400', not_needed: 'text-slate-500' };
const PLATFORM_ICONS = { facebook: '📘', instagram: '📸', google_business_profile: '📍', linkedin: '💼', email: '✉️', website: '🌐', tiktok: '🎵', youtube: '▶️' };

function ContentModal({ asset, clients, campaigns, onSave, onClose }) {
  const [form, setForm] = useState(asset || { client_id: '', campaign_id: '', asset_type: 'social_post', title: '', content: '', platform: 'facebook', status: 'draft', approval_status: 'pending', notes: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (asset?.id) {
      await base44.entities.ContentAsset.update(asset.id, form);
    } else {
      await base44.entities.ContentAsset.create(form);
    }
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-white font-bold text-lg mb-4">{asset?.id ? 'Edit Asset' : 'New Content Asset'}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Client</label>
              <select value={form.client_id} onChange={e => setForm(p => ({ ...p, client_id: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                <option value="">Select client…</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Asset Type</label>
              <select value={form.asset_type} onChange={e => setForm(p => ({ ...p, asset_type: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                {['social_post','blog_post','email','ad_copy','landing_page','video_script','image','carousel'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Title *</label>
            <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Content</label>
            <textarea value={form.content || ''} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={5}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white resize-none" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Platform</label>
              <select value={form.platform} onChange={e => setForm(p => ({ ...p, platform: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                {['facebook','instagram','google_business_profile','linkedin','email','website','tiktok','youtube'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                {['draft','ready','scheduled','published','archived'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Approval</label>
              <select value={form.approval_status} onChange={e => setForm(p => ({ ...p, approval_status: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                {['pending','approved','rejected','not_needed'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-sm text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-800">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg disabled:opacity-50">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OpsContent() {
  const [assets, setAssets] = useState([]);
  const [clients, setClients] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [weeklyModal, setWeeklyModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [generating, setGenerating] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const load = async () => {
    setLoading(true);
    const [a, c, camp] = await Promise.all([
      base44.entities.ContentAsset.list('-updated_date', 200),
      base44.entities.Client.list('-created_date', 100),
      base44.entities.Campaign.list('-created_date', 100),
    ]);
    setAssets(a);
    setClients(c);
    setCampaigns(camp);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleWeeklyGenerate = async () => {
    if (!selectedClient) return;
    setGenerating(true);
    await base44.functions.invoke('ntaWeeklyContentGenerator', { client_id: selectedClient });
    setGenerating(false);
    setWeeklyModal(false);
    load();
    alert('Weekly content generated! Check the list below.');
  };

  const handleMarkReady = async (asset) => {
    await base44.entities.ContentAsset.update(asset.id, { status: 'ready' });
    load();
  };

  const clientName = (id) => clients.find(c => c.id === id)?.business_name || '';

  const filtered = assets.filter(a => {
    const matchSearch = !search || a.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <OpsLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Content Assets</h1>
            <p className="text-slate-500 text-sm">{assets.length} total assets</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg"><RefreshCw className="w-4 h-4" /></button>
            <button onClick={() => setWeeklyModal(true)} className="flex items-center gap-1.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg">
              <Zap className="w-4 h-4" /> Weekly Generator
            </button>
            <button onClick={() => setModal({})} className="flex items-center gap-1.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg">
              <Plus className="w-4 h-4" /> New Asset
            </button>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
              className="bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white">
            <option value="all">All Status</option>
            {['draft','ready','scheduled','published','archived'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-slate-900 rounded-xl animate-pulse" />)}</div>
        ) : (
          <div className="space-y-2">
            {filtered.map(a => (
              <div key={a.id} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span>{PLATFORM_ICONS[a.platform] || '📄'}</span>
                    <p className="text-white font-semibold text-sm truncate">{a.title}</p>
                    <span className={`text-xs font-medium ${STATUS_COLORS[a.status]}`}>{a.status}</span>
                    <span className={`text-xs font-medium ${APPROVAL_COLORS[a.approval_status]}`}>· {a.approval_status}</span>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">{clientName(a.client_id)} · {a.asset_type}</p>
                </div>
                <div className="flex gap-2">
                  {a.status === 'draft' && (
                    <button onClick={() => handleMarkReady(a)} className="flex items-center gap-1 text-xs px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Mark Ready
                    </button>
                  )}
                  <button onClick={() => setModal(a)} className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg">Edit</button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="text-center text-slate-600 py-12 text-sm">No content assets found.</div>}
          </div>
        )}
      </div>

      {modal !== null && <ContentModal asset={modal?.id ? modal : null} clients={clients} campaigns={campaigns} onSave={() => { setModal(null); load(); }} onClose={() => setModal(null)} />}

      {weeklyModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-6">
            <h2 className="text-white font-bold text-lg mb-1">Weekly Content Generator</h2>
            <p className="text-slate-400 text-sm mb-4">Generate a full week of content for a client.</p>
            <div className="mb-4">
              <label className="block text-xs text-slate-400 mb-1">Select Client</label>
              <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                <option value="">Select client…</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setWeeklyModal(false)} className="flex-1 py-2 text-sm text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-800">Cancel</button>
              <button onClick={handleWeeklyGenerate} disabled={generating || !selectedClient}
                className="flex-1 py-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2">
                {generating ? <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Generating…</> : <><Zap className="w-4 h-4" /> Generate</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </OpsLayout>
  );
}
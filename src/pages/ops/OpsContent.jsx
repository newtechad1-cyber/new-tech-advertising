import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import OpsLayout from '@/components/ops-dashboard/OpsLayout';
import { Plus, Search, RefreshCw } from 'lucide-react';

const STATUS_COLORS = {
  draft: 'bg-slate-800 text-slate-400',
  ready_for_review: 'bg-amber-900/40 text-amber-400',
  approved: 'bg-emerald-900/40 text-emerald-400',
  scheduled: 'bg-blue-900/40 text-blue-400',
  published: 'bg-violet-900/40 text-violet-400',
  rejected: 'bg-red-900/40 text-red-400',
};

const PLATFORM_ICONS = {
  facebook: '📘', instagram: '📸', linkedin: '💼', youtube: '▶️',
  google_business_profile: '📍', tiktok: '🎵', x: '✖️', threads: '🧵',
};

function ContentModal({ asset, clients, campaigns, onClose, onSave }) {
  const [form, setForm] = useState(asset || {
    asset_name: '', asset_type: 'social_post', platform: 'facebook',
    headline: '', body_copy: '', caption_text: '', hook: '', cta: '',
    status: 'draft', client_id: '', campaign_id: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.asset_name.trim()) return;
    setSaving(true);
    if (asset?.id) {
      await base44.entities.NTAContentAsset.update(asset.id, form);
    } else {
      await base44.entities.NTAContentAsset.create(form);
    }
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h2 className="font-bold text-white">{asset ? 'Edit Content' : 'New Content Asset'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-xl">×</button>
        </div>
        <div className="p-5 space-y-3">
          {[['Asset Name *', 'asset_name'], ['Headline', 'headline'], ['Hook', 'hook'], ['CTA', 'cta']].map(([label, k]) => (
            <div key={k}>
              <label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>
              <input value={form[k] || ''} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Body Copy / Caption</label>
            <textarea value={form.body_copy || form.caption_text || ''} onChange={e => setForm(p => ({ ...p, body_copy: e.target.value, caption_text: e.target.value }))} rows={4}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Platform', 'platform', ['facebook','instagram','linkedin','youtube','google_business_profile','tiktok','x','threads']],
              ['Type', 'asset_type', ['social_post','article','video','short_video','email']],
              ['Status', 'status', ['draft','ready_for_review','approved','scheduled','published','rejected']],
            ].map(([label, k, opts]) => (
              <div key={k}>
                <label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>
                <select value={form[k] || ''} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                  {opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Client</label>
              <select value={form.client_id || ''} onChange={e => setForm(p => ({ ...p, client_id: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                <option value="">— None —</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-slate-800">
          <button onClick={onClose} className="text-sm px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.asset_name.trim()}
            className="text-sm font-bold px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
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

  const load = async () => {
    setLoading(true);
    const [a, cl, ca] = await Promise.all([
      base44.entities.NTAContentAsset.list('-created_date', 100),
      base44.entities.Clients.filter({ archived: false }),
      base44.entities.SpokeCampaign.list('-created_date', 50),
    ]);
    setAssets(a);
    setClients(cl);
    setCampaigns(ca);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = assets.filter(a => !search || a.asset_name?.toLowerCase().includes(search.toLowerCase()) || a.headline?.toLowerCase().includes(search.toLowerCase()));

  return (
    <OpsLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Content Assets</h1>
            <p className="text-slate-500 text-sm">{filtered.length} assets</p>
          </div>
          <button onClick={() => setModal({})} className="flex items-center gap-2 text-sm font-bold px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
            <Plus className="w-4 h-4" /> New Asset
          </button>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assets…"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          </div>
          <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-xl">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          {loading ? <div className="p-8 text-center text-slate-500 text-sm">Loading…</div> :
           filtered.length === 0 ? <div className="p-8 text-center text-slate-500 text-sm">No content assets yet.</div> : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Asset</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden sm:table-cell">Platform</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden md:table-cell">Type</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map(a => (
                  <tr key={a.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white">{a.asset_name}</p>
                      {a.headline && <p className="text-xs text-slate-500 truncate max-w-48">{a.headline}</p>}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-base">{PLATFORM_ICONS[a.platform] || '📣'}</span>
                      <span className="text-xs text-slate-500 ml-1">{a.platform}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[a.status] || STATUS_COLORS.draft}`}>{a.status?.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">{a.asset_type?.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setModal(a)} className="text-xs text-slate-500 hover:text-white px-2 py-1 rounded hover:bg-slate-700">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {modal !== null && <ContentModal asset={modal?.id ? modal : null} clients={clients} campaigns={campaigns} onClose={() => setModal(null)} onSave={() => { setModal(null); load(); }} />}
    </OpsLayout>
  );
}
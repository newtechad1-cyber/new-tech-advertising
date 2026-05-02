import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import OpsLayout from '@/components/ops-dashboard/OpsLayout';
import { Plus, Search, RefreshCw } from 'lucide-react';

const STATUS_COLORS = {
  draft: 'bg-slate-800 text-slate-400',
  active: 'bg-emerald-900/40 text-emerald-400',
  completed: 'bg-blue-900/40 text-blue-400',
};

function CampaignModal({ campaign, clients, onClose, onSave }) {
  const [form, setForm] = useState(campaign || {
    campaign_name: '', core_theme: '', target_audience: '',
    primary_offer: '', cta_url: '', status: 'draft', client_id: '', pillar: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.campaign_name.trim()) return;
    setSaving(true);
    if (campaign?.id) {
      await base44.entities.SpokeCampaign.update(campaign.id, form);
    } else {
      await base44.entities.SpokeCampaign.create(form);
    }
    setSaving(false);
    onSave();
  };

  const F = ({ label, k, type = 'text', opts }) => (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>
      {opts ? (
        <select value={form[k] || ''} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
          <option value="">— Select —</option>
          {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input type={type} value={form[k] || ''} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h2 className="font-bold text-white">{campaign ? 'Edit Campaign' : 'New Campaign'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-xl">×</button>
        </div>
        <div className="p-5 space-y-3">
          <F label="Campaign Name *" k="campaign_name" />
          <F label="Client" k="client_id" opts={clients.map(c => ({ value: c.id, label: c.business_name }))} />
          <F label="Core Theme" k="core_theme" />
          <F label="Target Audience" k="target_audience" />
          <F label="Primary Offer" k="primary_offer" />
          <F label="CTA URL" k="cta_url" />
          <F label="Pillar / Category" k="pillar" />
          <F label="Status" k="status" opts={[
            { value: 'draft', label: 'Draft' },
            { value: 'active', label: 'Active' },
            { value: 'completed', label: 'Completed' },
          ]} />
        </div>
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-slate-800">
          <button onClick={onClose} className="text-sm px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.campaign_name.trim()}
            className="text-sm font-bold px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OpsCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    const [c, cl] = await Promise.all([
      base44.entities.SpokeCampaign.list('-created_date', 100),
      base44.entities.Clients.filter({ archived: false }),
    ]);
    setCampaigns(c);
    setClients(cl);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = campaigns.filter(c => !search || c.campaign_name?.toLowerCase().includes(search.toLowerCase()));
  const clientMap = Object.fromEntries(clients.map(c => [c.id, c.business_name]));

  return (
    <OpsLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Campaigns</h1>
            <p className="text-slate-500 text-sm">{filtered.length} campaigns</p>
          </div>
          <button onClick={() => setModal({})} className="flex items-center gap-2 text-sm font-bold px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
            <Plus className="w-4 h-4" /> New Campaign
          </button>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search campaigns…"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          </div>
          <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-xl">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full p-8 text-center text-slate-500 text-sm">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full p-8 text-center text-slate-500 text-sm">No campaigns yet.</div>
          ) : filtered.map(c => (
            <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-600 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status] || STATUS_COLORS.draft}`}>{c.status}</span>
                <button onClick={() => setModal(c)} className="text-xs text-slate-500 hover:text-white px-2 py-0.5 rounded hover:bg-slate-700">Edit</button>
              </div>
              <h3 className="font-bold text-white text-sm mb-1">{c.campaign_name}</h3>
              {c.client_id && <p className="text-xs text-blue-400 mb-1">{clientMap[c.client_id] || c.client_id}</p>}
              {c.core_theme && <p className="text-xs text-slate-500 mb-1">{c.core_theme}</p>}
              {c.primary_offer && <p className="text-xs text-slate-400">{c.primary_offer}</p>}
            </div>
          ))}
        </div>
      </div>
      {modal !== null && <CampaignModal campaign={modal?.id ? modal : null} clients={clients} onClose={() => setModal(null)} onSave={() => { setModal(null); load(); }} />}
    </OpsLayout>
  );
}
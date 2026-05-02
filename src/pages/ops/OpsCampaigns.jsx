import React, { useState, useEffect } from 'react';
import OpsLayout from '../../components/ops-dashboard/OpsLayout';
import { base44 } from '@/api/base44Client';
import { Plus, RefreshCw, Zap, ChevronDown } from 'lucide-react';

const STATUS_COLORS = { planning: 'bg-slate-700 text-slate-300', active: 'bg-emerald-900/40 text-emerald-300', paused: 'bg-yellow-900/40 text-yellow-300', completed: 'bg-blue-900/40 text-blue-300' };
const SEASONS = ['spring', 'summer', 'fall', 'winter', 'year_round', 'custom'];

function SeasonalGeneratorModal({ clients, onClose, onDone }) {
  const [form, setForm] = useState({ client_id: '', season: 'spring', service_focus: '', offer: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    if (!form.client_id || !form.season) return;
    setLoading(true);
    const res = await base44.functions.invoke('ntaSeasonalCampaignGenerator', form);
    setResult(res.data);
    setLoading(false);
    onDone();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6">
        <h2 className="text-white font-bold text-lg mb-1">Seasonal Campaign Generator</h2>
        <p className="text-slate-400 text-sm mb-4">Generate a full campaign content pack in one click.</p>
        {result ? (
          <div className="space-y-3">
            <div className="bg-emerald-900/20 border border-emerald-700 rounded-xl p-4">
              <p className="text-emerald-300 font-bold text-sm mb-2">✓ Campaign Generated!</p>
              <p className="text-slate-300 text-sm font-medium">{result.campaign_name}</p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-slate-400">
                {Object.entries(result.assets_created || {}).map(([k, v]) => (
                  <span key={k} className="bg-slate-800 rounded px-2 py-1">{v} {k.replace(/_/g, ' ')}</span>
                ))}
              </div>
            </div>
            <button onClick={onClose} className="w-full py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg">Done</button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Client *</label>
              <select value={form.client_id} onChange={e => setForm(p => ({ ...p, client_id: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                <option value="">Select client…</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Season *</label>
              <select value={form.season} onChange={e => setForm(p => ({ ...p, season: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {[
              { key: 'service_focus', label: 'Service Focus (e.g. AC Tune-Up)', placeholder: 'HVAC Maintenance' },
              { key: 'offer', label: 'Offer / CTA (e.g. Free estimate)', placeholder: 'Free 21-Point Inspection' },
              { key: 'location', label: 'Location (e.g. Mason City, IA)', placeholder: 'Mason City, IA' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs text-slate-400 mb-1">{f.label}</label>
                <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <button onClick={onClose} className="flex-1 py-2 text-sm text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-800">Cancel</button>
              <button onClick={handleGenerate} disabled={loading || !form.client_id}
                className="flex-1 py-2 text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Generating…</> : <><Zap className="w-4 h-4" /> Generate Campaign</>}
              </button>
            </div>
            {loading && <p className="text-slate-500 text-xs text-center">This may take 15-30 seconds. Generating full content pack…</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function CampaignModal({ campaign, clients, onSave, onClose }) {
  const [form, setForm] = useState(campaign || { campaign_name: '', client_id: '', season: 'year_round', service_focus: '', offer: '', location: '', target_audience: '', status: 'planning', notes: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (campaign?.id) {
      await base44.entities.Campaign.update(campaign.id, form);
    } else {
      await base44.entities.Campaign.create(form);
    }
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-white font-bold text-lg mb-4">{campaign?.id ? 'Edit Campaign' : 'New Campaign'}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Client *</label>
            <select required value={form.client_id} onChange={e => setForm(p => ({ ...p, client_id: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
              <option value="">Select client…</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
            </select>
          </div>
          {[
            { key: 'campaign_name', label: 'Campaign Name *', required: true },
            { key: 'service_focus', label: 'Service Focus' },
            { key: 'offer', label: 'Offer / CTA' },
            { key: 'location', label: 'Location' },
            { key: 'target_audience', label: 'Target Audience' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs text-slate-400 mb-1">{f.label}</label>
              <input required={f.required} value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Season</label>
              <select value={form.season} onChange={e => setForm(p => ({ ...p, season: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                {['planning','active','paused','completed'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-sm text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-800">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg disabled:opacity-50">
              {saving ? 'Saving…' : 'Save Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OpsCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [showSeasonal, setShowSeasonal] = useState(false);
  const [generating, setGenerating] = useState(null);

  const load = async () => {
    setLoading(true);
    const [c, cl] = await Promise.all([
      base44.entities.Campaign.list('-created_date', 200),
      base44.entities.Client.list('-created_date', 100),
    ]);
    setCampaigns(c);
    setClients(cl);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleGenerate = async (campaign) => {
    setGenerating(campaign.id);
    await base44.functions.invoke('ntaGenerateCampaignContent', { campaign_id: campaign.id });
    setGenerating(null);
    alert('Content pack generated! Check Content Assets, Social Queue, and SEO Pages.');
  };

  const clientName = (id) => clients.find(c => c.id === id)?.business_name || 'Unknown';

  return (
    <OpsLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Campaigns</h1>
            <p className="text-slate-500 text-sm">{campaigns.length} total campaigns</p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg"><RefreshCw className="w-4 h-4" /></button>
            <button onClick={() => setShowSeasonal(true)} className="flex items-center gap-1.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg">
              <Zap className="w-4 h-4" /> Seasonal Generator
            </button>
            <button onClick={() => setModal({})} className="flex items-center gap-1.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg">
              <Plus className="w-4 h-4" /> New Campaign
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-slate-900 rounded-xl animate-pulse" />)}</div>
        ) : (
          <div className="space-y-2">
            {campaigns.map(c => (
              <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-semibold text-sm">{c.campaign_name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[c.status] || 'bg-slate-700 text-slate-400'}`}>{c.status}</span>
                    <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{c.season}</span>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">{clientName(c.client_id)} · {c.service_focus} · {c.location}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleGenerate(c)} disabled={generating === c.id}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-lg disabled:opacity-50">
                    <Zap className="w-3 h-3" /> {generating === c.id ? 'Generating…' : 'Generate Content'}
                  </button>
                  <button onClick={() => setModal(c)} className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg">Edit</button>
                </div>
              </div>
            ))}
            {campaigns.length === 0 && <div className="text-center text-slate-600 py-12 text-sm">No campaigns yet.</div>}
          </div>
        )}
      </div>

      {modal !== null && <CampaignModal campaign={modal?.id ? modal : null} clients={clients} onSave={() => { setModal(null); load(); }} onClose={() => setModal(null)} />}
      {showSeasonal && <SeasonalGeneratorModal clients={clients} onClose={() => { setShowSeasonal(false); load(); }} onDone={load} />}
    </OpsLayout>
  );
}
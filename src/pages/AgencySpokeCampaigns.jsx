import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import { Plus, Megaphone, Circle, CheckCircle, Zap, ArrowRight, X, Target } from 'lucide-react';

const IN = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';
const LBL = 'block text-xs font-medium text-slate-400 mb-1';

const STATUS_COLORS = {
  draft: 'bg-slate-700 text-slate-400',
  active: 'bg-emerald-900/50 text-emerald-300',
  completed: 'bg-blue-900/50 text-blue-300',
};

export default function AgencySpokeCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ campaign_name: '', pillar: '', core_theme: '', target_audience: '', primary_offer: '', cta_url: '', status: 'draft', client_id: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [c, m, cl] = await Promise.all([
      base44.entities.SpokeCampaign.list('-created_date', 100),
      base44.entities.PerformanceMetric.list('-date_logged', 200),
      base44.entities.Clients.filter({ archived: false }),
    ]);
    setCampaigns(c);
    setMetrics(m);
    setClients(cl);
    setLoading(false);
  };

  const save = async () => {
    setSaving(true);
    const slug = form.campaign_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    await base44.entities.SpokeCampaign.create({ ...form, campaign_slug: slug });
    setShowModal(false);
    setForm({ campaign_name: '', pillar: '', core_theme: '', target_audience: '', primary_offer: '', cta_url: '', status: 'draft', client_id: '' });
    setSaving(false);
    load();
  };

  const updateStatus = async (id, status) => {
    await base44.entities.SpokeCampaign.update(id, { status });
    setCampaigns(p => p.map(c => c.id === id ? { ...c, status } : c));
  };

  const getLeads = (id) => metrics.filter(m => m.campaign_id === id).reduce((s, m) => s + (m.leads || 0), 0);

  const total = campaigns.length;
  const active = campaigns.filter(c => c.status === 'active').length;
  const generating = campaigns.filter(c => getLeads(c.id) > 0).length;

  return (
    <AgencyLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Spoke Campaigns</h1>
            <p className="text-slate-500 text-sm mt-0.5">Authority campaigns linked to insight pages and content assets</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg">
            <Plus className="w-4 h-4" /> New Campaign
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3">
          <KPI label="Total Campaigns" value={total} color="text-white" />
          <KPI label="Active" value={active} color="text-emerald-400" />
          <KPI label="Generating Leads" value={generating} color="text-blue-400" />
        </div>

        {/* Campaign list */}
        {loading ? (
          <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-slate-800 rounded-xl animate-pulse" />)}</div>
        ) : campaigns.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <Megaphone className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No campaigns yet. Create your first spoke campaign.</p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
            {campaigns.map(c => {
              const leads = getLeads(c.id);
              return (
                <div key={c.id} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-white truncate">{c.campaign_name}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLORS[c.status]}`}>{c.status}</span>
                    </div>
                    <p className="text-xs text-slate-500">{[c.pillar, c.core_theme, c.target_audience].filter(Boolean).join(' · ')}</p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    {leads > 0 && <span className="text-xs font-bold text-blue-400">{leads} leads</span>}
                    <select value={c.status} onChange={e => updateStatus(c.id, e.target.value)}
                      className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-2 py-1.5">
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                    <Link to={`/agency/content-asset?campaign=${c.id}`} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                      Assets <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">New Spoke Campaign</h2>
              <button onClick={() => setShowModal(false)}><X className="w-4 h-4 text-slate-500" /></button>
            </div>
            <div className="p-6 space-y-3">
              {[['campaign_name','Campaign Name *'],['pillar','Pillar / Theme'],['core_theme','Core Theme'],['target_audience','Target Audience'],['primary_offer','Primary Offer'],['cta_url','CTA URL']].map(([k, label]) => (
                <div key={k}><label className={LBL}>{label}</label>
                  <input value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} className={IN} />
                </div>
              ))}
              <div><label className={LBL}>Client (optional)</label>
                <select value={form.client_id} onChange={e => setForm(p => ({ ...p, client_id: e.target.value }))} className={IN}>
                  <option value="">Internal / NTA</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
                </select>
              </div>
              <div><label className={LBL}>Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className={IN}>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 pb-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-400 bg-slate-800 rounded-lg">Cancel</button>
              <button onClick={save} disabled={saving || !form.campaign_name} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg">{saving ? 'Saving...' : 'Create Campaign'}</button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
}

function KPI({ label, value, color }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <p className={`text-3xl font-black ${color}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}
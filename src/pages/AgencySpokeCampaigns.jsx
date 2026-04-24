import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import TutorialHighlight from '../components/agency/TutorialHighlight.jsx';
import { Plus, Megaphone, ArrowRight, X, Copy, FileText, ExternalLink, Pencil, Trash2 } from 'lucide-react';

const IN = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';
const LBL = 'block text-xs font-medium text-slate-400 mb-1';

const STATUS_COLORS = {
  draft: 'bg-slate-700 text-slate-400',
  active: 'bg-emerald-900/50 text-emerald-300',
  completed: 'bg-blue-900/50 text-blue-300',
};

const BLANK = { campaign_name: '', pillar: '', core_theme: '', target_audience: '', primary_offer: '', cta_url: '', status: 'draft', client_id: '' };

export default function AgencySpokeCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [clients, setClients] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [cloneModal, setCloneModal] = useState(null); // holds campaign to clone
  const [form, setForm] = useState(BLANK);
  const [cloneForm, setCloneForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [cloning, setCloning] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [c, m, cl, a] = await Promise.all([
      base44.entities.SpokeCampaign.list('-created_date', 100),
      base44.entities.PerformanceMetric.list('-date_logged', 500),
      base44.entities.Clients.filter({ archived: false }),
      base44.entities.NTAContentAsset.list('-created_date', 500),
    ]);
    setCampaigns(c); setMetrics(m); setClients(cl); setAssets(a); setLoading(false);
  };

  const save = async () => {
    setSaving(true);
    const slug = form.campaign_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    await base44.entities.SpokeCampaign.create({ ...form, campaign_slug: slug });
    setShowModal(false);
    setForm(BLANK);
    setSaving(false);
    load();
  };

  const openClone = (c) => {
    setCloneForm({ campaign_name: `${c.campaign_name} (Copy)`, pillar: c.pillar, core_theme: c.core_theme, target_audience: c.target_audience, primary_offer: c.primary_offer, cta_url: c.cta_url, client_id: c.client_id || '', status: 'draft' });
    setCloneModal(c);
  };

  const clone = async () => {
    setCloning(true);
    const slug = cloneForm.campaign_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newCampaign = await base44.entities.SpokeCampaign.create({ ...cloneForm, campaign_slug: slug });
    // Copy linked draft assets (not published metrics)
    const linked = assets.filter(a => a.campaign_id === cloneModal.id && !['published'].includes(a.status));
    await Promise.all(linked.map(a => base44.entities.NTAContentAsset.create({
      ...a, id: undefined, campaign_id: newCampaign.id,
      status: 'draft', approval_status: 'draft', queued: false,
      scheduled_date: null, published_date: null,
      asset_name: `${a.asset_name} (Copy)`,
    })));
    setCloneModal(null);
    setCloning(false);
    load();
  };

  const updateStatus = async (id, status) => {
    await base44.entities.SpokeCampaign.update(id, { status });
    setCampaigns(p => p.map(c => c.id === id ? { ...c, status } : c));
  };

  const archiveCampaign = async (id, name) => {
    if (!confirm(`Archive campaign "${name}"? It will be marked completed and hidden.`)) return;
    await base44.entities.SpokeCampaign.update(id, { status: 'completed' });
    setCampaigns(p => p.filter(c => c.id !== id));
  };

  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({});

  const openEdit = (c) => {
    setEditForm({ campaign_name: c.campaign_name, pillar: c.pillar, core_theme: c.core_theme, target_audience: c.target_audience, primary_offer: c.primary_offer, cta_url: c.cta_url });
    setEditModal(c);
  };

  const saveEdit = async () => {
    await base44.entities.SpokeCampaign.update(editModal.id, editForm);
    setCampaigns(p => p.map(c => c.id === editModal.id ? { ...c, ...editForm } : c));
    setEditModal(null);
  };

  const getLeads = (id) => metrics.filter(m => m.campaign_id === id).reduce((s, m) => s + (m.leads || 0), 0);
  const getAssetCount = (id) => assets.filter(a => a.campaign_id === id).length;

  // Rollup totals
  const campRollup = (id) => metrics.filter(m => m.campaign_id === id).reduce(
    (s, m) => ({ views: s.views + (m.views||0), clicks: s.clicks + (m.clicks||0), leads: s.leads + (m.leads||0), calls: s.calls + (m.booked_calls||0), rev: s.rev + (m.revenue||0) }),
    { views: 0, clicks: 0, leads: 0, calls: 0, rev: 0 }
  );

  const total = campaigns.length;
  const active = campaigns.filter(c => c.status === 'active').length;
  const generating = campaigns.filter(c => getLeads(c.id) > 0).length;

  // Top campaign by leads
  const topCamp = [...campaigns].sort((a, b) => getLeads(b.id) - getLeads(a.id))[0];

  return (
    <AgencyLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Spoke Campaigns</h1>
            <p className="text-slate-500 text-sm mt-0.5">Authority campaigns linked to insight pages and content assets</p>
          </div>
          <div className="flex gap-2">
            <Link to="/insights" target="_blank" className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-semibold rounded-lg">
              <ExternalLink className="w-3.5 h-3.5" /> Public Insights
            </Link>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg">
              <Plus className="w-4 h-4" /> New Campaign
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KPI label="Total Campaigns" value={total} color="text-white" />
          <KPI label="Active" value={active} color="text-emerald-400" />
          <KPI label="Generating Leads" value={generating} color="text-blue-400" />
          <KPI label="Top Campaign" value={topCamp?.campaign_name?.slice(0, 18) || '—'} color="text-violet-400" sub={topCamp ? `${getLeads(topCamp.id)} leads` : ''} />
        </div>

        {/* Campaign list */}
        <TutorialHighlight id="campaign-list">
        {loading ? (
          <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-slate-800 rounded-xl animate-pulse" />)}</div>
        ) : campaigns.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <Megaphone className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm mb-4">No campaigns yet. Create your first spoke campaign.</p>
            <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg"><Plus className="w-4 h-4" /> New Campaign</button>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
            {campaigns.map(c => {
              const r = campRollup(c.id);
              const assetCount = getAssetCount(c.id);
              return (
                <div key={c.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-white truncate">{c.campaign_name}</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLORS[c.status]}`}>{c.status}</span>
                        {c.client_id && <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-400">Client</span>}
                      </div>
                      <p className="text-xs text-slate-500">{[c.pillar, c.core_theme, c.target_audience].filter(Boolean).join(' · ')}</p>
                      <div className="flex gap-4 mt-2 text-xs text-slate-600">
                        <span>{assetCount} assets</span>
                        {r.leads > 0 && <span className="text-emerald-400">{r.leads} leads</span>}
                        {r.calls > 0 && <span className="text-violet-400">{r.calls} calls</span>}
                        {r.views > 0 && <span>{r.views.toLocaleString()} views</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                      <select value={c.status} onChange={e => updateStatus(c.id, e.target.value)}
                        className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-2 py-1.5">
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                      </select>
                      <Link to={`/agency/content-asset?campaign=${c.id}`} className="text-xs px-2 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg flex items-center gap-1">
                        Assets <ArrowRight className="w-3 h-3" />
                      </Link>
                      <Link to={`/agency/insight-pages?campaign=${c.id}`} className="text-xs px-2 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Insights
                      </Link>
                      <Link to={`/agency/spoke-campaigns/${c.id}`} className="text-xs px-2 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded-lg flex items-center gap-1">
                        Open <ArrowRight className="w-3 h-3" />
                      </Link>
                      <button onClick={() => openClone(c)} className="text-xs px-2 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg flex items-center gap-1">
                        <Copy className="w-3 h-3" /> Clone
                      </button>
                      <button onClick={() => openEdit(c)} className="text-xs px-2 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg flex items-center gap-1">
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => archiveCampaign(c.id, c.campaign_name)} className="text-xs px-2 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Archive
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </TutorialHighlight>
      </div>

      {/* Create Modal */}
      {showModal && (
        <Modal title="New Spoke Campaign" onClose={() => setShowModal(false)}>
          <div className="space-y-3">
            {[['campaign_name','Campaign Name *'],['pillar','Pillar / Theme'],['core_theme','Core Theme'],['target_audience','Target Audience'],['primary_offer','Primary Offer'],['cta_url','CTA URL']].map(([k, label]) => (
              <div key={k}><label className={LBL}>{label}</label>
                <input value={form[k] || ''} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} className={IN} />
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
                <option value="draft">Draft</option><option value="active">Active</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-400 bg-slate-800 rounded-lg">Cancel</button>
            <button onClick={save} disabled={saving || !form.campaign_name} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg">{saving ? 'Saving...' : 'Create Campaign'}</button>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {editModal && (
        <Modal title={`Edit: ${editModal.campaign_name}`} onClose={() => setEditModal(null)}>
          <div className="space-y-3">
            {[['campaign_name','Campaign Name *'],['pillar','Pillar'],['core_theme','Core Theme'],['target_audience','Target Audience'],['primary_offer','Primary Offer'],['cta_url','CTA URL']].map(([k, label]) => (
              <div key={k}><label className={LBL}>{label}</label>
                <input value={editForm[k] || ''} onChange={e => setEditForm(p => ({ ...p, [k]: e.target.value }))} className={IN} />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setEditModal(null)} className="px-4 py-2 text-sm text-slate-400 bg-slate-800 rounded-lg">Cancel</button>
            <button onClick={saveEdit} disabled={!editForm.campaign_name} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg">Save Changes</button>
          </div>
        </Modal>
      )}

      {/* Clone Modal */}
      {cloneModal && (
        <Modal title={`Clone: ${cloneModal.campaign_name}`} onClose={() => setCloneModal(null)}>
          <p className="text-xs text-slate-500 mb-4">Draft assets will be copied. Published metrics will NOT be duplicated. Adjust targeting and CTA before activating.</p>
          <div className="space-y-3">
            {[['campaign_name','New Campaign Name *'],['target_audience','Target Audience'],['primary_offer','Primary Offer'],['cta_url','CTA URL']].map(([k, label]) => (
              <div key={k}><label className={LBL}>{label}</label>
                <input value={cloneForm[k] || ''} onChange={e => setCloneForm(p => ({ ...p, [k]: e.target.value }))} className={IN} />
              </div>
            ))}
            <div><label className={LBL}>Client (optional)</label>
              <select value={cloneForm.client_id || ''} onChange={e => setCloneForm(p => ({ ...p, client_id: e.target.value }))} className={IN}>
                <option value="">Internal / NTA</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setCloneModal(null)} className="px-4 py-2 text-sm text-slate-400 bg-slate-800 rounded-lg">Cancel</button>
            <button onClick={clone} disabled={cloning || !cloneForm.campaign_name} className="px-4 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-lg">{cloning ? 'Cloning...' : 'Clone Campaign'}</button>
          </div>
        </Modal>
      )}
    </AgencyLayout>
  );
}

function KPI({ label, value, color, sub }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <p className={`text-2xl font-black ${color} truncate`}>{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-slate-600">{sub}</p>}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-base font-bold text-white">{title}</h2>
          <button onClick={onClose}><X className="w-4 h-4 text-slate-500" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
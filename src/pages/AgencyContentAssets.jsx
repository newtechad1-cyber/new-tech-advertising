import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import { Plus, X, Filter, CheckCircle, Clock, Send, AlertCircle } from 'lucide-react';

const IN = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';
const LBL = 'block text-xs font-medium text-slate-400 mb-1';
const PLATFORMS = ['facebook','instagram','linkedin','x','threads','google_business_profile','youtube','tiktok'];
const ASSET_TYPES = ['article','video','short_video','social_post','email'];
const STATUSES = ['draft','ready_for_review','approved','scheduled','published','rejected'];

const STATUS_COLORS = {
  draft: 'bg-slate-700 text-slate-400',
  ready_for_review: 'bg-violet-900/50 text-violet-300',
  approved: 'bg-emerald-900/50 text-emerald-300',
  scheduled: 'bg-blue-900/50 text-blue-300',
  published: 'bg-teal-900/50 text-teal-300',
  rejected: 'bg-red-900/50 text-red-300',
};

const PLATFORM_EMOJI = { facebook:'📘', instagram:'📷', linkedin:'💼', x:'𝕏', threads:'🧵', google_business_profile:'🟢', youtube:'▶️', tiktok:'🎵' };

export default function AgencyContentAssets() {
  const [assets, setAssets] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ asset_name: '', asset_type: 'social_post', platform: 'facebook', headline: '', body_copy: '', caption_text: '', hook: '', cta: '', hashtags: '', campaign_id: '', client_id: '', status: 'draft', approval_status: 'draft' });

  // pre-select campaign from URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const camp = params.get('campaign');
    if (camp) setForm(p => ({ ...p, campaign_id: camp }));
    load();
  }, []);

  const load = async () => {
    const [a, c, cl] = await Promise.all([
      base44.entities.NTAContentAsset.list('-created_date', 200),
      base44.entities.SpokeCampaign.list('-created_date', 100),
      base44.entities.Clients.filter({ archived: false }),
    ]);
    setAssets(a); setCampaigns(c); setClients(cl); setLoading(false);
  };

  const save = async () => {
    setSaving(true);
    await base44.entities.NTAContentAsset.create(form);

    // If approved, auto-queue to SocialPostQueue
    if (form.approval_status === 'approved' && form.caption_text) {
      await base44.entities.SocialPostQueue.create({
        platform: form.platform, post_text: form.caption_text,
        campaign_id: form.campaign_id, client_id: form.client_id,
        publish_status: form.scheduled_date ? 'scheduled' : 'draft',
        scheduled_time: form.scheduled_date || null,
      });
    }

    setShowModal(false);
    setSaving(false);
    load();
  };

  const approve = async (asset) => {
    await base44.entities.NTAContentAsset.update(asset.id, { approval_status: 'approved', status: 'approved' });
    // Auto-add to social queue
    await base44.entities.SocialPostQueue.create({
      platform: asset.platform, post_text: asset.caption_text || asset.body_copy || '',
      campaign_id: asset.campaign_id, client_id: asset.client_id,
      publish_status: asset.scheduled_date ? 'scheduled' : 'draft',
      scheduled_time: asset.scheduled_date || null,
      asset_id: asset.id,
    });
    load();
  };

  const reject = async (id) => {
    await base44.entities.NTAContentAsset.update(id, { approval_status: 'rejected', status: 'rejected' });
    load();
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const filtered = assets.filter(a =>
    (filterStatus === 'all' || a.status === filterStatus) &&
    (filterPlatform === 'all' || a.platform === filterPlatform)
  );

  const drafts = assets.filter(a => a.status === 'draft').length;
  const awaitingApproval = assets.filter(a => a.status === 'ready_for_review').length;
  const readyToSchedule = assets.filter(a => a.approval_status === 'approved' && a.status !== 'scheduled' && a.status !== 'published').length;
  const scheduledThisWeek = assets.filter(a => {
    if (a.status !== 'scheduled' || !a.scheduled_date) return false;
    const d = new Date(a.scheduled_date);
    const now = new Date();
    const week = new Date(now); week.setDate(now.getDate() + 7);
    return d >= now && d <= week;
  }).length;

  return (
    <AgencyLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Content Queue</h1>
            <p className="text-slate-500 text-sm mt-0.5">All content assets across campaigns and platforms</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg">
            <Plus className="w-4 h-4" /> New Asset
          </button>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[['Drafts', drafts, 'text-slate-400'],['Awaiting Approval', awaitingApproval, 'text-violet-400'],['Ready to Schedule', readyToSchedule, 'text-emerald-400'],['Scheduled This Week', scheduledThisWeek, 'text-blue-400']].map(([l,v,c]) => (
            <div key={l} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className={`text-2xl font-black ${c}`}>{v}</p>
              <p className="text-xs text-slate-500 mt-0.5">{l}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-3 py-2">
            <option value="all">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
          <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)} className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-3 py-2">
            <option value="all">All Platforms</option>
            {PLATFORMS.map(p => <option key={p} value={p}>{p.replace(/_/g, ' ')}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          {loading ? <p className="p-6 text-slate-600 text-sm">Loading...</p> : filtered.length === 0 ? (
            <p className="p-8 text-center text-slate-600 text-sm">No assets match filters.</p>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-800">{['Asset','Platform','Type','Status','Approval','Scheduled','Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase whitespace-nowrap">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map(a => (
                  <tr key={a.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3"><p className="text-white font-medium truncate max-w-[180px]">{a.asset_name}</p></td>
                    <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{PLATFORM_EMOJI[a.platform]} {a.platform?.replace(/_/g,' ')}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{a.asset_type?.replace(/_/g,' ')}</td>
                    <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[a.status] || 'bg-slate-700 text-slate-400'}`}>{a.status}</span></td>
                    <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.approval_status === 'approved' ? 'bg-emerald-900/50 text-emerald-300' : a.approval_status === 'rejected' ? 'bg-red-900/50 text-red-300' : 'bg-slate-700 text-slate-400'}`}>{a.approval_status}</span></td>
                    <td className="px-4 py-3 text-xs text-slate-500">{a.scheduled_date ? new Date(a.scheduled_date).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {a.approval_status !== 'approved' && a.approval_status !== 'rejected' && (
                          <>
                            <button onClick={() => approve(a)} className="text-xs px-2 py-1 bg-emerald-800/40 hover:bg-emerald-800 text-emerald-300 rounded-lg">Approve</button>
                            <button onClick={() => reject(a.id)} className="text-xs px-2 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg">Reject</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">New Content Asset</h2>
              <button onClick={() => setShowModal(false)}><X className="w-4 h-4 text-slate-500" /></button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><label className={LBL}>Asset Name *</label><input value={form.asset_name} onChange={e => f('asset_name', e.target.value)} className={IN} /></div>
              <div><label className={LBL}>Campaign *</label>
                <select value={form.campaign_id} onChange={e => f('campaign_id', e.target.value)} className={IN}>
                  <option value="">Select Campaign</option>
                  {campaigns.map(c => <option key={c.id} value={c.id}>{c.campaign_name}</option>)}
                </select>
              </div>
              <div><label className={LBL}>Platform *</label>
                <select value={form.platform} onChange={e => f('platform', e.target.value)} className={IN}>
                  {PLATFORMS.map(p => <option key={p} value={p}>{p.replace(/_/g,' ')}</option>)}
                </select>
              </div>
              <div><label className={LBL}>Asset Type</label>
                <select value={form.asset_type} onChange={e => f('asset_type', e.target.value)} className={IN}>
                  {ASSET_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g,' ')}</option>)}
                </select>
              </div>
              <div><label className={LBL}>Client (optional)</label>
                <select value={form.client_id} onChange={e => f('client_id', e.target.value)} className={IN}>
                  <option value="">Internal / NTA</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2"><label className={LBL}>Headline</label><input value={form.headline} onChange={e => f('headline', e.target.value)} className={IN} /></div>
              <div className="sm:col-span-2"><label className={LBL}>Caption / Post Text</label><textarea value={form.caption_text} onChange={e => f('caption_text', e.target.value)} rows={3} className={IN} /></div>
              <div><label className={LBL}>Hook</label><input value={form.hook} onChange={e => f('hook', e.target.value)} className={IN} /></div>
              <div><label className={LBL}>CTA</label><input value={form.cta} onChange={e => f('cta', e.target.value)} className={IN} /></div>
              <div><label className={LBL}>Hashtags</label><input value={form.hashtags} onChange={e => f('hashtags', e.target.value)} className={IN} /></div>
              <div><label className={LBL}>Scheduled Date</label><input type="datetime-local" value={form.scheduled_date || ''} onChange={e => f('scheduled_date', e.target.value)} className={IN} /></div>
              <div><label className={LBL}>Approval Status</label>
                <select value={form.approval_status} onChange={e => f('approval_status', e.target.value)} className={IN}>
                  <option value="draft">Draft</option>
                  <option value="approved">Approved</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 pb-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-400 bg-slate-800 rounded-lg">Cancel</button>
              <button onClick={save} disabled={saving || !form.asset_name || !form.campaign_id} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg">{saving ? 'Saving...' : 'Create Asset'}</button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
}
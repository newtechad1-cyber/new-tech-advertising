import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import { Plus, X, AlertTriangle, CheckCircle, Pencil, Trash2, Send } from 'lucide-react';

const IN = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';
const LBL = 'block text-xs font-medium text-slate-400 mb-1';
const PLATFORMS = ['facebook','instagram','linkedin','x','threads','google_business_profile','youtube','tiktok'];
const ASSET_TYPES = ['article','video','short_video','social_post','email'];
const STATUSES = ['draft','ready_for_review','needs_reapproval','approved','scheduled','published','rejected'];
const PLATFORM_EMOJI = { facebook:'📘', instagram:'📷', linkedin:'💼', x:'𝕏', threads:'🧵', google_business_profile:'🟢', youtube:'▶️', tiktok:'🎵' };

const STATUS_COLORS = {
  draft: 'bg-slate-700 text-slate-400',
  ready_for_review: 'bg-violet-900/50 text-violet-300',
  needs_reapproval: 'bg-orange-900/50 text-orange-300',
  approved: 'bg-emerald-900/50 text-emerald-300',
  scheduled: 'bg-blue-900/50 text-blue-300',
  published: 'bg-teal-900/50 text-teal-300',
  rejected: 'bg-red-900/50 text-red-300',
};

const BLANK_FORM = { asset_name: '', asset_type: 'social_post', platform: 'facebook', headline: '', body_copy: '', caption_text: '', hook: '', cta: '', hashtags: '', campaign_id: '', insight_page_id: '', client_id: '', lead_id: '', status: 'draft', approval_status: 'draft', scheduled_date: '' };

export default function AgencyContentAssets() {
  const [assets, setAssets] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [clients, setClients] = useState([]);
  const [insightPages, setInsightPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterCampaign, setFilterCampaign] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectFeedback, setRejectFeedback] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const camp = params.get('campaign');
    const insight = params.get('insight');
    if (camp) { setFilterCampaign(camp); setForm(p => ({ ...p, campaign_id: camp })); }
    if (insight) setForm(p => ({ ...p, insight_page_id: insight }));
    load();
  }, []);

  const load = async () => {
    const [a, c, cl, ip] = await Promise.all([
      base44.entities.NTAContentAsset.list('-created_date', 300),
      base44.entities.SpokeCampaign.list('-created_date', 100),
      base44.entities.Clients.filter({ archived: false }),
      base44.entities.InsightPage.list('-created_date', 100),
    ]);
    setAssets(a); setCampaigns(c); setClients(cl); setInsightPages(ip); setLoading(false);
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    const created = await base44.entities.NTAContentAsset.create({ ...form, queued: false });
    // Auto-queue to SocialPostQueue only if approved
    if (form.approval_status === 'approved') {
      await enqueue(created);
    }
    setShowModal(false);
    setForm(BLANK_FORM);
    setSaving(false);
    load();
  };

  const enqueue = async (asset) => {
    // Prevent duplicate: check if already queued
    if (asset.queued) return;
    await base44.entities.SocialPostQueue.create({
      platform: asset.platform,
      post_text: asset.caption_text || asset.body_copy || '',
      campaign_id: asset.campaign_id,
      client_id: asset.client_id,
      publish_status: asset.scheduled_date ? 'scheduled' : 'draft',
      scheduled_time: asset.scheduled_date || null,
      asset_id: asset.id,
    });
    await base44.entities.NTAContentAsset.update(asset.id, { queued: true });
  };

  const approve = async (asset) => {
    await base44.entities.NTAContentAsset.update(asset.id, { approval_status: 'approved', status: 'approved' });
    const updated = { ...asset, approval_status: 'approved', status: 'approved' };
    await enqueue(updated);
    load();
  };

  const openReject = (asset) => { setRejectModal(asset); setRejectFeedback(''); };

  const confirmReject = async () => {
    await base44.entities.NTAContentAsset.update(rejectModal.id, { approval_status: 'rejected', status: 'rejected', rejection_feedback: rejectFeedback });
    setRejectModal(null);
    load();
  };

  const markNeedsReapproval = async (id) => {
    await base44.entities.NTAContentAsset.update(id, { approval_status: 'needs_reapproval', status: 'needs_reapproval', queued: false });
    load();
  };

  const deleteAsset = async (id, name) => {
    if (!confirm(`Delete asset "${name}"? This cannot be undone.`)) return;
    await base44.entities.NTAContentAsset.delete(id);
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  const sendToQueue = async (asset) => {
    await enqueue(asset);
    load();
  };

  const [editAssetModal, setEditAssetModal] = useState(null);
  const [editAssetForm, setEditAssetForm] = useState({});

  const openEditAsset = (a) => {
    setEditAssetForm({ asset_name: a.asset_name, headline: a.headline || '', caption_text: a.caption_text || '', hook: a.hook || '', cta: a.cta || '', hashtags: a.hashtags || '', scheduled_date: a.scheduled_date || '' });
    setEditAssetModal(a);
  };

  const saveEditAsset = async () => {
    await base44.entities.NTAContentAsset.update(editAssetModal.id, editAssetForm);
    setEditAssetModal(null);
    load();
  };

  const submitForReview = async (id) => {
    await base44.entities.NTAContentAsset.update(id, { status: 'ready_for_review', approval_status: 'pending_internal' });
    load();
  };

  const campMap = Object.fromEntries(campaigns.map(c => [c.id, c]));

  const filtered = assets.filter(a =>
    (filterStatus === 'all' || a.status === filterStatus) &&
    (filterPlatform === 'all' || a.platform === filterPlatform) &&
    (!filterCampaign || a.campaign_id === filterCampaign)
  );

  // Highlight flags
  const overdueApprovals = assets.filter(a => ['ready_for_review','pending_internal','pending_client'].includes(a.approval_status) && a.created_date && (Date.now() - new Date(a.created_date)) > 86400000 * 3);
  const unscheduledApproved = assets.filter(a => a.approval_status === 'approved' && !['scheduled','published'].includes(a.status) && !a.scheduled_date);

  const drafts = assets.filter(a => a.status === 'draft').length;
  const awaitingApproval = assets.filter(a => ['ready_for_review','needs_reapproval'].includes(a.status)).length;
  const readyToSchedule = unscheduledApproved.length;
  const scheduledThisWeek = assets.filter(a => {
    if (a.status !== 'scheduled' || !a.scheduled_date) return false;
    const d = new Date(a.scheduled_date); const now = new Date(); const w = new Date(); w.setDate(now.getDate() + 7);
    return d >= now && d <= w;
  }).length;

  return (
    <AgencyLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Content Queue</h1>
            <p className="text-slate-500 text-sm mt-0.5">All content assets across campaigns and platforms</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg">
            <Plus className="w-4 h-4" /> New Asset
          </button>
        </div>

        {/* Alerts */}
        {overdueApprovals.length > 0 && (
          <div className="flex items-center gap-3 bg-red-950/40 border border-red-900/50 rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300"><span className="font-bold">{overdueApprovals.length} overdue approval{overdueApprovals.length > 1 ? 's' : ''}</span> — items waiting 3+ days for review.</p>
          </div>
        )}
        {unscheduledApproved.length > 0 && (
          <div className="flex items-center gap-3 bg-amber-950/40 border border-amber-900/50 rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-300"><span className="font-bold">{unscheduledApproved.length} approved asset{unscheduledApproved.length > 1 ? 's' : ''}</span> not yet scheduled.</p>
          </div>
        )}

        {/* KPI strip — clickable filters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[['Drafts', drafts, 'text-slate-400', 'draft'],['Awaiting Approval', awaitingApproval, 'text-violet-400', 'ready_for_review'],['Ready to Schedule', readyToSchedule, 'text-emerald-400', 'approved'],['Scheduled This Week', scheduledThisWeek, 'text-blue-400', 'scheduled']].map(([l,v,c,s]) => (
            <button key={l} onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
              className={`bg-slate-900 border rounded-xl p-4 text-left transition-all ${filterStatus === s ? 'border-blue-500' : 'border-slate-800 hover:border-slate-700'}`}>
              <p className={`text-2xl font-black ${c}`}>{v}</p>
              <p className="text-xs text-slate-500 mt-0.5">{l}</p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-3 py-2">
            <option value="all">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
          </select>
          <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)} className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-3 py-2">
            <option value="all">All Platforms</option>
            {PLATFORMS.map(p => <option key={p} value={p}>{PLATFORM_EMOJI[p]} {p.replace(/_/g,' ')}</option>)}
          </select>
          <select value={filterCampaign} onChange={e => setFilterCampaign(e.target.value)} className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-3 py-2">
            <option value="">All Campaigns</option>
            {campaigns.map(c => <option key={c.id} value={c.id}>{c.campaign_name}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
          {loading ? <p className="p-6 text-slate-600 text-sm">Loading...</p> : filtered.length === 0 ? (
            <div className="p-10 text-center">
              <CheckCircle className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              <p className="text-slate-600 text-sm">No assets match filters.</p>
              <button onClick={() => setShowModal(true)} className="mt-3 inline-flex items-center gap-2 text-xs px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold"><Plus className="w-3.5 h-3.5" /> New Asset</button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-800">{['Asset','Platform','Campaign','Status','Approval','Scheduled','Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase whitespace-nowrap">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map(a => {
                  const overdue = ['ready_for_review','pending_internal','pending_client'].includes(a.approval_status) && a.created_date && (Date.now() - new Date(a.created_date)) > 86400000 * 3;
                  return (
                    <tr key={a.id} className={`hover:bg-slate-800/30 ${overdue ? 'bg-red-950/10' : ''}`}>
                      <td className="px-4 py-3">
                        <p className="text-white font-medium truncate max-w-[160px]">{a.asset_name}</p>
                        {a.rejection_feedback && <p className="text-xs text-red-400 truncate max-w-[160px]">↩ {a.rejection_feedback}</p>}
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{PLATFORM_EMOJI[a.platform]} {a.platform?.replace(/_/g,' ')}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{campMap[a.campaign_id]?.campaign_name?.slice(0,20) || '—'}</td>
                      <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[a.status] || 'bg-slate-700 text-slate-400'}`}>{a.status?.replace(/_/g,' ')}</span></td>
                      <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.approval_status === 'approved' ? 'bg-emerald-900/50 text-emerald-300' : a.approval_status === 'rejected' ? 'bg-red-900/50 text-red-300' : a.approval_status === 'needs_reapproval' ? 'bg-orange-900/50 text-orange-300' : 'bg-slate-700 text-slate-400'}`}>{a.approval_status?.replace(/_/g,' ')}</span></td>
                      <td className="px-4 py-3 text-xs text-slate-500">{a.scheduled_date ? new Date(a.scheduled_date).toLocaleDateString() : '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {a.status === 'draft' && (
                            <button onClick={() => submitForReview(a.id)} className="text-xs px-2 py-1 bg-violet-900/40 hover:bg-violet-900/70 text-violet-300 rounded-lg">Submit</button>
                          )}
                          {['ready_for_review','pending_internal','pending_client'].includes(a.approval_status) && (
                            <>
                              <button onClick={() => approve(a)} className="text-xs px-2 py-1 bg-emerald-800/40 hover:bg-emerald-800 text-emerald-300 rounded-lg">Approve</button>
                              <button onClick={() => openReject(a)} className="text-xs px-2 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg">Reject</button>
                            </>
                          )}
                          {a.approval_status === 'approved' && ['approved'].includes(a.status) && (
                            <button onClick={() => markNeedsReapproval(a.id)} className="text-xs px-2 py-1 bg-orange-900/30 hover:bg-orange-900/50 text-orange-400 rounded-lg">Re-Review</button>
                          )}
                          {a.approval_status === 'approved' && !a.queued && (
                            <button onClick={() => sendToQueue(a)} className="text-xs px-2 py-1 bg-blue-900/40 hover:bg-blue-900/70 text-blue-300 rounded-lg flex items-center gap-1"><Send className="w-3 h-3" /> Queue</button>
                          )}
                          <button onClick={() => openEditAsset(a)} className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg"><Pencil className="w-3 h-3" /></button>
                          <button onClick={() => deleteAsset(a.id, a.asset_name)} className="text-xs px-2 py-1 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-lg"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create Modal */}
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
                  {PLATFORMS.map(p => <option key={p} value={p}>{PLATFORM_EMOJI[p]} {p.replace(/_/g,' ')}</option>)}
                </select>
              </div>
              <div><label className={LBL}>Asset Type</label>
                <select value={form.asset_type} onChange={e => f('asset_type', e.target.value)} className={IN}>
                  {ASSET_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g,' ')}</option>)}
                </select>
              </div>
              <div><label className={LBL}>Linked Insight Page</label>
                <select value={form.insight_page_id} onChange={e => f('insight_page_id', e.target.value)} className={IN}>
                  <option value="">None</option>
                  {insightPages.map(ip => <option key={ip.id} value={ip.id}>{ip.title}</option>)}
                </select>
              </div>
              <div><label className={LBL}>Client (optional)</label>
                <select value={form.client_id} onChange={e => f('client_id', e.target.value)} className={IN}>
                  <option value="">Internal / NTA</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
                </select>
              </div>
              <div><label className={LBL}>Lead ID (optional)</label>
                <input value={form.lead_id} onChange={e => f('lead_id', e.target.value)} placeholder="Lead record ID" className={IN} />
              </div>
              <div className="sm:col-span-2"><label className={LBL}>Headline</label><input value={form.headline} onChange={e => f('headline', e.target.value)} className={IN} /></div>
              <div className="sm:col-span-2"><label className={LBL}>Caption / Post Text</label><textarea value={form.caption_text} onChange={e => f('caption_text', e.target.value)} rows={3} className={IN} /></div>
              <div><label className={LBL}>Hook</label><input value={form.hook} onChange={e => f('hook', e.target.value)} className={IN} /></div>
              <div><label className={LBL}>CTA</label><input value={form.cta} onChange={e => f('cta', e.target.value)} className={IN} /></div>
              <div><label className={LBL}>Hashtags</label><input value={form.hashtags} onChange={e => f('hashtags', e.target.value)} className={IN} /></div>
              <div><label className={LBL}>Scheduled Date</label><input type="datetime-local" value={form.scheduled_date || ''} onChange={e => f('scheduled_date', e.target.value)} className={IN} /></div>
              <div className="sm:col-span-2">
                <div className="bg-amber-950/30 border border-amber-900/40 rounded-lg p-3 text-xs text-amber-300">
                  ⚠ Assets can only be published after approval. Setting approval_status to "approved" on creation will auto-queue this asset.
                </div>
              </div>
              <div><label className={LBL}>Initial Approval Status</label>
                <select value={form.approval_status} onChange={e => f('approval_status', e.target.value)} className={IN}>
                  <option value="draft">Draft (no approval yet)</option>
                  <option value="pending_internal">Submit for Internal Review</option>
                  <option value="approved">Pre-Approved</option>
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

      {/* Edit Asset Modal */}
      {editAssetModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Edit — {editAssetModal.asset_name}</h2>
              <button onClick={() => setEditAssetModal(null)}><X className="w-4 h-4 text-slate-500" /></button>
            </div>
            <div className="p-6 space-y-3">
              {[['asset_name','Asset Name'],['headline','Headline'],['caption_text','Caption'],['hook','Hook'],['cta','CTA'],['hashtags','Hashtags']].map(([k, label]) => (
                <div key={k}><label className={LBL}>{label}</label>
                  <input value={editAssetForm[k] || ''} onChange={e => setEditAssetForm(p => ({ ...p, [k]: e.target.value }))} className={IN} />
                </div>
              ))}
              <div><label className={LBL}>Scheduled Date</label>
                <input type="datetime-local" value={editAssetForm.scheduled_date || ''} onChange={e => setEditAssetForm(p => ({ ...p, scheduled_date: e.target.value }))} className={IN} />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 pb-6">
              <button onClick={() => setEditAssetModal(null)} className="px-4 py-2 text-sm text-slate-400 bg-slate-800 rounded-lg">Cancel</button>
              <button onClick={saveEditAsset} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject with feedback modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Reject — {rejectModal.asset_name}</h2>
              <button onClick={() => setRejectModal(null)}><X className="w-4 h-4 text-slate-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className={LBL}>Feedback / Reason *</label>
                <textarea value={rejectFeedback} onChange={e => setRejectFeedback(e.target.value)} rows={3} placeholder="Explain what needs to change..." className={IN} />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 pb-6">
              <button onClick={() => setRejectModal(null)} className="px-4 py-2 text-sm text-slate-400 bg-slate-800 rounded-lg">Cancel</button>
              <button onClick={confirmReject} disabled={!rejectFeedback.trim()} className="px-4 py-2 text-sm font-semibold bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg">Confirm Reject</button>
            </div>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
}
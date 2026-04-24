import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import { Shield, CheckCircle, XCircle, Clock, AlertTriangle, X, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_COLORS = {
  pending: 'bg-amber-900/50 text-amber-300',
  pending_internal: 'bg-amber-900/50 text-amber-300',
  pending_client: 'bg-blue-900/50 text-blue-300',
  approved: 'bg-emerald-900/50 text-emerald-300',
  rejected: 'bg-red-900/50 text-red-300',
  needs_reapproval: 'bg-orange-900/50 text-orange-300',
};

const PLATFORM_EMOJI = { facebook:'📘', instagram:'📷', linkedin:'💼', x:'𝕏', threads:'🧵', google_business_profile:'🟢', youtube:'▶️', tiktok:'🎵' };

export default function AgencyApprovalCenter() {
  const [assets, setAssets] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectFeedback, setRejectFeedback] = useState('');

  // Canonical client filter — read from ?client=<Clients.id> in URL
  const urlParams = new URLSearchParams(window.location.search);
  const clientIdFilter = urlParams.get('client') || '';

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [a, c, cl] = await Promise.all([
      base44.entities.NTAContentAsset.list('-created_date', 300),
      base44.entities.SpokeCampaign.list('-created_date', 100),
      base44.entities.Clients.list('-created_date', 200),
    ]);
    setAssets(a); setCampaigns(c); setClients(cl); setLoading(false);
  };

  const campMap = Object.fromEntries(campaigns.map(c => [c.id, c]));
  const clientMap = Object.fromEntries(clients.map(c => [c.id, c]));

  // Apply canonical client_id filter when ?client= param is present.
  // Falls back to checking business_name only for legacy records missing client_id (marked below).
  const filteredAssets = clientIdFilter
    ? assets.filter(a => {
        // Primary: canonical client_id match
        if (a.client_id && a.client_id === clientIdFilter) return true;
        // LEGACY FALLBACK: name-based match for records created before client_id was stamped
        // TODO: remove once all records have been backfilled with client_id
        const client = clientMap[clientIdFilter];
        if (!a.client_id && client && a.asset_name && client.business_name) return false; // don't guess on name alone
        return false;
      })
    : assets;

  // Categorize using filteredAssets (scoped to client if ?client= param present, else all)
  const pendingInternal = filteredAssets.filter(a =>
    ['ready_for_review', 'pending_internal', 'draft'].includes(a.approval_status) ||
    ['draft', 'ready_for_review'].includes(a.status)
  );
  const pendingClient = filteredAssets.filter(a => a.approval_status === 'pending_client');
  const needsReapproval = filteredAssets.filter(a => a.approval_status === 'needs_reapproval');
  const rejected = filteredAssets.filter(a => a.approval_status === 'rejected');

  // Overdue = in pending state 3+ days
  const isOverdue = (a) => a.created_date && (Date.now() - new Date(a.created_date)) > 86400000 * 3;

  const enqueue = async (asset) => {
    if (asset.queued) return;
    // Canonical: client_id from the asset (Clients.id) is passed through to SocialPostQueue
    await base44.entities.SocialPostQueue.create({
      platform: asset.platform,
      post_text: asset.caption_text || asset.body_copy || '',
      campaign_id: asset.campaign_id,
      client_id: asset.client_id || '', // canonical Clients.id — required for calendar/queue filters
      publish_status: asset.scheduled_date ? 'scheduled' : 'draft',
      scheduled_time: asset.scheduled_date || null,
      asset_id: asset.id,
    });
    await base44.entities.NTAContentAsset.update(asset.id, { queued: true });
  };

  const approve = async (asset) => {
    await base44.entities.NTAContentAsset.update(asset.id, { approval_status: 'approved', status: 'approved' });
    await enqueue({ ...asset, approval_status: 'approved' });
    load();
  };

  const sendToClient = async (asset) => {
    await base44.entities.NTAContentAsset.update(asset.id, { approval_status: 'pending_client' });
    load();
  };

  const openReject = (asset) => { setRejectModal(asset); setRejectFeedback(''); };

  const confirmReject = async () => {
    await base44.entities.NTAContentAsset.update(rejectModal.id, {
      approval_status: 'rejected', status: 'rejected', rejection_feedback: rejectFeedback, queued: false
    });
    setRejectModal(null);
    load();
  };

  const TAB_DATA = {
    pending: pendingInternal,
    client: pendingClient,
    reapproval: needsReapproval,
    rejected,
  };

  const TABS = [
    { id: 'pending', label: `Internal (${pendingInternal.length})` },
    { id: 'client', label: `Client (${pendingClient.length})` },
    { id: 'reapproval', label: `Needs Re-Approval (${needsReapproval.length})` },
    { id: 'rejected', label: `Rejected (${rejected.length})` },
  ];

  const rows = TAB_DATA[tab] || [];
  const overdueCount = pendingInternal.filter(isOverdue).length + pendingClient.filter(isOverdue).length;

  return (
    <AgencyLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-white">Approval Center</h1>
          {clientIdFilter ? (
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-semibold text-blue-400 bg-blue-900/30 border border-blue-700/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filtered: {clientMap[clientIdFilter]?.business_name || clientIdFilter}
              </span>
              <Link to="/agency/approval-center" className="text-xs text-slate-500 hover:text-white transition-colors">Clear filter →</Link>
              <Link to={`/agency/clients/${clientIdFilter}`} className="text-xs text-slate-500 hover:text-white transition-colors">← Back to client</Link>
            </div>
          ) : (
            <p className="text-slate-500 text-sm mt-0.5">Review, approve, or reject content before it enters the publishing queue</p>
          )}
        </div>

        {/* Overdue alert */}
        {overdueCount > 0 && (
          <div className="flex items-center gap-3 bg-red-950/40 border border-red-900/50 rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300"><span className="font-bold">{overdueCount} overdue approval{overdueCount > 1 ? 's' : ''}</span> — waiting 3+ days.</p>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[['Pending Internal', pendingInternal.length, 'text-amber-400'],['Pending Client', pendingClient.length, 'text-blue-400'],['Needs Re-Approval', needsReapproval.length, 'text-orange-400'],['Rejected', rejected.length, 'text-red-400']].map(([l,v,c]) => (
            <div key={l} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
              <div><p className={`text-2xl font-black ${c}`}>{v}</p><p className="text-xs text-slate-500">{l}</p></div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-800 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${tab === t.id ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Rows */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
          {loading ? <p className="p-6 text-slate-600 text-sm">Loading...</p> : rows.length === 0 ? (
            <div className="p-10 text-center">
              <CheckCircle className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              <p className="text-slate-600 text-sm">Nothing in this queue.</p>
            </div>
          ) : rows.map(asset => {
            const overdue = isOverdue(asset);
            return (
              <div key={asset.id} className={`px-5 py-4 flex items-start justify-between gap-4 ${overdue ? 'bg-red-950/10' : ''}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white truncate">{asset.asset_name}</p>
                    {overdue && <span className="text-xs font-bold text-red-400 bg-red-900/30 px-2 py-0.5 rounded-full flex-shrink-0">Overdue</span>}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {PLATFORM_EMOJI[asset.platform]} {asset.platform?.replace(/_/g,' ')} · {asset.asset_type} · {campMap[asset.campaign_id]?.campaign_name || 'No campaign'}
                  </p>
                  {asset.rejection_feedback && <p className="text-xs text-red-400 mt-1">↩ Previous feedback: {asset.rejection_feedback}</p>}
                  <span className={`inline-block mt-1.5 text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[asset.approval_status] || 'bg-slate-700 text-slate-400'}`}>{asset.approval_status?.replace(/_/g,' ')}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                  {tab !== 'rejected' && (
                    <>
                      <button onClick={() => approve(asset)}
                        className="text-xs px-3 py-1.5 bg-emerald-800/40 hover:bg-emerald-800 text-emerald-300 rounded-lg font-semibold">✓ Approve</button>
                      {tab === 'pending' && (
                        <button onClick={() => sendToClient(asset)}
                          className="text-xs px-3 py-1.5 bg-blue-900/40 hover:bg-blue-900/70 text-blue-300 rounded-lg font-semibold">→ Client</button>
                      )}
                      <button onClick={() => openReject(asset)}
                        className="text-xs px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg font-semibold">✗ Reject</button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reject feedback modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">Reject — {rejectModal.asset_name}</h2>
              <button onClick={() => setRejectModal(null)}><X className="w-4 h-4 text-slate-500" /></button>
            </div>
            <div className="p-6">
              <label className="block text-xs font-medium text-slate-400 mb-1">Feedback / Reason *</label>
              <textarea value={rejectFeedback} onChange={e => setRejectFeedback(e.target.value)} rows={3}
                placeholder="Explain what needs to change..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
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
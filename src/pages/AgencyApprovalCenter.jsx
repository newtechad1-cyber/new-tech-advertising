import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AgencyLayout from '../components/agency/AgencyLayout';
import { Shield, CheckCircle, XCircle, Clock } from 'lucide-react';

const STATUS_COLORS = {
  pending: 'bg-amber-900/50 text-amber-300',
  approved: 'bg-emerald-900/50 text-emerald-300',
  rejected: 'bg-red-900/50 text-red-300',
};

export default function AgencyApprovalCenter() {
  const [items, setItems] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');

  useEffect(() => { load(); }, []);

  const load = async () => {
    const [it, a] = await Promise.all([
      base44.entities.ApprovalItem.list('-created_date', 200),
      base44.entities.NTAContentAsset.list('-created_date', 200),
    ]);
    setItems(it); setAssets(a); setLoading(false);
  };

  const act = async (id, status, feedback = '') => {
    await base44.entities.ApprovalItem.update(id, { status, feedback });
    setItems(p => p.map(i => i.id === id ? { ...i, status, feedback } : i));
  };

  // Also surface content assets awaiting approval as implicit approval items
  const pendingAssets = assets.filter(a => a.status === 'ready_for_review' && a.approval_status === 'draft');
  const approveAsset = async (asset) => {
    await base44.entities.NTAContentAsset.update(asset.id, { approval_status: 'approved', status: 'approved' });
    await base44.entities.SocialPostQueue.create({
      platform: asset.platform, post_text: asset.caption_text || asset.body_copy || '',
      campaign_id: asset.campaign_id, client_id: asset.client_id,
      publish_status: asset.scheduled_date ? 'scheduled' : 'draft',
      scheduled_time: asset.scheduled_date || null, asset_id: asset.id,
    });
    load();
  };
  const rejectAsset = async (id) => {
    await base44.entities.NTAContentAsset.update(id, { approval_status: 'rejected', status: 'rejected' });
    load();
  };

  const pending = items.filter(i => i.status === 'pending');
  const clientApprovals = items.filter(i => i.status === 'pending' && i.client_id);
  const rejected = items.filter(i => i.status === 'rejected');

  const TABS = [
    { id: 'pending', label: `Pending (${pending.length + pendingAssets.length})` },
    { id: 'client', label: `Client Approvals (${clientApprovals.length})` },
    { id: 'rejected', label: `Rejected (${rejected.length})` },
  ];

  const TAB_CONTENT = {
    pending: [...pendingAssets.map(a => ({ _type: 'asset', ...a })), ...pending.map(i => ({ _type: 'item', ...i }))],
    client: clientApprovals,
    rejected: rejected,
  };

  const rows = TAB_CONTENT[tab] || [];

  return (
    <AgencyLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-white">Approval Center</h1>
          <p className="text-slate-500 text-sm mt-0.5">Review and approve content before it enters the publishing queue</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div><p className="text-2xl font-black text-amber-400">{pending.length + pendingAssets.length}</p><p className="text-xs text-slate-500">Pending</p></div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <div><p className="text-2xl font-black text-blue-400">{clientApprovals.length}</p><p className="text-xs text-slate-500">Client Approvals</p></div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div><p className="text-2xl font-black text-red-400">{rejected.length}</p><p className="text-xs text-slate-500">Rejected</p></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-800">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${tab === t.id ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Rows */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
          {loading ? <p className="p-6 text-slate-600 text-sm">Loading...</p> : rows.length === 0 ? (
            <div className="p-10 text-center">
              <CheckCircle className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              <p className="text-slate-600 text-sm">Nothing here right now.</p>
            </div>
          ) : rows.map(row => (
            <div key={row.id} className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{row.asset_name || row.item_id || '—'}</p>
                <p className="text-xs text-slate-500">{row._type === 'asset' ? `${row.platform} · ${row.asset_type}` : `${row.item_type} · ${row.client_id ? 'Client' : 'Internal'}`}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[row.status || 'pending']}`}>{row.status || 'pending'}</span>
                {(row.status === 'pending' || row._type === 'asset') && (
                  <>
                    <button onClick={() => row._type === 'asset' ? approveAsset(row) : act(row.id, 'approved')}
                      className="text-xs px-3 py-1.5 bg-emerald-800/40 hover:bg-emerald-800 text-emerald-300 rounded-lg font-semibold">Approve</button>
                    <button onClick={() => row._type === 'asset' ? rejectAsset(row.id) : act(row.id, 'rejected')}
                      className="text-xs px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg font-semibold">Reject</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AgencyLayout>
  );
}
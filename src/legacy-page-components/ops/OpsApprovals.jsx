import React, { useState, useEffect } from 'react';
import OpsLayout from '../../components/ops-dashboard/OpsLayout';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, XCircle, MessageSquare, RefreshCw, Clock } from 'lucide-react';

const PLATFORM_ICONS = { facebook: '📘', instagram: '📸', google_business_profile: '📍', linkedin: '💼', email: '✉️', website: '🌐', tiktok: '🎵', youtube: '▶️' };
const TYPE_COLORS = { social_post: 'text-blue-400', ad_copy: 'text-orange-400', blog_post: 'text-green-400', email: 'text-purple-400', landing_page: 'text-cyan-400', video_script: 'text-red-400' };

function FeedbackModal({ asset, action, onConfirm, onClose }) {
  const [feedback, setFeedback] = useState('');
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6">
        <h2 className="text-white font-bold text-lg mb-1">{action === 'reject' ? 'Reject Asset' : 'Request Changes'}</h2>
        <p className="text-slate-400 text-sm mb-4">Provide feedback so this can be revised.</p>
        <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={4} placeholder="What needs to change?"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white resize-none mb-4" />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 text-sm text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-800">Cancel</button>
          <button onClick={() => onConfirm(feedback)} className="flex-1 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg">Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default function OpsApprovals() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [acting, setActing] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.ContentAsset.list('-updated_date', 200);
    setAssets(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (asset, action, feedback = '') => {
    setActing(asset.id);
    await base44.functions.invoke('ntaApprovalWorkflow', { asset_id: asset.id, action, feedback });
    setActing(null);
    setFeedbackModal(null);
    load();
  };

  const tabAssets = assets.filter(a => {
    if (tab === 'pending') return a.approval_status === 'pending';
    if (tab === 'approved') return a.approval_status === 'approved';
    if (tab === 'rejected') return a.approval_status === 'rejected';
    return true;
  });

  const pendingCount = assets.filter(a => a.approval_status === 'pending').length;

  return (
    <OpsLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white">Approval Workflow</h1>
            <p className="text-slate-500 text-sm">{pendingCount} items pending review</p>
          </div>
          <button onClick={load} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg"><RefreshCw className="w-4 h-4" /></button>
        </div>

        <div className="flex gap-1 bg-slate-900 rounded-xl p-1 w-fit">
          {[['pending', `Pending (${pendingCount})`], ['approved', 'Approved'], ['rejected', 'Rejected'], ['all', 'All']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${tab === key ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-slate-900 rounded-xl animate-pulse" />)}</div>
        ) : tabAssets.length === 0 ? (
          <div className="text-center text-slate-600 py-16 text-sm">No items in this queue.</div>
        ) : (
          <div className="space-y-3">
            {tabAssets.map(asset => (
              <div key={asset.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg">{PLATFORM_ICONS[asset.platform] || '📄'}</span>
                      <p className="text-white font-semibold text-sm">{asset.title}</p>
                      <span className={`text-xs font-medium ${TYPE_COLORS[asset.asset_type] || 'text-slate-400'}`}>{asset.asset_type}</span>
                    </div>
                    {asset.notes && asset.notes.includes('REJECTED') && (
                      <p className="text-red-400 text-xs mt-1 bg-red-900/20 rounded px-2 py-1">{asset.notes}</p>
                    )}
                    {asset.notes && asset.notes.includes('REVISION') && (
                      <p className="text-yellow-400 text-xs mt-1 bg-yellow-900/20 rounded px-2 py-1">{asset.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {asset.approval_status === 'pending' && <Clock className="w-4 h-4 text-yellow-400" />}
                    {asset.approval_status === 'approved' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {asset.approval_status === 'rejected' && <XCircle className="w-4 h-4 text-red-400" />}
                    <span className={`text-xs font-semibold ${asset.approval_status === 'approved' ? 'text-emerald-400' : asset.approval_status === 'rejected' ? 'text-red-400' : 'text-yellow-400'}`}>
                      {asset.approval_status}
                    </span>
                  </div>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">{asset.content}</p>

                {asset.approval_status === 'pending' && (
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => handleAction(asset, 'approve')} disabled={acting === asset.id}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg disabled:opacity-50">
                      <CheckCircle2 className="w-3 h-3" /> Approve
                    </button>
                    <button onClick={() => setFeedbackModal({ asset, action: 'request_changes' })}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 text-white rounded-lg">
                      <MessageSquare className="w-3 h-3" /> Request Changes
                    </button>
                    <button onClick={() => setFeedbackModal({ asset, action: 'reject' })}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-lg">
                      <XCircle className="w-3 h-3" /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {feedbackModal && (
        <FeedbackModal
          asset={feedbackModal.asset}
          action={feedbackModal.action}
          onConfirm={(feedback) => handleAction(feedbackModal.asset, feedbackModal.action, feedback)}
          onClose={() => setFeedbackModal(null)}
        />
      )}
    </OpsLayout>
  );
}
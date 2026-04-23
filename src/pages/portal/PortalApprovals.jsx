import React, { useState, useEffect } from 'react';
import PortalLayout from '../../components/portal/PortalLayout';
import { usePortalClient } from '../../lib/usePortalClient';
import { base44 } from '@/api/base44Client';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

const FRIENDLY = {
  'Pending Client Review': 'Waiting for Your Approval',
  'Approved': 'Approved',
  'Rejected': 'Rejected',
  'Revision Requested': 'Changes Requested',
};

export default function PortalApprovals() {
  const { user, client, loading: authLoading } = usePortalClient();
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [revising, setRevising] = useState(null);
  const [revisionNotes, setRevisionNotes] = useState('');

  useEffect(() => {
    if (!client?.id) return;
    base44.entities.ApprovalRequest.filter({ client_id: client.id }).then(a => {
      setApprovals(a.sort((x,y) => (y.created_date||'').localeCompare(x.created_date||'')));
      setLoading(false);
    });
  }, [client?.id]);

  const act = async (req, type) => {
    setSaving(req.id + type);
    const now = new Date().toISOString();
    const newStatus = type === 'approve' ? 'Approved' : type === 'reject' ? 'Rejected' : 'Revision Requested';
    await base44.entities.ApprovalRequest.update(req.id, {
      status: newStatus,
      final_decision: type === 'approve' ? 'Approved' : type === 'reject' ? 'Rejected' : null,
      decided_at: type !== 'revise' ? now : undefined,
      latest_revision_notes: type === 'revise' ? revisionNotes : req.latest_revision_notes,
      revision_count: type === 'revise' ? (req.revision_count || 0) + 1 : req.revision_count,
    });
    await base44.entities.ApprovalActionLog.create({
      approval_request_id: req.id,
      action_type: type === 'approve' ? 'Approved' : type === 'reject' ? 'Rejected' : 'Revision Requested',
      action_by: user?.full_name || user?.email || 'Client',
      action_by_role: 'Client',
      action_date: now,
      notes: type === 'revise' ? revisionNotes : '',
      old_status: req.status, new_status: newStatus,
    });
    setApprovals(prev => prev.map(a => a.id === req.id ? { ...a, status: newStatus } : a));
    setSaving(null);
    setRevising(null);
    setRevisionNotes('');
  };

  if (authLoading || loading) return <Loader />;

  const pending = approvals.filter(a => a.status === 'Pending Client Review');
  const history = approvals.filter(a => a.status !== 'Pending Client Review');

  return (
    <PortalLayout client={client} user={user}>
      <div className="px-6 pt-8 pb-12 max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Approvals</h1>
          <p className="text-slate-500 text-sm mt-1">Review and approve content before it goes live.</p>
        </div>

        {/* Pending */}
        {pending.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Waiting for Your Review</h2>
            {pending.map(req => (
              <div key={req.id} className="bg-white border border-amber-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-slate-100">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{req.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{req.request_type} {req.due_date ? `· Due ${new Date(req.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}</p>
                    </div>
                    <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-1 rounded-full flex-shrink-0">Needs Review</span>
                  </div>
                  {req.message && <p className="text-sm text-slate-600 mt-3 bg-slate-50 rounded-xl px-4 py-3">{req.message}</p>}
                </div>

                {/* Content preview from snapshot */}
                {req.content_snapshot && (() => {
                  try {
                    const snap = JSON.parse(req.content_snapshot);
                    return (
                      <div className="px-5 py-4 space-y-3 border-b border-slate-100">
                        {snap.hook && <div><p className="text-xs text-slate-400 mb-1">Hook</p><div className="bg-slate-50 rounded-xl px-4 py-2 text-sm text-slate-700">{snap.hook}</div></div>}
                        {snap.caption && <div><p className="text-xs text-slate-400 mb-1">Caption</p><div className="bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-700 whitespace-pre-wrap">{snap.caption}</div></div>}
                        {snap.script && <div><p className="text-xs text-slate-400 mb-1">Script</p><div className="bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-700 whitespace-pre-wrap max-h-40 overflow-y-auto">{snap.script}</div></div>}
                        {snap.image_url && <img src={snap.image_url} className="rounded-xl w-full object-cover max-h-60" onError={e => e.target.style.display='none'} />}
                      </div>
                    );
                  } catch { return null; }
                })()}

                {req.media_snapshot_urls && req.media_snapshot_urls.split(',').filter(Boolean).map((url, i) => (
                  <div key={i} className="px-5 py-2"><img src={url.trim()} className="rounded-xl w-full object-cover max-h-52" onError={e => e.target.style.display='none'} /></div>
                ))}

                {revising === req.id ? (
                  <div className="px-5 py-4 bg-orange-50 border-t border-orange-100 space-y-3">
                    <p className="text-sm font-semibold text-orange-700">What would you like changed?</p>
                    <textarea value={revisionNotes} onChange={e => setRevisionNotes(e.target.value)} rows={3} placeholder="Describe what needs to change..."
                      className="w-full bg-white border border-orange-200 rounded-xl px-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-400 resize-none" />
                    <div className="flex gap-2">
                      <button onClick={() => act(req, 'revise')} disabled={!revisionNotes.trim() || !!saving} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl">Submit Request</button>
                      <button onClick={() => { setRevising(null); setRevisionNotes(''); }} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="px-5 py-4 flex flex-wrap gap-2">
                    <button onClick={() => act(req, 'approve')} disabled={!!saving} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl">
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button onClick={() => setRevising(req.id)} className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm rounded-xl">
                      <RotateCcw className="w-4 h-4" /> Request Changes
                    </button>
                    <button onClick={() => act(req, 'reject')} disabled={!!saving} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 font-semibold text-sm rounded-xl">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {pending.length === 0 && (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl">
            <p className="text-4xl mb-3">✅</p>
            <p className="font-semibold text-slate-700">You're all caught up!</p>
            <p className="text-sm text-slate-400 mt-1">No content waiting for your approval right now.</p>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Previous Reviews</h2>
            {history.map(req => (
              <div key={req.id} className="bg-white border border-slate-200 rounded-2xl px-5 py-4 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{req.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{req.request_type} · {req.decided_at ? new Date(req.decided_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ml-3 ${
                  req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                  req.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                  'bg-orange-100 text-orange-700'
                }`}>{FRIENDLY[req.status] || req.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}

function Loader() {
  return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" /></div>;
}
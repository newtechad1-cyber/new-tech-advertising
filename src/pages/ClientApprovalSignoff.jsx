import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle, XCircle, RotateCcw, AlertTriangle } from 'lucide-react';

export default function ClientApprovalSignoff() {
  const token = window.location.pathname.split('/approval/')[1];
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [action, setAction] = useState(null);
  const [notes, setNotes] = useState('');
  const [done, setDone] = useState(null);

  useEffect(() => {
    if (!token) { setError('Invalid approval link.'); setLoading(false); return; }
    base44.entities.ApprovalRequest.filter({ signoff_token: token }).then(results => {
      if (!results || results.length === 0) setError('Approval request not found or link has expired.');
      else setRequest(results[0]);
      setLoading(false);
    });
  }, [token]);

  const submit = async (type) => {
    if (!request) return;
    const now = new Date().toISOString();
    const newStatus = type === 'approve' ? 'Approved' : type === 'reject' ? 'Rejected' : 'Revision Requested';
    await base44.entities.ApprovalRequest.update(request.id, {
      status: newStatus,
      final_decision: type !== 'revise' ? (type === 'approve' ? 'Approved' : 'Rejected') : null,
      decided_at: type !== 'revise' ? now : undefined,
      latest_revision_notes: type === 'revise' ? notes : request.latest_revision_notes,
      revision_count: type === 'revise' ? (request.revision_count || 0) + 1 : request.revision_count,
    });
    await base44.entities.ApprovalActionLog.create({
      approval_request_id: request.id,
      action_type: type === 'approve' ? 'Approved' : type === 'reject' ? 'Rejected' : 'Revision Requested',
      action_by: request.client_contact_name || 'Client',
      action_by_role: 'Client',
      action_date: now,
      notes,
      old_status: request.status,
      new_status: newStatus,
    });
    setDone(type);
  };

  let contentPreview = null;
  if (request?.content_snapshot) { try { contentPreview = JSON.parse(request.content_snapshot); } catch { contentPreview = null; } }

  if (loading) return <Screen><div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" /></Screen>;
  if (error) return <Screen><AlertTriangle className="w-12 h-12 text-red-400 mb-4" /><h1 className="text-xl font-bold text-white mb-2">Invalid Link</h1><p className="text-slate-400 text-sm">{error}</p></Screen>;
  if (done) return (
    <Screen>
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${done === 'approve' ? 'bg-emerald-900/50' : done === 'reject' ? 'bg-red-900/50' : 'bg-orange-900/50'}`}>
        {done === 'approve' ? <CheckCircle className="w-8 h-8 text-emerald-400" /> : done === 'reject' ? <XCircle className="w-8 h-8 text-red-400" /> : <RotateCcw className="w-8 h-8 text-orange-400" />}
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">{done === 'approve' ? 'Approved!' : done === 'reject' ? 'Rejected' : 'Revision Requested'}</h1>
      <p className="text-slate-400 text-sm">{done === 'approve' ? 'Thank you! This content is approved.' : done === 'reject' ? 'The team has been notified.' : 'Your notes have been sent to the team.'}</p>
      <p className="text-slate-600 text-xs mt-6">You may close this tab.</p>
    </Screen>
  );
  if (['Approved','Rejected','Cancelled'].includes(request?.status)) return (
    <Screen><CheckCircle className="w-12 h-12 text-slate-500 mb-4" /><h1 className="text-xl font-bold text-white mb-2">Already {request?.status}</h1><p className="text-slate-400 text-sm">This request has already been acted on.</p></Screen>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center pb-4 border-b border-slate-800">
          <p className="text-xs font-black tracking-widest text-blue-500 uppercase mb-2">New Tech Advertising</p>
          <h1 className="text-2xl font-bold text-white">Content Review Request</h1>
          {request?.business_name && <p className="text-slate-400 text-sm mt-1">For: {request.business_name}</p>}
        </div>
        {request?.message && (
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Message from your team</p>
            <p className="text-slate-300 text-sm leading-relaxed">{request.message}</p>
          </div>
        )}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-4">
          <h2 className="text-base font-bold text-white">{request?.title}</h2>
          {contentPreview?.caption && <div><p className="text-xs text-slate-500 mb-1">Caption</p><div className="bg-slate-800 rounded-xl p-4 text-sm text-slate-200 whitespace-pre-wrap">{contentPreview.caption}</div></div>}
          {contentPreview?.script && <div><p className="text-xs text-slate-500 mb-1">Script</p><div className="bg-slate-800 rounded-xl p-4 text-sm text-slate-200 whitespace-pre-wrap max-h-60 overflow-y-auto">{contentPreview.script}</div></div>}
          {contentPreview?.hook && <div><p className="text-xs text-slate-500 mb-1">Hook</p><div className="bg-slate-800 rounded-xl p-3 text-sm text-slate-200">{contentPreview.hook}</div></div>}
          {request?.media_snapshot_urls && request.media_snapshot_urls.split(',').filter(Boolean).map((url, i) => (
            <img key={i} src={url.trim()} className="rounded-xl w-full object-cover max-h-64" onError={e => e.target.style.display='none'} />
          ))}
          {request?.due_date && <p className="text-xs text-slate-500">Review by: <span className="text-slate-300">{new Date(request.due_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></p>}
        </div>

        {action === 'revise' ? (
          <div className="bg-slate-900 border border-orange-800/50 rounded-2xl p-5 space-y-3">
            <h3 className="text-base font-bold text-orange-300">What needs to change?</h3>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} placeholder="Describe your requested changes..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-orange-500 resize-none" />
            <div className="flex gap-3">
              <button onClick={() => submit('revise')} disabled={!notes.trim()} className="flex-1 py-3 bg-orange-700 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl">Submit</button>
              <button onClick={() => setAction(null)} className="px-5 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-xl">Back</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => submit('approve')} className="flex flex-col items-center gap-2 py-5 bg-emerald-900/40 border-2 border-emerald-700 hover:bg-emerald-900/60 rounded-2xl text-emerald-300 font-bold">
              <CheckCircle className="w-8 h-8" /><span>Approve</span>
            </button>
            <button onClick={() => setAction('revise')} className="flex flex-col items-center gap-2 py-5 bg-orange-900/30 border-2 border-orange-700 hover:bg-orange-900/50 rounded-2xl text-orange-300 font-bold">
              <RotateCcw className="w-8 h-8" /><span>Request Changes</span>
            </button>
            <button onClick={() => submit('reject')} className="flex flex-col items-center gap-2 py-5 bg-red-900/30 border-2 border-red-800 hover:bg-red-900/50 rounded-2xl text-red-300 font-bold">
              <XCircle className="w-8 h-8" /><span>Reject</span>
            </button>
          </div>
        )}
        <p className="text-center text-xs text-slate-700 pb-4">Powered by New Tech Advertising</p>
      </div>
    </div>
  );
}

function Screen({ children }) {
  return <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4"><div className="text-center max-w-sm flex flex-col items-center">{children}</div></div>;
}
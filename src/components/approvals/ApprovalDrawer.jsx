import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, RotateCcw, Send, Copy } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { StatusBadge, fmtDate, isOverdue } from './ApprovalUtils';

export default function ApprovalDrawer({ request, onClose, onUpdated }) {
  const [logs, setLogs] = useState([]);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [saving, setSaving] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    base44.entities.ApprovalActionLog.filter({ approval_request_id: request.id })
      .then(l => setLogs(l.sort((a, b) => (b.action_date || '').localeCompare(a.action_date || ''))));
  }, [request.id]);

  const act = async (action_type, patch, notes = '') => {
    setSaving(action_type);
    const now = new Date().toISOString();
    await base44.entities.ApprovalRequest.update(request.id, { ...patch, ...(patch.status === 'Approved' || patch.status === 'Rejected' ? { decided_at: now } : {}) });
    await base44.entities.ApprovalActionLog.create({
      approval_request_id: request.id, action_type, action_by: 'Agency', action_by_role: 'Internal',
      action_date: now, notes, old_status: request.status, new_status: patch.status || request.status,
    });
    const newLogs = await base44.entities.ApprovalActionLog.filter({ approval_request_id: request.id });
    setLogs(newLogs.sort((a, b) => (b.action_date || '').localeCompare(a.action_date || '')));
    onUpdated({ ...request, ...patch });
    setSaving(null);
  };

  const approve = () => act('Approved', { status: 'Approved', final_decision: 'Approved' });
  const reject = () => act('Rejected', { status: 'Rejected', final_decision: 'Rejected' });
  const requestRevision = () => {
    if (!revisionNotes.trim()) return;
    act('Revision Requested', { status: 'Revision Requested', latest_revision_notes: revisionNotes, revision_count: (request.revision_count || 0) + 1 }, revisionNotes);
    setRevisionNotes('');
  };
  const sendToClient = () => act('Sent for Review', { status: 'Pending Client Review', approval_stage: 'Client Review' });

  const approvalLink = `${window.location.origin}/approval/${request.signoff_token}`;
  const overdue = isOverdue(request.due_date) && !['Approved','Rejected','Cancelled'].includes(request.status);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-end" onClick={onClose}>
      <div className="bg-slate-900 border-l border-slate-700 w-full max-w-xl h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-5 py-4 flex items-start justify-between gap-3 z-10">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white truncate">{request.title}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-xs text-slate-400">{request.business_name || 'NTA'}</span>
              <StatusBadge status={request.status} />
              {overdue && <span className="text-xs font-bold text-red-400 bg-red-900/30 border border-red-800 px-2 py-0.5 rounded-full">⚠ Overdue</span>}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white flex-shrink-0"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[['Type', request.request_type], ['Stage', request.approval_stage], ['Target', request.approval_target], ['Owner', request.internal_owner || '—'], ['Requested', fmtDate(request.requested_date)], ['Due Date', request.due_date ? fmtDate(request.due_date) : '—'], ['Revisions', String(request.revision_count || 0)], ['Decision', request.final_decision || '—']].map(([l, v]) => (
              <div key={l}><p className="text-slate-500">{l}</p><p className="text-slate-300 mt-0.5">{v}</p></div>
            ))}
          </div>

          {request.client_contact_email && (
            <div className="bg-slate-800 rounded-xl p-3">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Client Contact</p>
              <p className="text-sm text-white">{request.client_contact_name || '—'}</p>
              <p className="text-xs text-slate-400">{request.client_contact_email}</p>
            </div>
          )}

          {request.message && <div><p className="text-xs text-slate-500 mb-1.5">Message</p><div className="bg-slate-800 rounded-lg p-3 text-sm text-slate-300">{request.message}</div></div>}
          {request.latest_revision_notes && <div><p className="text-xs text-slate-500 mb-1.5">Revision Notes</p><div className="bg-orange-900/20 border border-orange-800/40 rounded-lg p-3 text-sm text-orange-200">{request.latest_revision_notes}</div></div>}

          {request.signoff_token && (
            <div><p className="text-xs text-slate-500 mb-1.5">Client Approval Link</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-slate-800 rounded-lg px-3 py-2 text-slate-300 truncate">{approvalLink}</code>
                <button onClick={() => { navigator.clipboard.writeText(approvalLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className={`text-xs px-3 py-2 rounded-lg flex-shrink-0 ${copied ? 'bg-emerald-800 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}>
                  {copied ? '✓' : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          )}

          {!['Approved','Rejected','Cancelled'].includes(request.status) && (
            <div><p className="text-xs text-slate-500 mb-1.5">Request Revision</p>
              <textarea value={revisionNotes} onChange={e => setRevisionNotes(e.target.value)} rows={2} placeholder="Describe what needs to change..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            </div>
          )}

          <div>
            <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">Audit Trail</p>
            {logs.length === 0 ? <p className="text-xs text-slate-600 italic">No actions recorded yet.</p> : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {logs.map(log => (
                  <div key={log.id} className="flex gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-300"><span className="font-semibold">{log.action_type}</span>{log.action_by && <span className="text-slate-500"> by {log.action_by}</span>}</p>
                      {log.notes && <p className="text-xs text-slate-500 mt-0.5">{log.notes}</p>}
                      <p className="text-xs text-slate-600 mt-0.5">{fmtDate(log.action_date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 px-5 py-4 flex flex-wrap gap-2">
          {!['Approved','Rejected','Cancelled'].includes(request.status) && (
            <>
              <Btn onClick={approve} loading={saving === 'Approved'} icon={<CheckCircle className="w-3.5 h-3.5" />} label="Approve" cls="bg-emerald-700 hover:bg-emerald-600 text-white" />
              <Btn onClick={reject} loading={saving === 'Rejected'} icon={<XCircle className="w-3.5 h-3.5" />} label="Reject" cls="bg-red-900/40 hover:bg-red-900/60 border border-red-800 text-red-300" />
              <Btn onClick={requestRevision} loading={saving === 'Revision Requested'} icon={<RotateCcw className="w-3.5 h-3.5" />} label="Request Revision" cls="bg-orange-900/40 border border-orange-800 text-orange-300 hover:bg-orange-900/60" />
              {request.approval_stage === 'Internal Review' && (
                <Btn onClick={sendToClient} loading={saving === 'Sent for Review'} icon={<Send className="w-3.5 h-3.5" />} label="Send to Client" cls="bg-blue-700 hover:bg-blue-600 text-white" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Btn({ onClick, loading, icon, label, cls }) {
  return (
    <button onClick={onClick} disabled={loading} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-colors disabled:opacity-50 ${cls}`}>
      {icon}{loading ? '...' : label}
    </button>
  );
}
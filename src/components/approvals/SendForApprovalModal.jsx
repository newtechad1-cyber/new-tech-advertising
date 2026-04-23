import React, { useState } from 'react';
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { generateToken } from './ApprovalUtils';

const STAGES = ['Internal Review', 'Client Review', 'Final Signoff'];
const TYPES = ['Content Review', 'Post Approval', 'Campaign Approval', 'Asset Approval'];

export default function SendForApprovalModal({ items, clients, preferences, onClose, onSaved }) {
  const [form, setForm] = useState({
    request_type: 'Post Approval',
    approval_stage: 'Internal Review',
    approval_target: 'Internal Team',
    message: '',
    due_date: '',
    client_contact_name: '',
    client_contact_email: '',
    internal_owner: '',
  });
  const [saving, setSaving] = useState(false);

  const firstItem = items[0] || {};
  const clientId = firstItem.client_id || '';
  const pref = preferences.find(p => p.client_id === clientId);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleStageChange = (stage) => {
    set('approval_stage', stage);
    set('approval_target', stage === 'Internal Review' ? 'Internal Team' : stage === 'Client Review' ? 'Client' : 'Client + Internal Final Check');
  };

  const save = async () => {
    setSaving(true);
    const now = new Date().toISOString();
    const itemsToProcess = items.length > 0 ? items : [{ content_title: 'Manual Request', client_id: '', business_name: '' }];
    await Promise.all(itemsToProcess.map(async (item) => {
      const token = generateToken();
      const req = await base44.entities.ApprovalRequest.create({
        client_id: item.client_id || '', business_name: item.business_name || item.content_title || '',
        related_content_queue_id: item.id || '',
        title: item.content_title || item.title || 'Approval Request',
        request_type: form.request_type, approval_stage: form.approval_stage, approval_target: form.approval_target,
        message: form.message, due_date: form.due_date || null,
        status: form.approval_stage === 'Internal Review' ? 'Pending Internal Review' : 'Pending Client Review',
        signoff_token: token,
        client_contact_name: form.client_contact_name || pref?.default_approver_name || '',
        client_contact_email: form.client_contact_email || pref?.default_approver_email || '',
        internal_owner: form.internal_owner, requested_by: 'Agency', requested_date: now, revision_count: 0,
      });
      await base44.entities.ApprovalActionLog.create({
        approval_request_id: req.id, action_type: 'Created', action_by: 'Agency', action_by_role: 'Internal',
        action_date: now, notes: form.message || '', new_status: req.status, revision_round: 0,
      });
    }));
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div><h2 className="text-base font-bold text-white">Send for Approval</h2><p className="text-xs text-slate-500 mt-0.5">{items.length} item{items.length !== 1 ? 's' : ''} selected</p></div>
          <button onClick={onClose}><X className="w-4 h-4 text-slate-500 hover:text-white" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className={LBL}>Approval Stage</label>
            <div className="flex gap-2 flex-wrap">
              {STAGES.map(s => <button key={s} onClick={() => handleStageChange(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${form.approval_stage === s ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}>{s}</button>)}
            </div>
          </div>
          <Field label="Request Type"><select value={form.request_type} onChange={e => set('request_type', e.target.value)} className={IN}>{TYPES.map(t => <option key={t}>{t}</option>)}</select></Field>
          {form.approval_stage !== 'Internal Review' && (
            <>
              <Field label="Client Contact Name"><input value={form.client_contact_name} onChange={e => set('client_contact_name', e.target.value)} placeholder={pref?.default_approver_name || 'Client name...'} className={IN} /></Field>
              <Field label="Client Contact Email"><input value={form.client_contact_email} onChange={e => set('client_contact_email', e.target.value)} placeholder={pref?.default_approver_email || 'client@email.com'} className={IN} /></Field>
            </>
          )}
          <Field label="Internal Owner"><input value={form.internal_owner} onChange={e => set('internal_owner', e.target.value)} placeholder="Responsible internally..." className={IN} /></Field>
          <Field label="Due Date"><input type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)} className={IN} /></Field>
          <Field label="Message / Instructions"><textarea value={form.message} onChange={e => set('message', e.target.value)} rows={3} placeholder="Instructions for reviewer..." className={IN} /></Field>
        </div>
        <div className="flex justify-end gap-2 px-6 pb-6">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 bg-slate-800 rounded-lg">Cancel</button>
          <button onClick={save} disabled={saving} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg">{saving ? 'Sending...' : `Send for ${form.approval_stage}`}</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) { return <div><label className={LBL}>{label}</label>{children}</div>; }
const LBL = 'block text-xs font-medium text-slate-400 mb-1';
const IN = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';
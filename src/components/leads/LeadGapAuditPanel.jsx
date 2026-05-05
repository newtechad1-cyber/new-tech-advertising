import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const inp = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';
const lbl = 'block text-xs font-semibold text-slate-400 mb-1';

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${copied ? 'bg-emerald-900/60 text-emerald-300' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}>
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

export default function LeadGapAuditPanel({ lead, onUpdate }) {
  const [form, setForm] = useState({
    audit_type: lead.audit_type || 'written',
    audit_status: lead.audit_status || 'not_started',
    audit_gap1: lead.audit_gap1 || '',
    audit_gap2: lead.audit_gap2 || '',
    audit_gap3: lead.audit_gap3 || '',
    audit_cost_to_them: lead.audit_cost_to_them || '',
    audit_recommended_fix: lead.audit_recommended_fix || '',
    audit_url: lead.audit_url || '',
    audit_sent_date: lead.audit_sent_date || '',
    audit_follow_up_date: lead.audit_follow_up_date || '',
    audit_notes: lead.audit_notes || '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    await onUpdate(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const name = lead.contact_name || lead.business_name || '[Name]';
  const auditUrl = form.audit_url || '[Audit Link]';

  const writtenAuditText = `Just put this together for you — a couple easy wins you could fix pretty fast.

${form.audit_gap1 ? `1. ${form.audit_gap1}` : ''}
${form.audit_gap2 ? `2. ${form.audit_gap2}` : ''}
${form.audit_gap3 ? `3. ${form.audit_gap3}` : ''}

${form.audit_cost_to_them ? `What this might be costing you: ${form.audit_cost_to_them}` : ''}

${auditUrl}

If you want, I can map out exactly how I'd fix this for you step-by-step. No pressure either way.`;

  const deliveryMsg = `Just put this together for you — a couple easy wins you could fix pretty fast.

${auditUrl}

If you want, I can map out exactly how I'd fix this for you step-by-step. No pressure either way.`;

  const nextStepMsg = `Hey ${name} — just checking in on the breakdown I sent over.

Did anything in there stand out? Happy to go deeper on any of it or map out the fix if you want.`;

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gap Audit Details</p>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className={lbl}>Audit Type</label>
            <select value={form.audit_type} onChange={e => setF('audit_type', e.target.value)} className={inp}>
              <option value="written">Written</option>
              <option value="video">Video</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Audit Status</label>
            <select value={form.audit_status} onChange={e => setF('audit_status', e.target.value)} className={inp}>
              <option value="not_started">Not Started</option>
              <option value="requested">Requested</option>
              <option value="in_progress">In Progress</option>
              <option value="sent">Sent</option>
              <option value="followed_up">Followed Up</option>
            </select>
          </div>
        </div>

        <div>
          <label className={lbl}>Main Gap 1</label>
          <input value={form.audit_gap1} onChange={e => setF('audit_gap1', e.target.value)} placeholder="e.g. No Google Business Profile photos" className={inp} />
        </div>
        <div>
          <label className={lbl}>Main Gap 2</label>
          <input value={form.audit_gap2} onChange={e => setF('audit_gap2', e.target.value)} placeholder="e.g. Website loads slow on mobile" className={inp} />
        </div>
        <div>
          <label className={lbl}>Main Gap 3</label>
          <input value={form.audit_gap3} onChange={e => setF('audit_gap3', e.target.value)} placeholder="e.g. No call-to-action above the fold" className={inp} />
        </div>
        <div>
          <label className={lbl}>What This Is Costing Them</label>
          <input value={form.audit_cost_to_them} onChange={e => setF('audit_cost_to_them', e.target.value)} placeholder="e.g. Losing 3-5 leads/month to competitors" className={inp} />
        </div>
        <div>
          <label className={lbl}>Recommended Fix</label>
          <textarea value={form.audit_recommended_fix} onChange={e => setF('audit_recommended_fix', e.target.value)} rows={2} placeholder="What you'd do to fix it..." className={inp + ' resize-none'} />
        </div>
        <div>
          <label className={lbl}>Audit URL</label>
          <input value={form.audit_url} onChange={e => setF('audit_url', e.target.value)} placeholder="https://..." className={inp} />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className={lbl}>Audit Sent Date</label>
            <input type="date" value={form.audit_sent_date} onChange={e => setF('audit_sent_date', e.target.value)} className={inp} />
          </div>
          <div>
            <label className={lbl}>Follow-Up Date</label>
            <input type="date" value={form.audit_follow_up_date} onChange={e => setF('audit_follow_up_date', e.target.value)} className={inp} />
          </div>
        </div>
        <div>
          <label className={lbl}>Audit Notes</label>
          <textarea value={form.audit_notes} onChange={e => setF('audit_notes', e.target.value)} rows={3} className={inp + ' resize-none'} />
        </div>

        <button onClick={save} disabled={saving}
          className={`w-full py-2.5 text-sm font-bold rounded-xl transition-colors ${saved ? 'bg-emerald-700 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50'}`}>
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Audit Data'}
        </button>
      </div>

      {/* Quick Copy Outputs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Copy Messages</p>

        <div className="space-y-3">
          <div className="bg-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">Written Gap Audit Delivery</span>
              <CopyBtn text={writtenAuditText} />
            </div>
            <p className="text-xs text-slate-500 whitespace-pre-wrap">{writtenAuditText}</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">Video Audit Delivery Message</span>
              <CopyBtn text={deliveryMsg} />
            </div>
            <p className="text-xs text-slate-500 whitespace-pre-wrap">{deliveryMsg}</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">Next Step Message</span>
              <CopyBtn text={nextStepMsg} />
            </div>
            <p className="text-xs text-slate-500 whitespace-pre-wrap">{nextStepMsg}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
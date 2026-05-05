import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

const inp = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';
const lbl = 'block text-xs font-semibold text-slate-400 mb-1';

function addDays(n) {
  const d = new Date(); d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
        checked ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50' : 'bg-slate-800 text-slate-500 hover:text-white border border-slate-700'
      }`}
    >
      {checked ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      {label}
    </button>
  );
}

export default function LeadOutreachPanel({ lead, onUpdate }) {
  const [form, setForm] = useState({
    outreach_sent: lead.outreach_sent || false,
    outreach_date: lead.outreach_date || '',
    outreach_platform: lead.outreach_platform || '',
    reply_received: lead.reply_received || false,
    reply_date: lead.reply_date || '',
    followup1_sent: lead.followup1_sent || false,
    followup1_date: lead.followup1_date || '',
    followup2_sent: lead.followup2_sent || false,
    followup2_date: lead.followup2_date || '',
    followup3_sent: lead.followup3_sent || false,
    followup3_date: lead.followup3_date || '',
    next_follow_up: lead.next_follow_up || '',
    last_contacted: lead.last_contacted || '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const markAction = async (action) => {
    const today = new Date().toISOString().split('T')[0];
    const updates = {};
    if (action === 'outreach') {
      updates.outreach_sent = true;
      updates.outreach_date = today;
      updates.last_contacted = today;
      updates.status = 'contacted';
      if (!lead.date_first_contacted) updates.date_first_contacted = today;
      updates.next_follow_up = addDays(2);
    } else if (action === 'replied') {
      updates.reply_received = true;
      updates.reply_date = today;
      updates.status = 'replied';
    } else if (action === 'followup1') {
      updates.followup1_sent = true;
      updates.followup1_date = today;
      updates.last_contacted = today;
      updates.next_follow_up = addDays(3);
    } else if (action === 'followup2') {
      updates.followup2_sent = true;
      updates.followup2_date = today;
      updates.last_contacted = today;
      updates.next_follow_up = addDays(5);
    } else if (action === 'followup3') {
      updates.followup3_sent = true;
      updates.followup3_date = today;
      updates.last_contacted = today;
      updates.next_follow_up = addDays(7);
    }
    setForm(p => ({ ...p, ...updates }));
    await onUpdate(updates);
  };

  const save = async () => {
    setSaving(true);
    await onUpdate(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">

      {/* Quick Mark Buttons */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Mark</p>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => markAction('outreach')} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-900/40 hover:bg-blue-900/60 text-blue-300 transition-colors">
            ✉️ Mark Outreach Sent
          </button>
          <button onClick={() => markAction('replied')} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-violet-900/40 hover:bg-violet-900/60 text-violet-300 transition-colors">
            💬 Mark Reply Received
          </button>
          <button onClick={() => markAction('followup1')} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-900/40 hover:bg-amber-900/60 text-amber-300 transition-colors">
            📬 Follow-Up 1 Sent (+3 days)
          </button>
          <button onClick={() => markAction('followup2')} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-orange-900/40 hover:bg-orange-900/60 text-orange-300 transition-colors">
            📬 Follow-Up 2 Sent (+5 days)
          </button>
          <button onClick={() => markAction('followup3')} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-900/30 hover:bg-red-900/50 text-red-300 transition-colors">
            📬 Follow-Up 3 Sent (+7 days)
          </button>
        </div>
      </div>

      {/* Tracking Fields */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Outreach Tracking</p>

        {/* Initial Outreach */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-3 border-b border-slate-800">
          <div>
            <label className={lbl}>Initial Outreach Sent</label>
            <Toggle checked={form.outreach_sent} onChange={v => setF('outreach_sent', v)} label={form.outreach_sent ? 'Sent ✓' : 'Not Sent'} />
          </div>
          <div>
            <label className={lbl}>Outreach Date</label>
            <input type="date" value={form.outreach_date || ''} onChange={e => setF('outreach_date', e.target.value)} className={inp} />
          </div>
          <div>
            <label className={lbl}>Platform Contacted On</label>
            <input value={form.outreach_platform || ''} onChange={e => setF('outreach_platform', e.target.value)} placeholder="Facebook, text, email..." className={inp} />
          </div>
        </div>

        {/* Reply */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-800">
          <div>
            <label className={lbl}>Reply Received</label>
            <Toggle checked={form.reply_received} onChange={v => setF('reply_received', v)} label={form.reply_received ? 'Yes ✓' : 'No'} />
          </div>
          <div>
            <label className={lbl}>Reply Date</label>
            <input type="date" value={form.reply_date || ''} onChange={e => setF('reply_date', e.target.value)} className={inp} />
          </div>
        </div>

        {/* Follow-ups */}
        {[1, 2, 3].map(n => (
          <div key={n} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-800 last:border-0">
            <div>
              <label className={lbl}>Follow-Up {n}</label>
              <Toggle checked={form[`followup${n}_sent`]} onChange={v => setF(`followup${n}_sent`, v)} label={form[`followup${n}_sent`] ? `Sent ✓` : `Not Sent`} />
            </div>
            <div>
              <label className={lbl}>Date</label>
              <input type="date" value={form[`followup${n}_date`] || ''} onChange={e => setF(`followup${n}_date`, e.target.value)} className={inp} />
            </div>
          </div>
        ))}

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={lbl}>Last Contacted</label>
            <input type="date" value={form.last_contacted || ''} onChange={e => setF('last_contacted', e.target.value)} className={inp} />
          </div>
          <div>
            <label className={lbl}>Next Follow-Up Date</label>
            <input type="date" value={form.next_follow_up || ''} onChange={e => setF('next_follow_up', e.target.value)} className={inp} />
          </div>
        </div>

        <button onClick={save} disabled={saving}
          className={`w-full py-2.5 text-sm font-bold rounded-xl transition-colors ${saved ? 'bg-emerald-700 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50'}`}>
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Outreach Data'}
        </button>
      </div>
    </div>
  );
}
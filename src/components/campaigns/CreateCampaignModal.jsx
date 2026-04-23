import React, { useState } from 'react';
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const TYPES = ['Social Posting', 'Promo Campaign', 'Seasonal Campaign', 'Local SEO Support', 'Video Campaign', 'Reputation Campaign', 'Lead Generation', 'Offer Launch'];
const STATUSES = ['Draft', 'Planned', 'Active'];

export default function CreateCampaignModal({ clients, onClose, onSaved, prefillClientId }) {
  const [form, setForm] = useState({
    campaign_name: '',
    client_id: prefillClientId || '',
    business_name: '',
    campaign_type: 'Social Posting',
    objective: '',
    target_audience: '',
    offer_or_message: '',
    start_date: '',
    end_date: '',
    status: 'Draft',
    budget: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => {
    const update = { ...form, [k]: v };
    if (k === 'client_id') {
      const c = clients.find(c => c.id === v);
      update.business_name = c?.business_name || '';
    }
    setForm(update);
  };

  const save = async () => {
    if (!form.campaign_name.trim()) return;
    setSaving(true);
    await base44.entities.Campaign.create({ ...form, budget: form.budget ? Number(form.budget) : null });
    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-base font-bold text-white">New Campaign</h2>
          <button onClick={onClose}><X className="w-4 h-4 text-slate-500 hover:text-white" /></button>
        </div>
        <div className="p-6 space-y-4">
          <Field label="Campaign Name *">
            <input value={form.campaign_name} onChange={e => set('campaign_name', e.target.value)} placeholder="e.g. Spring Promo 2026" className={INPUT} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Client / Business">
              <select value={form.client_id} onChange={e => set('client_id', e.target.value)} className={INPUT}>
                <option value="">— NTA Internal —</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
              </select>
            </Field>
            <Field label="Campaign Type">
              <select value={form.campaign_type} onChange={e => set('campaign_type', e.target.value)} className={INPUT}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Objective">
            <input value={form.objective} onChange={e => set('objective', e.target.value)} placeholder="What is the goal?" className={INPUT} />
          </Field>
          <Field label="Offer / Message">
            <textarea value={form.offer_or_message} onChange={e => set('offer_or_message', e.target.value)} rows={2} placeholder="Core message or offer..." className={INPUT} />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Start Date">
              <input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} className={INPUT} />
            </Field>
            <Field label="End Date">
              <input type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)} className={INPUT} />
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={e => set('status', e.target.value)} className={INPUT}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Notes">
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} placeholder="Internal notes..." className={INPUT} />
          </Field>
        </div>
        <div className="flex justify-end gap-2 px-6 pb-6">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-white bg-slate-800 rounded-lg">Cancel</button>
          <button onClick={save} disabled={saving || !form.campaign_name.trim()} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg">
            {saving ? 'Saving...' : 'Create Campaign'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
      {children}
    </div>
  );
}

const INPUT = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';
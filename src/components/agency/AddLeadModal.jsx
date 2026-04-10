import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const BLANK = {
  first_name: '', last_name: '', business_name: '', phone: '', email: '',
  website: '', city: '', state: '', industry: '',
  lead_source: 'other', notes: '', status: 'new',
};

const SOURCE_LABELS = {
  website: 'Website', cold_outreach: 'Cold Outreach', referral: 'Referral',
  walk_in: 'Walk-In', other: 'Other',
};

export default function AddLeadModal({ onClose, onSaved }) {
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = 'Required';
    if (!form.business_name.trim()) e.business_name = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    // Create lead
    const lead = await base44.entities.SalesLead.create(form);
    // Auto-create deal
    const deal = await base44.entities.SalesDeal.create({
      lead_id: lead.id,
      deal_name: form.business_name,
      stage: 'New Lead',
      archived: false,
    });
    setSaving(false);
    onSaved({ lead, deal });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 flex-shrink-0">
          <div>
            <h2 className="font-bold text-white">Add New Lead</h2>
            <p className="text-slate-500 text-xs mt-0.5">A pipeline deal will be created automatically.</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white rounded-lg"><X className="w-4 h-4" /></button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="First Name *" error={errors.first_name}>
              <input value={form.first_name} onChange={e => set('first_name', e.target.value)}
                placeholder="John" className={inp(errors.first_name)} />
            </Field>
            <Field label="Last Name">
              <input value={form.last_name} onChange={e => set('last_name', e.target.value)}
                placeholder="Smith" className={inp()} />
            </Field>
          </div>

          <Field label="Business Name *" error={errors.business_name}>
            <input value={form.business_name} onChange={e => set('business_name', e.target.value)}
              placeholder="Acme HVAC" className={inp(errors.business_name)} />
          </Field>

          {/* Contact row */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone *" error={errors.phone}>
              <input value={form.phone} onChange={e => set('phone', e.target.value)}
                placeholder="(641) 555-0100" className={inp(errors.phone)} />
            </Field>
            <Field label="Email *" error={errors.email}>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="john@acme.com" className={inp(errors.email)} />
            </Field>
          </div>

          <Field label="Website">
            <input value={form.website} onChange={e => set('website', e.target.value)}
              placeholder="acmehvac.com" className={inp()} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="City">
              <input value={form.city} onChange={e => set('city', e.target.value)} placeholder="Mason City" className={inp()} />
            </Field>
            <Field label="State">
              <input value={form.state} onChange={e => set('state', e.target.value)} placeholder="IA" className={inp()} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Industry">
              <input value={form.industry} onChange={e => set('industry', e.target.value)} placeholder="HVAC" className={inp()} />
            </Field>
            <Field label="Lead Source">
              <div className="relative">
                <select value={form.lead_source} onChange={e => set('lead_source', e.target.value)}
                  className={inp() + ' appearance-none pr-8'}>
                  {Object.entries(SOURCE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </Field>
          </div>

          <Field label="Notes">
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
              rows={3} placeholder="Any context about this lead..."
              className={inp() + ' resize-none'} />
          </Field>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 border-t border-slate-800 flex-shrink-0">
          <button onClick={save} disabled={saving}
            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
            {saving ? 'Saving...' : 'Add Lead & Create Deal'}
          </button>
          <button onClick={onClose} className="px-5 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-400 block mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}

function inp(err) {
  return `w-full bg-slate-800 border ${err ? 'border-red-500' : 'border-slate-700'} rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500`;
}
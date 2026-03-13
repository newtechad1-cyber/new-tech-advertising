import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { X } from 'lucide-react';

const SOURCE_OPTIONS = [
  { key: 'authority_content_seo', label: 'Authority Content SEO' },
  { key: 'social_authority',      label: 'Social Authority Presence' },
  { key: 'outbound_prospecting',  label: 'Targeted Outbound' },
  { key: 'referral_expansion',    label: 'Referral Expansion' },
  { key: 'territory_campaigns',   label: 'Territory Campaign' },
  { key: 'demo_request',          label: 'Direct Demo Request' },
  { key: 'paid_amplification',    label: 'Paid Amplification' },
  { key: 'partner',               label: 'Partner Channel' },
  { key: 'other',                 label: 'Other' },
];

export default function ACQNewAttributionModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ source_key: 'demo_request', company_name: '', contact_name: '', contact_email: '', industry: '', city: '', deal_value: '', referrer_company: '', keyword: '' });
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.OutreachCampaign.filter({ status: 'active' }).then(d => setCampaigns(d || []));
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.company_name || !form.source_key) return;
    setSaving(true);
    await base44.functions.invoke('ntaAcquisitionEngine', {
      action: 'create_attribution',
      ...form,
      deal_value: parseFloat(form.deal_value) || 0,
      campaign_id: selectedCampaign || undefined,
    });
    setSaving(false);
    onSaved?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-black text-slate-900">Log Lead Attribution</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="text-xs font-black text-slate-700 mb-1.5 block">Acquisition Source *</label>
            <select value={form.source_key} onChange={e => set('source_key', e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:border-slate-400">
              {SOURCE_OPTIONS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
          {['company_name', 'contact_name', 'contact_email', 'industry', 'city'].map(field => (
            <div key={field}>
              <label className="text-xs font-black text-slate-700 mb-1.5 block capitalize">{field.replace(/_/g, ' ')}{field === 'company_name' ? ' *' : ''}</label>
              <input value={form[field]} onChange={e => set(field, e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-slate-400" />
            </div>
          ))}
          {form.source_key === 'referral_expansion' && (
            <div>
              <label className="text-xs font-black text-slate-700 mb-1.5 block">Referrer Company</label>
              <input value={form.referrer_company} onChange={e => set('referrer_company', e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-slate-400" />
            </div>
          )}
          {form.source_key === 'authority_content_seo' && (
            <div>
              <label className="text-xs font-black text-slate-700 mb-1.5 block">Keyword / Content Credited</label>
              <input value={form.keyword} onChange={e => set('keyword', e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-slate-400" />
            </div>
          )}
          <div>
            <label className="text-xs font-black text-slate-700 mb-1.5 block">Estimated Deal Value</label>
            <input type="number" value={form.deal_value} onChange={e => set('deal_value', e.target.value)}
              placeholder="0" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-slate-400" />
          </div>
          {campaigns.length > 0 && (
            <div>
              <label className="text-xs font-black text-slate-700 mb-1.5 block">Link to Campaign (optional)</label>
              <select value={selectedCampaign} onChange={e => setSelectedCampaign(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:border-slate-400">
                <option value="">— None —</option>
                {campaigns.map(c => <option key={c.id} value={c.id}>{c.campaign_name}</option>)}
              </select>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:border-slate-300">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.company_name}
            className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-black hover:bg-slate-800 disabled:opacity-40">
            {saving ? 'Saving…' : 'Log Lead'}
          </button>
        </div>
      </div>
    </div>
  );
}
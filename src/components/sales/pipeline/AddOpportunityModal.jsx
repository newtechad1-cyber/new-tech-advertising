import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddOpportunityModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    company_name: '', contact_name: '', contact_email: '', phone: '',
    city: '', industry: 'hvac', deal_value: '', assigned_owner: '',
    source: 'website', next_step_due: '', next_step_description: '', notes: ''
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.company_name) return;
    onCreate({ ...form, deal_value: parseFloat(form.deal_value) || 0 });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-white text-xl font-bold">New Sales Opportunity</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-slate-400 text-xs font-medium block mb-1">Company Name *</label>
              <input required value={form.company_name} onChange={e => set('company_name', e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="ABC HVAC Services" />
            </div>
            <div>
              <label className="text-slate-400 text-xs font-medium block mb-1">Contact Name</label>
              <input value={form.contact_name} onChange={e => set('contact_name', e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="John Smith" />
            </div>
            <div>
              <label className="text-slate-400 text-xs font-medium block mb-1">Phone</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="(555) 555-5555" />
            </div>
            <div>
              <label className="text-slate-400 text-xs font-medium block mb-1">Email</label>
              <input type="email" value={form.contact_email} onChange={e => set('contact_email', e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="john@company.com" />
            </div>
            <div>
              <label className="text-slate-400 text-xs font-medium block mb-1">City</label>
              <input value={form.city} onChange={e => set('city', e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="Austin, TX" />
            </div>
            <div>
              <label className="text-slate-400 text-xs font-medium block mb-1">Industry</label>
              <select value={form.industry} onChange={e => set('industry', e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 capitalize">
                {['hvac', 'plumbing', 'roofing', 'landscaping', 'electrical', 'painting', 'fitness', 'restaurant', 'real_estate', 'other'].map(i => (
                  <option key={i} value={i}>{i.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-xs font-medium block mb-1">Deal Value ($)</label>
              <input type="number" value={form.deal_value} onChange={e => set('deal_value', e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="1500" />
            </div>
            <div>
              <label className="text-slate-400 text-xs font-medium block mb-1">Source</label>
              <select value={form.source} onChange={e => set('source', e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                {['referral', 'website', 'cold_outreach', 'demo_request', 'paid_ad', 'partner', 'event', 'other'].map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-xs font-medium block mb-1">Assigned Owner</label>
              <input value={form.assigned_owner} onChange={e => set('assigned_owner', e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="Sarah Chen" />
            </div>
            <div>
              <label className="text-slate-400 text-xs font-medium block mb-1">Next Step Due</label>
              <input type="date" value={form.next_step_due} onChange={e => set('next_step_due', e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div className="col-span-2">
              <label className="text-slate-400 text-xs font-medium block mb-1">Next Step</label>
              <input value={form.next_step_description} onChange={e => set('next_step_description', e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="Follow up call to qualify..." />
            </div>
            <div className="col-span-2">
              <label className="text-slate-400 text-xs font-medium block mb-1">Notes</label>
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none" placeholder="Context, pain points, budget notes..." />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 hover:text-white rounded-lg text-sm font-semibold transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors">
              Create Opportunity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
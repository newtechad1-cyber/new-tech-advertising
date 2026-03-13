import React, { useState } from 'react';
import { X, Loader2, CheckCircle2 } from 'lucide-react';

export default function RSAddResellerModal({ onClose, onSave }) {
  const [form, setForm] = useState({ company_name: '', contact_name: '', contact_email: '', phone: '', tier: 'standard', revenue_share_percent: 20, territory: '' });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.company_name || !form.contact_email) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    onSave({ ...form, status: 'pending', active_clients: 0, monthly_revenue: 0, pipeline_value: 0 });
    setSaving(false);
    setDone(true);
    setTimeout(onClose, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <h2 className="text-white font-black text-lg">Add New Reseller</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        {done ? (
          <div className="p-10 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-white font-bold text-lg">Reseller Created!</p>
            <p className="text-slate-400 text-sm mt-1">Portal provisioning initiated.</p>
          </div>
        ) : (
          <>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Company Name *', key: 'company_name', placeholder: 'Peak Media Group' },
                  { label: 'Contact Name', key: 'contact_name', placeholder: 'Jane Smith' },
                  { label: 'Email *', key: 'contact_email', placeholder: 'jane@company.com' },
                  { label: 'Phone', key: 'phone', placeholder: '+1 (303) 555-0100' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-slate-400 text-xs font-semibold mb-1">{field.label}</label>
                    <input type="text" placeholder={field.placeholder} value={form[field.key]}
                      onChange={e => f(field.key, e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500" />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1">Partner Tier</label>
                  <select value={form.tier} onChange={e => f('tier', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500">
                    <option value="standard">Standard</option>
                    <option value="preferred">Preferred</option>
                    <option value="elite">Elite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-1">Revenue Share %</label>
                  <input type="number" min={10} max={35} value={form.revenue_share_percent}
                    onChange={e => f('revenue_share_percent', +e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500" />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1">Primary Territory</label>
                <input type="text" placeholder="Denver Metro, CO" value={form.territory}
                  onChange={e => f('territory', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500" />
              </div>
              <div className="p-3 bg-purple-950/20 border border-purple-800/30 rounded-xl text-xs text-purple-300/70">
                A reseller portal will be auto-provisioned upon saving. Credentials will be emailed to the contact.
              </div>
            </div>
            <div className="px-6 pb-6 flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm hover:bg-slate-800 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.company_name || !form.contact_email}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors disabled:opacity-50">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? 'Creating...' : 'Create Reseller + Portal'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
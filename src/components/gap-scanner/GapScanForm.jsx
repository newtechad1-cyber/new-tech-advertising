import React, { useState } from 'react';
import { Loader2, Zap, AlertCircle } from 'lucide-react';

const INDUSTRIES = ['HVAC', 'Plumbing', 'Roofing', 'Landscaping', 'Dental', 'Chiropractic', 'Restaurant', 'Retail', 'Auto Repair', 'Real Estate', 'Law', 'Accounting', 'Cleaning Services', 'Electrician', 'Construction', 'Salon/Spa', 'Fitness', 'Other'];

export default function GapScanForm({ onResult, initialData = {} }) {
  const [form, setForm] = useState({
    businessName: initialData.businessName || '',
    websiteUrl: initialData.websiteUrl || '',
    industry: initialData.industry || '',
    city: initialData.city || '',
    contactName: initialData.contactName || '',
    leadSource: initialData.leadSource || '',
    notes: initialData.notes || '',
    pastedContent: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPaste, setShowPaste] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const run = async () => {
    if (!form.businessName.trim() || !form.websiteUrl.trim()) {
      setError('Business name and website URL are required.');
      return;
    }
    setError(null);
    setLoading(true);
    const { base44 } = await import('@/api/base44Client');
    const res = await base44.functions.invoke('runAiGapScan', form);
    setLoading(false);
    if (res.data?.success) {
      onResult(res.data.audit, form, res.data.websiteAccessible);
    } else {
      setError(res.data?.error || 'Scan failed. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Business Name *">
          <input value={form.businessName} onChange={e => set('businessName', e.target.value)}
            placeholder="Acme HVAC" className={inp()} />
        </Field>
        <Field label="Website URL *">
          <input value={form.websiteUrl} onChange={e => set('websiteUrl', e.target.value)}
            placeholder="https://acmehvac.com" className={inp()} />
        </Field>
        <Field label="Industry">
          <select value={form.industry} onChange={e => set('industry', e.target.value)} className={inp()}>
            <option value="">Select industry...</option>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </Field>
        <Field label="City / Market">
          <input value={form.city} onChange={e => set('city', e.target.value)}
            placeholder="Mason City, IA" className={inp()} />
        </Field>
        <Field label="Contact Name">
          <input value={form.contactName} onChange={e => set('contactName', e.target.value)}
            placeholder="John Smith" className={inp()} />
        </Field>
        <Field label="Lead Source">
          <input value={form.leadSource} onChange={e => set('leadSource', e.target.value)}
            placeholder="Google Maps, Referral..." className={inp()} />
        </Field>
      </div>

      <Field label="Notes (optional)">
        <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
          rows={2} placeholder="Any context about this prospect..."
          className={inp() + ' resize-none'} />
      </Field>

      {/* Paste fallback */}
      <div>
        <button onClick={() => setShowPaste(!showPaste)}
          className="text-xs text-slate-500 hover:text-slate-300 underline">
          {showPaste ? '▲ Hide' : '▼ Website not loading?'} Paste website text manually
        </button>
        {showPaste && (
          <textarea value={form.pastedContent} onChange={e => set('pastedContent', e.target.value)}
            rows={5} placeholder="Paste the text content from the website here..."
            className={inp() + ' resize-none mt-2 text-xs'} />
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-950/40 border border-red-800/50 rounded-xl px-3 py-2 text-xs text-red-400">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{error}
        </div>
      )}

      <button onClick={run} disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-colors">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Scanning website...</> : <><Zap className="w-4 h-4" /> Run AI Gap Scan</>}
      </button>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-400 block mb-1">{label}</label>
      {children}
    </div>
  );
}

function inp() {
  return 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';
}
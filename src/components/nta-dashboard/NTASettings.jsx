import React, { useState } from 'react';
import { Save, Check } from 'lucide-react';

const DEFAULTS = {
  business_name: 'New Tech Advertising',
  owner_name: 'Rick Hesse',
  email: 'rick@newtech.ad',
  phone: '(641) 555-0100',
  website: 'https://newtech.ad',
  primary_color: '#2563eb',
  secondary_color: '#7c3aed',
  default_cta: 'Book a free website audit at newtech.ad',
  default_platforms: 'Facebook, LinkedIn, GBP',
  tagline: 'Modern Marketing for Local Business',
};

export default function NTASettings() {
  const [form, setForm] = useState(() => {
    try { return { ...DEFAULTS, ...(JSON.parse(localStorage.getItem('nta_settings') || '{}')) }; }
    catch { return { ...DEFAULTS }; }
  });
  const [saved, setSaved] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const save = () => {
    localStorage.setItem('nta_settings', JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-black text-white">Settings</h1>

      <Section title="Business Info">
        <F label="Business Name"><input value={form.business_name} onChange={e => set('business_name', e.target.value)} className={inp} /></F>
        <F label="Owner Name"><input value={form.owner_name} onChange={e => set('owner_name', e.target.value)} className={inp} /></F>
        <div className="grid grid-cols-2 gap-3">
          <F label="Email"><input type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inp} /></F>
          <F label="Phone"><input value={form.phone} onChange={e => set('phone', e.target.value)} className={inp} /></F>
        </div>
        <F label="Website"><input value={form.website} onChange={e => set('website', e.target.value)} className={inp} /></F>
        <F label="Tagline"><input value={form.tagline} onChange={e => set('tagline', e.target.value)} className={inp} /></F>
      </Section>

      <Section title="Brand">
        <div className="grid grid-cols-2 gap-3">
          <F label="Primary Color">
            <div className="flex items-center gap-2">
              <input type="color" value={form.primary_color} onChange={e => set('primary_color', e.target.value)} className="w-10 h-10 rounded-lg border border-slate-700 bg-slate-800 cursor-pointer p-1" />
              <input value={form.primary_color} onChange={e => set('primary_color', e.target.value)} className={inp} placeholder="#2563eb" />
            </div>
          </F>
          <F label="Secondary Color">
            <div className="flex items-center gap-2">
              <input type="color" value={form.secondary_color} onChange={e => set('secondary_color', e.target.value)} className="w-10 h-10 rounded-lg border border-slate-700 bg-slate-800 cursor-pointer p-1" />
              <input value={form.secondary_color} onChange={e => set('secondary_color', e.target.value)} className={inp} placeholder="#7c3aed" />
            </div>
          </F>
        </div>
      </Section>

      <Section title="Content Defaults">
        <F label="Default CTA">
          <textarea value={form.default_cta} onChange={e => set('default_cta', e.target.value)} rows={2} className={inp + ' resize-none'} />
        </F>
        <F label="Default Platforms">
          <input value={form.default_platforms} onChange={e => set('default_platforms', e.target.value)} className={inp} placeholder="Facebook, LinkedIn, GBP" />
        </F>
      </Section>

      <button onClick={save} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl transition-colors">
        {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Settings</>}
      </button>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">{title}</h2>
      {children}
    </div>
  );
}

function F({ label, children }) {
  return <div><label className="text-xs font-semibold text-slate-400 block mb-1">{label}</label>{children}</div>;
}

const inp = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500';
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Star } from 'lucide-react';

export default function HVACLeadForm({ ctaLabel = 'Request Your Free HVAC Demo System', compact = false }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', email: '', business_name: '' });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.business_name) return;
    setLoading(true);
    // Mirror to NTA Unified Intake (non-blocking)
    base44.functions.invoke('ntaUnifiedIntake', {
      submission_type: 'hvac_funnel_lead',
      offer_type: 'hvac_marketing',
      mapping_confidence: 'hardcoded',
      mapping_notes: 'HVACLeadForm.jsx hardcoded',
      detected_route: window.location.pathname,
      detected_component: 'HVACLeadForm',
      source_system: 'hvac_funnel',
      source_page: window.location.pathname,
      name: form.name,
      business_name: form.business_name,
      email: form.email,
      phone: form.phone,
      priority: 'high',
      is_high_intent: true,
      notes: 'HVAC Growth System funnel lead',
    }).catch(err => console.warn('[HVACLeadForm] NTA mirror failed:', err.message));

    await base44.entities.SalesLead.create({
      contact_name: form.name,
      phone: form.phone,
      email: form.email,
      business_name: form.business_name,
      lead_source: 'website',
      status: 'new',
      notes: 'HVAC Growth System funnel lead',
    });
    await base44.integrations.Core.SendEmail({
      to: 'newtechad1@gmail.com',
      subject: `New HVAC Funnel Lead: ${form.business_name}`,
      body: `New lead from the HVAC Growth System funnel:\n\nName: ${form.name}\nBusiness: ${form.business_name}\nPhone: ${form.phone}\nEmail: ${form.email}`,
    });
    setLoading(false);
    navigate('/hvac-funnel/thank-you');
  };

  return (
    <div className={`bg-white rounded-2xl shadow-2xl ${compact ? 'p-5' : 'p-8'} w-full max-w-lg mx-auto`}>
      {!compact && (
        <div className="text-center mb-6">
          <p className="text-2xl font-black text-slate-900">Get Your Free Demo System</p>
          <p className="text-slate-500 text-sm mt-1">We'll build it for your HVAC business — no cost, no obligation.</p>
        </div>
      )}
      <form onSubmit={submit} className="space-y-3">
        <input required value={form.name} onChange={e => set('name', e.target.value)}
          placeholder="Your Name" className={fi} />
        <input required value={form.business_name} onChange={e => set('business_name', e.target.value)}
          placeholder="Business Name" className={fi} />
        <input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
          placeholder="Phone Number" className={fi} />
        <input required type="email" value={form.email} onChange={e => set('email', e.target.value)}
          placeholder="Email Address" className={fi} />
        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-black py-4 rounded-xl text-base transition-all shadow-lg shadow-blue-600/30">
          {loading ? 'Submitting...' : <>{ctaLabel} <ArrowRight className="w-5 h-5" /></>}
        </button>
      </form>
      <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
        <div className="flex items-center gap-1 text-xs text-slate-500"><Shield className="w-3.5 h-3.5 text-emerald-500" /> 100% Secure</div>
        <div className="flex items-center gap-1 text-xs text-slate-500"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> 5-Star Rated</div>
        <div className="flex items-center gap-1 text-xs text-slate-500">✓ No Spam</div>
      </div>
    </div>
  );
}

const fi = 'w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';
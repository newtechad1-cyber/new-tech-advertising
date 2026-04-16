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

    try {
      // 1. Create Submission
      const submission = await base44.entities.Submission.create({
        submission_type: 'hvac_funnel_lead',
        source_system: 'hvac_funnel',
        source_page: window.location.pathname,
        name: form.name,
        business_name: form.business_name,
        email: form.email,
        phone: form.phone,
        notes: 'HVAC Growth System funnel lead',
        processing_status: 'processing',
        priority: 'high',
        raw_payload: JSON.stringify({ ...form, _nta_debug: { detected_component: 'HVACLeadForm', offer_type: 'hvac_marketing' } }),
      });

      // 2. Create Company
      const company = await base44.entities.NTACompany.create({
        company_name: form.business_name,
        email: form.email,
        phone: form.phone,
        source: 'hvac_funnel',
        owner_name: form.name,
        primary_contact_name: form.name,
        primary_contact_email: form.email,
        primary_contact_phone: form.phone,
        status: 'prospect',
        lifecycle_stage: 'lead',
      });

      // 3. Create Opportunity
      const opportunity = await base44.entities.NTAOpportunity.create({
        company_id: company.id,
        submission_id: submission.id,
        opportunity_name: `${form.business_name} — HVAC Marketing`,
        offer_type: 'hvac_marketing',
        stage: 'new',
        status: 'open',
        source: 'website',
        notes: 'HVAC Growth System funnel lead',
      });

      // 4. Create Activity
      await base44.entities.NTAActivity.create({
        company_id: company.id,
        opportunity_id: opportunity.id,
        submission_id: submission.id,
        activity_type: 'submission',
        title: `HVAC funnel lead: ${form.business_name}`,
        details: `Name: ${form.name} | Phone: ${form.phone} | Email: ${form.email}`,
        source_system: 'hvac_funnel',
      });

      // 5. Create follow-up Task
      await base44.entities.NTATask.create({
        company_id: company.id,
        opportunity_id: opportunity.id,
        submission_id: submission.id,
        task_type: 'follow_up',
        title: `Follow up with ${form.business_name}`,
        description: `HVAC funnel lead. Contact: ${form.name} | ${form.phone} | ${form.email}`,
        status: 'todo',
        priority: 'high',
        source_system: 'hvac_funnel',
      });

      // 6. Update submission status
      await base44.entities.Submission.update(submission.id, {
        matched_company_id: company.id,
        processing_status: 'completed',
      });
    } catch (err) {
      console.warn('[HVACLeadForm] NTA record creation failed:', err.message);
    }

    // Keep legacy SalesLead for backward compat
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
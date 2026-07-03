import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { ArrowRight, CheckCircle, Building2, Mail, Phone, User, Globe, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { createAgencyLead } from '@/lib/createAgencyLead';

const LOGO_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';

const SERVICE_TYPES = [
  { value: 'ada_rebuild', label: 'ADA Compliance Rebuild' },
  { value: 'website_rebuild', label: 'Full Website Rebuild' },
  { value: 'both', label: 'Both — ADA + Full Rebuild' },
];

const PAGE_COUNTS = ['1–10', '11–20', '21–50', '50+'];

export default function RebuildIntake() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=form, 2=success
  const [submitting, setSubmitting] = useState(false);
  const [partialSuccess, setPartialSuccess] = useState(null); // tracks which step failed

  // Detect source from URL param e.g. ?source=mason-city or ?source=website-rebuild-service
  const urlParams = new URLSearchParams(window.location.search);
  const sourcePage = urlParams.get('source') || 'rebuild-intake';

  const [form, setForm] = useState({
    name: '', email: '', phone: '', business_name: '',
    website: '', city: '', state: '', industry: '',
    service_type: 'ada_rebuild', page_count: '1–10',
    notes: '',
  });
  // Anti-spam: honeypot + page-load timestamp
  const [_hp, setHp] = useState('');
  const [pageLoadTs] = useState(() => Date.now());

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return; // prevent double-submit

    if (!form.name || !form.email || !form.business_name || !form.phone || !form.website) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setPartialSuccess(null);
    console.log('[REBUILD INTAKE FORM SUBMIT HIT]', form);

    try {
      // STEP 1: Create SalesLead + SalesDeal for pipeline visibility
      console.log('[RebuildIntake] Creating agency lead...');
      const { salesLead, salesDeal } = await createAgencyLead({
        business_name: form.business_name,
        contact_name: form.name,
        email: form.email,
        phone: form.phone,
        website: form.website,
        city: form.city,
        state: form.state,
        lead_source: 'website',
        notes: `Website Rebuild Intake | Service: ${form.service_type} | Pages: ${form.page_count} | ${form.notes || ''}`,
      });
      console.log('[RebuildIntake] Agency lead created:', { salesLead: salesLead.id, salesDeal: salesDeal.id, stage: salesDeal.stage, archived: salesDeal.archived });

      // STEP 2: Call the original email/CRM function
      console.log('[RebuildIntake] Calling sendRebuildIntakeEmail...');
      const response = await base44.functions.invoke('sendRebuildIntakeEmail', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        business_name: form.business_name,
        website: form.website,
        service_type: form.service_type,
        page_count: form.page_count,
        city: form.city,
        state: form.state,
        industry: form.industry,
        notes: form.notes,
        source: sourcePage,
      });

      const data = response.data;
      console.log('[RebuildIntake] Response:', data);

      if (!data?.success) {
        throw new Error(data?.error || 'Unknown error from backend');
      }

      // Check partial failures
      if (data.crm_failed || data.email_failed) {
        setPartialSuccess({ crmFailed: !!data.crm_failed, emailFailed: !!data.email_failed });
        console.warn('[RebuildIntake] Partial failure — crm_failed:', data.crm_failed, 'email_failed:', data.email_failed);
      }

      // Add the requested webhook call
      fetch('https://grateful-lynx-44.convex.site/api/webhook/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: 'Y24RdJ7OjvX8lrcjPRDCYcusOnAspC9DbYkqJtY1Zb0',
          source: 'nta-website',
          form: '/rebuild-intake',
          name: form.name,
          business_name: form.business_name,
          email: form.email,
          phone: form.phone,
          website: form.website,
          industry: form.industry,
          service_interest: form.service_type,
          notes: `Pages: ${form.page_count} | ${form.notes}`,
          timestamp: new Date().toISOString(),
          _hp,
          _ts: pageLoadTs,
        })
      }).catch(err => console.log('Webhook failed:', err));

      console.log('[RebuildIntake] Success — showing confirmation.');
      setStep(2);
    } catch (err) {
      console.error('[RebuildIntake] Submit failed:', err?.message || err);
      toast.error('Something went wrong sending your request. Please try again or call us at 641-420-8816.');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        
        <h2 className="text-3xl font-black text-slate-900 mb-4 text-center">Got It! We're Reviewing Your Project.</h2>
        <p className="text-slate-600 text-lg mb-8 max-w-lg mx-auto text-center">
          We'll scope your rebuild and send a detailed quote. Want to speed things up?
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-8">
          {/* Left Card */}
          <div className="bg-slate-950 text-white rounded-2xl p-6 text-left border border-slate-800 hover:border-slate-700 transition-colors group flex flex-col h-full">
            <div className="text-3xl mb-4">📅</div>
            <h3 className="text-xl font-bold mb-3">Book a Call</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
              Get on the calendar with Rick to discuss your website needs and speed up the quoting process.
            </p>
            <div className="mt-auto">
              <a 
                href="https://calendar.app.google/p6ieYanvwhixXxZ67" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full text-center bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-colors mb-3"
              >
                Pick a Time →
              </a>
              <p className="text-center text-slate-500 text-xs font-medium">Available Mon–Fri</p>
            </div>
          </div>

          {/* Right Card */}
          <div className="bg-slate-950 text-white rounded-2xl p-6 text-left border border-slate-800 hover:border-slate-700 transition-colors group flex flex-col h-full">
            <div className="text-3xl mb-4">💬</div>
            <h3 className="text-xl font-bold mb-3">Text Rick</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
              Have a quick question right now? Send a text directly and get a faster response.
            </p>
            <div className="mt-auto">
              <a 
                href="sms:+16414208816?body=Hey%20Rick%2C%20I%20just%20submitted%20a%20website%20rebuild%20request."
                className="block w-full text-center bg-transparent hover:bg-slate-800 border border-slate-700 text-white font-semibold py-3 rounded-xl transition-colors mb-3"
              >
                Text Now →
              </a>
              <p className="text-center text-slate-500 text-xs font-medium">No automated bots</p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-slate-500 text-sm">
            Custom quotes delivered within 1-2 business days.
          </p>
          <Link
            to="/"
            className="inline-block text-slate-500 hover:text-slate-800 text-sm transition-colors py-2"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to={createPageUrl('Home')}>
            <img src={LOGO_URL} alt="NTA" className="h-9 w-auto" />
          </Link>
          <Link to={createPageUrl('Book-Call')} className="text-slate-500 hover:text-slate-900 text-sm transition-colors">
            Talk to someone first →
          </Link>
        </div>
      </header>

      <div className="flex-1 p-4 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: What happens */}
          <div>
            <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Wrench className="w-3.5 h-3.5" /> Free quote · No commitment
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
              Website Rebuild &amp; ADA Compliance Intake
            </h1>
            <p className="text-slate-600 text-lg mb-8">
              Tell us about your current website. We'll review it and send you a detailed quote within 1–2 business days.
            </p>
            <div className="space-y-3">
              {[
                'We review your current site for issues',
                'You receive a custom-scoped proposal',
                'Approve the proposal to get started',
                'Site is rebuilt to modern standards',
                'Optional ADA compliance monitoring',
              ].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-slate-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 space-y-5 shadow-sm">
            {/* Anti-spam honeypot — hidden from real users */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}>
              <label htmlFor="company_url">Company URL</label>
              <input id="company_url" name="company_url" type="text" tabIndex={-1} autoComplete="off" value={_hp} onChange={e => setHp(e.target.value)} />
            </div>
            <h2 className="text-slate-900 font-bold text-lg">Tell Us About Your Project</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label className="text-slate-700 mb-1.5 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Full Name *</Label>
                <Input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" />
              </div>
              <div>
                <Label className="text-slate-700 mb-1.5 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Business Name *</Label>
                <Input required value={form.business_name} onChange={e => set('business_name', e.target.value)} placeholder="Smith Plumbing" />
              </div>
              <div>
                <Label className="text-slate-700 mb-1.5 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email *</Label>
                <Input required type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@business.com" />
              </div>
              <div>
                <Label className="text-slate-700 mb-1.5 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone *</Label>
                <Input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(555) 123-4567" />
              </div>
            </div>

            <div>
              <Label className="text-slate-700 mb-1.5 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Current Website *</Label>
              <Input required type="url" value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://yourbusiness.com" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-700 mb-1.5">City</Label>
                <Input value={form.city} onChange={e => set('city', e.target.value)} placeholder="Des Moines" />
              </div>
              <div>
                <Label className="text-slate-700 mb-1.5">State</Label>
                <Input value={form.state} onChange={e => set('state', e.target.value)} placeholder="IA" maxLength={2} />
              </div>
            </div>

            <div>
              <Label className="text-slate-700 mb-1.5">Service Needed *</Label>
              <div className="space-y-2">
                {SERVICE_TYPES.map(s => (
                  <label key={s.value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${form.service_type === s.value ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input type="radio" name="service_type" value={s.value} checked={form.service_type === s.value} onChange={() => set('service_type', s.value)} className="accent-blue-600" />
                    <span className="text-sm font-medium text-slate-800">{s.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-slate-700 mb-1.5">Approximate Page Count</Label>
              <div className="flex flex-wrap gap-2">
                {PAGE_COUNTS.map(p => (
                  <button key={p} type="button" onClick={() => set('page_count', p)}
                    className={`px-4 py-1.5 rounded-lg border text-sm transition-all ${form.page_count === p ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 text-slate-600 hover:border-slate-400'}`}>
                    {p} pages
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-slate-700 mb-1.5">Additional Notes (optional)</Label>
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
                placeholder="Specific concerns, timeline needs, or anything else..."
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>

            <Button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 h-auto text-base rounded-xl">
              {submitting ? 'Submitting…' : 'Request My Free Quote'}
              {!submitting && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
            <p className="text-center text-slate-500 text-xs">Free quote · No commitment · Response in 1–2 business days</p>
          </form>
        </div>
      </div>
    </div>
  );
}
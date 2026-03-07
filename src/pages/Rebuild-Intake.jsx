import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { ArrowRight, CheckCircle, Building2, Mail, Phone, User, Globe, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

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
  const [form, setForm] = useState({
    name: '', email: '', phone: '', business_name: '',
    website: '', city: '', state: '', industry: '',
    service_type: 'ada_rebuild', page_count: '1–10',
    notes: '',
  });

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Create Company
      const company = await base44.entities.Company.create({
        business_name: form.business_name,
        website: form.website,
        industry: form.industry,
        email: form.email,
        phone: form.phone,
        city: form.city,
        state: form.state,
        status: 'lead',
        source: 'website',
      });

      // Create Lead
      const lead = await base44.entities.Lead.create({
        company_id: company.id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        business_name: form.business_name,
        website: form.website,
        industry: form.industry,
        service_interest: 'ada_rebuild',
        message: `Service: ${form.service_type} | Pages: ${form.page_count} | ${form.notes}`,
        status: 'new',
        source: 'website',
      });

      // Create ServiceRequest
      await base44.entities.ServiceRequest.create({
        company_id: company.id,
        lead_id: lead.id,
        service_type: form.service_type,
        status: 'submitted',
        notes: form.notes,
        request_details: JSON.stringify({
          website: form.website,
          page_count: form.page_count,
          city: form.city,
          state: form.state,
        }),
      });

      // Notify team
      await base44.integrations.Core.SendEmail({
        from_name: 'NTA — Website Intake',
        to: 'rick@newtechadvertising.com',
        subject: `Website Intake: ${form.business_name} — ${form.service_type}`,
        body: `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nBusiness: ${form.business_name}\nWebsite: ${form.website}\nService: ${form.service_type}\nPages: ${form.page_count}\nCity/State: ${form.city}, ${form.state}\nNotes: ${form.notes}`,
      });

      setStep(2);
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-10 max-w-md w-full text-center shadow-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-3">Request Received!</h1>
          <p className="text-slate-600 mb-6">
            We'll review your site and prepare a proposal within <strong>1–2 business days</strong>. We'll email it directly to <span className="font-semibold">{form.email}</span>.
          </p>
          <div className="space-y-3">
            <Link
              to={createPageUrl('Book-Call')}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all text-sm"
            >
              Book a call to discuss <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={createPageUrl('Home')}
              className="w-full flex items-center justify-center text-slate-500 hover:text-slate-800 text-sm transition-colors py-2"
            >
              ← Back to home
            </Link>
          </div>
          <p className="text-slate-400 text-xs mt-5">
            Questions? <a href="tel:6414208816" className="text-blue-600">641-420-8816</a>
          </p>
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
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { createAgencyLead } from '@/lib/createAgencyLead';
import { ArrowRight, CheckCircle, Building2, Mail, Phone, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import SEOHead from '@/components/shared/SEOHead';

const LOGO_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/45ced7207_nta_logo_header_1600x320.png';

const AUDIT_ITEMS = [
  'Website speed & mobile performance',
  'Social media presence & posting consistency',
  'Local SEO & Google Business Profile',
  'ADA compliance risk assessment',
  'Competitor content analysis',
  'Recommended growth opportunities',
];

export default function FreeAudit() {
  const [step, setStep] = useState(1); // 1=form, 2=success
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', business_name: '',
    website: '', industry: '',
  });

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // STEP 1 — Create SalesLead + SalesDeal FIRST (canonical intake path)
      const { salesLead, salesDeal } = await createAgencyLead({
        business_name: form.business_name,
        contact_name:  form.name,
        email:         form.email,
        phone:         form.phone,
        website:       form.website,
        industry:      form.industry,
        lead_source:   'website',
        notes:         'Requested free marketing audit',
      });
      console.log('[FreeAudit] Lead created', salesLead.id, salesDeal.id);

      // Wrap secondary actions in a separate try/catch so they never block the success UI
      try {
        // STEP 2 — Mirror to NTA Unified Intake
        await base44.functions.invoke('ntaUnifiedIntake', {
          submission_type: 'free_audit_request',
          offer_type: 'marketing_audit',
          mapping_confidence: 'hardcoded',
          mapping_notes: 'Free-Audit.jsx /free-audit hardcoded',
          detected_route: '/free-audit',
          detected_component: 'FreeAudit',
          source_system: 'website',
          source_page: '/free-audit',
          name: form.name,
          business_name: form.business_name,
          email: form.email,
          phone: form.phone,
          website: form.website,
          notes: `Industry: ${form.industry}`,
          priority: 'high',
          is_high_intent: true,
        });

        // STEP 3 — Notify team
        await base44.integrations.Core.SendEmail({
          from_name: 'NTA — Free Audit Request',
          to: 'rick@newtechadvertising.com',
          subject: `Free Audit Request: ${form.business_name}`,
          body: `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nBusiness: ${form.business_name}\nWebsite: ${form.website}\nIndustry: ${form.industry}`,
        });
      } catch (secondaryErr) {
        console.warn('[FreeAudit] Secondary actions failed, but lead was created:', secondaryErr.message);
      }

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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <SEOHead 
          title="Free Marketing Audit | New Tech Advertising"
          description="Get a free AI marketing audit for your small business. We analyze your Google presence, social media, website & AI visibility. New Tech Advertising, Mason City IA."
        />
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-3">Audit Requested!</h1>
          <p className="text-slate-400 mb-6">
            We'll analyze your online presence and send you a full report within <strong className="text-white">24–48 hours</strong>.
          </p>
          <div className="space-y-3">
            <Link
              to={createPageUrl('Get-Started')}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-xl transition-all text-sm"
            >
              Start free trial while you wait <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={createPageUrl('Book-Call')}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold py-3 rounded-xl transition-all text-sm"
            >
              Book a strategy call instead
            </Link>
          </div>
          <p className="text-slate-600 text-xs mt-5">
            Questions? <a href="tel:6414208816" className="text-violet-400">641-420-8816</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <SEOHead 
        title="Free Marketing Audit | New Tech Advertising"
        description="Get a free AI marketing audit for your small business. We analyze your Google presence, social media, website & AI visibility. New Tech Advertising, Mason City IA."
      />
      {/* Header */}
      <header className="border-b border-slate-800 py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to={createPageUrl('Home')}>
            <img src={LOGO_URL} alt="NTA" className="h-9 w-auto" />
          </Link>
          <Link to={createPageUrl('Get-Started')} className="text-slate-400 hover:text-white text-sm transition-colors">
            Ready to start? →
          </Link>
        </div>
      </header>

      <div className="flex-1 p-4 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: What's included */}
          <div>
            <span className="inline-flex items-center gap-2 bg-amber-600/20 border border-amber-500/30 text-amber-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Search className="w-3.5 h-3.5" /> 100% Free · No strings attached
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
              Get Your Free Marketing Audit
            </h1>
            <p className="text-slate-400 text-lg mb-8">
              We'll analyze your business's online presence and send you a detailed report showing exactly where you're losing customers — and how to fix it.
            </p>
            <div className="space-y-3">
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">Your audit includes:</p>
              {AUDIT_ITEMS.map(item => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-slate-400">
              <strong className="text-white">Delivered within 24–48 hours.</strong> We do this manually — a real person on our team audits your business and sends you a PDF report with specific, actionable recommendations.
            </div>
          </div>

          {/* Right: Form */}
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-5">
            <h2 className="text-white font-bold text-lg mb-2">Request Your Free Audit</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label className="text-slate-300 mb-1.5 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Full Name *</Label>
                <Input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
              <div>
                <Label className="text-slate-300 mb-1.5 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Business Name *</Label>
                <Input required value={form.business_name} onChange={e => set('business_name', e.target.value)} placeholder="Smith Plumbing" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
              <div>
                <Label className="text-slate-300 mb-1.5 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email *</Label>
                <Input required type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@business.com" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
              <div>
                <Label className="text-slate-300 mb-1.5 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone *</Label>
                <Input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(555) 123-4567" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
            </div>

            <div>
              <Label className="text-slate-300 mb-1.5">Business Website</Label>
              <Input type="url" value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://yourbusiness.com" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
            </div>

            <div>
              <Label className="text-slate-300 mb-1.5">Industry</Label>
              <Input value={form.industry} onChange={e => set('industry', e.target.value)} placeholder="e.g. HVAC, Restaurant, Law Firm" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber-500 hover:bg-amber-400 text-white font-bold py-3 h-auto text-base rounded-xl shadow-lg shadow-amber-500/20"
            >
              {submitting ? 'Submitting…' : 'Get My Free Audit'}
              {!submitting && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>

            <p className="text-center text-slate-600 text-xs">
              Free · No credit card · No spam · Delivered in 24–48 hours
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
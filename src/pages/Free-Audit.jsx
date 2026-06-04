import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { createAgencyLead } from '@/lib/createAgencyLead';
import { base44 } from '@/api/base44Client';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { CheckCircle2, Phone, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const PHONE = '6414208816';
const PHONE_DISPLAY = '641-420-8816';
const SMS_BODY = encodeURIComponent("Hey, can you look at my website?");

const AUDIT_ITEMS = [
  'Website speed & mobile performance',
  'Local SEO & Google Business Profile analysis',
  'Social media presence & posting consistency',
  'ADA & accessibility compliance check',
  'AI visibility issues (how AI search engines see your site)',
  'Competitor content analysis',
  'What\'s working, what\'s not, and what to fix first',
];

function TextMeButton() {
  return (
    <a
      href={`sms:+1${PHONE}?body=${SMS_BODY}`}
      className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:border-slate-400 bg-white text-slate-800 font-bold px-6 py-4 rounded-xl text-base transition-colors w-full sm:w-auto"
    >
      <MessageSquare className="w-5 h-5 text-slate-600" />
      Text Me: {PHONE_DISPLAY}
    </a>
  );
}

export default function FreeAudit() {
  const [step, setStep] = useState(1);
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
      // Call ntaUnifiedIntake
      await base44.functions.invoke('ntaUnifiedIntake', {
        submission_type: 'free_audit_request',
        source_system: 'website',
        source_page: '/free-audit',
        name: form.name,
        business_name: form.business_name,
        email: form.email,
        phone: form.phone,
        website: form.website,
        industry: form.industry,
        notes: 'Requested free marketing audit',
      });

      try {
        // Notify team
        await base44.integrations.Core.SendEmail({
          from_name: 'NTA — Free Audit Request',
          to: 'rick@newtechadvertising.com',
          subject: `Free Audit Request: ${form.business_name}`,
          body: `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nBusiness: ${form.business_name}\nWebsite: ${form.website}\nIndustry: ${form.industry}`,
        });
      } catch (secondaryErr) {
        console.warn('Email notification failed, but lead was created:', secondaryErr);
      }

      // Add the requested webhook call as well, just to be completely certain
      fetch('WEBHOOK_URL_PLACEHOLDER', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'nta-website',
          form: '/free-audit',
          name: form.name,
          business_name: form.business_name,
          email: form.email,
          phone: form.phone,
          website: form.website,
          industry: form.industry,
          service_interest: '',
          notes: 'Requested free marketing audit',
          timestamp: new Date().toISOString()
        })
      }).catch(err => console.log('Webhook failed:', err));

      setStep(2);
      setForm({ name: '', email: '', phone: '', business_name: '', website: '', industry: '' });
    } catch (err) {
      toast.error('Something went wrong. Please call or text instead.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <SEOHead 
        title="Free Marketing & Gap Audit | New Tech Advertising"
        description="Get a free marketing and gap audit. We identify exactly why your website isn't bringing in calls and what to fix first. NTA Mason City IA."
      />
      <MarketingNav />

      {/* Hero Section */}
      <section className="bg-slate-950 text-white pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Get a Free Marketing & Gap Audit
          </h1>
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            If your website isn't bringing in calls or customers, I'll show you exactly why — and what to fix first.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => document.getElementById('audit-form').scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors"
            >
              Fill Out the Form Below
            </button>
            <a
              href={`tel:+1${PHONE}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors hover:bg-slate-700 border border-slate-700"
            >
              <Phone className="w-5 h-5" /> Call or Text: {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>

      {/* Main Content & Form */}
      <section className="py-16 px-6 flex-1">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          
          {/* What Your Audit Includes */}
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-6">What Your Audit Includes</h2>
            <ul className="space-y-4 mb-8">
              {AUDIT_ITEMS.map(item => (
                <li key={item} className="flex items-start gap-3 text-slate-700 text-lg">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-slate-700 text-base leading-relaxed">
              <strong className="text-blue-900 block mb-1">Delivered within 24–48 hours.</strong>
              A real person audits your business and sends you a detailed PDF report with specific, actionable recommendations. No high-pressure sales pitch.
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Prefer to talk?</h3>
              <p className="text-slate-600 mb-6">Call or text: {PHONE_DISPLAY}</p>
              <TextMeButton />
            </div>
          </div>

          {/* Form Section */}
          <div id="audit-form" className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
            {step === 2 ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">You're In! Your Gap Audit Is On the Way.</h2>
                <p className="text-slate-600 text-lg mb-8 max-w-lg mx-auto">
                  We're reviewing your business now. But why wait? Pick your next step:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Left Card */}
                  <div className="bg-slate-950 text-white rounded-2xl p-6 text-left border border-slate-800 hover:border-slate-700 transition-colors group flex flex-col h-full">
                    <div className="text-3xl mb-4">📅</div>
                    <h3 className="text-xl font-bold mb-3">Talk to Rick — 15 Minutes</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                      Get your audit results explained live, ask questions, and find out exactly what to fix first. No pitch, no pressure.
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
                    <div className="text-3xl mb-4">🚀</div>
                    <h3 className="text-xl font-bold mb-3">Try the DIY Tools</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                      Explore our marketing platform and start building your online presence while we prepare your audit.
                    </p>
                    <div className="mt-auto">
                      <Link 
                        to="/start" 
                        className="block w-full text-center bg-transparent hover:bg-slate-800 border border-slate-700 text-white font-semibold py-3 rounded-xl transition-colors mb-3"
                      >
                        Start Free Trial →
                      </Link>
                      <p className="text-center text-slate-500 text-xs font-medium">No credit card required</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-slate-500 text-sm">
                    Either way, your personalized audit report will hit your inbox within 24 hours.
                  </p>
                  <p className="text-slate-600 font-medium">
                    Questions? Call or text Rick directly: <a href="tel:6414208816" className="text-blue-600 hover:underline">641-420-8816</a>
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-2xl font-black text-slate-900 mb-6">Request Your Free Audit</h2>
                
                <div className="space-y-1.5">
                  <Label className="text-slate-700 text-sm font-semibold">Full Name <span className="text-red-500">*</span></Label>
                  <Input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" className="bg-slate-50 border-slate-200 px-4 py-3 h-auto" />
                </div>
                
                <div className="space-y-1.5">
                  <Label className="text-slate-700 text-sm font-semibold">Business Name <span className="text-red-500">*</span></Label>
                  <Input required value={form.business_name} onChange={e => set('business_name', e.target.value)} placeholder="Smith Plumbing" className="bg-slate-50 border-slate-200 px-4 py-3 h-auto" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-slate-700 text-sm font-semibold">Email <span className="text-red-500">*</span></Label>
                    <Input required type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@business.com" className="bg-slate-50 border-slate-200 px-4 py-3 h-auto" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-slate-700 text-sm font-semibold">Phone <span className="text-red-500">*</span></Label>
                    <Input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(555) 123-4567" className="bg-slate-50 border-slate-200 px-4 py-3 h-auto" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-700 text-sm font-semibold">Business Website (Optional)</Label>
                  <Input type="url" value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://yourbusiness.com" className="bg-slate-50 border-slate-200 px-4 py-3 h-auto" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-700 text-sm font-semibold">Industry (Optional)</Label>
                  <Input value={form.industry} onChange={e => set('industry', e.target.value)} placeholder="e.g. HVAC, Restaurant, Law Firm" className="bg-slate-50 border-slate-200 px-4 py-3 h-auto" />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 h-auto text-lg rounded-xl shadow-lg shadow-blue-600/20"
                  >
                    {submitting ? 'Submitting...' : 'Get My Free Audit'}
                    {!submitting && <ArrowRight className="w-5 h-5 ml-2" />}
                  </Button>
                  <p className="text-center text-slate-500 text-sm mt-4">
                    Free · No credit card · No spam · Delivered in 24–48 hours
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
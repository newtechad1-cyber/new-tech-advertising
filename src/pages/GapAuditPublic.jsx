import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import { CheckCircle2, ArrowRight, Search, TrendingUp, Shield, Smartphone } from 'lucide-react';

const INDUSTRIES = ['HVAC', 'Plumbing', 'Electrical', 'Excavating', 'Lawn Care / Landscaping', 'Roofing', 'Concrete / Flatwork', 'Auto Repair', 'Pest Control', 'Cleaning Service', 'Painting', 'Flooring', 'Restaurant / Food', 'Retail', 'Other'];

const CONCERNS = [
  'Not showing up on Google',
  'Website not generating leads',
  'Losing business to competitors online',
  'Need more reviews / reputation help',
  'Social media not working',
  'Seasonal slow periods',
  'Not sure what to fix first',
  'Other',
];

function ThankYou({ businessName }) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">You're All Set!</h1>
          <p className="text-slate-400 mt-3 text-lg leading-relaxed">
            We got your request for <span className="text-white font-semibold">{businessName}</span>. Your free Gap Audit will be ready within 24 hours.
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left space-y-3">
          <p className="text-sm font-bold text-slate-300 uppercase tracking-wider">What happens next:</p>
          {[
            "We review your website, Google presence, and local competitors",
            "We identify your 3–5 biggest lead gaps",
            "Rick from NTA reaches out to walk you through the findings",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              <p className="text-slate-300 text-sm">{step}</p>
            </div>
          ))}
        </div>
        <a href="/" className="inline-block text-sm text-slate-500 hover:text-white transition-colors">← Back to NTA Home</a>
      </div>
    </div>
  );
}

export default function GapAuditPublic() {
  const [form, setForm] = useState({
    business_name: '', website: '', contact_name: '', email: '', phone: '',
    industry: '', main_concern: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const res = await base44.functions.invoke('ntaProspectSubmitted', {
      business_name: form.business_name,
      website: form.website,
      contact_name: form.contact_name,
      email: form.email,
      phone: form.phone,
      industry: form.industry,
      notes: form.main_concern ? `Main concern: ${form.main_concern}` : '',
    });
    if (res.data?.success) {
      setSubmitted(true);
    } else {
      setError('Something went wrong. Please try again or call us directly.');
    }
    setSubmitting(false);
  };

  if (submitted) return <ThankYou businessName={form.business_name} />;

  return (
    <div className="bg-gray-950 min-h-screen">
      <MarketingNav />

      {/* Hero */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-blue-600/20 text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">Free · No Obligation · 24hr Turnaround</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
            Find Out Exactly <span className="text-blue-400">Where You're Losing Leads</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
            A free review of your online presence — we identify the 3–5 biggest gaps costing you leads and show you what to fix first.
          </p>
        </div>
      </section>

      {/* Trust bar */}
      <section className="pb-10 px-4">
        <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Search, label: 'Google Visibility' },
            { icon: TrendingUp, label: 'Lead Gaps' },
            { icon: Smartphone, label: 'Mobile & UX' },
            { icon: Shield, label: 'No Sales Pitch' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-3 flex items-center gap-2.5">
              <Icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span className="text-slate-300 text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="pb-20 px-4">
        <div className="max-w-xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">
            <h2 className="text-xl font-bold text-white mb-1">Request Your Free Gap Audit</h2>
            <p className="text-slate-500 text-sm mb-6">Takes 2 minutes. Results in 24 hours.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Business Name *</label>
                  <input required value={form.business_name} onChange={e => set('business_name', e.target.value)}
                    placeholder="ABC Plumbing"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Website</label>
                  <input value={form.website} onChange={e => set('website', e.target.value)}
                    placeholder="https://yoursite.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Your Name *</label>
                  <input required value={form.contact_name} onChange={e => set('contact_name', e.target.value)}
                    placeholder="John Smith"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Phone *</label>
                  <input required value={form.phone} onChange={e => set('phone', e.target.value)}
                    placeholder="(641) 555-0100"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="john@abcplumbing.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Industry</label>
                <select value={form.industry} onChange={e => set('industry', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
                  <option value="">Select your industry…</option>
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">What's your biggest concern right now?</label>
                <select value={form.main_concern} onChange={e => set('main_concern', e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
                  <option value="">Choose one…</option>
                  {CONCERNS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {error && <p className="text-red-400 text-sm bg-red-950/40 rounded-xl px-3 py-2">{error}</p>}

              <button type="submit" disabled={submitting}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-colors">
                {submitting ? (
                  <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Submitting…</>
                ) : (
                  <>Get My Free Gap Audit <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <p className="text-center text-xs text-slate-600">No spam. No sales pressure. Just honest feedback.</p>
            </form>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
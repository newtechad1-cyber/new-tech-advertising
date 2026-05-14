import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, ChevronDown, Phone } from 'lucide-react';
import MarketingNav from '../nav/MarketingNav';
import SiteFooter from '../marketing/SiteFooter';
import { base44 } from '@/api/base44Client';

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-0 py-4 text-left gap-4">
        <span className="font-semibold text-slate-800 text-sm">{q}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="text-slate-600 text-sm leading-relaxed pb-4">{a}</p>}
    </div>
  );
}

function LeadForm({ source }) {
  const [form, setForm] = useState({ name: '', business: '', website: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.business.trim()) return;
    setSubmitting(true);
    try {
      await base44.entities.SalesLead.create({
        business_name: form.business,
        contact_name: form.name,
        website: form.website,
        phone: form.phone,
        lead_source: 'website',
        status: 'new',
        notes: `Gap Audit Request — ${source} — ${new Date().toLocaleDateString()}`,
      });
    } catch (_) {}
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900 mb-1">Got it — we'll be in touch soon.</h3>
        <p className="text-slate-500 text-sm">Usually within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {[
        { key: 'name', label: 'Your Name', placeholder: 'Rick Johnson' },
        { key: 'business', label: 'Business Name *', placeholder: 'Johnson Heating & A/C', required: true },
        { key: 'website', label: 'Website URL', placeholder: 'yourbusiness.com' },
        { key: 'phone', label: 'Phone or Email', placeholder: '(641) 555-0100' },
      ].map(f => (
        <div key={f.key}>
          <label className="block text-xs font-semibold text-slate-600 mb-1">{f.label}</label>
          <input
            required={f.required}
            value={form[f.key]}
            onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
            placeholder={f.placeholder}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      ))}
      <button
        type="submit"
        disabled={submitting || !form.business.trim()}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl text-sm transition"
      >
        {submitting ? 'Sending…' : <>Get My Free Gap Audit <ArrowRight className="w-4 h-4" /></>}
      </button>
      <p className="text-slate-400 text-xs text-center">No obligation. Response within 24 hours.</p>
    </form>
  );
}

export default function ServicePageLayout({
  seoTitle,
  seoDescription,
  eyebrow,
  headline,
  subheadline,
  problem,
  solution,
  includes,
  example,
  faqs,
  relatedLinks,
  formSource,
}) {
  useEffect(() => {
    document.title = seoTitle;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.setAttribute('content', seoDescription);
  }, [seoTitle, seoDescription]);

  return (
    <div className="bg-white min-h-screen">
      <MarketingNav />

      {/* Hero */}
      <section className="bg-slate-900 text-white pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block mb-4">{eyebrow}</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5">{headline}</h1>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed mb-6">{subheadline}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/rebuild-intake?source=service-page" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition">
              Get a Free Gap Audit <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="tel:6414208816" className="inline-flex items-center gap-2 border border-slate-600 hover:border-slate-400 text-slate-300 font-semibold px-6 py-3.5 rounded-xl text-sm transition">
              <Phone className="w-4 h-4" /> 641-420-8816
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">

        {/* Problem */}
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-red-500 block mb-3">The Problem</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-4">What's Getting in the Way</h2>
            <div className="space-y-3">
              {problem.map((p, i) => (
                <div key={i} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0 mt-1.5" />
                  <p className="text-slate-700 text-sm leading-relaxed">{p}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-3">The NTA Solution</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-4">How We Fix It</h2>
            <div className="space-y-3">
              {solution.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700 text-sm leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What's Included */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-3">What's Included</span>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Everything in This Service</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {includes.map((item, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">{i + 1}</span>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Example */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-3">Real Example</span>
          <h2 className="text-xl font-extrabold text-slate-900 mb-3">{example.client}</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">{example.story}</p>
          {example.result && (
            <div className="bg-white border border-blue-100 rounded-xl px-4 py-3 inline-flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <p className="text-slate-800 text-sm font-semibold">{example.result}</p>
            </div>
          )}
        </div>

        {/* CTA + Form */}
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-3">Get Started Free</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Request a Free Gap Audit</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              We'll look at your current site and online presence and send you a short breakdown of what we'd do first — no obligation, no sales pitch.
            </p>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Phone className="w-4 h-4" />
              <span>Prefer to call? </span>
              <a href="tel:6414208816" className="text-blue-600 font-semibold hover:underline">641-420-8816</a>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7">
            <LeadForm source={formSource} />
          </div>
        </div>

        {/* FAQ */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-3">FAQ</span>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Common Questions</h2>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl px-6 divide-y divide-slate-100">
            {faqs.map((faq, i) => <FAQItem key={i} {...faq} />)}
          </div>
        </div>

        {/* Related Services */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-3">Related Services</span>
          <div className="flex flex-wrap gap-3">
            {relatedLinks.map(link => (
              <Link key={link.href} to={link.href} className="inline-flex items-center gap-1.5 border border-slate-300 hover:border-blue-400 text-slate-600 hover:text-blue-700 font-semibold text-xs px-4 py-2 rounded-full transition">
                {link.label} <ArrowRight className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import { CheckCircle2 } from 'lucide-react';

function ThankYou({ businessName }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-5 py-20">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Got it — thanks.</h1>
          <p className="text-slate-600 leading-relaxed">
            {businessName ? `I'll take a look at ${businessName} ` : "I'll take a look "}
            and reach out with what I find. Usually within a day or two.
          </p>
        </div>
        <div className="text-left bg-slate-50 rounded-xl p-5 space-y-2.5">
          <p className="text-sm font-semibold text-slate-700">What happens next:</p>
          {[
            'I review your site',
            'I send you a quick breakdown',
            'If it makes sense, we can talk through next steps',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              <p className="text-slate-600 text-sm">{step}</p>
            </div>
          ))}
        </div>
        <a href="/" className="inline-block text-sm text-slate-400 hover:text-slate-600 transition-colors">← Back to home</a>
      </div>
    </div>
  );
}

export default function GapAuditPublic() {
  const [form, setForm] = useState({ contact_name: '', business_name: '', website: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const res = await base44.functions.invoke('ntaProspectSubmitted', {
      contact_name: form.contact_name,
      business_name: form.business_name,
      website: form.website,
      phone: form.phone,
    });
    if (res.data?.success) {
      setSubmitted(true);
    } else {
      setError('Something went wrong. Please try again or text me at 319-290-0004.');
    }
    setSubmitting(false);
  };

  if (submitted) return <ThankYou businessName={form.business_name} />;

  return (
    <div className="bg-white min-h-screen">
      <MarketingNav />

      <div className="max-w-2xl mx-auto px-5 pt-20 pb-24 space-y-14">

        {/* Headline + Intro */}
        <section>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 leading-tight">
            See What Your Website Is Missing
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed mb-6">
            If your website isn't bringing in calls, messages, or customers consistently, there's usually a reason.
          </p>
          <p className="text-slate-600 mb-3">Most local business sites have gaps in:</p>
          <ul className="space-y-1.5 mb-6">
            {[
              'SEO — not showing up when people search',
              'Messaging — not clear enough to make someone call',
              'Structure — confusing layout that loses visitors',
              'Follow-up — missed opportunities to capture leads',
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-slate-700">
                <span className="text-slate-400 mt-1">·</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-slate-700 font-medium">I'll take a look and show you what's actually going on.</p>
        </section>

        {/* What You Get */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">What You'll Get</h2>
          <ul className="space-y-2 mb-4">
            {[
              "A simple breakdown of what's working",
              "What's not working",
              "Where you're missing opportunities",
              "What you can fix first",
            ].map(item => (
              <li key={item} className="flex items-start gap-2.5 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-slate-500 text-sm">No long reports. No fluff. Just real feedback.</p>
        </section>

        {/* Form */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Send Your Website</h2>
          <p className="text-slate-500 text-sm mb-6">Fill this out and I'll take a look.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
              <input
                required
                value={form.contact_name}
                onChange={e => set('contact_name', e.target.value)}
                placeholder="John Smith"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Business Name</label>
              <input
                required
                value={form.business_name}
                onChange={e => set('business_name', e.target.value)}
                placeholder="ABC Plumbing"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Website</label>
              <input
                value={form.website}
                onChange={e => set('website', e.target.value)}
                placeholder="https://yoursite.com"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone <span className="text-slate-400 font-normal">(so I can text you when it's ready)</span></label>
              <input
                required
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder="(641) 555-0100"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-700 text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
            >
              {submitting ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
              ) : (
                'Submit Request'
              )}
            </button>
          </form>
        </section>

        {/* Text directly */}
        <section className="border-t border-slate-100 pt-10">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Or Text Me Directly</h2>
          <p className="text-slate-600 mb-3">If you don't want to fill out the form, just text me:</p>
          <p className="text-lg font-semibold text-slate-900">👉 Text: <a href="sms:3192900004" className="text-blue-600 hover:underline">319-290-0004</a></p>
          <p className="text-slate-500 text-sm mt-1">I'll reply and take a look.</p>
        </section>

        {/* What Happens Next */}
        <section className="border-t border-slate-100 pt-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4">What Happens Next</h2>
          <ol className="space-y-2.5">
            {[
              'I review your site',
              'I send you a quick breakdown',
              'If it makes sense, we can talk through next steps',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <p className="text-slate-400 text-sm mt-5">No pressure. Just clarity.</p>
        </section>

      </div>

      <SiteFooter />
    </div>
  );
}
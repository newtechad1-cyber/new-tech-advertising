import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import { CheckCircle2 } from 'lucide-react';

function ThankYou({ businessName }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 py-20">
        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-3">Got it — thanks.</h1>
          <p className="text-slate-600 text-base leading-relaxed">
            {businessName ? `We'll take a look at ${businessName} ` : "We'll take a look "}
            and reach out with what we find. Usually within a day or two.
          </p>
        </div>
        <a href="/" className="inline-block text-sm text-slate-400 hover:text-slate-700 transition-colors">
          ← Back to home
        </a>
      </div>
    </div>
  );
}

export default function GapAuditPublic() {
  const [form, setForm] = useState({
    contact_name: '',
    business_name: '',
    website: '',
    phone: '',
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
      contact_name: form.contact_name,
      business_name: form.business_name,
      website: form.website,
      phone: form.phone,
    });
    if (res.data?.success) {
      setSubmitted(true);
    } else {
      setError('Something went wrong. Please try again or call us at (641) 357-9932.');
    }
    setSubmitting(false);
  };

  if (submitted) return <ThankYou businessName={form.business_name} />;

  return (
    <div className="bg-white min-h-screen">
      <MarketingNav />

      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Headline */}
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 leading-tight">
              See What Your Website Is Missing
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Send your website and we'll take a look. You'll get a straightforward breakdown of what's working, what's not, and what to fix first.
            </p>
            <p className="text-slate-500 text-base mb-4">What we look at:</p>
            <ul className="space-y-2 mb-2">
              {[
                'SEO gaps — whether your business is showing up for the searches that matter',
                'Messaging issues — whether your site actually explains what you do and why to call you',
                'Missed opportunities — simple things that could be bringing in more leads but aren\'t',
              ].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-slate-700 text-base">
                  <span className="text-blue-500 font-bold mt-1 flex-shrink-0">·</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-slate-400 text-sm mt-5">No pressure. No complicated reports. Just honest feedback.</p>
          </div>

          {/* Form */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Request a Free Gap Audit</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Name</label>
                <input
                  required
                  value={form.contact_name}
                  onChange={e => set('contact_name', e.target.value)}
                  placeholder="John Smith"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Business Name</label>
                <input
                  required
                  value={form.business_name}
                  onChange={e => set('business_name', e.target.value)}
                  placeholder="ABC Plumbing"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Website</label>
                <input
                  value={form.website}
                  onChange={e => set('website', e.target.value)}
                  placeholder="https://yoursite.com"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                <input
                  required
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  placeholder="(641) 555-0100"
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-colors mt-2"
              >
                {submitting ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
                ) : (
                  'Get My Free Gap Audit'
                )}
              </button>
            </form>
          </div>

        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
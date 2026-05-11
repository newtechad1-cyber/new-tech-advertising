import React, { useState } from 'react';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, Phone, MessageSquare } from 'lucide-react';

const PHONE = '6414208816';
const PHONE_DISPLAY = '641-420-8816';
const SMS_BODY = encodeURIComponent("Hey Rick, can you look at my website?");

function TextMeButton() {
  return (
    <a
      href={`sms:+1${PHONE}?body=${SMS_BODY}`}
      className="inline-flex items-center gap-2 border border-slate-300 hover:border-slate-400 bg-white text-slate-800 font-bold px-6 py-3 rounded-xl text-sm transition-colors"
    >
      <MessageSquare className="w-4 h-4 text-slate-600" />
      Text Me: {PHONE_DISPLAY}
    </a>
  );
}

function ThankYou() {
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center max-w-md mx-auto">
      <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
      <p className="text-slate-800 font-bold text-lg mb-1">Got your request.</p>
      <p className="text-slate-600">I'll take a look and reach out shortly.</p>
    </div>
  );
}

export default function GapAuditPublic() {
  const [form, setForm] = useState({ contact_name: '', business_name: '', website: '', phone: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.business_name) { setError('Please enter your business name.'); return; }
    setLoading(true);
    setError('');
    const res = await base44.functions.invoke('ntaProspectSubmitted', {
      business_name: form.business_name,
      contact_name: form.contact_name,
      website: form.website,
      phone: form.phone,
      email: form.email,
    });
    setLoading(false);
    if (res.data?.success) {
      setSubmitted(true);
    } else {
      setError('Something went wrong. Please call or text instead.');
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <MarketingNav />

      {/* Hero */}
      <section className="bg-slate-950 text-white pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black mb-4">Get a Free Gap Audit</h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              If your website isn't bringing in calls or customers, I'll show you why.
            </p>

            {/* Prominent phone */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`tel:+1${PHONE}`}
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 font-black px-7 py-4 rounded-xl text-base transition-colors hover:bg-slate-100"
              >
                <Phone className="w-4 h-4" /> Call or Text: {PHONE_DISPLAY}
              </a>
              <TextMeButton />
            </div>
          </div>
          
          {/* Video */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
            <iframe 
              src="https://www.youtube.com/embed/T4FR9lSpaeY?rel=0" 
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="autoplay; encrypted-media; fullscreen" 
              title="Gap Audit Video"
            />
          </div>
        </div>
      </section>

      {/* Form + What You'll Get */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-12 items-start">

          {/* Form */}
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Or fill this out:</h2>
            <p className="text-slate-500 text-sm mb-6">I'll take a look and get back to you.</p>

            {submitted ? <ThankYou /> : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={form.contact_name}
                    onChange={e => setForm({ ...form, contact_name: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Business Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Your business name"
                    value={form.business_name}
                    onChange={e => setForm({ ...form, business_name: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Website</label>
                  <input
                    type="text"
                    placeholder="yourwebsite.com"
                    value={form.website}
                    onChange={e => setForm({ ...form, website: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="Your phone number"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Your email (optional)"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl text-base transition-colors disabled:opacity-60"
                >
                  {loading ? 'Sending...' : 'Submit Request'}
                </button>
              </form>
            )}
          </div>

          {/* What You'll Get */}
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-5">What You'll Get</h2>
            <ul className="space-y-3 mb-6">
              {["What's working", "What's not", "What to fix first"].map(item => (
                <li key={item} className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-slate-500 text-sm">No pressure. Just a clear breakdown.</p>

            {/* Phone repeat */}
            <div className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2">Prefer to call or text?</p>
              <a
                href={`tel:+1${PHONE}`}
                className="flex items-center gap-2 text-slate-900 font-black text-xl hover:text-blue-600 transition-colors"
              >
                <Phone className="w-5 h-5" /> {PHONE_DISPLAY}
              </a>
              <div className="mt-3">
                <TextMeButton />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Phone } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GAPS = [
  'No Google Business Profile posts in 90+ days',
  'No call-to-action visible above the fold on mobile',
  'Missing local city or service area pages',
  'Reviews not being responded to',
  'Slow page speed losing mobile visitors',
  'No seasonal campaigns running',
];

export default function HomeGapAuditCTA() {
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
        notes: `Gap Audit Request — Homepage CTA — ${new Date().toLocaleDateString()}`,
      });
    } catch (_) {}
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left: What a gap audit reveals */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-4">Free · No Pitch</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
              See What Your Website Is Missing
            </h2>
            <p className="text-slate-600 text-base leading-relaxed mb-6">
              Most local service business websites are missing 3–5 things that cost them leads every week. A gap audit takes about 20 minutes and shows you exactly what to fix — no obligation, no sales pitch.
            </p>

            <p className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Common gaps we find:</p>
            <div className="space-y-2 mb-8">
              {GAPS.map(g => (
                <div key={g} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                  {g}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Phone className="w-4 h-4" />
              <span>Prefer to call? </span>
              <a href="tel:+16413579932" className="text-blue-600 font-semibold hover:underline">(641) 357-9932</a>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Got it — we'll reach out soon.</h3>
                <p className="text-slate-500 text-sm">We'll review your site and put together a quick gap snapshot, usually within 24–48 hours.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Request a Free Gap Audit</h3>
                <p className="text-slate-500 text-sm mb-6">We'll look at your site and send you a short breakdown of what we find.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Your Name</label>
                    <input
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Rick Johnson"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Business Name *</label>
                    <input
                      required
                      value={form.business}
                      onChange={e => setForm(p => ({ ...p, business: e.target.value }))}
                      placeholder="Johnson Heating & A/C"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Website URL</label>
                    <input
                      value={form.website}
                      onChange={e => setForm(p => ({ ...p, website: e.target.value }))}
                      placeholder="yourbusiness.com"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Phone or Email</label>
                    <input
                      value={form.phone}
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      placeholder="(641) 555-0100"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting || !form.business.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition"
                  >
                    {submitting ? 'Sending…' : <>Get My Free Gap Audit <ArrowRight className="w-4 h-4" /></>}
                  </button>
                  <p className="text-slate-400 text-xs text-center">No obligation. We'll review and reach out within 24 hours.</p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
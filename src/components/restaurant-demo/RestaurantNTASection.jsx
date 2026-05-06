import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SERVICES = [
  { icon: '🌐', label: 'Website Optimization' },
  { icon: '🤖', label: 'AI Visibility (ChatGPT, Perplexity)' },
  { icon: '🎤', label: 'Voice Search SEO' },
  { icon: '📸', label: 'Social Content Creation' },
  { icon: '🎬', label: 'Food & Promo Videos' },
  { icon: '📱', label: 'Facebook & Instagram Campaigns' },
  { icon: '📍', label: 'Google Business Optimization' },
  { icon: '⭐', label: 'Review Strategy' },
  { icon: '📲', label: 'QR Code Promotions' },
  { icon: '📺', label: 'CTV / Streaming TV Ads' },
  { icon: '📊', label: 'Mobile Conversion Optimization' },
  { icon: '🔍', label: '"Near Me" Search Domination' },
];

// demoLabel: human-readable source label passed in from each page
export default function RestaurantNTASection({ config, demoLabel }) {
  const { name, city } = config;
  const [form, setForm] = useState({ contactName: '', phone: '', email: '', restaurant: '', city: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.entities.SalesLead.create({
        business_name: form.restaurant || `${form.contactName}'s Restaurant`,
        contact_name: form.contactName,
        phone: form.phone,
        email: form.email,
        city: form.city || city,
        industry: 'Restaurant',
        lead_source: 'website',
        status: 'new',
        priority: 'high',
        audit_status: 'not_started',
        internal_notes: `[Restaurant Demo Lead]\nSource: ${demoLabel || name} Demo Page\nVertical: Restaurant\nLead Source: Restaurant Demo\nAudit Status: Not Started\nPipeline Status: New Lead\n\nRequested free restaurant visibility audit via the NTA demo system.`,
        pain_points: 'Restaurant owner interested in improving online visibility, local SEO, and customer acquisition.',
        opportunity_notes: `Came from NTA Restaurant Demo — ${demoLabel || name}. High intent prospect.`,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-6 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-3">Powered by NTA</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
            NTA Restaurant Visibility System
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Everything you see on this page — the SEO, mobile optimization, menu design, review integration, and local visibility — is exactly what NTA builds for local restaurants like yours.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {SERVICES.map(s => (
            <div key={s.label} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xl">{s.icon}</span>
              <p className="text-slate-700 font-semibold text-sm">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Lead Form */}
        <div className="bg-slate-950 rounded-2xl p-8 md:p-12 max-w-3xl mx-auto">
          {submitted ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">We'll Be In Touch!</h3>
              <p className="text-slate-400 leading-relaxed">Our team will reach out within 1 business day with your free restaurant visibility audit — showing exactly how your restaurant appears in Google, AI search, and voice search.</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-white mb-2">Free Restaurant Visibility Audit</h3>
                <p className="text-slate-400 text-sm leading-relaxed">See exactly how your restaurant appears in Google, AI search, voice search, and on mobile. No cost. No obligation. Real insights.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    required
                    placeholder="Your Name"
                    value={form.contactName}
                    onChange={e => setForm({...form, contactName: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    placeholder="Restaurant Name"
                    value={form.restaurant}
                    onChange={e => setForm({...form, restaurant: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    required
                    type="tel"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    placeholder="Your City"
                    value={form.city}
                    onChange={e => setForm({...form, city: e.target.value})}
                    className="w-full sm:col-span-2 bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-base"
                >
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                    : <>Get My Free Restaurant Visibility Audit <ChevronRight className="w-4 h-4" /></>
                  }
                </button>
              </form>
              <p className="text-slate-600 text-xs mt-4 text-center">
                Or call us directly: <a href="tel:+16414208816" className="text-blue-400 font-bold hover:underline">641-420-8816</a>
              </p>
            </>
          )}
        </div>

        {/* Other demos CTA */}
        <div className="mt-10 text-center">
          <p className="text-slate-400 text-sm mb-4">Explore all restaurant demos</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/restaurant-demo/pizza" className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl transition-colors text-sm">🍕 Pizza Demo</Link>
            <Link to="/restaurant-demo/mexican" className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl transition-colors text-sm">🌮 Mexican Demo</Link>
            <Link to="/restaurant-demo/bar" className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl transition-colors text-sm">🍺 Bar & Grill Demo</Link>
          </div>
        </div>

      </div>
    </section>
  );
}
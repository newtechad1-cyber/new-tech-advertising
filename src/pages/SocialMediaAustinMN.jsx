import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import { CheckCircle, ArrowRight, MapPin } from 'lucide-react';

const INTENTS = [
  { title: 'Affordable Social Media Management in Austin, MN', desc: 'Professional social media at small business prices. No agency markups, no contracts — just consistent, strategic content that grows your Austin business.' },
  { title: 'Designed for Austin, MN Small Businesses', desc: 'We work exclusively with small and local businesses. Our content system is built around what Austin customers actually care about and how they search for local services.' },
  { title: 'Local Content Strategy for Austin Businesses', desc: 'Your content strategy is built around Austin — local events, community keywords, and messaging that makes your business feel like a trusted part of the neighborhood.' },
  { title: 'Consistent Social Media Posting for Austin, MN', desc: 'We write, schedule, and publish your posts every week across Facebook, Instagram, and Google Business. No gaps, no dark periods — your brand stays active and visible.' },
  { title: 'Grow Your Austin Business With Social Media', desc: 'We build social media content around one goal: driving more customers to your business. More visibility, more website traffic, more leads — month after month.' },
];

const INCLUDED = [
  'AI-written content for Austin, MN audiences',
  'Posting across Facebook, Instagram, Google Business',
  'Consistent weekly publishing schedule',
  'Strategy aligned with your local SEO',
  'Monthly performance recap',
  'Community-first content approach',
];

export default function SocialMediaAustinMN() {
  useEffect(() => {
    document.title = 'Social Media Management Austin MN | NTA';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.setAttribute('content', 'Social media management for small businesses in Austin, MN. Local content strategy, consistent posting, and growth-focused social media services.');
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <MarketingNav />

      {/* HERO */}
      <section className="bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-violet-300" />
            <span className="text-violet-300 text-sm font-semibold">Austin, Minnesota</span>
          </div>
          <span className="inline-block bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            Social Media Management
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
            Social Media Management for Austin, MN Businesses
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Done-for-you social media built for Austin small businesses. Local strategy, consistent content, and real results — without adding to your workload.
          </p>
          <Link
            to="/book-a-call"
            className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-10 py-4 rounded-xl text-lg transition shadow-lg shadow-violet-600/30"
          >
            Get Your Free Social Media Growth Plan <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* INTENTS */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-14">
            What Austin, MN Businesses Get From Social Media Management
          </h2>
          <div className="space-y-6">
            {INTENTS.map((item, i) => (
              <div key={i} className="flex gap-5 border border-slate-200 rounded-2xl p-7 hover:shadow-md transition">
                <div className="bg-violet-50 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="py-20 px-6 bg-violet-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-10">What's Included for Austin Businesses</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {INCLUDED.map(item => (
              <div key={item} className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-5 py-4">
                <CheckCircle className="w-5 h-5 text-violet-200 flex-shrink-0" />
                <span className="text-white font-medium text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WEBSITE INTEGRATION */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-5">Works Best With a High-Performance Website</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Social media brings in traffic — your website needs to convert it. Combine our{' '}
            <Link to="/services/social-media-management" className="text-violet-600 font-semibold hover:underline">social media management services</Link>{' '}
            with our{' '}
            <Link to="/services/website-rebuilds" className="text-blue-600 font-semibold hover:underline">website rebuild services</Link>{' '}
            for a full growth system.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/website-rebuilds/austin-mn" className="text-blue-600 hover:underline font-medium">→ Website Rebuild Services in Austin</Link>
            <Link to="/services/social-media-management" className="text-violet-600 hover:underline font-medium">→ Social Media Management Overview</Link>
            <Link to="/website-rebuilds/albert-lea-mn" className="text-blue-600 hover:underline font-medium">→ Albert Lea, MN Website Rebuilds</Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-violet-300" />
            <span className="text-violet-300 text-sm font-semibold">Austin, Minnesota</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
            Ready to Grow Your Austin Business With Social Media?
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto">
            Let's build a consistent, strategic social presence that drives real customers to your business.
          </p>
          <Link
            to="/book-a-call"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-10 py-5 rounded-xl text-xl transition shadow-xl shadow-violet-600/30"
          >
            Get Your Social Media Growth Plan <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="text-slate-400 text-sm mt-4">Free strategy call. No commitment required.</p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
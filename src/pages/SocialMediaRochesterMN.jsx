import React from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import { CheckCircle, ArrowRight, MapPin } from 'lucide-react';

import SEOHead from '@/components/shared/SEOHead';
const INTENTS = [
  { title: 'Affordable Social Media for Rochester Businesses', desc: 'Professional social media management priced for small businesses in Rochester — no agency overhead, no hidden fees. Predictable, transparent pricing that delivers real ROI.' },
  { title: 'Built for Small Businesses in Rochester, MN', desc: 'We specialize in local and small businesses. Our system is built around what Rochester business owners actually need — consistent visibility, local relevance, and lead-focused content.' },
  { title: 'Content Strategy Tailored to the Rochester Market', desc: 'We build your social strategy around what Rochester customers respond to — community events, local keywords, seasonal promotions, and messaging that resonates with your audience.' },
  { title: 'Consistent Social Media Posting for Rochester Businesses', desc: 'We write, design, and schedule your posts across Facebook, Instagram, and Google Business — week after week, so your brand stays active and top-of-mind with local customers.' },
  { title: 'Turn Social Media Into Business Growth in Rochester', desc: 'Every post is crafted to drive real outcomes — website visits, phone calls, and new leads. Social media done right compounds your local visibility and builds a steady flow of customers.' },
];

const INCLUDED = [
  'AI-written content for Rochester audiences',
  'Multi-platform publishing schedule',
  'Consistent weekly posting — no gaps',
  'Strategy tied to your website and local SEO',
  'Monthly performance reporting',
  'Local market knowledge built into every post',
];

export default function SocialMediaRochesterMN() {

  return (
    <div className="bg-white min-h-screen">
      <SEOHead 
        title="Social Media Marketing Rochester MN | New Tech Advertising"
        description="AI-powered social media marketing for businesses in Rochester, Minnesota. Automated content creation, scheduling, and local engagement."
      />
      <MarketingNav />

      {/* HERO */}
      <section className="bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-violet-300" />
            <span className="text-violet-300 text-sm font-semibold">Rochester, Minnesota</span>
          </div>
          <span className="inline-block bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            Social Media Management
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
            Social Media Management for Rochester, MN Businesses
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            We manage your social media with a local strategy built for Rochester — consistent content, real results, and zero extra work on your end.
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
            What Rochester Businesses Get From Social Media Management
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
          <h2 className="text-3xl font-bold text-white mb-10">What's Included for Rochester Businesses</h2>
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
            Social media drives traffic — but that traffic needs somewhere to go. Pair our{' '}
            <Link to="/services/social-media-management" className="text-violet-600 font-semibold hover:underline">social media management services</Link>{' '}
            with our{' '}
            <Link to="/services/website-rebuilds" className="text-blue-600 font-semibold hover:underline">website rebuild services</Link>{' '}
            for a complete local growth system.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/website-rebuilds/rochester-mn" className="text-blue-600 hover:underline font-medium">→ Website Rebuild Services in Rochester</Link>
            <Link to="/services/social-media-management" className="text-violet-600 hover:underline font-medium">→ Social Media Management Overview</Link>
            <Link to="/website-rebuilds/mason-city-ia" className="text-blue-600 hover:underline font-medium">→ Mason City, IA Website Rebuilds</Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-violet-300" />
            <span className="text-violet-300 text-sm font-semibold">Rochester, Minnesota</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
            Ready to Grow Your Rochester Business With Social Media?
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
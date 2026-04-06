import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import NTAGrowthGuideBot from '../components/nta-guide/NTAGrowthGuideBot';
import {
  ArrowRight, CheckCircle, ChevronRight, Globe, Shield, Tv, Zap,
  MapPin, BarChart2, TrendingUp, Smartphone, MousePointer, Search,
  AlertTriangle, Clock
} from 'lucide-react';

const SERVICES = [
  {
    icon: Globe,
    label: 'Website Rebuilds',
    headline: 'Turn Your Website Into a Lead Machine',
    desc: 'We rebuild outdated websites with modern design, SEO structure, and conversion-focused layouts built to generate more calls and leads.',
    cta: 'Learn More',
    href: '/services/website-rebuilds',
    featured: true,
    color: 'blue',
  },
  {
    icon: Shield,
    label: 'ADA Compliance',
    headline: 'Protect Your Business & Expand Your Reach',
    desc: 'We audit and remediate websites for ADA accessibility compliance — reducing legal risk while making your site usable for every visitor.',
    cta: 'Learn More',
    href: '/AdaWebsiteCompliance',
    featured: false,
    color: 'violet',
  },
  {
    icon: Tv,
    label: 'Streaming TV Advertising',
    headline: 'Reach Local Customers on Streaming Platforms',
    desc: 'Get your business in front of local households through targeted streaming TV and connected TV advertising — affordable and measurable.',
    cta: 'Learn More',
    href: '/StreamingTvAdvertising',
    featured: false,
    color: 'emerald',
  },
  {
    icon: Zap,
    label: 'AI Marketing & SEO',
    headline: 'Consistent Content That Builds Authority',
    desc: 'AI-powered content, local SEO systems, and automated publishing that grow your visibility month over month without adding to your workload.',
    cta: 'Learn More',
    href: '/AiSeo',
    featured: false,
    color: 'amber',
  },
];

const PROBLEMS = [
  { icon: AlertTriangle, text: 'Outdated design that reduces trust with visitors' },
  { icon: Search, text: 'Weak SEO structure — not showing up on Google' },
  { icon: Smartphone, text: 'Poor mobile performance losing local customers' },
  { icon: MousePointer, text: 'No clear call-to-action — visitors leave without contacting you' },
  { icon: Clock, text: 'Slow load times that hurt rankings and conversions' },
  { icon: BarChart2, text: 'Missed lead opportunities every single day' },
];

const STEPS = [
  { num: '01', title: 'Audit', desc: 'We analyze your site for SEO gaps, speed issues, conversion blockers, and ADA risks.', color: 'bg-blue-600' },
  { num: '02', title: 'Rebuild', desc: 'Modern design, optimized content, and conversion-focused layout built from the ground up.', color: 'bg-violet-600' },
  { num: '03', title: 'Launch', desc: 'Your new site goes live fast, indexed, and ready to capture leads immediately.', color: 'bg-emerald-600' },
  { num: '04', title: 'Grow', desc: 'Ongoing SEO, content, and campaigns layered on your new foundation to compound results.', color: 'bg-orange-500' },
];

const LOCAL_MARKETS = [
  { city: 'Mason City', state: 'IA', href: '/website-rebuilds/mason-city-ia' },
  { city: 'Rochester', state: 'MN', href: '/website-rebuilds/rochester-mn' },
  { city: 'Austin', state: 'MN', href: '/website-rebuilds/austin-mn' },
  { city: 'Albert Lea', state: 'MN', href: '/website-rebuilds/albert-lea-mn' },
];

const VALUE_POINTS = [
  'More inbound leads and phone calls',
  'Better visibility in local search results',
  'Stronger trust with modern, professional design',
  'Fast performance on every device',
  'Scalable systems that grow with your business',
];

const AUDIT_INCLUDES = [
  'Local SEO review and keyword gaps',
  'Page speed analysis',
  'Conversion issues identified',
  'ADA compliance check',
  'Mobile experience review',
  'Improvement roadmap delivered',
];

const colorMap = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'bg-blue-600', badge: 'bg-blue-100 text-blue-700', btn: 'bg-blue-600 hover:bg-blue-700 text-white' },
  violet: { bg: 'bg-violet-50', border: 'border-violet-200', icon: 'bg-violet-600', badge: 'bg-violet-100 text-violet-700', btn: 'bg-violet-600 hover:bg-violet-700 text-white' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'bg-emerald-600', badge: 'bg-emerald-100 text-emerald-700', btn: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700', btn: 'bg-amber-500 hover:bg-amber-600 text-white' },
};

export default function Home() {
  useEffect(() => {
    document.title = 'NTA | Websites, AI Marketing & Advertising for Local Business';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'NTA helps local businesses grow with modern website rebuilds, ADA compliance, AI marketing, and advertising systems. Get a free website audit.');
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <MarketingNav />

      {/* ── 1. HERO ── */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white pt-24 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            Local Business Growth Systems
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            We Help Local Businesses<br className="hidden sm:block" /> Get More Customers Online
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-4 leading-relaxed">
            Modern websites, AI-powered marketing, and advertising systems built to generate leads, improve visibility, and help your business grow.
          </p>
          <p className="text-slate-400 text-sm mb-10">
            Practical systems. Real results. Built for small and local businesses in North Iowa and Southern Minnesota.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/rebuild-intake?source=homepage"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition shadow-lg shadow-blue-600/30"
            >
              Get a Free Website Audit <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white font-semibold px-8 py-4 rounded-xl text-lg transition"
            >
              Explore Services <ChevronRight className="w-5 h-5" />
            </a>
          </div>

          {/* Hero Video */}
          <div className="mt-12 flex justify-center px-4">
            <div
              className="rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/40 border border-white/10 bg-black w-full"
              style={{ maxWidth: '960px', aspectRatio: '16 / 9' }}
            >
              <iframe
                src="https://www.youtube.com/embed/X1yCn7xgx_o?rel=0&playsinline=1"
                title="NTA Homepage Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. CORE SERVICES ── */}
      <section id="services" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Services Built to Grow Local Businesses</h2>
            <p className="text-slate-600 text-lg max-w-xl mx-auto">Everything you need to get found online, convert visitors, and build a stronger local presence.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((svc) => {
              const c = colorMap[svc.color];
              const Icon = svc.icon;
              return (
                <div key={svc.label} className={`rounded-2xl border-2 p-7 flex flex-col ${svc.featured ? `${c.bg} ${c.border} ring-2 ring-blue-300 shadow-lg` : 'border-slate-200 hover:shadow-md'} transition`}>
                  {svc.featured && (
                    <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 self-start">Featured Service</span>
                  )}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${c.icon}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-widest mb-2 px-2 py-0.5 rounded-full self-start ${c.badge}`}>{svc.label}</span>
                  <h3 className="font-bold text-slate-900 text-lg mb-2 mt-1">{svc.headline}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed flex-1">{svc.desc}</p>
                  <Link
                    to={svc.href}
                    className={`mt-5 inline-flex items-center justify-center gap-2 font-bold px-5 py-2.5 rounded-xl text-sm transition ${c.btn}`}
                  >
                    {svc.cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. PROBLEM / AUTHORITY ── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Most Small Business Websites Are Losing Customers
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Your website should be your best salesperson — working around the clock to bring in leads. If it has any of these issues, it's doing the opposite.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {PROBLEMS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-4 bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
                <div className="bg-red-50 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-slate-700 font-medium text-sm leading-relaxed mt-1">{text}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-800 mb-6">
              We rebuild and improve systems that help businesses <span className="text-blue-600">get found and generate more leads.</span>
            </p>
            <Link
              to="/rebuild-intake?source=homepage"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition shadow-md"
            >
              Get a Free Website Audit <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">How We Help You Grow</h2>
            <p className="text-slate-600 text-lg max-w-xl mx-auto">A simple, four-step process from where you are to where you want to be.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step) => (
              <div key={step.num} className="text-center">
                <div className={`${step.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl mx-auto mb-4`}>
                  {step.num}
                </div>
                <h3 className="text-slate-900 font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. LOCAL SERVICE AREAS ── */}
      <section className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <MapPin className="w-10 h-10 text-blue-300 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Proudly Serving Businesses Across North Iowa and Southern Minnesota
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            NTA works directly with small and local businesses in Mason City, Rochester, Austin, Albert Lea, and surrounding communities throughout North Iowa and Southern Minnesota. We understand the local markets and build systems designed to help businesses grow in these regions.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {LOCAL_MARKETS.map(({ city, state, href }) =>
              href ? (
                <Link
                  key={city}
                  to={href}
                  className="flex items-center gap-2 bg-blue-600/20 border border-blue-500/40 hover:border-blue-400 text-blue-200 hover:text-white font-semibold px-5 py-2.5 rounded-full text-sm transition"
                >
                  <MapPin className="w-3.5 h-3.5" /> {city}, {state}
                </Link>
              ) : (
                <span
                  key={city}
                  className="flex items-center gap-2 bg-white/10 border border-white/20 text-slate-300 font-semibold px-5 py-2.5 rounded-full text-sm"
                >
                  <MapPin className="w-3.5 h-3.5" /> {city}, {state}
                </span>
              )
            )}
          </div>
          <div className="border-t border-slate-700 pt-8">
            <p className="text-slate-400 text-sm mb-4 font-medium">Local service pages:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/website-rebuilds/mason-city-ia" className="text-blue-400 hover:text-blue-300 hover:underline font-medium transition">
                → Mason City, IA Website Rebuild Services
              </Link>
              <Link to="/website-rebuilds/rochester-mn" className="text-blue-400 hover:text-blue-300 hover:underline font-medium transition">
                → Rochester, MN Website Rebuild Services
              </Link>
              <Link to="/services/website-rebuilds" className="text-blue-400 hover:text-blue-300 hover:underline font-medium transition">
                → Website Rebuild Services Overview
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. RESULTS / VALUE ── */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <TrendingUp className="w-10 h-10 text-blue-200 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-10">Built for Real Results</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            {VALUE_POINTS.map(point => (
              <div key={point} className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-5 py-4">
                <CheckCircle className="w-5 h-5 text-blue-200 flex-shrink-0" />
                <span className="text-white font-medium text-sm">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FEATURED OFFER ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-slate-50 border-2 border-blue-200 rounded-3xl p-10 text-center shadow-lg">
            <span className="inline-block bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-5">
              Free — No Obligation
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Start With a Website Audit</h2>
            <p className="text-slate-600 mb-8 leading-relaxed max-w-xl mx-auto">
              If your website is outdated, underperforming, or not bringing in leads, we'll show you exactly what to fix and where the biggest opportunities are.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-8 text-left max-w-lg mx-auto">
              {AUDIT_INCLUDES.map(item => (
                <div key={item} className="flex items-center gap-2 text-slate-700 text-sm">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <Link
              to="/rebuild-intake?source=homepage"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-xl text-lg transition shadow-lg shadow-blue-600/30"
            >
              Get My Free Audit <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-slate-400 text-xs mt-4">No credit card required. Response within 24–48 hours.</p>
          </div>
        </div>
      </section>

      {/* ── 8. INSIGHTS PLACEHOLDER ── */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Local Business Marketing Insights</h2>
          <p className="text-slate-500 text-base mb-8 max-w-xl mx-auto">
            Practical guides and strategies for small businesses looking to improve their online presence, generate more leads, and grow in local markets.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/Blog" className="text-blue-600 hover:underline font-medium">→ Read Our Blog</Link>
            <Link to="/services/website-rebuilds" className="text-blue-600 hover:underline font-medium">→ Website Rebuild Services</Link>
            <Link to="/AdaWebsiteCompliance" className="text-blue-600 hover:underline font-medium">→ ADA Compliance</Link>
            <Link to="/AiSeo" className="text-blue-600 hover:underline font-medium">→ AI SEO & Marketing</Link>
            <Link to="/Contact" className="text-blue-600 hover:underline font-medium">→ Contact Us</Link>
          </div>
        </div>
      </section>

      {/* ── 9. FINAL CTA ── */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
            Ready to Turn Your Website Into a Lead Generator?
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto">
            Every day with an underperforming site is a day you're handing customers to your competitors. Let's change that.
          </p>
          <Link
            to="/rebuild-intake?source=homepage"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-5 rounded-xl text-xl transition shadow-xl shadow-blue-600/30"
          >
            Get Your Free Website Audit <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      <SiteFooter />
      <NTAGrowthGuideBot />
    </div>
  );
}
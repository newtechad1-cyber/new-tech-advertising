import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import {
  ArrowRight, CheckCircle, AlertTriangle, Search, Smartphone,
  MousePointer, Clock, BarChart2, Zap, Globe, Shield, TrendingUp, MapPin, ChevronDown
} from 'lucide-react';

const PROBLEMS = [
  { icon: AlertTriangle, text: 'Outdated design that reduces trust with visitors' },
  { icon: Search, text: 'Weak SEO — not showing up in Rochester Google searches' },
  { icon: Smartphone, text: 'Poor mobile experience losing local customers' },
  { icon: MousePointer, text: 'No clear call-to-action — visitors leave without contacting you' },
  { icon: Clock, text: 'Slow load times that hurt rankings and conversions' },
  { icon: BarChart2, text: 'Missed lead opportunities every single day' },
];

const SOLUTIONS = [
  { icon: Search, title: 'Built for Local Search Visibility', desc: 'Structured for Rochester-area keyword rankings, Google Business alignment, and local SEO signals that help nearby customers find you.' },
  { icon: Smartphone, title: 'Optimized for Mobile Users', desc: 'Most local searches happen on mobile. Your rebuilt site will load fast, display correctly, and convert on every device.' },
  { icon: MousePointer, title: 'Designed to Convert', desc: 'Clear calls-to-action, trust signals, and conversion-focused layouts that turn visitors into phone calls and form submissions.' },
  { icon: TrendingUp, title: 'Built for Long-Term SEO Growth', desc: 'A proper content structure that gives your Rochester business a foundation to grow visibility month over month.' },
  { icon: Globe, title: 'Supports Future Expansion', desc: 'Built to scale — add service pages, blog content, and local landing pages as your business grows across Southeast Minnesota.' },
  { icon: Shield, title: 'ADA & Performance Ready', desc: 'Modern standards compliance, fast load speeds, and accessibility baked in from the start.' },
];

const STEPS = [
  { num: '01', title: 'Audit', desc: 'We analyze your current site for SEO gaps, speed issues, conversion blockers, and local ranking opportunities specific to Rochester.', color: 'bg-blue-600' },
  { num: '02', title: 'Rebuild', desc: 'Modern design, optimized content structure, and a conversion-focused layout built from the ground up for your business.', color: 'bg-violet-600' },
  { num: '03', title: 'Launch', desc: 'Your new site goes live fast — properly indexed, mobile-ready, and positioned to capture local leads immediately.', color: 'bg-emerald-600' },
  { num: '04', title: 'Grow', desc: 'Ongoing SEO, content, and local campaigns layered on your new foundation to compound results over time.', color: 'bg-orange-500' },
];

const BEFORE = [
  'Outdated design that hurts trust with Rochester customers',
  'Slow page load times on mobile and desktop',
  'Weak or no visibility in Rochester-area Google searches',
  'Confusing navigation and no clear next step for visitors',
];

const AFTER = [
  'Modern, professional design that builds immediate trust',
  'Fast, mobile-optimized performance on every device',
  'Stronger local search presence in Rochester and Southeast MN',
  'Clear messaging and CTAs that generate more calls and leads',
];

const AUDIT_INCLUDES = [
  'Local SEO review and keyword gaps',
  'Page speed analysis',
  'Conversion issues identified',
  'ADA compliance check',
  'Mobile experience review',
  'Improvement roadmap delivered',
];

const TRUST_POINTS = [
  'Serving Rochester and surrounding Southeast Minnesota communities',
  'Built for small and mid-sized local businesses',
  'Focused on measurable business results — more calls, more leads',
  'Modern systems with practical, hands-on execution',
  'No long-term contracts required to get started',
  'Straightforward process from audit to launch',
];

const FAQS = [
  { q: 'Do you work with businesses in Rochester, MN?', a: 'Yes. We work with small and mid-sized businesses in Rochester and throughout Southeast Minnesota. Whether you\'re a local service business, professional practice, or retail operation, we build websites designed to generate more leads in your local market.' },
  { q: 'How long does a website rebuild take?', a: 'Most projects are completed within 4–8 weeks depending on scope. We\'ll give you a clear timeline after your free audit so you know exactly what to expect.' },
  { q: 'Will this help me rank better in Google in Rochester?', a: 'Yes. Local SEO structure is built into every rebuild — including proper page structure, keyword targeting for Rochester-area searches, and Google Business alignment. Many clients see measurable improvement in local rankings within 60–90 days.' },
  { q: 'What does a website rebuild cost?', a: 'Pricing depends on the scope of your project. After your free audit, we\'ll provide a clear, itemized proposal with no surprises. Most small business rebuilds are priced to be accessible without requiring a large upfront investment.' },
  { q: 'Do you handle SEO as part of the rebuild?', a: 'Yes. On-page SEO is included in every rebuild — proper heading structure, meta tags, local keyword integration, and site speed optimization. Ongoing SEO services are also available to continue growing your rankings after launch.' },
  { q: 'Do you work with small businesses?', a: 'That\'s our primary focus. We specialize in helping small and local businesses compete online with systems that are built for their market, their budget, and their goals.' },
];

export default function WebsiteRebuildsRochesterMN() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="bg-white min-h-screen">
      <SEOHead 
        title="Website Rebuilds Rochester MN | New Tech Advertising"
        description="Professional website rebuilds for businesses in Rochester, Minnesota. Modern, mobile-responsive, AI-optimized websites."
      />
      <MarketingNav />

      {/* ── 1. HERO ── */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white pt-24 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-5">
            <MapPin className="w-4 h-4 text-blue-300" />
            <span className="text-blue-300 text-sm font-semibold uppercase tracking-widest">Rochester, Minnesota</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Website Rebuild Services<br className="hidden sm:block" /> in Rochester, MN
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-4 leading-relaxed">
            We help businesses in Rochester turn outdated websites into lead-generating systems with modern design, stronger SEO structure, and faster performance.
          </p>
          <p className="text-slate-400 text-sm mb-10">
            Serving Rochester and surrounding communities across Southeast Minnesota.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/rebuild-intake?source=website-rebuild-rochester-mn"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition shadow-lg shadow-blue-600/30"
            >
              Get a Free Website Audit <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#process"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white font-semibold px-8 py-4 rounded-xl text-lg transition"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. LOCAL PROBLEM ── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Most Rochester Business Websites Are Losing Customers
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Many small businesses in Rochester rely on their website, but most are not built to generate leads consistently. If your site has any of these issues, it's costing you customers every day.
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
            <Link
              to="/rebuild-intake?source=website-rebuild-rochester-mn"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition shadow-md"
            >
              Get a Free Website Audit <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3. LOCAL SOLUTION ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Website Rebuilds Designed for Rochester Businesses
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Every rebuild is built around your local market — designed to help Rochester customers find you, trust you, and contact you.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOLUTIONS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. BEFORE / AFTER ── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Before & After a Website Rebuild</h2>
            <p className="text-slate-600 text-lg max-w-xl mx-auto">Here's what changes for Rochester businesses that make the switch.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-7">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <span className="font-bold text-red-700 text-sm uppercase tracking-widest">Before</span>
              </div>
              <ul className="space-y-3">
                {BEFORE.map(item => (
                  <li key={item} className="flex items-start gap-3 text-slate-700 text-sm">
                    <span className="text-red-400 font-bold mt-0.5 flex-shrink-0">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-7">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="font-bold text-emerald-700 text-sm uppercase tracking-widest">After</span>
              </div>
              <ul className="space-y-3">
                {AFTER.map(item => (
                  <li key={item} className="flex items-start gap-3 text-slate-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. PROCESS ── */}
      <section id="process" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Our Simple Website Rebuild Process</h2>
            <p className="text-slate-600 text-lg max-w-xl mx-auto">
              We work with Rochester-area business owners to improve online visibility and turn websites into stronger sales tools.
            </p>
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

      {/* ── 6. LOCAL TRUST ── */}
      <section className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <MapPin className="w-10 h-10 text-blue-300 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Focused on Local Business Growth</h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            We build practical, modern systems for small businesses in Rochester, Minnesota, and throughout Southeast Minnesota — focused on real outcomes, not vanity metrics.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left mb-10">
            {TRUST_POINTS.map(point => (
              <div key={point} className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-5 py-4">
                <CheckCircle className="w-4 h-4 text-blue-300 flex-shrink-0" />
                <span className="text-slate-200 text-sm font-medium">{point}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-700 pt-8 text-sm text-slate-400">
            Serving Rochester, MN and surrounding Southeast Minnesota communities including Stewartville, Byron, Kasson, Mantorville, and the greater Olmsted County area.
          </div>
        </div>
      </section>

      {/* ── 7. OFFER / AUDIT ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-slate-50 border-2 border-blue-200 rounded-3xl p-10 text-center shadow-lg">
            <span className="inline-block bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-5">
              Free — No Obligation
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Get a Free Website Audit in Rochester</h2>
            <p className="text-slate-600 mb-8 leading-relaxed max-w-xl mx-auto">
              If your Rochester business website isn't generating leads, we'll show you exactly what to fix and where the biggest opportunities are.
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
              to="/rebuild-intake?source=website-rebuild-rochester-mn"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-xl text-lg transition shadow-lg shadow-blue-600/30"
            >
              Get My Free Audit <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-slate-400 text-xs mt-4">No credit card required. Response within 24–48 hours.</p>
          </div>
        </div>
      </section>

      {/* ── 8. FAQ ── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Common Questions</h2>
            <p className="text-slate-600">Answers to what Rochester business owners ask most.</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-slate-900 hover:bg-slate-50 transition"
                >
                  {faq.q}
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GROW BEYOND WEBSITE ── */}
      <section className="py-16 px-6 bg-violet-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border-2 border-violet-200 rounded-3xl p-10 text-center shadow-sm">
            <span className="inline-block bg-violet-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-5">Beyond the Rebuild</span>
            <h2 className="text-3xl font-bold text-slate-900 mb-5">Grow Your Business Beyond Your Website</h2>
            <p className="text-slate-600 leading-relaxed mb-4 max-w-2xl mx-auto">
              A great website is just the starting point. Local businesses in Rochester are using social media to drive consistent traffic, stay top-of-mind with customers, and turn their online presence into a steady stream of new leads.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
              Our <Link to="/services/social-media-management" className="text-violet-600 font-semibold hover:underline">social media management services</Link> are built to work alongside your rebuilt website — creating a unified growth engine that compounds visibility month over month.
            </p>
            <Link to="/services/social-media-management" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-3 rounded-xl transition shadow-md">
              See Social Media Management <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 9. INTERNAL LINKS ── */}
      <section className="py-12 px-6 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-500 text-sm mb-4 font-medium">Explore more:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/services/website-rebuilds" className="text-blue-600 hover:underline font-medium">→ Website Rebuild Services Overview</Link>
            <Link to="/website-rebuilds/mason-city-ia" className="text-blue-600 hover:underline font-medium">→ Mason City, IA Website Rebuilds</Link>
            <Link to="/Contact" className="text-blue-600 hover:underline font-medium">→ Contact Us</Link>
            <Link to="/Blog" className="text-blue-600 hover:underline font-medium">→ Marketing Blog</Link>
          </div>
        </div>
      </section>

      {/* ── 10. FINAL CTA ── */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
            Need More Leads From Your<br className="hidden sm:block" /> Website in Rochester?
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto">
            Every day with an underperforming site is a day you're handing customers to your competitors. Let's change that.
          </p>
          <Link
            to="/rebuild-intake?source=website-rebuild-rochester-mn"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-5 rounded-xl text-xl transition shadow-xl shadow-blue-600/30"
          >
            Start With a Free Audit <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
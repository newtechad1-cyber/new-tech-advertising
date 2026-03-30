import React from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import { CheckCircle, AlertTriangle, Zap, TrendingUp, Shield, ArrowRight, Clock, Search, Smartphone, MousePointer, BarChart2, ChevronRight } from 'lucide-react';

const PROBLEMS = [
  { icon: Zap, text: 'Slow load speeds hurting Google rankings' },
  { icon: Smartphone, text: 'Poor mobile experience losing visitors' },
  { icon: MousePointer, text: 'No clear conversion path for leads' },
  { icon: AlertTriangle, text: 'Outdated design reducing trust' },
  { icon: Search, text: 'Weak SEO structure limiting visibility' },
  { icon: Shield, text: 'ADA compliance risks and legal exposure' },
];

const SOLUTIONS = [
  {
    title: 'AI-Structured Pages for SEO',
    desc: 'Every page is built with keyword-targeted structure, proper heading hierarchy, and semantic markup that search engines reward.',
  },
  {
    title: 'Conversion-Focused Layout',
    desc: 'Clear calls-to-action, trust signals, and persuasive messaging placed exactly where visitors need them to take action.',
  },
  {
    title: 'Fast, Mobile-First Performance',
    desc: 'Optimized images, lean code, and mobile-first design ensure fast load times on every device.',
  },
  {
    title: 'Built-In Lead Capture Systems',
    desc: 'Contact forms, click-to-call, and lead magnets integrated throughout so you never miss an opportunity.',
  },
  {
    title: 'Scalable for Growth',
    desc: 'A content architecture designed to expand with blog posts, new pages, and campaigns that compound over time.',
  },
];

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Audit',
    desc: 'We analyze your current site — speed, SEO gaps, conversion issues, ADA risks, and competitive positioning.',
    color: 'bg-blue-600',
  },
  {
    num: '02',
    title: 'Rebuild',
    desc: 'Modern structure, AI-optimized content, and conversion-focused design built from the ground up.',
    color: 'bg-violet-600',
  },
  {
    num: '03',
    title: 'Launch',
    desc: 'Your new site goes live fully optimized — fast, indexed, and ready to capture leads immediately.',
    color: 'bg-emerald-600',
  },
  {
    num: '04',
    title: 'Grow',
    desc: 'Ongoing SEO, content, and campaigns layered on top of your new foundation to compound results.',
    color: 'bg-orange-500',
  },
];

const RESULTS = [
  'More inbound leads and phone calls',
  'Better Google search rankings',
  'Faster page load performance',
  'Increased visitor trust and credibility',
  'Higher conversion rates from existing traffic',
];

const FAQS = [
  {
    q: 'How long does a rebuild take?',
    a: 'Most small business website rebuilds are completed in 2–4 weeks. Larger or more complex sites may take 4–8 weeks. We move quickly without cutting corners.',
  },
  {
    q: 'Will I lose my existing SEO rankings?',
    a: 'No. We preserve your URL structure and existing SEO equity during the rebuild, and the new site is built to rank higher than your current one.',
  },
  {
    q: 'Do you handle the content too?',
    a: 'Yes. Our AI-assisted content team writes keyword-optimized, conversion-focused copy for every page — no extra work required from you.',
  },
  {
    q: 'What does a rebuild cost?',
    a: 'Pricing depends on your site size and goals. We offer a free audit first so you know exactly what\'s needed before committing. Most projects start at $2,500.',
  },
  {
    q: 'Do you work with small businesses?',
    a: 'That\'s our specialty. We\'ve built our entire platform around the needs of small and mid-sized local businesses who need results without agency overhead.',
  },
  {
    q: 'Can you improve my Google rankings after the rebuild?',
    a: 'Yes. Every rebuild includes foundational SEO, and we offer ongoing content and SEO services to continue driving ranking improvements over time.',
  },
];

const TRUST_ITEMS = [
  { icon: CheckCircle, text: 'Built exclusively for local and small businesses' },
  { icon: TrendingUp, text: 'Focused on ROI and measurable outcomes' },
  { icon: Zap, text: 'AI-powered systems for speed and scale' },
  { icon: BarChart2, text: 'Performance-first approach on every project' },
];

export default function WebsiteRebuildService() {
  return (
    <div className="bg-white min-h-screen">
      {/* SEO Meta — rendered via Helmet or inline for now */}
      <title>Website Rebuild Services for Small Business | NTA</title>

      <MarketingNav />

      {/* ── 1. HERO ── */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            Website Rebuild Services
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
            Your Website Is Costing You Customers — We Fix It Fast
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Outdated websites lose traffic, conversions, and trust. We rebuild your site using modern AI-driven structure so it ranks, converts, and grows your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/rebuild-intake?source=website-rebuild-service"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition shadow-lg shadow-blue-600/30"
            >
              Get a Free Website Audit <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#process"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white font-semibold px-8 py-4 rounded-xl text-lg transition"
            >
              See How It Works <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. PROBLEM ── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Most Small Business Websites Are Losing Money
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              You built a site to grow your business. But if it has any of these issues, it may be doing the opposite.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {PROBLEMS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-4 bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
                <div className="bg-red-50 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-slate-700 font-medium text-sm leading-relaxed mt-1">{text}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-lg font-semibold text-slate-800">
            If your website isn't generating leads, it's <span className="text-red-500">costing you business.</span>
          </p>
        </div>
      </section>

      {/* ── 3. SOLUTION ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              We Don't Just Redesign — We Rebuild for Performance
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Every rebuild is engineered for SEO, speed, and conversions — not just aesthetics.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOLUTIONS.map((s, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl p-7 hover:shadow-md transition">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{s.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. BEFORE / AFTER ── */}
      <section className="py-20 px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-14">
            The Difference Is Dramatic
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Before */}
            <div className="bg-red-950/40 border border-red-800/50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <h3 className="text-red-300 font-bold text-lg uppercase tracking-wide">Before</h3>
              </div>
              <ul className="space-y-4">
                {['Slow load times (5–8 seconds)', 'Outdated design from 2015', 'Confusing navigation and layout', 'No clear calls-to-action', 'Buried on page 3+ of Google', 'Zero lead capture system'].map(item => (
                  <li key={item} className="flex items-start gap-3 text-red-200 text-sm">
                    <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* After */}
            <div className="bg-emerald-950/40 border border-emerald-700/50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <h3 className="text-emerald-300 font-bold text-lg uppercase tracking-wide">After</h3>
              </div>
              <ul className="space-y-4">
                {['Lightning fast (under 2 seconds)', 'Modern, professional design', 'Clear messaging and easy navigation', 'Strategic CTAs throughout', 'Ranking for local keywords', 'Automated lead capture system'].map(item => (
                  <li key={item} className="flex items-start gap-3 text-emerald-200 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
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
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Our Simple Rebuild Process</h2>
            <p className="text-slate-600 text-lg max-w-xl mx-auto">Four clear steps from broken to high-performing.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step) => (
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

      {/* ── 6. RESULTS ── */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-10">Built to Drive Real Results</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {RESULTS.map(r => (
              <div key={r} className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-5 py-4">
                <CheckCircle className="w-5 h-5 text-blue-200 flex-shrink-0" />
                <span className="text-white font-medium text-sm">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. OFFER ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-slate-50 border-2 border-blue-200 rounded-3xl p-10 text-center shadow-lg">
            <span className="inline-block bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-5">
              Free — No Obligation
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Get a Free Website Performance Audit</h2>
            <p className="text-slate-600 mb-8 leading-relaxed max-w-xl mx-auto">
              We'll analyze your current site and deliver a detailed roadmap showing exactly what's holding you back and how to fix it.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-8 text-left max-w-lg mx-auto">
              {[
                'SEO score and keyword gaps',
                'Page speed analysis',
                'Conversion issues identified',
                'ADA compliance check',
                'Mobile experience review',
                'Improvement roadmap',
              ].map(item => (
                <div key={item} className="flex items-center gap-2 text-slate-700 text-sm">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <Link
              to="/rebuild-intake?source=website-rebuild-service"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-xl text-lg transition shadow-lg shadow-blue-600/30"
            >
              Get My Free Audit <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-slate-400 text-xs mt-4">No credit card required. Results delivered within 24–48 hours.</p>
          </div>
        </div>
      </section>

      {/* ── 8. TRUST ── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Businesses Trust NTA</h2>
          <p className="text-slate-600 text-lg mb-12 max-w-xl mx-auto">
            We're not a generalist agency. We're built specifically for small and local businesses who need real ROI.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TRUST_ITEMS.map(({ icon: Icon, text }) => (
              <div key={text} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center gap-3 text-center hover:shadow-md transition">
                <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-slate-700 font-semibold text-sm">{text}</p>
              </div>
            ))}
          </div>
          {/* Internal links */}
          <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/AdaWebsiteCompliance" className="text-blue-600 hover:underline font-medium">→ ADA Compliance Services</Link>
            <Link to="/AiSeo" className="text-blue-600 hover:underline font-medium">→ AI SEO & Marketing</Link>
            <Link to="/Contact" className="text-blue-600 hover:underline font-medium">→ Contact Us</Link>
            <Link to="/Blog" className="text-blue-600 hover:underline font-medium">→ Read Our Blog</Link>
          </div>
        </div>
      </section>

      {/* ── 9. FAQ ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="border border-slate-200 rounded-2xl p-7">
                <h3 className="font-bold text-slate-900 text-lg mb-3">{q}</h3>
                <p className="text-slate-600 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. FINAL CTA ── */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
            Stop Losing Customers to a Bad Website
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto">
            Every day with an underperforming site is a day you're handing leads to competitors. Let's change that.
          </p>
          <Link
            to="/rebuild-intake?source=website-rebuild-service"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-5 rounded-xl text-xl transition shadow-xl shadow-blue-600/30"
          >
            Get Your Free Audit Today <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
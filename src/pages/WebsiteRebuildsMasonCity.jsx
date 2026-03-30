import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import {
  CheckCircle, AlertTriangle, Zap, TrendingUp, Shield, ArrowRight,
  Search, Smartphone, MousePointer, BarChart2, ChevronRight, MapPin
} from 'lucide-react';

const PROBLEMS = [
  { icon: Zap, text: 'Slow load speeds that hurt Google rankings' },
  { icon: Smartphone, text: 'Poor mobile experience losing visitors on the go' },
  { icon: MousePointer, text: 'No clear conversion path — visitors leave without calling' },
  { icon: AlertTriangle, text: 'Outdated design that reduces trust with local customers' },
  { icon: Search, text: 'Weak local SEO — not showing up in Mason City searches' },
  { icon: Shield, text: 'ADA compliance risks and potential legal exposure' },
];

const SOLUTIONS = [
  {
    title: 'Built for Local Search Visibility',
    desc: 'Every page is structured with Mason City-specific keywords, local schema markup, and geo-targeted content that helps you rank in North Iowa searches.',
  },
  {
    title: 'Optimized for Mobile Users',
    desc: 'Most local searches happen on mobile. We build fast, mobile-first sites that load instantly and look great on every device.',
  },
  {
    title: 'Designed to Convert Visitors Into Calls',
    desc: 'Clear calls-to-action, click-to-call buttons, and trust signals placed exactly where Mason City customers need them to take action.',
  },
  {
    title: 'Structured for Long-Term SEO Growth',
    desc: 'A content architecture designed to grow over time with local blog posts, service pages, and campaigns that compound your visibility.',
  },
];

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Audit',
    desc: 'We analyze your current site for speed issues, local SEO gaps, conversion problems, and ADA risks — specific to your Mason City market.',
    color: 'bg-blue-600',
  },
  {
    num: '02',
    title: 'Rebuild',
    desc: 'Modern design, locally optimized content, and a conversion-focused layout built from the ground up for North Iowa businesses.',
    color: 'bg-violet-600',
  },
  {
    num: '03',
    title: 'Launch',
    desc: 'Your new site goes live fully optimized — fast, indexed, and ready to capture leads from Mason City and surrounding communities.',
    color: 'bg-emerald-600',
  },
  {
    num: '04',
    title: 'Grow',
    desc: 'Ongoing local SEO, content, and campaigns layered on top of your new foundation to keep your Mason City business growing.',
    color: 'bg-orange-500',
  },
];

const FAQS = [
  {
    q: 'Do you work with businesses in Mason City?',
    a: 'Yes. We work directly with small and mid-sized businesses in Mason City, IA and throughout North Iowa — including surrounding communities like Clear Lake, Garner, and Hampton.',
  },
  {
    q: 'How long does a website rebuild take?',
    a: 'Most projects are completed in 2–4 weeks. Larger or more complex sites may take 4–8 weeks. We move quickly without cutting corners.',
  },
  {
    q: 'Will a new website help me rank locally in Mason City?',
    a: 'Yes. We build every site with local SEO structure built in — proper keyword targeting, local schema markup, and geo-optimized content to improve your visibility in Mason City and North Iowa searches.',
  },
  {
    q: 'What does a website rebuild cost?',
    a: "Pricing depends on your site's size and scope. We offer a free audit first so you know exactly what's needed before committing. Most projects start at $2,500.",
  },
  {
    q: 'Do you handle SEO after the rebuild?',
    a: 'Yes. Every rebuild includes foundational local SEO, and we offer ongoing content and SEO services to continue improving your rankings over time.',
  },
];

export default function WebsiteRebuildsMasonCity() {
  useEffect(() => {
    document.title = 'Website Rebuild Services in Mason City IA | NTA';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', 'Need a better website in Mason City, IA? We rebuild websites for speed, SEO, and conversions. Get your free audit today.');
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'description';
      newMeta.content = 'Need a better website in Mason City, IA? We rebuild websites for speed, SEO, and conversions. Get your free audit today.';
      document.head.appendChild(newMeta);
    }
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <MarketingNav />

      {/* ── 1. HERO ── */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-5">
            <MapPin className="w-4 h-4 text-blue-300" />
            <span className="bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest">
              Mason City, Iowa
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
            Website Rebuild Services<br className="hidden sm:block" /> in Mason City, IA
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            We help businesses in Mason City turn outdated websites into lead-generating systems with modern design, SEO structure, and fast performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/RebuildIntake"
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

      {/* ── 2. LOCAL PROBLEM ── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Most Mason City Business Websites Are Losing Customers
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Many small businesses in Mason City rely on their website, but most are not built to generate leads. If your site has any of these issues, it may be costing you business.
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
            If your website isn't generating leads in Mason City, it's <span className="text-red-500">working against you.</span>
          </p>
        </div>
      </section>

      {/* ── 3. LOCAL SOLUTION ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Website Rebuilds Designed for Mason City Businesses
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              We don't just redesign — we rebuild for local search performance, mobile usability, and real lead generation in North Iowa.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SOLUTIONS.map((s, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl p-7 hover:shadow-md transition">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{s.title}</h3>
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
            The Difference for Mason City Businesses
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-red-950/40 border border-red-800/50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <h3 className="text-red-300 font-bold text-lg uppercase tracking-wide">Before</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Outdated local business website',
                  'Low visibility in Mason City searches',
                  'Slow load times on mobile',
                  'Confusing layout, no clear CTA',
                  'Buried on page 3+ of Google',
                  'Missing leads to competitors',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-red-200 text-sm">
                    <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-emerald-950/40 border border-emerald-700/50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <h3 className="text-emerald-300 font-bold text-lg uppercase tracking-wide">After</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Modern, fast website built for conversions',
                  'Better local rankings in Mason City & North Iowa',
                  'Lightning fast on mobile (under 2 seconds)',
                  'Clear messaging and strategic CTAs',
                  'Ranking for local Mason City keywords',
                  'Generating calls and leads consistently',
                ].map(item => (
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
            <p className="text-slate-600 text-lg max-w-xl mx-auto">
              We work directly with Mason City business owners to improve their online presence — four clear steps from broken to high-performing.
            </p>
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

      {/* ── 6. LOCAL TRUST ── */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <MapPin className="w-10 h-10 text-blue-200 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Focused on Local Business Growth</h2>
          <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
            We're not a generalist agency. We build specifically for small and local businesses in Mason City, IA and the surrounding North Iowa region.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: 'Serving Mason City & Surrounding Areas', desc: 'Clear Lake, Garner, Hampton, Forest City, and throughout North Iowa.' },
              { title: 'Built for Small & Mid-Sized Businesses', desc: 'No enterprise overhead. Focused, affordable solutions for local businesses.' },
              { title: 'Measurable Results, Not Just Design', desc: 'Every rebuild is built around SEO rankings, conversions, and lead generation.' },
            ].map(item => (
              <div key={item.title} className="bg-white/10 border border-white/20 rounded-2xl p-6 text-left">
                <CheckCircle className="w-5 h-5 text-blue-200 mb-3" />
                <h3 className="text-white font-bold text-sm mb-2">{item.title}</h3>
                <p className="text-blue-100 text-xs leading-relaxed">{item.desc}</p>
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
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Get a Free Website Audit in Mason City</h2>
            <p className="text-slate-600 mb-8 leading-relaxed max-w-xl mx-auto">
              We'll analyze your current site and deliver a clear roadmap showing exactly what's holding you back from ranking and converting in the Mason City market.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-8 text-left max-w-lg mx-auto">
              {[
                'Local SEO score and keyword gaps',
                'Page speed analysis',
                'Conversion issues identified',
                'ADA compliance check',
                'Mobile experience review',
                'Local improvement roadmap',
              ].map(item => (
                <div key={item} className="flex items-center gap-2 text-slate-700 text-sm">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <Link
              to="/RebuildIntake"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-xl text-lg transition shadow-lg shadow-blue-600/30"
            >
              Get My Free Audit <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-slate-400 text-xs mt-4">No credit card required. Results delivered within 24–48 hours.</p>
          </div>
        </div>
      </section>

      {/* ── 8. FAQ ── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Frequently Asked Questions — Mason City, IA
          </h2>
          <div className="space-y-6">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="border border-slate-200 rounded-2xl p-7 bg-white">
                <h3 className="font-bold text-slate-900 text-lg mb-3">{q}</h3>
                <p className="text-slate-600 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Internal Links ── */}
      <section className="py-10 px-6 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-500 text-sm mb-4 font-medium">Also explore:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/services/website-rebuilds" className="text-blue-600 hover:underline font-medium">→ Website Rebuild Services Overview</Link>
            <Link to="/AdaWebsiteCompliance" className="text-blue-600 hover:underline font-medium">→ ADA Compliance Services</Link>
            <Link to="/AiSeo" className="text-blue-600 hover:underline font-medium">→ AI SEO & Marketing</Link>
            <Link to="/Contact" className="text-blue-600 hover:underline font-medium">→ Contact Us</Link>
            <Link to="/Blog" className="text-blue-600 hover:underline font-medium">→ Read Our Blog</Link>
          </div>
        </div>
      </section>

      {/* ── 9. FINAL CTA ── */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-300" />
            <span className="text-blue-300 text-sm font-semibold">Mason City, Iowa</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
            Need More Leads From Your Website in Mason City?
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto">
            Every day with an underperforming site is a day you're handing business to your North Iowa competitors. Let's fix that.
          </p>
          <Link
            to="/RebuildIntake"
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
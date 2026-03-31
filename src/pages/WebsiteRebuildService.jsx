import React from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import { CheckCircle, AlertTriangle, Zap, TrendingUp, Shield, ArrowRight, Clock, Search, Smartphone, MousePointer, BarChart2, ChevronRight, MapPin, BookOpen } from 'lucide-react';

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
    a: 'Most small business website rebuilds are completed in 2-4 weeks. Larger or more complex sites may take 4-8 weeks. We move quickly without cutting corners.',
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
    a: "Pricing depends on your site size and goals. We offer a free audit first so you know exactly what's needed before committing. Most projects start at $2,500.",
  },
  {
    q: 'Do you work with small businesses?',
    a: "That's our specialty. We've built our entire platform around the needs of small and mid-sized local businesses who need results without agency overhead.",
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

const RESOURCES = [
  {
    category: 'Website Performance',
    categoryColor: 'text-blue-600',
    title: '5 Signs Your Website Is Losing Customers',
    desc: 'Learn the warning signs your website is losing customers before they bounce to a competitor.',
    href: '/Blog',
  },
  {
    category: 'Technology',
    categoryColor: 'text-violet-600',
    title: 'AI Websites vs Traditional Websites',
    desc: 'Compare AI websites vs traditional websites and understand what performs better for local businesses.',
    href: '/Blog',
  },
  {
    category: 'Compliance',
    categoryColor: 'text-emerald-600',
    title: 'ADA Compliance Guide for Business Websites',
    desc: 'Everything you need to know about ADA compliance for business websites and how to avoid lawsuits.',
    href: '/AdaWebsiteCompliance',
  },
];

export default function WebsiteRebuildService() {
  return (
    <div className="bg-white min-h-screen">
      <title>Website Rebuild Services for Small Business | NTA</title>

      <MarketingNav />

      {/* HERO */}
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

          <div className="mt-12 flex justify-center">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/40 border border-white/10" style={{width: '315px', height: '560px'}}>
              <iframe
                width="315"
                height="560"
                src="https://www.youtube.com/embed/cbgGLgaBurs?rel=0&playsinline=1"
                title="NTA Website Rebuild Service"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                style={{width: '100%', height: '100%', border: 'none', display: 'block'}}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section className="py-14 px-6 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Local Service Areas</h2>
          </div>
          <p className="text-slate-600 mb-8 max-w-2xl">
            We specialize in website rebuilds for small businesses across North Iowa and Southern Minnesota. Click your area to see local-specific information and pricing.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { city: 'Mason City, IA', desc: 'Mason City website rebuild services', href: '/website-rebuilds/mason-city-ia' },
              { city: 'Rochester, MN', desc: 'Rochester MN website redesign', href: '/website-rebuilds/rochester-mn' },
              { city: 'Austin, MN', desc: 'Austin MN website rebuild services', href: '/website-rebuilds/austin-mn' },
              { city: 'Albert Lea, MN', desc: 'Albert Lea website redesign', href: '/website-rebuilds/albert-lea-mn' },
            ].map(({ city, desc, href }) => (
              <Link key={city} to={href} className="group flex items-center justify-between bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded-xl px-5 py-4 transition-all">
                <div>
                  <p className="font-bold text-slate-900 group-hover:text-white text-sm">{city}</p>
                  <p className="text-blue-600 group-hover:text-blue-100 text-xs font-medium mt-0.5">{desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-400 group-hover:text-white flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
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
            If your website is not generating leads, it's <span className="text-red-500">costing you business.</span>
          </p>
        </div>
      </section>

      {/* SOLUTION */}
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

      {/* BEFORE / AFTER */}
      <section className="py-20 px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-14">
            The Difference Is Dramatic
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-red-950/40 border border-red-800/50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <h3 className="text-red-300 font-bold text-lg uppercase tracking-wide">Before</h3>
              </div>
              <ul className="space-y-4">
                {['Slow load times (5-8 seconds)', 'Outdated design from 2015', 'Confusing navigation and layout', 'No clear calls-to-action', 'Buried on page 3+ of Google', 'Zero lead capture system'].map(item => (
                  <li key={item} className="flex items-start gap-3 text-red-200 text-sm">
                    <span className="text-red-400 mt-0.5 flex-shrink-0">x</span>
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

      {/* PROCESS */}
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

      {/* RESULTS */}
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

      {/* FREE AUDIT OFFER */}
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
            <p className="text-slate-400 text-xs mt-4">No credit card required. Results delivered within 24-48 hours.</p>
          </div>
        </div>
      </section>

      {/* HELPFUL RESOURCES */}
      <section className="py-14 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Helpful Resources</h2>
          </div>
          <p className="text-slate-600 mb-8 max-w-2xl">
            Learn what's really happening with your website and what modern alternatives look like.
          </p>
          <div className="grid sm:grid-cols-3 gap-5">
            {RESOURCES.map((r) => (
              <Link key={r.title} to={r.href} className="group block bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md rounded-2xl p-6 transition-all">
                <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${r.categoryColor}`}>{r.category}</p>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 leading-snug mb-2">{r.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{r.desc}</p>
                <span className="inline-flex items-center gap-1 text-blue-600 text-sm font-semibold group-hover:gap-2 transition-all">
                  Read more <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
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
          <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/AdaWebsiteCompliance" className="text-blue-600 hover:underline font-medium">ADA Compliance Services</Link>
            <Link to="/AiSeo" className="text-blue-600 hover:underline font-medium">AI SEO &amp; Marketing</Link>
            <Link to="/Contact" className="text-blue-600 hover:underline font-medium">Contact Us</Link>
            <Link to="/Blog" className="text-blue-600 hover:underline font-medium">Read Our Blog</Link>
          </div>
        </div>
      </section>

      {/* WHAT HAPPENS AFTER */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-violet-50 to-slate-50 border-2 border-violet-200 rounded-3xl p-10">
            <div className="max-w-2xl mx-auto text-center">
              <span className="inline-block bg-violet-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-5">
                After the Launch
              </span>
              <h2 className="text-3xl font-bold text-slate-900 mb-5">
                What Happens After Your Website Is Rebuilt?
              </h2>
              <p className="text-slate-600 leading-relaxed mb-5">
                A high-performance website is your foundation — but a foundation alone doesn't bring customers. Once your new site is live, the next step is driving consistent traffic and visibility so that your investment actually pays off.
              </p>
              <p className="text-slate-600 leading-relaxed mb-5">
                That's where content and social media come in. Businesses that pair a rebuilt website with{' '}
                <Link to="/services/social-media-management" className="text-violet-600 font-semibold hover:underline">
                  ongoing social media management
                </Link>
                {' '}see compounding results — more visibility, more traffic, and more leads month over month.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                Your website and your social presence work together as a unified growth engine. We manage both so you don't have to.
              </p>
              <Link
                to="/services/social-media-management"
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-3 rounded-xl transition shadow-md"
              >
                See Social Media Management <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
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

      {/* FINAL CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
            Stop Losing Customers to a Bad Website
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto">
            Every day with an underperforming site is a day you're handing leads to competitors. Let's change that.
          </p>
          <Link
            to="/rebuild-intake"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-5 rounded-xl text-xl transition shadow-xl shadow-blue-600/30"
          >
            Start your website rebuild <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="text-slate-400 text-sm mt-4">No commitment required. Free audit included.</p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
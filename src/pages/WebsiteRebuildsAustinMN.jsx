import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import { CheckCircle, AlertTriangle, Zap, Smartphone, MousePointer, Search, Shield, ArrowRight, ChevronRight, MapPin, TrendingUp, BarChart2 } from 'lucide-react';

import SEOHead from '@/components/shared/SEOHead';
const INTAKE_URL = '/rebuild-intake?source=website-rebuild-austin-mn';

const PROBLEMS = [
  { icon: AlertTriangle, text: 'Outdated design that reduces visitor trust' },
  { icon: Zap, text: 'Slow load speeds hurting local Google rankings' },
  { icon: Smartphone, text: 'Poor mobile experience losing customers on-the-go' },
  { icon: Search, text: 'Weak SEO structure limiting visibility in Austin searches' },
  { icon: MousePointer, text: 'No clear call-to-action — visitors leave without contacting you' },
  { icon: Shield, text: 'ADA compliance risks and legal exposure' },
];

const SOLUTIONS = [
  { title: 'Built for Local Search Visibility', desc: 'Every page is structured with Austin-focused keywords, proper heading hierarchy, and semantic markup that helps your business show up when local customers search.' },
  { title: 'Optimized for Mobile Users', desc: 'Most local searches happen on phones. We build mobile-first so every Austin visitor gets a fast, smooth experience regardless of device.' },
  { title: 'Designed to Convert Visitors Into Calls', desc: 'Strategic calls-to-action, trust signals, and persuasive messaging placed exactly where Austin customers need them to take action.' },
  { title: 'Structured for Long-Term SEO Growth', desc: 'A content architecture designed to expand with blog posts, new pages, and campaigns that compound your local visibility over time.' },
  { title: 'Supports Future Expansion', desc: 'Built to scale — add new services, locations, and campaigns without rebuilding from scratch.' },
];

const PROCESS_STEPS = [
  { num: '01', title: 'Audit', desc: 'We analyze your current site — speed, local SEO gaps, conversion issues, ADA risks, and competitive positioning in Austin.', color: 'bg-blue-600' },
  { num: '02', title: 'Rebuild', desc: 'Modern structure, locally optimized content, and conversion-focused design built from the ground up for Austin businesses.', color: 'bg-violet-600' },
  { num: '03', title: 'Launch', desc: 'Your new site goes live fully optimized — fast, indexed, and ready to capture leads from Austin and surrounding areas immediately.', color: 'bg-emerald-600' },
  { num: '04', title: 'Grow', desc: 'Ongoing local SEO, content, and campaigns layered on top to compound your results over time.', color: 'bg-orange-500' },
];

const FAQS = [
  { q: 'Do you work with businesses in Austin, MN?', a: 'Yes. We work directly with small and local businesses in Austin and throughout southern Minnesota. We understand the local market and build websites designed to perform in this region.' },
  { q: 'How long does a website rebuild take?', a: 'Most small business website rebuilds are completed in 2–4 weeks. Larger or more complex sites may take 4–8 weeks. We move quickly without cutting corners.' },
  { q: 'Will this help me rank better in local searches?', a: 'Yes. Every rebuild includes foundational local SEO — keyword-targeted pages, proper site structure, and location-relevant content that helps Austin customers find you on Google.' },
  { q: 'What does a rebuild cost?', a: 'Pricing depends on your site size and goals. We start with a free audit so you know exactly what\'s needed before committing. Most projects start at $2,500.' },
  { q: 'Do you handle the SEO too?', a: 'Yes. Our team writes keyword-optimized, conversion-focused content for every page. We also offer ongoing local SEO services to continue improving your rankings after launch.' },
  { q: 'Do you work with small businesses?', a: 'That\'s our specialty. We\'ve built our entire system around the needs of small and local businesses in Austin, Mason City, Rochester, and surrounding communities.' },
];

const AUDIT_ITEMS = [
  'Local SEO review and keyword gaps',
  'Page speed analysis',
  'Conversion issues identified',
  'ADA compliance check',
  'Mobile experience review',
  'Improvement roadmap delivered',
];

const TRUST_ITEMS = [
  { icon: MapPin, text: 'Serving Austin and surrounding southern Minnesota communities' },
  { icon: CheckCircle, text: 'Built exclusively for small and local businesses' },
  { icon: TrendingUp, text: 'Focused on measurable business results' },
  { icon: BarChart2, text: 'Modern systems with practical, local execution' },
];

export default function WebsiteRebuildsAustinMN() {
  const [openFaq, setOpenFaq] = useState(null);


  return (
    <div className="bg-white min-h-screen">
      <SEOHead 
        title="Website Rebuilds Austin MN | New Tech Advertising"
        description="Professional website rebuilds for businesses in Austin, Minnesota. Modern, mobile-responsive, AI-optimized websites."
      />
      <MarketingNav />

      {/* ── 1. HERO ── */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-5">
            <MapPin className="w-4 h-4 text-blue-300" />
            <span className="text-blue-300 text-sm font-semibold uppercase tracking-widest">Austin, Minnesota</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
            Website Rebuild Services in Austin, MN
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            We help businesses in Austin turn outdated websites into lead-generating systems with modern design, stronger SEO structure, and faster performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={INTAKE_URL} className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition shadow-lg shadow-blue-600/30">
              Get a Free Website Audit <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#process" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white/60 text-white font-semibold px-8 py-4 rounded-xl text-lg transition">
              See How It Works <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. LOCAL PROBLEM ── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Most Austin Business Websites Are Losing Customers</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Many small businesses in Austin rely on their website, but most are not built to generate leads consistently. If your site has any of these issues, it may be costing you business every day.
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

      {/* ── 3. LOCAL SOLUTION ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Website Rebuilds Designed for Austin Businesses</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              We don't just redesign — we rebuild for local SEO, speed, and conversions so your site works harder for your business.
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
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-14">The Difference Is Dramatic</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-red-950/40 border border-red-800/50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <h3 className="text-red-300 font-bold text-lg uppercase tracking-wide">Before</h3>
              </div>
              <ul className="space-y-4">
                {['Outdated local business site', 'Slow load times (5–8 seconds)', 'Weak visibility in Austin searches', 'Confusing layout and navigation', 'No lead capture system', 'Buried on page 3+ of Google'].map(item => (
                  <li key={item} className="flex items-start gap-3 text-red-200 text-sm">
                    <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>{item}
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
                {['Modern, professional website', 'Lightning fast (under 2 seconds)', 'Stronger local search presence in Austin', 'Clear messaging and easy navigation', 'Automated lead capture system', 'Ranking for local keywords'].map(item => (
                  <li key={item} className="flex items-start gap-3 text-emerald-200 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />{item}
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
              We work with Austin-area business owners to improve online visibility and turn websites into stronger sales tools.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map(step => (
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
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Focused on Local Business Growth</h2>
          <p className="text-slate-600 text-lg mb-12 max-w-xl mx-auto">
            We're not a generalist agency. We're built specifically for small and local businesses in Austin, southern Minnesota, and surrounding communities.
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
        </div>
      </section>

      {/* ── 7. OFFER ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-slate-50 border-2 border-blue-200 rounded-3xl p-10 text-center shadow-lg">
            <span className="inline-block bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-5">Free — No Obligation</span>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Get a Free Website Audit in Austin</h2>
            <p className="text-slate-600 mb-8 leading-relaxed max-w-xl mx-auto">
              If your Austin business website is outdated, underperforming, or not bringing in leads, we'll show you exactly what to fix and where the biggest opportunities are.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-8 text-left max-w-lg mx-auto">
              {AUDIT_ITEMS.map(item => (
                <div key={item} className="flex items-center gap-2 text-slate-700 text-sm">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />{item}
                </div>
              ))}
            </div>
            <Link to={INTAKE_URL} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-xl text-lg transition shadow-lg shadow-blue-600/30">
              Get My Free Audit <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-slate-400 text-xs mt-4">No credit card required. Response within 24–48 hours.</p>
          </div>
        </div>
      </section>

      {/* ── 8. INTERNAL LINKS ── */}
      <section className="py-12 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-slate-700 font-semibold mb-5 text-sm uppercase tracking-widest">More Website Rebuild Resources</h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/services/website-rebuilds" className="text-blue-600 hover:underline font-medium">→ Website Rebuild Services Overview</Link>
            <Link to="/website-rebuilds/mason-city-ia" className="text-blue-600 hover:underline font-medium">→ Mason City, IA Website Rebuild Services</Link>
            <Link to="/website-rebuilds/rochester-mn" className="text-blue-600 hover:underline font-medium">→ Rochester, MN Website Rebuild Services</Link>
            <Link to="/AdaWebsiteCompliance" className="text-blue-600 hover:underline font-medium">→ ADA Compliance Services</Link>
            <Link to="/Contact" className="text-blue-600 hover:underline font-medium">→ Contact Us</Link>
            <Link to="/Blog" className="text-blue-600 hover:underline font-medium">→ Read Our Blog</Link>
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
              A great website is just the starting point. Local businesses in Austin are using social media to drive consistent traffic, stay top-of-mind with customers, and turn their online presence into a steady stream of new leads.
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

      {/* ── 9. FAQ ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map(({ q, a }, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-7 py-5 text-left hover:bg-slate-50 transition"
                >
                  <span className="font-bold text-slate-900">{q}</span>
                  <ChevronRight className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-7 pb-5 text-slate-600 leading-relaxed text-sm">{a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. FINAL CTA ── */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
            Need More Leads From Your Website in Austin?
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto">
            Every day with an underperforming site is a day you're handing customers to competitors. Let's fix that.
          </p>
          <Link to={INTAKE_URL} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-5 rounded-xl text-xl transition shadow-xl shadow-blue-600/30">
            Start With a Free Audit <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
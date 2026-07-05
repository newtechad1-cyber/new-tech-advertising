import React from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import { CheckCircle, ArrowRight, AlertTriangle, Zap, Globe, Share2, BarChart2, MapPin, Calendar, Smartphone } from 'lucide-react';

import SEOHead from '@/components/shared/SEOHead';
const PROBLEMS = [
  { icon: Calendar, title: 'Inconsistent Posting', desc: 'Most businesses post once in a while, then go dark for weeks. Inconsistency kills momentum and trust with your audience.' },
  { icon: AlertTriangle, title: 'No Real Strategy', desc: 'Sharing random content with no plan behind it generates zero business results — just wasted time and effort.' },
  { icon: BarChart2, title: 'No Measurable Results', desc: 'Likes and followers don\'t pay the bills. Without a results-focused approach, social media is just noise.' },
];

const SOLUTIONS = [
  { icon: Zap, title: 'AI-Powered Content Creation', desc: 'Our AI writes industry-specific captions, posts, and visuals tailored to your business — no more staring at a blank screen.' },
  { icon: Share2, title: 'Multi-Platform Publishing', desc: 'Content goes live across Facebook, Instagram, Google Business, and more — automatically, on a consistent schedule.' },
  { icon: Globe, title: 'Strategy Tied to SEO + Website', desc: 'Every post is built to drive traffic back to your website and reinforce your local search presence — not just get views.' },
  { icon: Smartphone, title: 'Mobile-Optimized Creative', desc: 'Every piece of content is designed for how your customers actually consume media — on their phones, in their feeds.' },
];

const LOCAL_MARKETS = [
  { city: 'Mason City', state: 'IA', href: '/website-rebuilds/mason-city-ia' },
  { city: 'Rochester', state: 'MN', href: '/website-rebuilds/rochester-mn' },
  { city: 'Austin', state: 'MN', href: '/website-rebuilds/austin-mn' },
  { city: 'Albert Lea', state: 'MN', href: '/website-rebuilds/albert-lea-mn' },
];

const WHAT_YOU_GET = [
  'Weekly content calendar built for your business',
  'AI-written posts optimized for each platform',
  'Consistent publishing — no gaps or dark periods',
  'Content designed to drive calls and website traffic',
  'Performance reporting so you see what\'s working',
  'Strategy aligned with your local SEO goals',
];

export default function SocialMediaManagement() {
  return (
    <div className="bg-white min-h-screen">
      <SEOHead 
        title="Social Media Management | AI-Powered Social Media Marketing"
        description="AI-powered social media management for small businesses. Automated posting, content creation, and engagement tracking across all platforms."
      />
      <title>Social Media Management for Small Businesses | NTA</title>

      <MarketingNav />

      {/* HERO */}
      <section className="bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            Social Media Management
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
            Turn Your Social Media Into a Growth Engine for Your Business
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            We manage, create, and publish content that drives real business results — not just likes. Built for local businesses who want more customers, not more followers.
          </p>
          <Link
            to="/book-a-call"
            className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-10 py-4 rounded-xl text-lg transition shadow-lg shadow-violet-600/30"
          >
            Start Your Growth Plan <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Why Most Small Business Social Media Fails
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              It's not that social media doesn't work. It's that most businesses approach it the wrong way.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {PROBLEMS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-red-100 rounded-2xl p-7 shadow-sm">
                <div className="bg-red-50 w-11 h-11 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              The NTA Social Media System
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              A complete, done-for-you social media engine built around your business goals — not vanity metrics.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {SOLUTIONS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-5 border border-slate-200 rounded-2xl p-7 hover:shadow-md transition">
                <div className="bg-violet-50 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="py-20 px-6 bg-violet-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-10">What's Included</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {WHAT_YOU_GET.map(item => (
              <div key={item} className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-5 py-4">
                <CheckCircle className="w-5 h-5 text-violet-200 flex-shrink-0" />
                <span className="text-white font-medium text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTEGRATION WITH WEBSITE REBUILDS */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-violet-50 border-2 border-blue-200 rounded-3xl p-10">
            <div className="max-w-2xl mx-auto text-center">
              <span className="inline-block bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-5">
                Better Together
              </span>
              <h2 className="text-3xl font-bold text-slate-900 mb-5">
                Social Media Works Best When Your Website Is Built for Conversions
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Social content drives traffic — but if your website is slow, outdated, or doesn't have a clear call-to-action, that traffic goes nowhere. That's why our most successful clients pair social media management with our{' '}
                <Link to="/services/website-rebuilds" className="text-blue-600 font-semibold hover:underline">
                  AI-powered website rebuild services
                </Link>
                {' '}— turning clicks into calls and leads.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                Your social posts, your website content, and your local SEO all work from the same strategy — compounding your visibility over time instead of working in isolation.
              </p>
              <Link
                to="/services/website-rebuilds"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition shadow-md"
              >
                See Website Rebuild Services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* LOCAL SECTION */}
      <section className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <MapPin className="w-10 h-10 text-violet-300 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Serving Local Businesses Across North Iowa and Southern Minnesota
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            We work directly with small businesses in Mason City, Rochester, Austin, Albert Lea, and surrounding communities. Local market knowledge built into every content strategy.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {LOCAL_MARKETS.map(({ city, state, href }) => (
              <Link
                key={city}
                to={href}
                className="flex items-center gap-2 bg-violet-600/20 border border-violet-500/40 hover:border-violet-400 text-violet-200 hover:text-white font-semibold px-5 py-2.5 rounded-full text-sm transition"
              >
                <MapPin className="w-3.5 h-3.5" /> {city}, {state}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
            Get Your Social Media Growth Plan
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto">
            Let's build a consistent, strategic social presence that actually drives customers to your business.
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
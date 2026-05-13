import React, { useEffect } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Search, LayoutTemplate, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';

export default function AccessibleWebsites() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans">
      <MarketingNav />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold px-4 py-2 rounded-full mb-8">
              <ShieldCheck className="w-4 h-4" /> Modern, Accessible & AI-Ready
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight max-w-4xl mx-auto">
              Web Accessibility & ADA Compliant Rebuilds
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              We rebuild your website to meet modern accessibility standards, protecting your business while maximizing digital trust, usability, and AI search visibility.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/gap-audit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all w-full sm:w-auto shadow-lg shadow-blue-600/20">
                Get a Free Accessibility Audit
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-24 bg-slate-900 border-y border-slate-800">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">More Than Just Legal Compliance</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Accessibility is the foundation of a modern web presence. An accessible website performs better across the board.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
                <ShieldCheck className="w-10 h-10 text-emerald-500 mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">Customer Trust</h3>
                <p className="text-slate-400 leading-relaxed">
                  A site that works for everyone builds immediate credibility. Ensure every customer, regardless of ability, has a flawless experience.
                </p>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
                <Search className="w-10 h-10 text-blue-500 mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">AI & SEO Visibility</h3>
                <p className="text-slate-400 leading-relaxed">
                  The same structured data and clear navigation required for accessibility are exactly what AI models and search engines need to read your site.
                </p>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl">
                <LayoutTemplate className="w-10 h-10 text-violet-500 mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">Modern Usability</h3>
                <p className="text-slate-400 leading-relaxed">
                  Accessibility means better mobile performance, clear color contrast, and fast load times. It's an overall upgrade to your digital storefront.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">What's Included in a Rebuild</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                'Full ADA WCAG 2.1 AA Compliance',
                'Mobile-Responsive Modern Design',
                'Screen Reader Optimization & ARIA Tags',
                'Keyboard Navigation Support',
                'Accessible Forms with Clear Labels',
                'Optimized Color Contrast Ratios',
                'Proper Alt Text for All Media',
                'Semantic HTML for AI Readability',
                'Fast Page Load Speeds',
                'Google & AI Search Friendly Structure'
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                  <span className="text-slate-300 font-medium mt-0.5">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-gradient-to-br from-blue-900/40 to-slate-900 border-t border-slate-800">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Start with a Free Gap Audit</h2>
            <p className="text-xl text-slate-300 mb-10">
              Find out if your website is meeting modern accessibility standards and where you're losing visibility.
            </p>
            <Link to="/gap-audit" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20">
              Request Your Audit <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
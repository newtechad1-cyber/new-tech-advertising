import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle, ArrowRight, Phone, Monitor, Smartphone, Search, Shield, TrendingUp, MousePointer } from 'lucide-react';

const ISSUES = [
  {
    icon: Monitor,
    title: 'Weak First Impression',
    description: 'Visitors form an opinion about your website in under 3 seconds. An outdated design signals an outdated business — before a customer reads a single word.',
    severity: 'high',
  },
  {
    icon: MousePointer,
    title: 'No Strong Call to Action',
    description: 'The site doesn\'t clearly tell visitors what to do next. Without a clear CTA, most visitors leave without making contact.',
    severity: 'high',
  },
  {
    icon: TrendingUp,
    title: 'Dated Visual Design',
    description: 'Design trends and user expectations have changed significantly. An outdated appearance reduces trust and makes competitors look more credible.',
    severity: 'medium',
  },
  {
    icon: Smartphone,
    title: 'Limited Mobile Optimization',
    description: 'Over 60% of local searches happen on mobile. If your site is hard to use on a phone, you\'re losing more than half of your potential customers.',
    severity: 'high',
  },
  {
    icon: Search,
    title: 'Weak SEO Structure',
    description: 'Without proper local SEO — page titles, meta descriptions, schema markup, and keyword targeting — your site struggles to appear when customers search for furniture near them.',
    severity: 'high',
  },
  {
    icon: Shield,
    title: 'Accessibility / ADA Concerns',
    description: 'Websites must meet ADA accessibility standards. Non-compliant sites risk legal exposure and exclude a significant portion of potential customers.',
    severity: 'medium',
  },
  {
    icon: ArrowRight,
    title: 'No Clear Conversion Funnel',
    description: 'There\'s no guided path from landing to contact. Visitors browse without being led toward scheduling, calling, or requesting information.',
    severity: 'high',
  },
];

const SEVERITY_STYLES = {
  high: { badge: 'bg-red-100 text-red-700 border-red-200', border: 'border-red-200', dot: 'bg-red-500' },
  medium: { badge: 'bg-amber-100 text-amber-700 border-amber-200', border: 'border-amber-200', dot: 'bg-amber-500' },
};

const WHAT_IT_SHOULD_DO = [
  'Communicate your value and credibility within the first 3 seconds',
  'Guide visitors clearly toward calling, visiting, or requesting a quote',
  'Load fast and work beautifully on every mobile device',
  'Rank locally so customers can find you on Google',
  'Capture leads even when customers aren\'t ready to buy today',
  'Support your marketing efforts with consistent branding and messaging',
];

export default function AuditFurnitureMattressOutlet() {
  useEffect(() => {
    document.title = 'Website Audit — Furniture & Mattress Outlet';
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* NAV BAR */}
      <nav className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-800 text-sm">New Tech Advertising</span>
        </div>
        <div className="flex gap-3">
          <a href="#" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 px-4 py-2 rounded-lg transition-colors">
            View Demo Preview
          </a>
          <a href="/book-a-call" className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            <Phone className="w-3.5 h-3.5" /> Book a Call
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-white/10 border border-white/20 text-white/80 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Confidential Website Audit Report
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-5 leading-tight">
            Website Audit for<br />
            <span className="text-amber-400">Furniture & Mattress Outlet</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            We reviewed your current website and found several issues that may be hurting user experience, search visibility, and conversions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-8 py-3.5 rounded-xl transition-colors text-sm"
            >
              <Monitor className="w-4 h-4" /> View Demo Preview
            </a>
            <a
              href="/book-a-call"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-3.5 rounded-xl transition-colors text-sm"
            >
              <Phone className="w-4 h-4" /> Book a Call
            </a>
          </div>
        </div>
      </section>

      {/* EXECUTIVE SUMMARY */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-slate-900 rounded-full" />
            <h2 className="text-2xl font-black text-slate-900">Executive Summary</h2>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
            <p className="text-slate-700 text-lg leading-relaxed">
              Your business appears established, but the current website feels more like an <strong>online brochure</strong> than a sales and lead-generation tool. The site likely creates friction for visitors, especially on mobile, and does not clearly guide users toward taking action.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: 'Issues Found', value: '7', color: 'text-red-600' },
              { label: 'High Priority', value: '5', color: 'text-amber-600' },
              { label: 'Impact Level', value: 'High', color: 'text-slate-800' },
            ].map(stat => (
              <div key={stat.label} className="text-center bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-slate-500 text-xs mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEY ISSUES */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-red-500 rounded-full" />
            <h2 className="text-2xl font-black text-slate-900">Key Issues Found</h2>
          </div>
          <p className="text-slate-500 text-sm mb-8 ml-5">These are the specific areas we identified during our review.</p>

          <div className="space-y-4">
            {ISSUES.map((issue, i) => {
              const Icon = issue.icon;
              const styles = SEVERITY_STYLES[issue.severity];
              return (
                <div key={i} className={`bg-white border rounded-2xl p-6 shadow-sm ${styles.border}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${issue.severity === 'high' ? 'bg-red-50' : 'bg-amber-50'}`}>
                      <Icon className={`w-5 h-5 ${issue.severity === 'high' ? 'text-red-500' : 'text-amber-500'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-base">{issue.title}</h3>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${styles.badge}`}>
                          {issue.severity === 'high' ? 'High Priority' : 'Medium Priority'}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">{issue.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY THIS MATTERS */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-amber-400 rounded-full" />
            <h2 className="text-2xl font-black text-slate-900">Why This Matters</h2>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
            <p className="text-slate-700 text-lg leading-relaxed">
              These issues can lead to <strong>lower trust</strong>, <strong>lower engagement</strong>, <strong>weaker local visibility</strong>, and missed opportunities from potential customers who visit your site and leave without taking action.
            </p>
            <p className="text-slate-600 text-base leading-relaxed mt-4">
              In a competitive local market, your website is often the first — and sometimes only — impression a customer gets before deciding whether to visit your store or call your competitor.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT A MODERN SITE SHOULD DO */}
      <section className="py-16 px-6 bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-amber-400 rounded-full" />
            <h2 className="text-2xl font-black text-white">What a Modern Site Should Do</h2>
          </div>
          <p className="text-slate-400 text-sm mb-8 ml-5">A well-built website is your best salesperson — working 24/7.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WHAT_IT_SHOULD_DO.map((point, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-5">
                <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-slate-200 text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAMPLE REBUILD */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            We took action
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">
            We Built a Sample Homepage Preview
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Instead of only pointing out issues, we created a sample homepage concept to show what a modern, conversion-focused version of your site could look like — built specifically for Furniture & Mattress Outlet.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-bold px-10 py-4 rounded-xl transition-colors text-sm shadow-lg"
          >
            <Monitor className="w-4 h-4" /> View the Sample Rebuild
            <ArrowRight className="w-4 h-4" />
          </a>

          {/* Preview placeholder */}
          <div className="mt-10 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-16 flex flex-col items-center gap-3">
            <Monitor className="w-10 h-10 text-slate-300" />
            <p className="text-slate-400 text-sm font-medium">Sample rebuild preview will appear here</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-2xl mx-auto text-center">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-5" />
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
            Want to See How This Could Work<br className="hidden sm:block" /> for Your Business?
          </h2>
          <p className="text-slate-400 text-base mb-10 max-w-xl mx-auto">
            We'd love to walk you through the full rebuild plan, answer your questions, and show you what results other local businesses have seen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/book-a-call"
              className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-8 py-4 rounded-xl transition-colors text-sm shadow-lg"
            >
              <Phone className="w-4 h-4" /> Book a Call
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-4 rounded-xl transition-colors text-sm"
            >
              <Monitor className="w-4 h-4" /> View Demo Preview
            </a>
          </div>
          <p className="text-slate-500 text-xs mt-8">
            New Tech Advertising · 641-420-8816 · rick@newtechadvertising.com
          </p>
        </div>
      </section>
    </div>
  );
}
import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle, ArrowRight, Phone, Monitor, Smartphone, Search, Shield, TrendingUp, MousePointer, Eye } from 'lucide-react';

const DEMO_LINK = '/demo/furniture-mattress-outlet';
const BOOKING_LINK = '/book-a-call';

const ISSUES = [
  {
    icon: Eye,
    title: 'Weak First Impression',
    description: 'The homepage does not immediately communicate a strong value proposition or modern brand presence.',
    severity: 'high',
  },
  {
    icon: MousePointer,
    title: 'No Strong Primary Call to Action',
    description: 'Visitors are not clearly guided toward the next step — whether that is calling, visiting, or browsing products.',
    severity: 'high',
  },
  {
    icon: Monitor,
    title: 'Dated Visual Presentation',
    description: 'The design feels older and may reduce perceived trust with first-time visitors comparing options.',
    severity: 'medium',
  },
  {
    icon: Smartphone,
    title: 'Limited Mobile Optimization',
    description: 'Mobile visitors may experience friction with layout, readability, or usability — and over 60% of local searches happen on mobile.',
    severity: 'high',
  },
  {
    icon: Search,
    title: 'Weak SEO Structure',
    description: 'Page structure and content do not strongly support local search visibility, making it harder for customers to find you on Google.',
    severity: 'high',
  },
  {
    icon: Shield,
    title: 'Accessibility / ADA Concerns',
    description: 'The site may not fully support modern accessibility best practices, which can create legal exposure and exclude potential customers.',
    severity: 'medium',
  },
  {
    icon: TrendingUp,
    title: 'No Clear Conversion Funnel',
    description: 'The website does not consistently move visitors toward contact, a store visit, or a purchase action.',
    severity: 'high',
  },
];

const SEVERITY_STYLES = {
  high: { badge: 'bg-red-50 text-red-600 border-red-200', border: 'border-l-red-400', icon: 'bg-red-50 text-red-500' },
  medium: { badge: 'bg-amber-50 text-amber-600 border-amber-200', border: 'border-l-amber-400', icon: 'bg-amber-50 text-amber-500' },
};

const CHECKLIST = [
  'Communicate value immediately on the homepage',
  'Guide visitors clearly toward the next action',
  'Be fully mobile-first in layout and design',
  'Rank locally so customers can find you on Google',
  'Capture leads effectively even before a purchase decision',
  'Support ongoing marketing and long-term growth',
];

export default function AuditFurnitureMattressOutlet() {
  useEffect(() => {
    document.title = 'Website Audit — Furniture & Mattress Outlet';
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* NAV */}
      <nav className="bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-800 text-sm hidden sm:block">New Tech Advertising</span>
        </div>
        <div className="flex gap-2">
          <a href={DEMO_LINK} className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-400 px-4 py-2 rounded-lg transition-colors">
            <Monitor className="w-3.5 h-3.5" /> View Demo
          </a>
          <a href={BOOKING_LINK} className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            <Phone className="w-3.5 h-3.5" /> Book a Call
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-white/10 border border-white/20 text-white/70 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Confidential Website Audit Report
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-5 leading-tight">
            Website Audit for<br />
            <span className="text-amber-400">Furniture & Mattress Outlet</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            We reviewed your current website and identified several issues that may be affecting first impressions, mobile experience, search visibility, and conversions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={DEMO_LINK} className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg text-sm">
              <Monitor className="w-4 h-4" /> View Demo Preview
            </a>
            <a href={BOOKING_LINK} className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold px-8 py-3.5 rounded-xl transition-all text-sm">
              <Phone className="w-4 h-4" /> Book a Call
            </a>
          </div>
        </div>
      </section>

      {/* EXECUTIVE SUMMARY */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-slate-900 rounded-full flex-shrink-0" />
            <h2 className="text-2xl font-black text-slate-900">Executive Summary</h2>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 mb-6">
            <p className="text-slate-700 text-lg leading-relaxed">
              Your business appears established, but the current website functions more like an <strong>online brochure</strong> than a modern sales tool. The site likely creates friction for visitors, especially on mobile devices, and does not clearly guide users toward taking action. That can lead to missed opportunities, weaker local visibility, and lower conversions.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Issues Found', value: '7', color: 'text-red-600' },
              { label: 'High Priority', value: '5', color: 'text-amber-600' },
              { label: 'Impact Level', value: 'High', color: 'text-slate-900' },
            ].map(stat => (
              <div key={stat.label} className="text-center bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-slate-500 text-xs mt-1 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEY ISSUES */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-red-500 rounded-full flex-shrink-0" />
            <h2 className="text-2xl font-black text-slate-900">Key Issues Found</h2>
          </div>
          <p className="text-slate-500 text-sm mb-8 pl-4">These are the specific areas we identified during our review.</p>
          <div className="space-y-4">
            {ISSUES.map((issue, i) => {
              const Icon = issue.icon;
              const s = SEVERITY_STYLES[issue.severity];
              return (
                <div key={i} className={`bg-white border border-slate-200 border-l-4 ${s.border} rounded-2xl p-6 shadow-sm`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.icon}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap mb-1.5">
                        <h3 className="font-bold text-slate-900">{issue.title}</h3>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${s.badge}`}>
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
            <div className="w-1 h-8 bg-amber-400 rounded-full flex-shrink-0" />
            <h2 className="text-2xl font-black text-slate-900">Why This Matters</h2>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 space-y-4">
            <p className="text-slate-700 text-lg leading-relaxed">
              These types of issues can <strong>reduce trust</strong>, <strong>lower engagement</strong>, <strong>weaken search visibility</strong>, and cause potential customers to leave before taking action.
            </p>
            <p className="text-slate-600 leading-relaxed">
              A better structured website can improve user experience, strengthen local visibility, and turn more traffic into real business — without needing to spend more on advertising.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT A MODERN SITE SHOULD DO */}
      <section className="py-16 px-6 bg-slate-900">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-amber-400 rounded-full flex-shrink-0" />
            <h2 className="text-2xl font-black text-white">What a Modern Site Should Do</h2>
          </div>
          <p className="text-slate-400 text-sm mb-8 pl-4">A well-built website is your best salesperson — working 24/7.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CHECKLIST.map((point, i) => (
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
          <span className="inline-block bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            We took action
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">
            We Built a Sample Homepage Preview
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Instead of only pointing out issues, we created a sample homepage concept to show what a more modern, conversion-focused version of your site could look like.
          </p>
          <a href={DEMO_LINK} className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-bold px-10 py-4 rounded-xl transition-all text-sm shadow-lg">
            <Monitor className="w-4 h-4" /> View the Sample Rebuild <ArrowRight className="w-4 h-4" />
          </a>
          <div className="mt-10 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-16 flex flex-col items-center gap-3">
            <Monitor className="w-10 h-10 text-slate-300" />
            <p className="text-slate-400 text-sm font-medium">Demo preview — click the button above to view</p>
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
          <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-xl mx-auto">
            If you'd like, we can walk you through the sample rebuild and show exactly how a more modern site structure could help improve visibility, trust, and conversions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={DEMO_LINK} className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-8 py-4 rounded-xl transition-all text-sm shadow-lg">
              <Monitor className="w-4 h-4" /> View Demo Preview
            </a>
            <a href={BOOKING_LINK} className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold px-8 py-4 rounded-xl transition-all text-sm">
              <Phone className="w-4 h-4" /> Book a Call
            </a>
          </div>
          <p className="text-slate-500 text-xs mt-10">
            New Tech Advertising · 641-420-8816 · rick@newtechadvertising.com
          </p>
        </div>
      </section>
    </div>
  );
}
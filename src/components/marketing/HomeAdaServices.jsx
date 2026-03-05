import React from 'react';
import { ShieldCheck, CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { createPageUrl } from '@/utils';

const FEATURES = [
  'Full WCAG 2.1 AA compliance',
  'Mobile responsive redesign',
  'Screen reader optimization',
  'Keyboard navigation support',
  'Alt text for all images',
  'Color contrast corrections',
  'ADA compliance certificate',
  'Ongoing monitoring & updates',
];

export default function HomeAdaServices() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <AlertTriangle className="w-4 h-4" /> Additional Service
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
              Is your website ADA compliant?<br className="hidden md:block" />
              <span className="text-red-600"> If not, you could be sued.</span>
            </h2>
            <p className="text-slate-600 text-lg mb-6 leading-relaxed">
              Over 4,000 ADA website lawsuits are filed every year. Most target small business websites that were never designed with accessibility in mind.
            </p>
            <p className="text-slate-600 mb-8 leading-relaxed">
              NTA offers full ADA-compliant website rebuilds that protect your business from legal liability and make your site accessible to every customer.
            </p>

            <ul className="grid grid-cols-2 gap-2 mb-8">
              {FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2 text-slate-700 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>

            <a
              href={createPageUrl('AdaWebsiteRebuild')}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all"
            >
              Learn About ADA Rebuilds <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right: Pricing card */}
          <div>
            <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-lg">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg">ADA Website Rebuild</h3>
                    <p className="text-slate-300 text-sm">One-time project, milestone billing</p>
                  </div>
                </div>
                <div className="flex items-end gap-2 mt-4">
                  <span className="text-4xl font-extrabold">$1,500</span>
                  <span className="text-slate-300 mb-1">– $3,000</span>
                </div>
                <p className="text-slate-400 text-xs mt-1">Based on site size and complexity</p>
              </div>

              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-4 bg-slate-50 rounded-xl p-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shrink-0 mt-0.5">1</div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">50% Deposit</p>
                      <p className="text-slate-500 text-sm">Paid upfront to begin the project. Covers audit, design, and build phase.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-slate-50 rounded-xl p-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center text-sm shrink-0 mt-0.5">2</div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">50% on Completion</p>
                      <p className="text-slate-500 text-sm">Final payment due when your new site is ready to launch. You only pay when it's done right.</p>
                    </div>
                  </div>
                </div>

                <a
                  href={createPageUrl('AdaWebsiteRebuild')}
                  className="block w-full text-center bg-slate-900 hover:bg-slate-700 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all"
                >
                  Get a Free Website Review
                </a>
                <p className="text-center text-slate-400 text-xs mt-2">Free audit — no obligation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
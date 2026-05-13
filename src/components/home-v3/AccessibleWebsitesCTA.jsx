import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function AccessibleWebsitesCTA() {
  return (
    <section className="py-20 bg-slate-900 border-y border-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 text-emerald-400 font-bold text-sm tracking-wide uppercase mb-4">
              <ShieldCheck className="w-5 h-5" />
              Modern Website Standards
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
              Web Accessibility & ADA Compliance
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              A modern website isn't just about looking good—it's about working perfectly for everyone. We rebuild websites to meet strict accessibility standards, protecting your business while maximizing digital trust, usability, and AI search visibility.
            </p>
            <Link to="/accessible-websites" className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold px-6 py-3 rounded-xl transition-colors group">
              Learn About Accessible Rebuilds <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full" />
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
              <ul className="space-y-6">
                <li className="flex items-center gap-4 text-slate-300 font-medium">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">✓</div>
                  Built for Customer Trust
                </li>
                <li className="flex items-center gap-4 text-slate-300 font-medium">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">✓</div>
                  Optimized for AI Readability
                </li>
                <li className="flex items-center gap-4 text-slate-300 font-medium">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 shrink-0">✓</div>
                  Superior Mobile Experience
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
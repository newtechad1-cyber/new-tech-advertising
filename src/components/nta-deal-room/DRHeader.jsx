import React from 'react';
import { Sparkles, MapPin, Tag } from 'lucide-react';

export default function DRHeader({ company, industry, city, strategyTitle }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950 border-b border-slate-800">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-10 text-center">
        {/* NTA badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/15 border border-blue-500/30 rounded-full mb-6">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-blue-400 text-xs font-bold tracking-wide uppercase">NTA · Your Growth Strategy</span>
        </div>

        {/* Company name */}
        <h1 className="text-white text-4xl font-black tracking-tight mb-2">
          {company || 'Your Business'}
        </h1>

        <p className="text-blue-300 text-xl font-semibold mb-3">{strategyTitle || 'Market Authority Growth Plan'}</p>

        {/* Meta tags */}
        <div className="flex items-center justify-center gap-4 text-slate-400 text-sm mb-6">
          {city && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{city}</span>}
          {industry && <span className="flex items-center gap-1.5 capitalize"><Tag className="w-3.5 h-3.5" />{industry.replace('_', ' ')}</span>}
        </div>

        {/* Intro message */}
        <div className="max-w-2xl mx-auto bg-slate-800/40 border border-slate-700/50 rounded-2xl px-6 py-4 text-left">
          <p className="text-slate-300 text-sm leading-relaxed">
            👋 <strong className="text-white">Hi {company ? `${company.split(' ')[0]} Team` : 'there'},</strong> this private strategy room was built specifically for your business. Inside you'll find your personalized growth plan, ROI projections, proof from businesses just like yours, and everything you need to make a confident decision. Take your time — we're here when you're ready.
          </p>
        </div>
      </div>
    </div>
  );
}
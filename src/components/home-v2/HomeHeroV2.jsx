import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';

export default function HomeHeroV2() {
  return (
    <section className="bg-slate-950 text-white pt-24 pb-20 px-4 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #10b981 0%, transparent 40%)`
      }} />

      <div className="max-w-5xl mx-auto relative">
        <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-700/40 rounded-full px-4 py-1.5 text-xs font-semibold text-blue-300 mb-6">
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
          Serving North Iowa & Southern Minnesota
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 max-w-4xl">
          Local Lead Systems for{' '}
          <span className="text-blue-400">North Iowa</span> Businesses
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mb-8 leading-relaxed">
          We build the website, SEO pages, ads, content, video, and follow-up system your business needs to turn local searches into real leads.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/gap-audit"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-4 rounded-xl text-base transition-colors"
          >
            Get a Free Gap Audit <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-7 py-4 rounded-xl text-base transition-colors"
          >
            See How It Works <ChevronDown className="w-4 h-4" />
          </a>
        </div>

        {/* Trust bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-6 text-sm text-slate-400">
          {['HVAC & Plumbing', 'Excavating & Septic', 'Lawn & Landscaping', 'Retail & Service', 'Any Local Business'].map(item => (
            <span key={item} className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span> {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
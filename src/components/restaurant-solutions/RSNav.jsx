import React from 'react';
import { Link } from 'react-router-dom';

export default function RSNav() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="bg-[#0B1120] border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></div>
          <span className="text-white font-bold text-lg tracking-tight">New Tech Advertising</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
            ← Back to Main Site
          </Link>
          <button onClick={() => scrollTo('features')} className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
            Features
          </button>
          <button onClick={() => scrollTo('cta')} className="bg-[#F59E0B] hover:bg-amber-400 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm transition-colors shadow-sm">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
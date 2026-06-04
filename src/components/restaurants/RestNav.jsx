import React from 'react';
import { Link } from 'react-router-dom';

export default function RestNav() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0B1120]/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-white font-bold text-lg tracking-tight">New Tech Advertising</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
            ← Back to Main Site
          </Link>
          <button onClick={() => scrollTo('features')} className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
            Features
          </button>
          <button onClick={() => scrollTo('how-it-works')} className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
            How It Works
          </button>
          <button onClick={() => scrollTo('cta')} className="bg-amber-500 hover:bg-amber-400 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
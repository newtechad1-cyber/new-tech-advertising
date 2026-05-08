import React from 'react';
import { Link } from 'react-router-dom';

export default function InternetChangedSection() {
  return (
    <section className="py-20 px-6 bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-4">The Big Picture</p>
        <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-6">
          The Internet Changed.<br />
          <span className="text-slate-400">Most Local Marketing Didn't.</span>
        </h2>
        <p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed mb-10">
          New Tech Advertising helps local businesses get found, build trust, use AI practically, create better content, improve follow-up, and connect websites, search, streaming TV, and automation into one growth system.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/gap-audit" className="bg-blue-600 hover:bg-blue-500 text-white font-black px-7 py-4 rounded-xl transition-colors text-sm">
            Get My AI Gap Audit
          </Link>
          <Link to="/what-changed-online" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-7 py-4 rounded-xl transition-colors text-sm">
            Learn What Changed Online
          </Link>
          <Link to="/learning-center" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-7 py-4 rounded-xl transition-colors text-sm">
            See How The System Works
          </Link>
        </div>
      </div>
    </section>
  );
}
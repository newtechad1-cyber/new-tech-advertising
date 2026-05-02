import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// VIDEO PLACEHOLDER — swap src for real embed when ready
function VideoPlaceholder({ label }) {
  return (
    <div className="w-full rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden aspect-video flex flex-col items-center justify-center gap-3">
      <div className="w-14 h-14 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center">
        <svg className="w-6 h-6 text-slate-400 ml-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <p className="text-slate-500 text-sm font-medium text-center px-4">{label}</p>
    </div>
  );
}

export default function HomeHeroV2() {
  return (
    <section className="bg-slate-950 text-white pt-20 pb-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Hero text */}
        <div className="max-w-3xl mb-10">
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-5 text-white">
            Local Lead Systems for North Iowa Businesses
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed mb-4 max-w-2xl">
            We help local businesses get found and turn interest into real calls, customers, and jobs.
          </p>
          <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-2xl">
            No inflated claims. No complicated systems.<br />
            Just practical work that helps your business show up and get contacted.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/gap-audit"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-4 rounded-xl text-base transition-colors"
            >
              Get a Free Gap Audit <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/our-work"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-7 py-4 rounded-xl text-base transition-colors"
            >
              See Our Work
            </Link>
          </div>
        </div>

        {/* Hero video */}
        <VideoPlaceholder label={`VIDEO — "Here's what I do and how I help local businesses get more calls and customers."`} />

      </div>
    </section>
  );
}
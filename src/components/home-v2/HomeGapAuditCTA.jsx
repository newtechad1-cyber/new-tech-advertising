import React from 'react';
import { Link } from 'react-router-dom';

// VIDEO PLACEHOLDER
function VideoPlaceholder({ label }) {
  return (
    <div className="w-full rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden aspect-video flex flex-col items-center justify-center gap-3">
      <div className="w-14 h-14 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center">
        <svg className="w-6 h-6 text-slate-400 ml-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <p className="text-slate-500 text-sm font-medium text-center px-6">{label}</p>
    </div>
  );
}

export default function HomeGapAuditCTA() {
  return (
    <>
      {/* Not Sure What's Missing */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-5">Not Sure What's Missing?</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Most business owners don't know what their website or marketing is actually doing—or not doing.
            </p>
            <p className="text-slate-600 text-base leading-relaxed mb-4">
              We break it down simply:
            </p>
            <ul className="space-y-2 mb-6">
              {["What's working", "What's not", "What to fix first"].map(item => (
                <li key={item} className="flex items-start gap-2 text-slate-700 text-base">
                  <span className="text-blue-500 font-bold mt-0.5">·</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-slate-500 text-base">No pressure. No complicated reports.</p>
          </div>

          {/* Gap audit pitch video */}
          <VideoPlaceholder label={`VIDEO — "I'll walk through your site and show you exactly what's missing and what you can improve."`} />
        </div>
      </section>

      {/* Get a Free Gap Audit */}
      <section className="bg-slate-950 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-5">Get a Free Gap Audit</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              Send your website and I'll take a look.
            </p>
            <p className="text-slate-400 text-base mb-4">You'll get:</p>
            <ul className="space-y-2 mb-8">
              {[
                'A simple breakdown of issues',
                'Clear improvement ideas',
                'Practical next steps',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-slate-300 text-base">
                  <span className="text-emerald-400 font-bold mt-0.5">·</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/gap-audit"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors"
            >
              Get My Free Gap Audit →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
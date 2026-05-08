import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

const PROBLEMS = [
  "Outdated websites that don't explain what the business does",
  "Basic WordPress or old HTML-style pages with no mobile optimization",
  "Weak or nonexistent local SEO",
  "No presence in AI search (ChatGPT, Perplexity, voice assistants)",
  "Disconnected marketing — ads, website, and social not working together",
  "Paid good money for a site that doesn't convert visitors into calls",
];

const SHIFTS = [
  "AI search is changing how people find local businesses",
  "Customers research on mobile, voice, and AI before ever calling",
  "Reviews, trust signals, and content now influence decisions",
  "One-time ads don't build the repeated impressions needed to win",
  "Follow-up systems are now expected — not optional",
];

export default function WhatWeFoundSection() {
  return (
    <section className="py-20 px-6 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-600 mb-3">What We Found</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
            After Researching Local Business Websites
          </h2>
          <p className="text-slate-500 max-w-3xl mx-auto text-lg leading-relaxed">
            This is not about criticizing business owners. Most were never taught what to look for. The internet changed, AI search is growing, customer behavior changed, and many local businesses were left with tools that no longer match the way people find and choose businesses.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mb-12">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <h3 className="text-xl font-black text-slate-900">What We're Still Seeing</h3>
            </div>
            <ul className="space-y-4">
              {PROBLEMS.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700 text-sm leading-relaxed">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0" />
              <h3 className="text-xl font-black text-slate-900">What Changed Online</h3>
            </div>
            <ul className="space-y-4">
              {SHIFTS.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700 text-sm leading-relaxed">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center bg-slate-900 rounded-2xl p-8">
          <p className="text-white text-lg font-bold mb-2">NTA exists to help fix that.</p>
          <p className="text-slate-400 text-sm mb-6">We work with local businesses to modernize their online presence, connect their marketing systems, and build a foundation that actually works today.</p>
          <Link to="/what-changed-online" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-black px-7 py-3.5 rounded-xl transition-colors text-sm">
            See What Changed Online →
          </Link>
        </div>
      </div>
    </section>
  );
}
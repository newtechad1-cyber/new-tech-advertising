import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Search, Tv, Star, RefreshCw, AlertTriangle } from 'lucide-react';

const SECTIONS = [
  {
    icon: <AlertTriangle className="w-7 h-7 text-orange-500" />,
    tag: 'The Problem',
    tagColor: 'text-orange-600',
    title: 'Old Websites Are No Longer Enough',
    body: [
      'A website built five or six years ago was designed for a different internet. Back then, most people found local businesses by typing into Google and clicking through several results.',
      'That process is changing. Customers today research on their phones, ask voice assistants, scroll social media, and increasingly get answers directly from AI tools without visiting a website at all.',
      'If your website is slow, unclear about what you do, not mobile-optimized, or not trusted by Google — you are invisible to a growing number of your potential customers.',
    ],
    bg: 'bg-orange-50 border-orange-100',
  },
  {
    icon: <Search className="w-7 h-7 text-blue-500" />,
    tag: 'AI Search',
    tagColor: 'text-blue-600',
    title: 'How AI Search Is Changing Discovery',
    body: [
      'Tools like ChatGPT, Perplexity, Google\'s AI Overviews, and Siri are now answering questions that used to require clicking through search results. When someone asks "who is the best roofer near me" or "what should I look for in a local accountant," AI gives a direct answer.',
      'The businesses that appear in those answers are the ones that have published helpful content, earned solid reviews, built trustworthy websites, and shown up consistently online.',
      'This is not about gaming a system. It is about being genuinely present and credible across the internet so AI tools can confidently recommend you.',
    ],
    bg: 'bg-blue-50 border-blue-100',
  },
  {
    icon: <RefreshCw className="w-7 h-7 text-purple-500" />,
    tag: 'Repeated Impressions',
    tagColor: 'text-purple-600',
    title: 'Why Repeated Impressions Still Matter',
    body: [
      'Most customers do not buy the first time they see a business. Research consistently shows people need multiple exposures to a brand before they feel comfortable enough to reach out.',
      'This is why a single Facebook ad or a single mailer rarely produces strong results on its own. Customers need to see you in search, on social, maybe in a streaming TV ad, in a review, and through helpful content before they feel they know and trust you.',
      'The businesses winning locally are the ones showing up in multiple places consistently — not running one campaign and waiting.',
    ],
    bg: 'bg-purple-50 border-purple-100',
  },
  {
    icon: <Tv className="w-7 h-7 text-green-500" />,
    tag: 'Streaming TV',
    tagColor: 'text-green-600',
    title: 'How CTV Fits Into Modern Marketing',
    body: [
      'More than half of American households have cut or reduced traditional cable. They are watching Hulu, Peacock, Pluto, Roku, and other streaming platforms instead.',
      'Connected TV advertising lets local businesses reach these households with targeted video ads — by zip code, household income, homeownership, and other factors. Budgets start much lower than traditional broadcast TV.',
      'CTV works best as part of a full system. It builds awareness so that when a customer searches on Google or asks an AI tool, they already recognize your name.',
    ],
    bg: 'bg-green-50 border-green-100',
  },
  {
    icon: <Star className="w-7 h-7 text-yellow-500" />,
    tag: 'Trust Signals',
    tagColor: 'text-yellow-600',
    title: 'Why Trust, Reviews, Content, and Follow-Up Matter',
    body: [
      'Local business decisions are trust decisions. Before someone calls a plumber, hires a landscaper, or books a consultation with an attorney, they are asking themselves: "Can I trust this business?"',
      'Reviews answer that question. So does a professional, clear website. So do helpful articles, videos, and social content that show you know your subject. So does a business that follows up after a first contact instead of going silent.',
      'Each of these elements adds credibility. Remove any one of them and you create doubt. Build all of them together and you build the kind of authority that converts browsers into buyers.',
    ],
    bg: 'bg-yellow-50 border-yellow-100',
  },
  {
    icon: <TrendingUp className="w-7 h-7 text-red-500" />,
    tag: 'The NTA Approach',
    tagColor: 'text-red-600',
    title: 'How NTA Helps Local Businesses Adapt',
    body: [
      'NTA is not a traditional marketing agency. We do not sell one service and walk away. We help local businesses build a connected growth system — one that covers attention, discovery, trust, conversion, and follow-up.',
      'We use AI tools practically, not as a gimmick. We help businesses create better websites, publish consistent content, run CTV ads, build review systems, and set up follow-up automation that works while the owner is focused on running their business.',
      'Most of our clients come to us after paying for marketing that did not produce results. The difference is usually not the quality of one ad or one piece of content. It is whether everything is connected and working together.',
    ],
    bg: 'bg-red-50 border-red-100',
  },
];

export default function WhatChangedOnline() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav strip */}
      <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-white font-black text-lg tracking-tight hover:text-blue-400 transition-colors">
          ← New Tech Advertising
        </Link>
        <Link to="/gap-audit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-4 py-2 rounded-lg transition-colors">
          Get My Free Audit
        </Link>
      </div>

      {/* Hero */}
      <div className="bg-slate-950 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-4">Education</p>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-6">
            What Changed Online<br />
            <span className="text-slate-400">for Local Businesses</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            A plain-spoken guide to why old marketing approaches are falling short and what's actually working for local businesses today.
          </p>
        </div>
      </div>

      {/* Content sections */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-10">
        {SECTIONS.map((section, i) => (
          <div key={i} className={`rounded-2xl border p-8 ${section.bg}`}>
            <div className="flex items-start gap-4 mb-5">
              <div className="flex-shrink-0 mt-0.5">{section.icon}</div>
              <div>
                <p className={`text-xs font-black uppercase tracking-widest mb-1 ${section.tagColor}`}>{section.tag}</p>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">{section.title}</h2>
              </div>
            </div>
            <div className="space-y-4 pl-11">
              {section.body.map((para, j) => (
                <p key={j} className="text-slate-700 leading-relaxed text-base">{para}</p>
              ))}
            </div>
          </div>
        ))}

        {/* Bottom CTA */}
        <div className="bg-slate-900 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Ready to See Where You Stand?</h2>
          <p className="text-slate-400 text-base mb-6 max-w-xl mx-auto">
            Our AI Gap Audit reviews your online presence across search, trust, website, and visibility — and shows you exactly what's missing.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/gap-audit" className="bg-blue-600 hover:bg-blue-500 text-white font-black px-7 py-4 rounded-xl transition-colors text-sm">
              Get My AI Gap Audit
            </Link>
            <Link to="/learning-center" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-7 py-4 rounded-xl transition-colors text-sm flex items-center gap-2">
              Visit Learning Center <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
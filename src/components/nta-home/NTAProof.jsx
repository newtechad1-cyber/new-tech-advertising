import React from 'react';
import { TrendingUp, Quote } from 'lucide-react';

const CASE_STUDIES = [
  {
    company: 'Peak HVAC — Denver, CO',
    industry: 'HVAC',
    results: [
      { label: 'Organic Traffic', before: '180/mo', after: '2,400/mo', color: '#3b82f6' },
      { label: 'Leads/Month',     before: '8',      after: '47',       color: '#10b981' },
      { label: 'Revenue Growth',  before: 'Baseline', after: '+$31K/mo', color: '#f59e0b' },
    ],
    quote: 'We went from invisible to the most recognized HVAC brand in our city in under 8 months.',
    author: 'Mike T., Owner',
  },
  {
    company: 'Lone Star Roofing — Dallas, TX',
    industry: 'Roofing',
    results: [
      { label: 'Google Ranking', before: 'Page 4',    after: '#2 in city',  color: '#8b5cf6' },
      { label: 'Monthly Leads', before: '12',         after: '63',           color: '#10b981' },
      { label: 'Close Rate',    before: '22%',        after: '38%',          color: '#06b6d4' },
    ],
    quote: 'The content machine runs itself. I just get more calls — I don\'t have to think about marketing anymore.',
    author: 'Sarah K., Owner',
  },
  {
    company: 'Metro Electric — Chicago, IL',
    industry: 'Electrical',
    results: [
      { label: 'Content Published', before: '4/yr',  after: '400+/yr',  color: '#3b82f6' },
      { label: 'Streaming Views',   before: '0',     after: '48K/mo',   color: '#06b6d4' },
      { label: 'Revenue Impact',    before: 'N/A',   after: '+$19K/mo', color: '#f59e0b' },
    ],
    quote: 'Competitors are confused how we\'re everywhere. Streaming TV alone doubled our brand awareness.',
    author: 'James L., CEO',
  },
];

const TESTIMONIALS = [
  { name: 'Chris R.', title: 'HVAC Owner — Phoenix', text: 'Best marketing investment we\'ve made in 14 years of business. Period.' },
  { name: 'Amanda F.', title: 'Landscaping — Nashville', text: 'I was skeptical. 90 days later my phone doesn\'t stop ringing.' },
  { name: 'David M.', title: 'Plumbing — Seattle', text: 'The ROI dashboard finally shows my wife marketing is worth the spend.' },
];

export default function NTAProof() {
  return (
    <section id="results" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-4">Real Results</p>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
            Businesses That Became the Authority in Their Market
          </h2>
          <p className="text-lg text-slate-400">Real numbers from real local businesses — no cherry-picked vanity metrics.</p>
        </div>

        {/* Case study cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {CASE_STUDIES.map((cs, i) => (
            <div key={i} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-white font-black text-sm">{cs.company}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{cs.industry}</p>
                </div>
                <TrendingUp className="w-4 h-4 text-green-400 flex-shrink-0" />
              </div>

              <div className="space-y-3 mb-5">
                {cs.results.map((r, j) => (
                  <div key={j} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50">
                    <span className="text-slate-400 text-xs">{r.label}</span>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-600 line-through">{r.before}</span>
                      <span className="font-black" style={{ color: r.color }}>{r.after}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-800 pt-4">
                <Quote className="w-4 h-4 text-slate-700 mb-2" />
                <p className="text-slate-400 text-sm italic leading-relaxed mb-2">"{cs.quote}"</p>
                <p className="text-slate-600 text-xs font-semibold">— {cs.author}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-sm font-black flex-shrink-0">
                {t.name[0]}
              </div>
              <div>
                <p className="text-slate-300 text-sm leading-relaxed mb-2">"{t.text}"</p>
                <p className="text-white text-xs font-bold">{t.name}</p>
                <p className="text-slate-600 text-xs">{t.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
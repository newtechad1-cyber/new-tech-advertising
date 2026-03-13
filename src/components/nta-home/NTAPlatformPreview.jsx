import React from 'react';

const ROWS = [
  {
    label: 'Content Engine',
    headline: 'Your AI marketing team — writing, scheduling, and publishing without you.',
    benefits: ['2 SEO blogs per week', '5 social posts per platform', '1 video script per week', 'All branded to your voice'],
    color: '#3b82f6',
    mockSlots: [
      { t: 'Blog: "5 Signs Your AC Needs Service"', s: 'Published · 847 views', c: '#10b981' },
      { t: 'Facebook: Summer promotion post', s: 'Scheduled · Tomorrow 9am', c: '#3b82f6' },
      { t: 'GMB: Business update posted', s: 'Live · Just now', c: '#10b981' },
      { t: 'Instagram: Before/after photo', s: 'Scheduled · Wed 11am', c: '#f59e0b' },
    ],
  },
  {
    label: 'Streaming Visibility',
    headline: 'Be the only local business your neighbors see on TV.',
    benefits: ['Roku, Fire TV, Apple TV', 'Geo-targeted to your city', 'Professional video ads', 'Runs 24/7 automatically'],
    color: '#06b6d4',
    mockSlots: [
      { t: '📺 Streaming Campaign Active', s: '12,400 impressions this week', c: '#06b6d4' },
      { t: '🎯 Denver + 15mi radius', s: '94% audience match rate', c: '#10b981' },
      { t: '▶ Video Ad Running: 30s', s: 'Avg 82% completion rate', c: '#8b5cf6' },
      { t: '📊 Attribution: 14 calls tracked', s: 'From streaming this month', c: '#f59e0b' },
    ],
  },
  {
    label: 'ROI Dashboard',
    headline: 'Stop guessing. See exactly what your marketing is worth.',
    benefits: ['Visibility score tracking', 'Lead source attribution', 'Revenue impact estimate', 'Monthly authority report'],
    color: '#10b981',
    mockSlots: [
      { t: 'Organic Leads — March', s: '+47 leads tracked to content', c: '#10b981' },
      { t: 'Visibility Score', s: '94 / 100 — Top 5% in market', c: '#3b82f6' },
      { t: 'Estimated Revenue Impact', s: '$24,800 attributed this month', c: '#f59e0b' },
      { t: 'Authority Report', s: 'Sent to client — 3 days ago', c: '#8b5cf6' },
    ],
  },
];

export default function NTAPlatformPreview() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 space-y-24">
        {ROWS.map((row, i) => (
          <div key={i} className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${i % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
            {/* Text */}
            <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
              <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: row.color }}>{row.label}</p>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-6">{row.headline}</h3>
              <ul className="space-y-3 mb-8">
                {row.benefits.map((b, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${row.color}18` }}>
                      <span className="text-xs font-black" style={{ color: row.color }}>✓</span>
                    </div>
                    <span className="text-slate-700 font-medium">{b}</span>
                  </li>
                ))}
              </ul>
              <a href="#demo" className="inline-flex items-center gap-2 text-sm font-bold transition-colors hover:underline" style={{ color: row.color }}>
                See this in the demo →
              </a>
            </div>

            {/* Mock UI */}
            <div className={i % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
              <div className="rounded-2xl border border-slate-200 shadow-xl bg-white overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{row.label}</span>
                  <div className="flex gap-1">
                    {[0,1,2].map(d => <div key={d} className="w-2 h-2 rounded-full bg-slate-200" />)}
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  {row.mockSlots.map((slot, j) => (
                    <div key={j} className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex-1">
                        <p className="text-slate-800 text-sm font-semibold">{slot.t}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{slot.s}</p>
                      </div>
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: slot.c }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
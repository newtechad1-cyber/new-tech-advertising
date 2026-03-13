import React from 'react';

const STEPS = [
  {
    num: '01',
    title: 'Book Your Demo',
    desc: 'A 30-minute platform walkthrough showing your industry, your market, and your competitors — live during the call.',
    duration: '30 min',
    color: '#3b82f6',
  },
  {
    num: '02',
    title: 'Market Authority Audit',
    desc: 'We analyze your online presence, competitor visibility, and untapped local opportunities to build your growth roadmap.',
    duration: '24–48 hrs',
    color: '#8b5cf6',
  },
  {
    num: '03',
    title: 'System Launch',
    desc: 'Your authority website, content calendar, and AI agents are configured and activated within 14 days of signing.',
    duration: '14 days',
    color: '#06b6d4',
  },
  {
    num: '04',
    title: 'AI Takes Over',
    desc: 'Content publishes weekly. Streaming campaigns run automatically. You receive monthly reports while the system grows your authority.',
    duration: 'Ongoing',
    color: '#10b981',
  },
];

export default function NTAProcess() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-4">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
            From Demo to Market Domination in 30 Days
          </h2>
          <p className="text-lg text-slate-500">No lengthy onboarding. No 90-day delays. You're live and visible faster than any agency can move.</p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line */}
          <div className="absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 hidden md:block" style={{ left: '10%', right: '10%' }} />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                {/* Circle */}
                <div className="relative z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center border-2 bg-white shadow-lg mb-6"
                  style={{ borderColor: step.color }}>
                  <span className="text-xs font-bold text-slate-400">{step.num}</span>
                  <span className="text-xs font-black mt-0.5" style={{ color: step.color }}>{step.duration}</span>
                </div>
                <h3 className="text-slate-900 font-black text-lg mb-3">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 text-center">
          <a href="/book-call" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-black text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 hover:-translate-y-0.5">
            Start With a Free Demo →
          </a>
          <p className="text-slate-400 text-sm mt-3">No commitment required. See the platform for your market before deciding.</p>
        </div>
      </div>
    </section>
  );
}
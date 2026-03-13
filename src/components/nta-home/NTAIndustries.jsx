import React from 'react';

const INDUSTRIES = [
  { name: 'HVAC',         emoji: '❄️',  desc: 'Seasonal campaigns, emergency visibility',        clients: '60+ clients' },
  { name: 'Plumbing',     emoji: '🔧',  desc: 'Emergency SEO + authority content',               clients: '45+ clients' },
  { name: 'Roofing',      emoji: '🏠',  desc: 'Storm season targeting + local dominance',         clients: '38+ clients' },
  { name: 'Electrical',   emoji: '⚡',  desc: 'Safety content + service area expansion',          clients: '29+ clients' },
  { name: 'Landscaping',  emoji: '🌿',  desc: 'Seasonal visual content + review generation',      clients: '34+ clients' },
  { name: 'Painting',     emoji: '🎨',  desc: 'Before/after storytelling + social proof',         clients: '22+ clients' },
  { name: 'Restaurants',  emoji: '🍽️',  desc: 'Promo campaigns + streaming visibility',           clients: '18+ clients' },
  { name: 'Fitness',      emoji: '💪',  desc: 'Community authority + challenge campaigns',        clients: '15+ clients' },
  { name: 'Real Estate',  emoji: '🏡',  desc: 'Market authority + neighborhood content',          clients: '27+ clients' },
  { name: 'Dental',       emoji: '🦷',  desc: 'Trust content + local search domination',          clients: '19+ clients' },
  { name: 'Law Firms',    emoji: '⚖️',  desc: 'Expertise content + authority positioning',        clients: '14+ clients' },
  { name: 'Med Spa',      emoji: '✨',  desc: 'Visual campaigns + streaming visibility',           clients: '16+ clients' },
];

export default function NTAIndustries() {
  return (
    <section id="industries" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-4">Industries Served</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
            Built for Every Local Business Category
          </h2>
          <p className="text-lg text-slate-500">
            Our AI is trained on industry-specific content patterns, local search behavior, and seasonal demand cycles.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {INDUSTRIES.map((ind, i) => (
            <div key={i} className="group p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer bg-white">
              <div className="text-3xl mb-3">{ind.emoji}</div>
              <h4 className="font-black text-slate-900 text-sm mb-1">{ind.name}</h4>
              <p className="text-slate-500 text-xs leading-relaxed mb-3">{ind.desc}</p>
              <p className="text-blue-600 text-xs font-bold">{ind.clients}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-slate-900 font-black text-lg">Don't see your industry?</p>
            <p className="text-slate-500 text-sm mt-1">We've built authority systems for 40+ business categories. Let's talk.</p>
          </div>
          <a href="#demo" className="flex-shrink-0 px-6 py-3 rounded-xl text-sm font-black text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            Book a Discovery Call →
          </a>
        </div>
      </div>
    </section>
  );
}
import React from 'react';
import { TrendingUp, Eye, Zap, ArrowRight } from 'lucide-react';

const INDUSTRY_DATA = {
  hvac: { searches: '2,400+', competitors: 47, opportunity: 'High', keyword: 'HVAC service' },
  plumbing: { searches: '3,200+', competitors: 52, opportunity: 'High', keyword: 'plumber near me' },
  roofing: { searches: '1,800+', competitors: 31, opportunity: 'Very High', keyword: 'roof replacement' },
  landscaping: { searches: '2,100+', competitors: 68, opportunity: 'Medium', keyword: 'landscaping company' },
  electrical: { searches: '1,600+', competitors: 28, opportunity: 'High', keyword: 'electrician near me' },
  painting: { searches: '900+', competitors: 22, opportunity: 'Medium', keyword: 'house painting' },
  fitness: { searches: '5,400+', competitors: 84, opportunity: 'High', keyword: 'gym near me' },
  restaurant: { searches: '8,200+', competitors: 140, opportunity: 'Very High', keyword: 'restaurants near me' },
  real_estate: { searches: '6,400+', competitors: 95, opportunity: 'Very High', keyword: 'real estate agent' },
  other: { searches: '1,200+', competitors: 35, opportunity: 'Medium', keyword: 'local service' },
};

const OPP_COLOR = { High: '#f59e0b', 'Very High': '#ef4444', Medium: '#3b82f6', Low: '#10b981' };

export default function DRStrategyHero({ company, industry, city, onScrollToProposal }) {
  const data = INDUSTRY_DATA[industry] || INDUSTRY_DATA.other;
  const color = OPP_COLOR[data.opportunity] || '#f59e0b';

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h2 className="text-white text-3xl font-black mb-3">Your Visibility Opportunity</h2>
        <p className="text-slate-400 text-base max-w-xl mx-auto">
          Here's what the market looks like in {city || 'your area'} — and exactly how NTA positions you to capture it.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Monthly Local Searches', value: data.searches, sub: `for "${data.keyword}"`, icon: Eye, color: '#3b82f6' },
          { label: 'Active Competitors', value: data.competitors, sub: 'fighting for page 1', icon: TrendingUp, color: '#f59e0b' },
          { label: 'Your Opportunity', value: data.opportunity, sub: 'market capture potential', icon: Zap, color },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 text-center">
              <Icon className="w-6 h-6 mx-auto mb-3" style={{ color: m.color }} />
              <p className="text-3xl font-black text-white mb-1">{m.value}</p>
              <p className="text-slate-500 text-xs">{m.label}</p>
              <p className="text-slate-600 text-xs mt-1 italic">{m.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Authority message */}
      <div className="bg-gradient-to-br from-blue-950/40 to-slate-900 border border-blue-800/40 rounded-2xl p-8 text-center">
        <p className="text-white text-xl font-bold mb-3">
          Most {industry ? industry.replace('_', ' ') : 'local businesses'} in {city || 'your market'} are invisible online.
        </p>
        <p className="text-slate-300 text-base leading-relaxed max-w-2xl mx-auto mb-6">
          They have no content strategy, minimal reviews, no video presence, and they're completely absent on streaming TV. NTA changes all of that — systematically, consistently, and fully managed for you.
        </p>
        <button onClick={onScrollToProposal}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/40">
          Review Your Growth Plan <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
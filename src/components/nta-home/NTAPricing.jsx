import React from 'react';
import { Check, Shield, TrendingUp, Zap } from 'lucide-react';

const PLANS = [
  {
    name: 'Starter Authority',
    tagline: 'Build your foundation',
    icon: Shield,
    color: '#3b82f6',
    ideal: 'Perfect for businesses just entering the local digital market with a clear growth intent.',
    includes: ['Authority website foundation', 'AI blog content (2/week)', 'Google Business optimization', 'Social posting (3/week)', 'Monthly visibility report'],
    cta: 'Get Starter Pricing',
  },
  {
    name: 'Market Authority',
    tagline: 'Dominate your market',
    icon: TrendingUp,
    color: '#8b5cf6',
    popular: true,
    ideal: 'For established businesses ready to become the clear #1 authority in their local market.',
    includes: ['Everything in Starter', 'AI video scripts + production', 'Full social campaign management', 'Streaming TV visibility', 'ROI attribution dashboard', 'Review generation system'],
    cta: 'Get Authority Pricing',
  },
  {
    name: 'Domination Plan',
    tagline: 'Own the entire market',
    icon: Zap,
    color: '#10b981',
    ideal: 'Multi-location or enterprise businesses that want total market saturation and competitive lockout.',
    includes: ['Everything in Authority', 'Multi-location management', 'Custom AI agent deployment', 'Competitor displacement strategy', 'Dedicated growth strategist', 'Quarterly executive reviews'],
    cta: 'Get Domination Pricing',
  },
];

export default function NTAPricing() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-4">Structured Growth Plans</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
            Plans Built for Growth — Not Just Traffic
          </h2>
          <p className="text-lg text-slate-500">
            Every plan is built on the same AI platform. Pricing is determined by your market size, goals, and the level of authority you want to establish.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLANS.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <div key={i} className={`relative rounded-2xl p-7 transition-all hover:-translate-y-1 ${
                plan.popular
                  ? 'bg-gradient-to-b from-blue-600 to-blue-700 shadow-2xl shadow-blue-600/30'
                  : 'bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full text-xs font-black bg-white text-blue-600 shadow-md whitespace-nowrap">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: plan.popular ? 'rgba(255,255,255,0.2)' : `${plan.color}18` }}>
                    <Icon className="w-5 h-5" style={{ color: plan.popular ? '#fff' : plan.color }} />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${plan.popular ? 'text-blue-200' : 'text-slate-500'}`}>{plan.tagline}</p>
                    <h3 className={`font-black text-base ${plan.popular ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                  </div>
                </div>

                <p className={`text-sm leading-relaxed mb-6 ${plan.popular ? 'text-blue-100' : 'text-slate-500'}`}>{plan.ideal}</p>

                <ul className="space-y-2.5 mb-7">
                  {plan.includes.map((item, j) => (
                    <li key={j} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: plan.popular ? '#93c5fd' : plan.color }} />
                      <span className={`text-sm font-medium ${plan.popular ? 'text-white' : 'text-slate-700'}`}>{item}</span>
                    </li>
                  ))}
                </ul>

                <a href="/book-call" className={`block w-full text-center py-3 rounded-xl text-sm font-black transition-all ${
                  plan.popular
                    ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}>
                  {plan.cta} →
                </a>
              </div>
            );
          })}
        </div>

        <p className="text-center text-slate-400 text-sm mt-8">
          Pricing is customized during your demo based on your market, competition level, and growth goals.
        </p>
      </div>
    </section>
  );
}
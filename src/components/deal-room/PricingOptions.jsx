import React, { useState } from 'react';
import { Check, Zap } from 'lucide-react';

export default function PricingOptions() {
  const [selectedTier, setSelectedTier] = useState('growth');

  const tiers = [
    {
      id: 'visibility',
      name: 'Visibility Plan',
      price: '$1,500',
      period: 'per month',
      description: 'Foundation for local visibility and engagement',
      cta: 'Start Visibility Plan',
      features: [
        'Daily content distribution',
        '4 channels (Facebook, Instagram, Google, Website)',
        'Basic reporting dashboard',
        'Content calendar planning',
        'Email support'
      ],
      outcome: 'Predictable visibility growth & engagement momentum'
    },
    {
      id: 'growth',
      name: 'Growth Authority Plan',
      price: '$2,500',
      period: 'per month',
      description: 'Content + video for rapid authority building',
      cta: 'Start Growth Plan',
      featured: true,
      features: [
        'Everything in Visibility Plan',
        'Monthly video content strategy',
        'Professional video editing',
        'Advanced analytics & ROI tracking',
        'Monthly strategy session',
        'Priority support'
      ],
      outcome: 'Accelerated visibility, authority, and qualified leads'
    },
    {
      id: 'dominance',
      name: 'Video Dominance Plan',
      price: '$4,500',
      period: 'per month',
      description: 'Full video strategy + multi-location scaling',
      cta: 'Start Dominance Plan',
      features: [
        'Everything in Growth Plan',
        'Weekly video content creation',
        'Multi-location management',
        'Paid amplification strategy',
        'Bi-weekly strategy sessions',
        'Dedicated account manager',
        'Custom brand integration'
      ],
      outcome: 'Market dominance through video authority & scale'
    }
  ];

  return (
    <div className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-slate-600 text-lg">
            Choose the plan that fits your growth goals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-lg border-2 transition-all cursor-pointer ${
                tier.featured
                  ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              onClick={() => setSelectedTier(tier.id)}
            >
              {tier.featured && (
                <div className="bg-blue-600 text-white text-center py-2 text-sm font-semibold">
                  MOST POPULAR
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{tier.name}</h3>
                <p className="text-slate-600 text-sm mb-6">{tier.description}</p>

                <div className="mb-6">
                  <p className="text-4xl font-bold text-slate-900">{tier.price}</p>
                  <p className="text-slate-600 text-sm">{tier.period}</p>
                </div>

                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-colors mb-8 ${
                    tier.featured
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}
                >
                  {tier.cta}
                </button>

                <div className="mb-6">
                  <p className="text-sm font-semibold text-slate-900 mb-3">What You Get:</p>
                  <ul className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-100 p-4 rounded-lg">
                  <p className="text-xs text-slate-600 mb-1">OUTCOME</p>
                  <p className="font-semibold text-slate-900 text-sm">{tier.outcome}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <Zap className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
          <p className="text-slate-900 font-semibold">Your growth plan slot is reserved for the next 7 days.</p>
          <p className="text-slate-600 text-sm mt-2">Secure your pricing and onboarding timeline today.</p>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plans = [
  {
    key: 'diy',
    name: 'DIY Growth System',
    description: 'Self-serve tools and templates',
    monthly: 299,
    features: ['Content calendar', 'SEO templates', 'Social planner', 'Analytics dashboard'],
    cta: 'Start DIY',
    color: 'border-blue-500',
  },
  {
    key: 'guided_growth',
    name: 'Guided Growth',
    description: 'Expert guidance + tools',
    monthly: 1500,
    features: ['Everything in DIY', 'Weekly strategy calls', 'Content feedback', 'Monthly ROI reports'],
    cta: 'Choose Guided',
    color: 'border-purple-500',
    recommended: true,
  },
  {
    key: 'done_for_you',
    name: 'Done-For-You',
    description: 'We handle everything',
    monthly: 3500,
    features: [
      'All content creation',
      'Campaign management',
      'Video production',
      'Dedicated strategist',
      'Monthly strategy reviews',
    ],
    cta: 'Choose DFY',
    color: 'border-green-500',
  },
];

export default function DealRoomPlans({ opportunity, onSelectPlan }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Choose Your Plan</h2>
      <p className="text-slate-400 mb-8">Select the right level of support for your business</p>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.key}
            className={`bg-slate-900 rounded-lg border-2 ${plan.color} p-6 transition-all ${
              plan.recommended ? 'transform scale-105 shadow-xl' : ''
            }`}
          >
            {plan.recommended && (
              <div className="mb-3 inline-block px-3 py-1 bg-green-600/20 border border-green-600 rounded-full text-xs font-bold text-green-400">
                RECOMMENDED
              </div>
            )}

            <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
            <p className="text-sm text-slate-400 mb-4">{plan.description}</p>

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-slate-700">
              <p className="text-3xl font-bold text-white">
                ${plan.monthly}
                <span className="text-sm text-slate-400">/month</span>
              </p>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Button
              onClick={() => onSelectPlan(plan.key)}
              className={`w-full ${
                plan.recommended
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
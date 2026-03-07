import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CheckCircle, ArrowRight } from 'lucide-react';

const PLANS = [
  {
    name: 'DIY Starter',
    price: '$99',
    period: '/mo',
    desc: 'Great for solopreneurs and small teams who want AI-powered content without agency costs.',
    features: ['20 AI posts/month', 'Content scheduling', '3 social channels', 'Basic analytics', 'Authority Plan'],
    cta: 'Start Free Trial',
    link: 'Get-Started',
    highlight: false,
  },
  {
    name: 'DIY Pro',
    price: '$199',
    period: '/mo',
    desc: 'For growing businesses that need more content, more channels, and AI video capability.',
    features: ['50 AI posts/month', 'Unlimited scheduling', '7 social channels', 'AI Video Studio', 'Advanced analytics', 'Priority support'],
    cta: 'Start Free Trial',
    link: 'Get-Started',
    highlight: false,
  },
  {
    name: 'DFY Social',
    price: '$399',
    period: '/mo',
    desc: 'Done-for-you social media management. We create, approve, and post everything.',
    features: ['Everything in Pro', 'Dedicated content team', 'We post for you', 'Monthly strategy call', 'Video production included'],
    cta: 'Book Strategy Call',
    link: 'Book-Call',
    highlight: true,
  },
  {
    name: 'Total Reach',
    price: '$899',
    period: '/mo',
    desc: 'Full-service marketing: social, video, streaming TV, and ADA compliance — all managed.',
    features: ['Everything in DFY', 'Streaming TV ads', 'ADA compliance monitoring', 'Google Business management', 'Custom reporting', 'Dedicated account manager'],
    cta: 'Book Strategy Call',
    link: 'Book-Call',
    highlight: false,
  },
];

export default function HomePricing() {
  return (
    <section className="bg-slate-950 py-20 px-4 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-green-400 text-sm font-semibold uppercase tracking-widest">Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">
            Transparent pricing. No hidden fees.
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Pick the plan that fits your business. Start with a free trial — no credit card required.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 flex flex-col ${
                plan.highlight
                  ? 'bg-violet-900/30 border-2 border-violet-500/60'
                  : 'bg-slate-900 border border-slate-800'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-violet-600 text-white text-xs font-bold px-4 py-1 rounded-full">Most Popular</span>
                </div>
              )}
              <div className="mb-5">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{plan.name}</p>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-slate-400 text-sm mb-1">{plan.period}</span>
                </div>
                <p className="text-slate-500 text-xs mt-2 leading-relaxed">{plan.desc}</p>
              </div>
              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to={createPageUrl(plan.link)}
                className={`w-full text-center font-bold py-2.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 ${
                  plan.highlight
                    ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30'
                    : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white'
                }`}
              >
                {plan.cta} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-600 text-sm mt-8">
          All plans include a 14-day free trial. Cancel anytime. Volume discounts for agencies & franchises.
        </p>
      </div>
    </section>
  );
}
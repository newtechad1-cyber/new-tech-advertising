import React from 'react';
import { CheckCircle, Star, Zap, ArrowRight } from 'lucide-react';

const TRIAL_URL = 'https://app.newtechadvertising.com/start-trial';
const STRATEGY_URL = 'https://app.newtechadvertising.com/book-call';

const plans = [
  {
    name: 'DIY Starter',
    price: '$99',
    period: '/mo',
    desc: 'A simple self-service plan for businesses that want to create and schedule their own content.',
    features: ['AI content tools', 'Social media scheduler', 'Basic video creation', 'Analytics dashboard'],
    cta: 'Start Free Trial',
    ctaHref: TRIAL_URL,
    highlight: null,
    ctaStyle: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
    cardStyle: 'bg-white border-slate-200',
  },
  {
    name: 'DIY Pro',
    price: '$199',
    period: '/mo',
    desc: 'More automation, better content tools, and expanded marketing features for growing businesses.',
    features: ['Unlimited content tools', 'Advanced video creation', 'Email marketing tools', 'CRM features'],
    cta: 'Start Free Trial',
    ctaHref: TRIAL_URL,
    highlight: 'Most Popular',
    ctaStyle: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30',
    cardStyle: 'bg-blue-600 border-blue-500 text-white ring-2 ring-blue-400 ring-offset-2 scale-105',
    dark: true,
  },
  {
    name: 'DFY Social Management',
    price: '$399',
    period: '/mo',
    desc: 'Done-for-you social media management for businesses that want a hands-off solution.',
    features: ['Content creation', 'Video production', 'Post scheduling', 'Monthly reporting'],
    cta: 'Book Strategy Call',
    ctaHref: STRATEGY_URL,
    highlight: null,
    ctaStyle: 'border-2 border-slate-700 text-slate-700 hover:bg-slate-700 hover:text-white',
    cardStyle: 'bg-white border-slate-200',
  },
  {
    name: 'Total Reach Campaign',
    price: '$899',
    period: '/mo',
    desc: 'Coordinated social media and streaming TV campaigns for businesses that want maximum reach.',
    features: ['Social media management', 'Streaming TV campaign setup', 'Coordinated messaging', 'Campaign analytics'],
    cta: 'Book Strategy Call',
    ctaHref: STRATEGY_URL,
    highlight: 'Best for Maximum Visibility',
    ctaStyle: 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20',
    cardStyle: 'bg-slate-900 border-slate-700 text-white ring-2 ring-slate-600 ring-offset-2',
    dark: true,
  },
];

export default function PlatformPricing() {
  return (
    <section className="bg-white py-20 lg:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            Pricing
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">
            Use the Platform Yourself — or Let Us Run Your Marketing
          </h2>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Choose the level of support that fits your business. Start with the platform and upgrade anytime.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-center">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-6 flex flex-col transition-all duration-200 hover:shadow-xl ${plan.cardStyle}`}
            >
              {plan.highlight && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full shadow-sm whitespace-nowrap ${plan.dark ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'}`}>
                  <Star className="w-3 h-3 fill-current" /> {plan.highlight}
                </div>
              )}

              <div className="mb-5 pt-2">
                <p className={`text-sm font-semibold mb-1 ${plan.dark ? 'text-white/70' : 'text-slate-500'}`}>{plan.name}</p>
                <div className="flex items-baseline gap-0.5 mb-3">
                  <span className={`text-4xl font-extrabold ${plan.dark ? 'text-white' : 'text-slate-900'}`}>{plan.price}</span>
                  <span className={`text-sm ${plan.dark ? 'text-white/60' : 'text-slate-500'}`}>{plan.period}</span>
                </div>
                <p className={`text-sm leading-relaxed ${plan.dark ? 'text-white/70' : 'text-slate-600'}`}>{plan.desc}</p>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle className={`w-4 h-4 shrink-0 ${plan.dark ? 'text-white/70' : 'text-blue-500'}`} />
                    <span className={plan.dark ? 'text-white/80' : 'text-slate-700'}>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.ctaHref}
                className={`inline-flex items-center justify-center gap-1.5 font-bold py-3 px-4 rounded-xl text-sm transition-all duration-200 ${plan.ctaStyle}`}
              >
                {plan.cta} <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
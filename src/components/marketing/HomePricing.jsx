import React from 'react';
import { CheckCircle, ArrowRight, Zap } from 'lucide-react';

const TRIAL_URL = 'https://app.newtechadvertising.com/start-trial';

const PLANS = [
  {
    name: 'Starter',
    price: 99,
    tagline: 'Everything you need to get started',
    badge: null,
    color: 'border-slate-200',
    buttonStyle: 'bg-slate-900 hover:bg-slate-700 text-white',
    features: [
      'AI captions & hashtags',
      '10 social posts/month',
      'Image generation',
      'Content calendar',
      'Facebook & Instagram scheduling',
      '1 social media account',
      'Email support',
    ],
  },
  {
    name: 'Pro',
    price: 199,
    tagline: 'For businesses serious about growth',
    badge: 'Most Popular',
    color: 'border-blue-500 shadow-xl shadow-blue-600/10',
    buttonStyle: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30',
    features: [
      'Everything in Starter',
      '30 social posts/month',
      'AI video creation',
      'Streaming TV ad scripts',
      'LinkedIn scheduling included',
      'Up to 3 social accounts',
      'Priority support',
      'Brand voice training',
      'Analytics & reporting',
    ],
  },
];

export default function HomePricing() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-3">Simple Pricing</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">
            Flat monthly pricing. No surprises.
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Pay less per month than a single agency blog post. Keep all the results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className={`relative border-2 rounded-2xl p-8 flex flex-col ${plan.color}`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" /> {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-extrabold text-slate-900 mb-1">{plan.name}</h3>
                <p className="text-slate-500 text-sm mb-4">{plan.tagline}</p>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-extrabold text-slate-900">${plan.price}</span>
                  <span className="text-slate-400 mb-2">/month</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-slate-700 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {f}
                  </li>
                ))}
              </ul>

              <a
                href={TRIAL_URL}
                className={`inline-flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-xl text-sm transition-all ${plan.buttonStyle}`}
              >
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-400 text-sm mt-8">
          All plans include a 7-day free trial. No credit card required to start.
        </p>
      </div>
    </section>
  );
}
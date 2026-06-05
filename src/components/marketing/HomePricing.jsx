import React from 'react';
import { CheckCircle, ArrowRight, Zap } from 'lucide-react';

const TRIAL_URL = 'https://app.newtechadvertising.com/start-trial';

const PLANS = [
  {
    name: 'DIY Social',
    price: 97,
    tagline: 'Manage your social media with AI tools',
    badge: 'Best Way to Start',
    badgeStyle: 'bg-blue-600',
    color: 'border-slate-200',
    buttonStyle: 'bg-blue-600 hover:bg-blue-500 text-white',
    features: [
      'AI Content Generation (20 posts/mo)',
      'Social Media Planner',
      '3 Social Channels',
      'Content Calendar',
      'Growth Guide Chatbot',
      'Learning Center Access',
      'Email Support',
      'Cancel Anytime'
    ],
    link: '/nta/diy-growth-system?plan=diy_social'
  },
  {
    name: 'DIY Marketing Suite',
    price: 197,
    tagline: 'Full marketing + business tools — run everything yourself',
    badge: 'Best for Solo Operators',
    badgeStyle: 'bg-violet-600',
    color: 'border-violet-500 shadow-xl shadow-violet-600/10 scale-105',
    buttonStyle: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/30',
    features: [
      'Everything in DIY Social PLUS:',
      'Full CRM & Client Management',
      'Leads Pipeline & Prospecting',
      'Invoicing & Expense Tracking',
      'Financial Reports (P&L)',
      'Project Tracking',
      '50 AI Posts/mo & 7 Channels',
      'AI Video Studio',
      'Self-Service Gap Audit',
      'Monthly Live Q&A',
      'Priority Support'
    ],
    link: '/nta/diy-growth-system?plan=diy_suite'
  },
  {
    name: 'Growth Partner',
    price: 297,
    tagline: 'We handle social media + strategy — you focus on your business',
    badge: 'Best for Accountability',
    badgeStyle: 'bg-emerald-600',
    color: 'border-emerald-500/30 shadow-lg',
    buttonStyle: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    features: [
      '20 Done-For-You Social Posts/mo',
      '7 Channels Managed',
      'Monthly Strategy Call',
      'SEO + Google Business Optimization',
      'Content Calendar Done For You',
      'Monthly Performance Report',
      'Dedicated Growth Strategist'
    ],
    link: '/book-call'
  },
  {
    name: 'Growth Accelerator',
    price: 497,
    tagline: 'Full content + video + reputation managed for you',
    badge: 'Best for Serious Growth',
    badgeStyle: 'bg-amber-500',
    color: 'border-amber-500/30 shadow-lg',
    buttonStyle: 'bg-amber-600 hover:bg-amber-500 text-white',
    features: [
      'Everything in Growth Partner PLUS:',
      'AI Video Production',
      'Reputation & Review Management',
      'Streaming TV Ad Scripts',
      'Bi-weekly Strategy Calls',
      'Unlimited Social Channels',
      'Competitor Analysis'
    ],
    link: '/book-call'
  },
  {
    name: 'Full-Stack Growth',
    price: 797,
    tagline: 'Marketing + back-office systems + custom automations',
    badge: 'The Everything Plan',
    badgeStyle: 'bg-rose-600',
    color: 'border-rose-500/30 shadow-lg',
    buttonStyle: 'bg-rose-600 hover:bg-rose-500 text-white',
    features: [
      'Everything in Accelerator PLUS:',
      'Custom Back-Office App',
      'Automated Invoicing & Dispatch',
      'Weekly Strategy Calls',
      'Custom Automation Workflows',
      'Priority Everything',
      'Quarterly Business Reviews'
    ],
    link: '/book-call'
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

        <div className="flex overflow-x-auto pb-10 snap-x snap-mandatory gap-8 lg:grid lg:grid-cols-5 lg:overflow-visible w-full">
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className={`relative border-2 rounded-2xl p-8 flex flex-col min-w-[320px] snap-center shrink-0 ${plan.color}`}
            >
              {plan.badge && (
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1 whitespace-nowrap ${plan.badgeStyle || 'bg-blue-600'}`}>
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
                href={plan.link}
                className={`inline-flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-xl text-sm transition-all ${plan.buttonStyle}`}
              >
                {plan.name.includes('DIY') ? 'Start ' + plan.name : 'Book a Call'} <ArrowRight className="w-4 h-4" />
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
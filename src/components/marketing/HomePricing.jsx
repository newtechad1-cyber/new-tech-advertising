import React from 'react';
import { CheckCircle, ArrowRight, Zap } from 'lucide-react';

const TRIAL_URL = 'https://app.newtechadvertising.com/start-trial';

const PLANS = [
  {
    name: 'DIY Social',
    price: 97,
    tagline: 'Manage your social media with AI tools',
    badge: 'Best Way to Start',
    color: 'border-blue-200 bg-white hover:border-blue-300',
    buttonStyle: 'bg-blue-600 hover:bg-blue-700 text-white',
    link: '/nta/diy-growth-system?plan=diy_social',
    features: [
      'AI Content Gen (20/mo)',
      'Social Media Planner',
      '3 Social Channels',
      'Content Calendar',
      'Growth Guide Chatbot',
      'Learning Center Access',
      'Email Support',
      'Cancel Anytime'
    ],
  },
  {
    name: 'DIY Marketing Suite',
    price: 197,
    tagline: 'Full marketing + business tools',
    badge: 'Best for Solo Operators',
    color: 'border-violet-500 shadow-xl shadow-violet-600/10 bg-white scale-105 z-10',
    buttonStyle: 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30',
    link: '/nta/diy-growth-system?plan=diy_suite',
    features: [
      'Everything in DIY Social',
      'Full CRM & Client Management',
      'Leads Pipeline & Prospecting',
      'Invoicing & Expenses',
      'Financial Reports (P&L)',
      'Project Tracking',
      '50 AI Posts/mo, 7 Channels',
      'AI Video Studio',
      'Self-Service Gap Audit',
      'Monthly Live Q&A',
      'Priority Support'
    ],
  },
  {
    name: 'Growth Partner',
    price: 297,
    tagline: 'We handle social media + strategy',
    badge: 'Best for Accountability',
    color: 'border-emerald-200 bg-white hover:border-emerald-300',
    buttonStyle: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    link: '/book-call',
    features: [
      '20 Done-For-You Posts/mo',
      '7 Channels Managed',
      'Monthly Strategy Call',
      'SEO + Google Business',
      'Content Calendar DFY',
      'Monthly Performance Report',
      'Dedicated Growth Strategist'
    ],
  },
  {
    name: 'Growth Accelerator',
    price: 497,
    tagline: 'Full content + video + reputation',
    badge: 'Best for Serious Growth',
    color: 'border-amber-200 bg-white hover:border-amber-300',
    buttonStyle: 'bg-amber-600 hover:bg-amber-700 text-white',
    link: '/book-call',
    features: [
      'Everything in Growth Partner',
      'AI Video Production',
      'Reputation & Review Management',
      'Streaming TV Ad Scripts',
      'Bi-weekly Strategy Calls',
      'Unlimited Social Channels',
      'Competitor Analysis'
    ],
  },
  {
    name: 'Full-Stack Growth',
    price: 797,
    tagline: 'Marketing + back-office systems',
    badge: 'The Everything Plan',
    color: 'border-rose-200 bg-white hover:border-rose-300',
    buttonStyle: 'bg-rose-600 hover:bg-rose-700 text-white',
    link: '/book-call',
    features: [
      'Everything in Accelerator',
      'Custom Back-Office App',
      'Automated Invoicing & Dispatch',
      'Weekly Strategy Calls',
      'Custom Automation Workflows',
      'Priority Everything',
      'Quarterly Business Reviews'
    ],
  }
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

        <div className="flex lg:grid lg:grid-cols-5 gap-6 max-w-[90rem] mx-auto overflow-x-auto pb-8 snap-x snap-mandatory">
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className={`relative min-w-[320px] lg:min-w-0 snap-center border-2 rounded-2xl p-8 flex flex-col transition-all duration-300 ${plan.color}`}
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
                href={plan.link || TRIAL_URL}
                className={`inline-flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-xl text-sm transition-all mt-auto ${plan.buttonStyle}`}
              >
                {plan.link?.includes('book-call') ? 'Book a Call' : 'Get Started'} <ArrowRight className="w-4 h-4" />
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
import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PLANS = [
  {
    name: 'DIY Social',
    price: 97,
    badge: 'Best Way to Start',
    description: 'Manage your social media with AI tools',
    cta: 'Start DIY Social',
    ctaDestination: '/nta/diy-growth-system?plan=diy_social',
    features: [
      'AI Content Gen (20 posts)',
      'Social Media Planner',
      '3 Social Channels',
      'Content Calendar',
      'Growth Guide Chatbot',
      'Learning Center Access',
      'Email Support',
      'Cancel Anytime',
    ],
    notIncluded: [],
    featured: false,
  },
  {
    name: 'DIY Marketing Suite',
    price: 197,
    badge: 'Best for Solo Operators',
    description: 'Full marketing + business tools',
    cta: 'Start Marketing Suite',
    ctaDestination: '/nta/diy-growth-system?plan=diy_suite',
    features: [
      'Everything in DIY Social',
      'Full CRM & Management',
      'Leads Pipeline & Prospecting',
      'Invoicing & Expenses',
      'Financial Reports (P&L)',
      'Project Tracking',
      '50 AI Posts/mo',
      '7 Social Channels',
      'AI Video Studio',
      'Self-Service Gap Audit',
      'Monthly Live Q&A',
      'Priority Support',
    ],
    notIncluded: [],
    featured: true,
  },
  {
    name: 'Growth Partner',
    price: 297,
    badge: 'Best for Accountability',
    description: 'We handle social media + strategy',
    cta: 'Book a Call',
    ctaDestination: '/book-call',
    features: [
      '20 Done-For-You Posts/mo',
      '7 Channels Managed',
      'Monthly Strategy Call',
      'SEO + Google Business',
      'Content Calendar DFY',
      'Monthly Performance Report',
      'Dedicated Growth Strategist',
    ],
    notIncluded: [],
    featured: false,
  },
  {
    name: 'Growth Accelerator',
    price: 497,
    badge: 'Best for Serious Growth',
    description: 'Full content + video + reputation',
    cta: 'Book a Call',
    ctaDestination: '/book-call',
    features: [
      'Everything in Growth Partner',
      'AI Video Production',
      'Reputation & Reviews',
      'Streaming TV Ad Scripts',
      'Bi-weekly Strategy Calls',
      'Unlimited Channels',
      'Competitor Analysis',
    ],
    notIncluded: [],
    featured: false,
  },
  {
    name: 'Full-Stack Growth',
    price: 797,
    badge: 'The Everything Plan',
    description: 'Marketing + back-office systems',
    cta: 'Book Strategy Call',
    ctaDestination: '/book-call',
    features: [
      'Everything in Accelerator',
      'Custom Back-Office App',
      'Automated Invoicing & Dispatch',
      'Weekly Strategy Calls',
      'Custom Automation Workflows',
      'Priority Everything',
      'Quarterly Business Reviews',
    ],
    notIncluded: [],
    featured: false,
  },
];

export default function DIYPricingLadder() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Pricing That Scales With You</h1>
          <p className="text-xl text-slate-400">Start small with DIY. Upgrade anytime as you grow.</p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="py-20 px-6 overflow-x-hidden">
        <div className="max-w-[90rem] mx-auto">
          <div className="flex lg:grid lg:grid-cols-5 gap-8 mb-12 overflow-x-auto pb-12 pt-4 px-4 snap-x snap-mandatory">
            {PLANS.map((plan, idx) => (
              <div
                key={idx}
                className={`min-w-[320px] lg:min-w-0 snap-center rounded-lg border transition-all flex flex-col ${
                  plan.featured
                    ? 'bg-gradient-to-b from-violet-600/20 to-indigo-600/10 border-violet-600/50 scale-105 shadow-2xl z-10'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="px-6 pt-6">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      plan.featured
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-white">
                      ${plan.price}
                      <span className="text-lg text-slate-400">/month</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <a href={plan.ctaDestination}>
                    <Button
                      className={`w-full mb-6 ${
                        plan.featured
                          ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </a>

                  {/* Features */}
                  <div className="space-y-3 flex-1">
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Not Included */}
                  {plan.notIncluded.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-700">
                      <p className="text-xs text-slate-500 mb-3">Not Included</p>
                      <div className="space-y-2">
                        {plan.notIncluded.map((notIncluded, niIdx) => (
                          <div key={niIdx} className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border border-slate-600" />
                            <span className="text-slate-500 text-xs">{notIncluded}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Upgrade Paths */}
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-8 mt-16">
            <h3 className="text-2xl font-bold text-white mb-6">Upgrade Path</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold">1</div>
                <div>
                  <p className="text-white font-semibold">Start with DIY</p>
                  <p className="text-slate-400 text-sm">Get familiar with the platform and see results</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold">2</div>
                <div>
                  <p className="text-white font-semibold">Upgrade to Guided Growth</p>
                  <p className="text-slate-400 text-sm">Add strategy help when you're ready to accelerate</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold">3</div>
                <div>
                  <p className="text-white font-semibold">Move to Done-For-You</p>
                  <p className="text-slate-400 text-sm">Let our team handle execution while you focus on the business</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
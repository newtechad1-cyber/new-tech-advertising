import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PLANS = [
  {
    name: 'DIY',
    price: 99,
    badge: 'Best Way to Start',
    description: 'For businesses doing their own marketing with NTA tools',
    cta: 'Start DIY Plan',
    ctaDestination: '/nta/diy-growth-system',
    features: [
      'AI Content Generation',
      'Social Media Planner',
      'AI Video Studio',
      'Lead Tracker',
      'ROI Dashboard',
      'Email Support',
      'Cancel Anytime',
    ],
    notIncluded: [
      'Strategy Guidance',
      'Priority Support',
      'Dedicated Account Manager',
    ],
    featured: true,
  },
  {
    name: 'Guided Growth',
    price: 299,
    badge: 'Best for Accountability',
    description: 'DIY tools + monthly strategy help and coaching',
    cta: 'Upgrade to Guided Growth',
    ctaDestination: 'mailto:sales@newtechadvertising.com?subject=Guided Growth Plan',
    features: [
      'Everything in DIY',
      'Monthly Strategy Calls',
      'Personalized Growth Plan',
      'Priority Email Support',
      'Performance Reviews',
      'Upgrade Path to DFY',
    ],
    notIncluded: [
      'Content Execution',
      'Video Production',
      'Dedicated Team',
    ],
    featured: false,
  },
  {
    name: 'Done-For-You',
    price: 1200,
    badge: 'Best for Busy Owners',
    description: 'We handle all the marketing execution for you',
    cta: 'Explore Done-For-You',
    ctaDestination: 'mailto:sales@newtechadvertising.com?subject=Done-For-You Marketing',
    features: [
      'Content & Video Creation',
      'Social Media Management',
      'Website Optimization',
      'SEO Strategy',
      'Monthly Reports',
      'Dedicated Account Manager',
      'Strategy & Execution',
    ],
    notIncluded: [],
    featured: false,
  },
  {
    name: 'Premium Authority',
    price: 3000,
    badge: 'Best for Aggressive Growth',
    description: 'Full marketing dominance in your market',
    cta: 'Schedule Consultation',
    ctaDestination: 'https://calendar.app.google/p6ieYanvwhixXxZ67',
    features: [
      'Everything in Done-For-You',
      'Streaming TV Advertising',
      'Premium Visibility Stack',
      'High-Authority Media Assets',
      'Market Dominance Strategy',
      'Dedicated Growth Team',
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
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {PLANS.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-lg border transition-all ${
                  plan.featured
                    ? 'bg-gradient-to-b from-violet-600/20 to-indigo-600/10 border-violet-600/50 scale-105 shadow-2xl'
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
                  <div className="space-y-3">
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
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
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-8 mt-16">
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
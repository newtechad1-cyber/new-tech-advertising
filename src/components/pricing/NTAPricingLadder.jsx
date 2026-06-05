import React, { useState } from 'react';
import { Check, ArrowRight, Crown, Zap, Target, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TIERS = [
  {
    id: 'diy_social',
    name: 'DIY Social',
    price: 97,
    tag: 'Best Way to Start',
    phase: 'Start',
    icon: Target,
    tagBg: 'bg-blue-500/10 border-blue-500/30',
    tagText: 'text-blue-300',
    description: 'Manage your social media with AI tools',
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
    cta: 'Start DIY Social',
    ctaVariant: 'default',
    highlight: false,
  },
  {
    id: 'diy_suite',
    name: 'DIY Marketing Suite',
    price: 197,
    tag: 'Best for Solo Operators',
    phase: 'Accelerate',
    icon: Zap,
    tagBg: 'bg-violet-500/10 border-violet-500/30',
    tagText: 'text-violet-300',
    description: 'Full marketing + business tools — run everything yourself',
    features: [
      'Everything in DIY Social',
      'Full CRM & Client Management',
      'Leads Pipeline & Prospecting',
      'Invoicing & Expense Tracking',
      'Financial Reports (P&L)',
      'Project Tracking',
      '50 AI Posts/mo',
      '7 Social Channels',
      'AI Video Studio',
      'Self-Service Gap Audit',
      'Monthly Live Q&A',
      'Priority Support'
    ],
    cta: 'Start Marketing Suite',
    ctaVariant: 'default',
    highlight: true,
  },
  {
    id: 'growth_partner',
    name: 'Growth Partner',
    price: 297,
    tag: 'Best for Accountability',
    phase: 'Partner',
    icon: Rocket,
    tagBg: 'bg-emerald-500/10 border-emerald-500/30',
    tagText: 'text-emerald-300',
    description: 'We handle social media + strategy — you focus on your business',
    features: [
      '20 Done-For-You Social Posts/mo',
      '7 Channels Managed',
      'Monthly Strategy Call',
      'SEO + Google Business Optimization',
      'Content Calendar Done For You',
      'Monthly Performance Report',
      'Dedicated Growth Strategist'
    ],
    cta: 'Book a Call',
    ctaVariant: 'outline',
    highlight: false,
  },
  {
    id: 'growth_accelerator',
    name: 'Growth Accelerator',
    price: 497,
    tag: 'Best for Serious Growth',
    phase: 'Dominate',
    icon: Crown,
    tagBg: 'bg-amber-500/10 border-amber-500/30',
    tagText: 'text-amber-300',
    description: 'Full content + video + reputation managed for you',
    features: [
      'Everything in Growth Partner',
      'AI Video Production',
      'Reputation & Review Management',
      'Streaming TV Ad Scripts',
      'Bi-weekly Strategy Calls',
      'Unlimited Social Channels',
      'Competitor Analysis'
    ],
    cta: 'Book a Call',
    ctaVariant: 'outline',
    highlight: false,
  },
  {
    id: 'full_stack',
    name: 'Full-Stack Growth',
    price: 797,
    tag: 'The Everything Plan',
    phase: 'Scale',
    icon: Crown,
    tagBg: 'bg-rose-500/10 border-rose-500/30',
    tagText: 'text-rose-300',
    description: 'Marketing + back-office systems + custom automations',
    features: [
      'Everything in Accelerator',
      'Custom Back-Office App',
      'Automated Invoicing & Dispatch',
      'Weekly Strategy Calls',
      'Custom Automation Workflows',
      'Priority Everything',
      'Quarterly Business Reviews'
    ],
    cta: 'Book Strategy Call',
    ctaVariant: 'outline',
    highlight: false,
  },
];

export default function NTAPricingLadder({
  currentPlan = null,
  onSelectPlan = () => {},
  showPhases = true,
  compact = false,
}) {
  const [hoveredTier, setHoveredTier] = useState(null);

  const handleCTA = (tierId) => {
    onSelectPlan(tierId);
  };

  if (compact) {
    return (
      <div className="space-y-3">
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`p-4 rounded-lg border transition-all ${
              currentPlan === tier.id
                ? 'bg-slate-800/50 border-violet-500/50'
                : 'bg-slate-800/30 border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold">{tier.name}</h3>
                <p className="text-slate-400 text-sm">${tier.price}/mo</p>
              </div>
              {currentPlan === tier.id && (
                <span className="text-violet-400 font-semibold text-sm">Current</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Phase Timeline */}
      {showPhases && (
        <div className="mb-12">
          <div className="flex justify-between items-center">
            {TIERS.map((tier, idx) => (
              <div key={tier.id} className="flex items-center flex-1">
                <div className="text-center flex-1">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${
                    tier.highlight
                      ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400'
                  } mb-2`}>
                    <tier.icon className="w-6 h-6" />
                  </div>
                  <p className={`text-sm font-bold ${tier.highlight ? 'text-white' : 'text-slate-400'}`}>
                    {tier.phase}
                  </p>
                </div>
                {idx < TIERS.length - 1 && (
                  <div className="flex-1 h-1 bg-slate-800 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="flex overflow-x-auto pb-6 snap-x snap-mandatory gap-4 md:grid md:grid-cols-5 md:overflow-visible">
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            onMouseEnter={() => setHoveredTier(tier.id)}
            onMouseLeave={() => setHoveredTier(null)}
            className={`rounded-xl border transition-all duration-300 overflow-hidden min-w-[280px] snap-center shrink-0 ${
              tier.highlight
                ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-violet-500/50 ring-2 ring-violet-500/20 scale-105'
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
            } ${hoveredTier === tier.id && !tier.highlight ? 'border-slate-600' : ''}`}
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                  <p className="text-slate-400 text-xs mt-1">{tier.phase}</p>
                </div>
                {tier.highlight && <Crown className="w-5 h-5 text-violet-400" />}
              </div>

              {/* Tag */}
              <div className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold mb-3 ${tier.tagBg} ${tier.tagText}`}>
                {tier.tag}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-white">${tier.price}</span>
                <span className="text-slate-400 text-sm">/mo{tier.priceTag}</span>
              </div>

              <p className="text-slate-400 text-sm">{tier.description}</p>
            </div>

            {/* Features */}
            <div className="p-6 border-b border-slate-800">
              <ul className="space-y-3">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      tier.highlight ? 'text-violet-400' : 'text-slate-400'
                    }`} />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="p-6">
              <Button
                onClick={() => handleCTA(tier.id)}
                className={`w-full flex items-center justify-center gap-2 py-3 font-bold rounded-lg transition-all ${
                  tier.highlight
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white'
                    : tier.ctaVariant === 'outline'
                    ? 'bg-slate-800 border border-slate-700 text-white hover:bg-slate-700'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                {tier.cta}
                <ArrowRight className="w-4 h-4" />
              </Button>

              {currentPlan === tier.id && (
                <p className="text-center text-violet-400 text-xs font-semibold mt-3">
                  ✓ Current Plan
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ROI Guidance */}
      <div className="mt-8 bg-slate-900/50 border border-slate-800 rounded-lg p-6">
        <h3 className="text-white font-bold mb-4">Why the pricing ladder?</h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <p className="text-slate-400 text-sm mb-2">
              <span className="text-white font-semibold">DIY:</span> Perfect for learning and testing
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-2">
              <span className="text-white font-semibold">Guided:</span> For 2x growth with support
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-2">
              <span className="text-white font-semibold">Done-For-You:</span> For 5x growth, we execute
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-2">
              <span className="text-white font-semibold">Authority:</span> For market dominance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
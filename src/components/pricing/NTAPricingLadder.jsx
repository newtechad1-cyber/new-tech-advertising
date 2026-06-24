import React, { useState } from 'react';
import { Check, ArrowRight, Crown, Zap, Target, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TIERS = [
  {
    id: 'foundation_launch',
    name: 'Foundation Launch',
    price: 297,
    setupFee: 397,
    tag: 'Best Way to Start',
    phase: 'Foundation',
    icon: Target,
    tagBg: 'bg-blue-500/10 border-blue-500/30',
    tagText: 'text-blue-300',
    description: 'For businesses with no website or a weak online foundation.',
    features: [
      'Website setup/rebuild',
      'Domain & hosting guidance',
      'Google Business Profile setup',
      'Contact forms & core pages',
      'Basic local SEO',
      'Monthly website upkeep',
      'Email support'
    ],
    cta: 'Start Foundation Launch',
    ctaVariant: 'default',
    highlight: false,
  },
  {
    id: 'visibility_growth',
    name: 'Visibility Growth',
    price: 397,
    setupFee: 497,
    tag: 'Consistent Growth',
    phase: 'Visibility',
    icon: Zap,
    tagBg: 'bg-violet-500/10 border-violet-500/30',
    tagText: 'text-violet-300',
    description: 'For businesses with a website that need to be found consistently.',
    features: [
      'Everything in Foundation PLUS:',
      'Visibility Audit',
      'SEO improvements',
      'Monthly content & social posting',
      'Review monitoring',
      'Monthly reporting',
      'Ongoing website improvements'
    ],
    cta: 'Start Visibility Growth',
    ctaVariant: 'default',
    highlight: true,
  },
  {
    id: 'authority_builder',
    name: 'Authority Builder',
    price: 597,
    setupFee: 697,
    tag: 'Build Trust',
    phase: 'Authority',
    icon: Crown,
    tagBg: 'bg-emerald-500/10 border-emerald-500/30',
    tagText: 'text-emerald-300',
    description: 'Deeper content, reputation building, and community credibility.',
    features: [
      'Everything in Visibility PLUS:',
      'Deeper content strategy',
      'Proactive review campaigns',
      'Service-area authority',
      'AI video & content assets',
      'Community credibility building',
      'Monthly strategy review'
    ],
    cta: 'Build Your Authority',
    ctaVariant: 'outline',
    highlight: false,
  },
  {
    id: 'market_leader',
    name: 'Market Leader',
    price: 897,
    setupFee: 997,
    tag: 'Dominate Market',
    phase: 'Leadership',
    icon: Rocket,
    tagBg: 'bg-amber-500/10 border-amber-500/30',
    tagText: 'text-amber-300',
    description: 'Competitive tracking, video strategy, and advanced local SEO.',
    features: [
      'Everything in Authority PLUS:',
      'Competitive tracking & analysis',
      'Stronger content volume',
      'Streaming/video strategy',
      'Advanced local SEO campaigns',
      'Quarterly campaign planning',
      'Growth consulting'
    ],
    cta: 'Become a Leader',
    ctaVariant: 'outline',
    highlight: false,
  },
  {
    id: 'elevate',
    name: 'Elevate',
    price: 1497,
    setupFee: 1597,
    tag: 'Full Automation',
    phase: 'Elevate',
    icon: Crown,
    tagBg: 'bg-rose-500/10 border-rose-500/30',
    tagText: 'text-rose-300',
    description: 'Custom AI workflows, CRM, and sales automation.',
    features: [
      'Everything in Market Leader PLUS:',
      'Custom AI workflows',
      'CRM & sales automation',
      'Internal process automation',
      'Lead follow-up systems',
      'Strategic business consulting',
      'Dedicated operations lead'
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
      <div className="flex flex-col md:grid md:grid-cols-2 lg:flex lg:flex-row lg:flex-wrap lg:justify-center gap-6 pb-6 items-stretch">
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            onMouseEnter={() => setHoveredTier(tier.id)}
            onMouseLeave={() => setHoveredTier(null)}
            className={`rounded-xl border transition-all duration-300 flex flex-col overflow-hidden w-full lg:w-[calc(33.333%-16px)] xl:w-[calc(20%-19.2px)] ${
              tier.highlight
                ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-violet-500/50 ring-2 ring-violet-500/20 md:col-span-2 md:order-first lg:order-none lg:scale-105 z-10'
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
            } ${hoveredTier === tier.id && !tier.highlight ? 'border-slate-600' : ''}`}
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-800">
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
              <div className="flex flex-col gap-1 mb-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">${tier.price}</span>
                  <span className="text-slate-400 text-sm">/mo{tier.priceTag}</span>
                </div>
                {tier.setupFee && <span className="text-slate-500 text-xs">+ ${tier.setupFee} setup</span>}
              </div>

              <p className="text-slate-400 text-sm">{tier.description}</p>
            </div>

            {/* Features */}
            <div className="p-5 border-b border-slate-800 flex-1">
              <ul className="space-y-3">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                      tier.highlight ? 'text-violet-400' : 'text-slate-400'
                    }`} />
                    <span className="text-slate-300 leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="p-5 mt-auto">
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
        <p className="text-slate-300 font-medium">
          <span className="text-white font-bold">A note on advertising:</span> Advertising is not a magic bullet. Growth comes from consistency, clear messaging, and a long-term commitment. Most clients should plan on at least 3 to 6 months, with 12 months being ideal for building real momentum.
        </p>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Zap, Users, Crown } from 'lucide-react';

const UPGRADE_LEVELS = [
  {
    id: 'diy',
    name: 'DIY',
    monthlyPrice: '$99',
    tagline: 'Self-service marketing growth',
    icon: Zap,
    color: 'blue',
    badgeText: 'You are here',
    badgeColor: 'bg-blue-600',
    features: [
      'AI content generation',
      'Marketing calendar',
      'Social automation',
      'Basic analytics',
      'Community support'
    ],
    bestFor: 'Hands-on entrepreneurs who like building their own strategy'
  },
  {
    id: 'guided',
    name: 'Guided Growth',
    monthlyPrice: '$499',
    tagline: 'Human strategy + AI execution',
    icon: Users,
    color: 'purple',
    features: [
      'Everything in DIY',
      'Strategy consultation',
      'Growth planning',
      'Campaign optimization',
      'Priority support'
    ],
    bestFor: 'Growth-focused businesses ready to accelerate with expert guidance'
  },
  {
    id: 'done_for_you',
    name: 'Done-For-You',
    monthlyPrice: '$1,999+',
    tagline: 'Full-service marketing on demand',
    icon: Crown,
    color: 'emerald',
    features: [
      'Everything in Guided',
      'Content creation',
      'Campaign management',
      'Lead nurturing',
      'Dedicated strategist'
    ],
    bestFor: 'Busy owners ready to offload marketing completely'
  },
  {
    id: 'premium',
    name: 'Premium',
    monthlyPrice: 'Custom',
    tagline: 'Enterprise marketing suite',
    icon: Crown,
    color: 'amber',
    features: [
      'Everything in Done-For-You',
      'Custom integrations',
      'Team training',
      'White-label options',
      'Direct executive access'
    ],
    bestFor: 'Large teams needing enterprise-level solutions'
  }
];

export default function DIYUpgradePath() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section className="py-16 px-6 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Grow at Your Pace
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Start with DIY and upgrade when you're ready. No contracts. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {UPGRADE_LEVELS.map((level) => {
            const Icon = level.icon;
            const isHovered = hoveredId === level.id;
            const isCurrent = level.id === 'diy';

            return (
              <div
                key={level.id}
                onMouseEnter={() => setHoveredId(level.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative"
              >
                <Card
                  className={`
                    h-full transition-all duration-300 border-2
                    ${isCurrent
                      ? 'border-blue-500 bg-blue-950/20'
                      : isHovered
                      ? 'border-slate-500 bg-slate-800'
                      : 'border-slate-700 bg-slate-800/50'
                    }
                  `}
                >
                  {/* Current Badge */}
                  {isCurrent && (
                    <div className="absolute -top-3 left-6">
                      <Badge className={`${level.badgeColor} text-white text-xs`}>
                        {level.badgeText}
                      </Badge>
                    </div>
                  )}

                  <CardContent className="p-6 space-y-4 flex flex-col h-full">
                    {/* Icon + Name */}
                    <div className="space-y-2">
                      <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {level.name}
                      </h3>
                      <p className="text-xs text-slate-400 italic">
                        {level.tagline}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="pt-2 border-t border-slate-700">
                      <div className="text-2xl font-bold text-white">
                        {level.monthlyPrice}
                      </div>
                      {level.monthlyPrice !== 'Custom' && (
                        <div className="text-xs text-slate-500">/month</div>
                      )}
                    </div>

                    {/* Best For */}
                    <div className="bg-slate-700/50 rounded p-3">
                      <p className="text-xs text-slate-300 leading-relaxed">
                        <span className="font-semibold text-slate-200">Best for: </span>
                        {level.bestFor}
                      </p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-2 flex-1">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Includes:
                      </p>
                      <ul className="space-y-1.5">
                        {level.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs text-slate-300"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    {isCurrent && (
                      <div className="pt-4 border-t border-slate-700">
                        <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                          Get Started
                        </button>
                      </div>
                    )}
                    {!isCurrent && (
                      <div className="pt-4 border-t border-slate-700">
                        <button className="w-full px-4 py-2 bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg hover:bg-slate-600 transition-colors">
                          Learn More
                        </button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Arrow connector (hide on last) */}
                {level.id !== 'premium' && (
                  <div className="hidden lg:flex absolute -right-2 top-1/3 z-10 text-slate-600 text-xl">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="mt-10 text-center bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-300 text-sm">
            <span className="font-semibold">Pro Tip:</span> Start with DIY and upgrade to Guided or Done-For-You whenever you're ready. Most successful users upgrade after seeing their first 30 days of results.
          </p>
        </div>
      </div>
    </section>
  );
}
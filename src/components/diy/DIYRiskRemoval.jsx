import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Lock, RotateCcw, Heart } from 'lucide-react';

const RISK_REMOVALS = [
  {
    icon: RotateCcw,
    title: 'Cancel Anytime',
    description: 'No long-term contracts. If DIY isn\'t for you, cancel in 30 seconds. Your data is yours.',
    color: 'text-blue-400'
  },
  {
    icon: Lock,
    title: 'No Contracts',
    description: 'Month-to-month only. Change plans or cancel without penalties, hidden fees, or blame.',
    color: 'text-green-400'
  },
  {
    icon: Heart,
    title: 'Small Business Friendly',
    description: 'Built for solo founders and small teams. Pricing scales with you. No enterprise minimums.',
    color: 'text-pink-400'
  },
  {
    icon: CheckCircle,
    title: 'Upgrade Only When Ready',
    description: 'Master DIY first. Upgrade to guided or done-for-you only when you\'re ready to scale faster.',
    color: 'text-purple-400'
  }
];

export default function DIYRiskRemoval() {
  return (
    <section className="py-16 px-6 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-900/30 text-emerald-400 px-4 py-2 rounded-full mb-4">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">RISK REMOVAL GUARANTEE</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Zero Risk. Start Small. Grow Your Way.
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            We've removed every barrier to getting started. You're in control of your marketing and your commitment.
          </p>
        </div>

        {/* Risk Removals Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {RISK_REMOVALS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card
                key={idx}
                className="bg-slate-900 border-slate-700 hover:border-emerald-600/30 transition-all"
              >
                <CardContent className="p-6 space-y-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Trust Banner */}
        <div className="mt-12 bg-gradient-to-r from-emerald-900/20 to-blue-900/20 border border-emerald-700/30 rounded-lg p-8 text-center space-y-3">
          <Badge className="bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 mx-auto">
            Trusted by 5,000+ small business owners
          </Badge>
          <h3 className="text-xl font-semibold text-white">
            Start Your Risk-Free Growth Journey
          </h3>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
            Join other small business owners using the DIY Growth System to build consistent marketing presence, attract leads, and scale their revenue—all on their own terms.
          </p>
        </div>
      </div>
    </section>
  );
}
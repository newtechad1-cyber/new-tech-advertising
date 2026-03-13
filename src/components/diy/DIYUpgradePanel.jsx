import React from 'react';
import { CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DIYUpgradePanel({ onUpgradeClick, subscription }) {
  return (
    <section className="bg-gradient-to-r from-indigo-600/15 to-blue-600/15 border border-indigo-600/30 rounded-xl p-8 mb-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Current Plan */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">You're on DIY</h3>
          <div className="space-y-3">
            {[
              'AI content generation tools',
              'Weekly marketing direction',
              'Lead & ROI tracking',
              'Community & knowledge base',
              'Email support',
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-slate-300">{feature}</span>
              </div>
            ))}
          </div>
          <p className="text-slate-400 text-sm mt-6">
            <span className="text-white font-semibold">$99/month</span> • Cancel anytime
          </p>
        </div>

        {/* Upgrade to Guided Growth */}
        <div className="bg-gradient-to-br from-indigo-600/20 to-blue-600/20 border border-indigo-600/40 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h4 className="text-lg font-bold text-white">Guided Growth (Recommended)</h4>
          </div>

          <p className="text-slate-300 text-sm mb-6">
            Everything in DIY, plus:
          </p>

          <ul className="space-y-3 mb-6">
            {[
              '1-on-1 strategy calls',
              'Dedicated growth strategist',
              'Monthly performance reviews',
              'Advanced AI features',
              'Priority support',
            ].map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span className="text-white text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mb-6">
            <p className="text-indigo-300 text-xs font-semibold mb-1">PRICING</p>
            <p className="text-white text-2xl font-bold">
              $499<span className="text-lg text-slate-400">/month</span>
            </p>
            <p className="text-slate-400 text-xs mt-2">First month includes strategy audit</p>
          </div>

          <Button
            onClick={onUpgradeClick}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2"
          >
            Upgrade Now
            <ArrowRight className="w-4 h-4" />
          </Button>

          <p className="text-slate-400 text-xs text-center mt-4">
            Perfect for businesses ready to accelerate their growth
          </p>
        </div>
      </div>
    </section>
  );
}
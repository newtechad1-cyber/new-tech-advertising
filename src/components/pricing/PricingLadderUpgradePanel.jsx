import React from 'react';
import { ArrowRight, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUpgradeCTA, getPlanTransitionDescription } from './PricingLadderUpgradeLogic';

export default function PricingLadderUpgradePanel({ 
  currentPlan = 'diy',
  readinessScore = 60,
  priority = 'medium',
  nextPlan = 'guided',
  onUpgrade = () => {},
  compact = false,
}) {
  if (readinessScore < 40) return null;

  const cta = getUpgradeCTA(currentPlan);
  const transition = getPlanTransitionDescription(currentPlan, nextPlan);

  if (!cta || !transition) return null;

  if (compact) {
    return (
      <div className={`rounded-lg border p-4 ${
        priority === 'high' 
          ? 'bg-violet-600/15 border-violet-500/30' 
          : 'bg-slate-800/30 border-slate-700'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-sm">{transition.title}</p>
            <p className="text-slate-400 text-xs mt-1">{transition.description}</p>
          </div>
          <Button
            onClick={() => {
              if (cta.action === 'contact') {
                window.location.href = cta.href;
              } else if (cta.action === 'schedule') {
                window.location.href = cta.href;
              } else {
                onUpgrade(nextPlan);
              }
            }}
            className={`flex-shrink-0 ml-4 ${
              priority === 'high'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700'
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
            size="sm"
          >
            {cta.text}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border overflow-hidden transition-all ${
      priority === 'high'
        ? 'bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border-violet-500/30 ring-2 ring-violet-500/10'
        : 'bg-slate-900/50 border-slate-800'
    }`}>
      {/* Header */}
      <div className={`px-6 py-4 border-b ${priority === 'high' ? 'border-violet-500/20' : 'border-slate-800'}`}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-yellow-400" />
              <p className="text-slate-400 text-sm">Ready for next step?</p>
            </div>
            <h3 className="text-2xl font-bold text-white">{transition.title}</h3>
          </div>
          {priority === 'high' && (
            <div className="bg-violet-600 text-white px-3 py-1 rounded-full text-xs font-bold">
              Recommended
            </div>
          )}
        </div>
        <p className="text-slate-300">{transition.description}</p>
      </div>

      {/* Benefits */}
      <div className="px-6 py-4 border-b border-slate-800">
        <p className="text-slate-400 text-sm font-semibold mb-3">What you'll get:</p>
        <ul className="space-y-2">
          {transition.benefits.map((benefit, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${priority === 'high' ? 'bg-violet-400' : 'bg-slate-400'}`} />
              <span className="text-slate-300 text-sm">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Readiness Score */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/30">
        <div className="flex items-center justify-between mb-2">
          <p className="text-slate-400 text-sm">Your upgrade readiness</p>
          <p className="text-white font-bold">{readinessScore}%</p>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${priority === 'high' ? 'bg-violet-500' : 'bg-slate-500'}`}
            style={{ width: `${readinessScore}%` }}
          />
        </div>
        <p className="text-slate-500 text-xs mt-2">
          {readinessScore >= 75
            ? "You're ready to level up now!"
            : readinessScore >= 50
            ? 'You\'re on track. Upgrade soon.'
            : 'Keep building momentum before upgrading.'}
        </p>
      </div>

      {/* CTA */}
      <div className="px-6 py-4">
        <Button
          onClick={() => {
            if (cta.action === 'contact' || cta.action === 'schedule') {
              window.location.href = cta.href;
            } else {
              onUpgrade(nextPlan);
            }
          }}
          className={`w-full flex items-center justify-center gap-2 py-3 font-bold rounded-lg ${
            priority === 'high'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white'
              : 'bg-slate-700 hover:bg-slate-600 text-white'
          }`}
        >
          {cta.text}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
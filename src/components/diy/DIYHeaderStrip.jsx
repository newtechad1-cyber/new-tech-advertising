import React from 'react';
import { TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DIYHeaderStrip({ subscription, onUpgradeClick }) {
  // Calculate momentum score (0-100) based on activity
  const calculateMomentumScore = () => {
    let score = 50; // base score
    if (subscription?.onboarding_completed) score += 15;
    if (subscription?.campaign_id) score += 15;
    if (subscription?.marketing_goals) score += 10;
    if (subscription?.website_url) score += 10;
    return Math.min(score, 100);
  };

  const momentumScore = calculateMomentumScore();
  const scoreColor = momentumScore >= 75 ? 'text-green-400' : momentumScore >= 50 ? 'text-yellow-400' : 'text-orange-400';

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Welcome + Business Name */}
          <div>
            <p className="text-slate-400 text-sm mb-1">Welcome back,</p>
            <h1 className="text-2xl font-bold text-white">
              {subscription?.business_name || 'Your Business'}
            </h1>
          </div>

          {/* Momentum Score */}
          <div className="flex items-center gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 min-w-48">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-sm font-semibold">Growth Momentum</p>
                <TrendingUp className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-bold ${scoreColor}`}>
                  {momentumScore}
                </span>
                <span className="text-slate-500 text-sm">/100</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5 mt-3">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    momentumScore >= 75
                      ? 'bg-green-500'
                      : momentumScore >= 50
                      ? 'bg-yellow-500'
                      : 'bg-orange-500'
                  }`}
                  style={{ width: `${momentumScore}%` }}
                />
              </div>
            </div>

            {/* Plan Badge */}
            <div className="bg-violet-600/20 border border-violet-600/50 rounded-lg px-4 py-3">
              <p className="text-violet-300 text-xs font-semibold mb-1">CURRENT PLAN</p>
              <p className="text-white font-bold text-lg">DIY Growth System</p>
              <p className="text-violet-400 text-sm">$99/month</p>
            </div>

            {/* Upgrade CTA */}
            <Button
              onClick={onUpgradeClick}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Upgrade Plan
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
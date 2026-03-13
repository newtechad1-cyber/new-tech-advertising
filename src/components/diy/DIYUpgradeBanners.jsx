import React, { useState } from 'react';
import { X, AlertCircle, TrendingUp, Zap, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  calculateUpgradeReadinessAndSignals,
  getUpgradeMessage,
} from './ntaUpgradeRecommendationEngine';

const SIGNAL_ICONS = {
  low_momentum_risk: AlertCircle,
  high_effort_low_execution: Zap,
  lead_momentum: TrendingUp,
  time_constraint_pattern: Clock,
  aggressive_growth_intent: Target,
};

export default function DIYUpgradeBanners({
  subscription,
  growthStage,
  onUpgradeClick,
  onDismiss,
}) {
  const [dismissed, setDismissed] = useState([]);

  if (!subscription || !growthStage) return null;

  const analysis = calculateUpgradeReadinessAndSignals(subscription, growthStage);

  if (!analysis.shouldShowAlert || !analysis.primarySignal) return null;

  // Don't show if already dismissed
  if (dismissed.includes(analysis.primarySignal)) return null;

  const message = getUpgradeMessage(analysis.primarySignal);
  const SignalIcon = SIGNAL_ICONS[analysis.primarySignal] || AlertCircle;

  const handleDismiss = () => {
    setDismissed([...dismissed, analysis.primarySignal]);
    onDismiss?.(analysis.primarySignal);
  };

  const priorityStyles = {
    critical: 'bg-red-500/10 border-red-500/30',
    high: 'bg-orange-500/10 border-orange-500/30',
    medium: 'bg-amber-500/10 border-amber-500/30',
  };

  return (
    <div
      className={`relative rounded-lg border p-4 mb-6 flex gap-4 ${
        priorityStyles[analysis.alertPriority] || priorityStyles.medium
      }`}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-1">
        <SignalIcon className="w-5 h-5 text-white" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white mb-1">{message.title}</h3>
        <p className="text-sm text-slate-300 mb-4">{message.body}</p>

        {/* Readiness Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400">Upgrade Readiness</span>
            <span className="text-xs font-semibold text-white">
              {analysis.readinessScore}/100
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all ${
                analysis.readinessScore >= 70
                  ? 'bg-green-500'
                  : analysis.readinessScore >= 50
                  ? 'bg-amber-500'
                  : 'bg-slate-500'
              }`}
              style={{ width: `${analysis.readinessScore}%` }}
            />
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => onUpgradeClick?.(analysis.recommendedPlan)}
          size="sm"
          className="bg-white text-slate-900 hover:bg-slate-100 font-semibold"
        >
          {message.cta}
        </Button>
      </div>

      {/* Close Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
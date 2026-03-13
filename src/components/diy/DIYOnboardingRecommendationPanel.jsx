import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DIYOnboardingRecommendationPanel({
  recommendation = null,
  insight = null,
  onContinue = () => {},
}) {
  if (!recommendation) return null;

  const colorMap = {
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      badge: 'bg-blue-600',
      text: 'text-blue-300',
    },
    violet: {
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/30',
      badge: 'bg-violet-600',
      text: 'text-violet-300',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      badge: 'bg-amber-600',
      text: 'text-amber-300',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      badge: 'bg-emerald-600',
      text: 'text-emerald-300',
    },
  };

  const colors = colorMap[recommendation.color] || colorMap.blue;

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-xl p-8`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-4xl mb-2">{recommendation.emoji}</div>
            <h2 className="text-2xl font-bold text-white">{recommendation.headline}</h2>
          </div>
          {recommendation.subMessage && (
            <div className={`${colors.badge} text-white px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap`}>
              {recommendation.subMessage}
            </div>
          )}
        </div>
        <p className="text-slate-300 text-lg">{recommendation.message}</p>
      </div>

      {/* Insight */}
      {insight && (
        <div className="bg-slate-800/50 rounded-lg p-4 mb-6 border border-slate-700">
          <p className="text-slate-200 text-sm">
            <span className="font-semibold">💡 Key Insight:</span> {insight}
          </p>
        </div>
      )}

      {/* Benefits */}
      {recommendation.benefits && (
        <div className="mb-6">
          <p className="text-slate-400 text-sm font-semibold mb-3">What you'll get:</p>
          <ul className="space-y-2">
            {recommendation.benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <Check className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
                <span className="text-slate-300">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <div className="flex gap-3">
        <Button
          onClick={() => window.location.href = recommendation.ctaHref}
          className={`${colors.badge} hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2`}
        >
          {recommendation.cta}
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Button
          onClick={onContinue}
          variant="outline"
          className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 font-bold py-3 px-6 rounded-lg"
        >
          Continue to Dashboard
        </Button>
      </div>
    </div>
  );
}
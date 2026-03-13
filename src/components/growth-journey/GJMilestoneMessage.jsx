import React, { useState } from 'react';
import { MessageSquare, X, TrendingUp, Zap, Rocket, Crown } from 'lucide-react';

const STAGE_ICONS = { launch_confidence: Zap, momentum_reinforcement: TrendingUp, growth_expansion: Rocket, market_leadership: Crown };
const STAGE_COLORS = { launch_confidence: '#3b82f6', momentum_reinforcement: '#8b5cf6', growth_expansion: '#f59e0b', market_leadership: '#10b981' };

const MESSAGES = {
  launch_confidence: {
    headline: 'Your authority system is building momentum.',
    body: 'Every article published, every social post distributed, and every keyword your brand now ranks for is expanding your digital footprint in a way your competitors have not matched. This compounding foundation is precisely what transforms good businesses into recognized market authorities.',
    cta: 'View your content going live',
  },
  momentum_reinforcement: {
    headline: 'Your visibility is measurably growing.',
    body: 'The consistency you have maintained is producing compounding returns. Search visibility is rising, brand recognition is strengthening, and the market is beginning to associate your name with authority in your category. This is exactly where momentum becomes market advantage.',
    cta: 'Review your visibility progress',
  },
  growth_expansion: {
    headline: 'Your authority has earned expansion opportunity.',
    body: 'The market position you have built creates real leverage for growth. Businesses at your stage that extend their authority reach — through additional channels, geographic markets, or content velocity — consistently see accelerated returns on their existing investment.',
    cta: 'Explore your growth options',
  },
  market_leadership: {
    headline: 'You are operating as a market authority.',
    body: 'Your consistent investment in authority content has placed your business in a category that most competitors cannot reach. The strategic question now is not whether to grow — it is which growth channels to activate in what sequence to maximize your leadership position.',
    cta: 'Schedule your strategic review',
  },
};

export default function GJMilestoneMessage({ currentStage, onDismiss, onCTA }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const msg = MESSAGES[currentStage];
  const Icon = STAGE_ICONS[currentStage] || Zap;
  const color = STAGE_COLORS[currentStage] || '#3b82f6';
  if (!msg) return null;

  return (
    <div className="relative rounded-2xl p-5 border-2" style={{ borderColor: color + '30', background: color + '08' }}>
      <button onClick={() => { setDismissed(true); onDismiss?.(); }}
        className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/50 transition-colors text-slate-400">
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: color + '20' }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="flex-1 pr-6">
          <p className="font-black text-slate-900 text-sm mb-2">{msg.headline}</p>
          <p className="text-sm text-slate-600 leading-relaxed">{msg.body}</p>
          {onCTA && (
            <button onClick={onCTA}
              className="mt-3 text-sm font-bold px-4 py-2 rounded-xl text-white transition-colors"
              style={{ background: color }}>
              {msg.cta}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
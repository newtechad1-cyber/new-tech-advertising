import React, { useState, useEffect } from 'react';
import { X, Rocket, Video, TrendingUp, Calendar, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

const MILESTONE_STYLES = {
  first_campaign: {
    icon: Rocket,
    bgColor: 'from-blue-600 to-blue-900',
    accentColor: 'text-blue-300',
  },
  first_video: {
    icon: Video,
    bgColor: 'from-purple-600 to-purple-900',
    accentColor: 'text-purple-300',
  },
  first_lead: {
    icon: TrendingUp,
    bgColor: 'from-green-600 to-green-900',
    accentColor: 'text-green-300',
  },
  '30_days': {
    icon: Calendar,
    bgColor: 'from-pink-600 to-pink-900',
    accentColor: 'text-pink-300',
  },
  growth_score_50: {
    icon: Zap,
    bgColor: 'from-amber-600 to-amber-900',
    accentColor: 'text-amber-300',
  },
  growth_score_75: {
    icon: Crown,
    bgColor: 'from-yellow-600 to-yellow-900',
    accentColor: 'text-yellow-300',
  },
};

export default function DIYMilestoneCelebration({
  milestone,
  onClose,
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      duration: 2500,
    });

    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible || !milestone) return null;

  const style = MILESTONE_STYLES[milestone.type] || MILESTONE_STYLES.first_campaign;
  const Icon = style.icon;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="pointer-events-auto">
        <div
          className={`bg-gradient-to-br ${style.bgColor} rounded-2xl p-12 max-w-md shadow-2xl border border-slate-600/50`}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className={`p-4 bg-white/10 rounded-full ${style.accentColor}`}>
              <Icon className="w-12 h-12" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-white text-center mb-3">
            {milestone.title}
          </h2>

          {/* Message */}
          <p className="text-white/90 text-center mb-8">
            {milestone.message}
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              className="flex-1 text-white hover:bg-white/10"
            >
              Awesome!
            </Button>
            <Button
              onClick={() => window.location.href = '#wins'}
              className="flex-1 bg-white text-slate-900 hover:bg-slate-100 font-semibold"
            >
              View Wins
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { CheckCircle2, Circle, Zap, TrendingUp, Rocket, Crown } from 'lucide-react';

const STAGE_CONFIG = {
  launch_confidence: {
    icon: Zap,
    color: '#3b82f6',
    bg: '#eff6ff',
    label: 'Launch Confidence',
    months: '0 – 3 months',
    description: 'Your authority system is live. Content is compounding.',
    outcome: 'Foundation established, first visibility wins',
  },
  momentum_reinforcement: {
    icon: TrendingUp,
    color: '#8b5cf6',
    bg: '#f5f3ff',
    label: 'Momentum Reinforcement',
    months: '3 – 7 months',
    description: 'Measurable visibility growth. Amplifying what works.',
    outcome: 'Rankings rising, engagement compounding',
  },
  growth_expansion: {
    icon: Rocket,
    color: '#f59e0b',
    bg: '#fffbeb',
    label: 'Growth Expansion',
    months: '7 – 13 months',
    description: 'Authority proven. New channels and reach available.',
    outcome: 'Market share growing, expansion opportunities emerge',
  },
  market_leadership: {
    icon: Crown,
    color: '#10b981',
    bg: '#f0fdf4',
    label: 'Market Leadership',
    months: '13+ months',
    description: 'Category dominance. Strategic scaling.',
    outcome: 'Recognized market authority, sustainable lead flow',
  },
};

const STAGE_ORDER = ['launch_confidence', 'momentum_reinforcement', 'growth_expansion', 'market_leadership'];

export default function GJStageTimeline({ currentStage, monthsActive }) {
  const currentIdx = STAGE_ORDER.indexOf(currentStage);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="font-black text-slate-900 text-base">Your Authority Growth Journey</h2>
        <p className="text-sm text-slate-500 mt-0.5">Strategic milestones on the path to market leadership</p>
      </div>

      <div className="p-6">
        {/* Desktop: horizontal stepper */}
        <div className="hidden md:block">
          {/* Connector line */}
          <div className="relative flex items-start">
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-slate-200 z-0" />
            <div className="absolute top-5 left-5 h-0.5 z-0 bg-gradient-to-r from-slate-800 to-transparent transition-all"
              style={{ width: `${(currentIdx / (STAGE_ORDER.length - 1)) * 100}%` }} />

            <div className="relative z-10 flex justify-between w-full">
              {STAGE_ORDER.map((key, idx) => {
                const cfg = STAGE_CONFIG[key];
                const Icon = cfg.icon;
                const isCompleted = idx < currentIdx;
                const isCurrent = idx === currentIdx;
                const isFuture = idx > currentIdx;

                return (
                  <div key={key} className="flex flex-col items-center text-center" style={{ width: `${100 / STAGE_ORDER.length}%` }}>
                    {/* Icon node */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all mb-3 ${
                      isCurrent ? 'shadow-lg scale-110' : ''
                    }`} style={{
                      background: isCompleted || isCurrent ? cfg.color : 'white',
                      borderColor: isFuture ? '#e2e8f0' : cfg.color,
                    }}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        <Icon className="w-5 h-5" style={{ color: isCurrent ? 'white' : cfg.color }} />
                      )}
                    </div>

                    {/* Label */}
                    <p className={`text-xs font-black leading-tight mb-1 ${isFuture ? 'text-slate-400' : 'text-slate-900'}`}>
                      {cfg.label}
                    </p>
                    <p className="text-xs text-slate-400">{cfg.months}</p>

                    {isCurrent && (
                      <span className="mt-2 px-2 py-0.5 rounded-full text-xs font-black text-white"
                        style={{ background: cfg.color }}>Current</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile: vertical list */}
        <div className="md:hidden space-y-4">
          {STAGE_ORDER.map((key, idx) => {
            const cfg = STAGE_CONFIG[key];
            const Icon = cfg.icon;
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const isFuture = idx > currentIdx;
            return (
              <div key={key} className={`flex gap-3 p-3 rounded-xl transition-all ${isCurrent ? 'border-2 shadow-sm' : 'border border-slate-100'}`}
                style={{ borderColor: isCurrent ? cfg.color : undefined, background: isCurrent ? cfg.bg : 'white' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: isFuture ? '#f1f5f9' : cfg.color }}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Icon className="w-4 h-4" style={{ color: isFuture ? '#94a3b8' : 'white' }} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-black ${isFuture ? 'text-slate-400' : 'text-slate-900'}`}>{cfg.label}</p>
                    {isCurrent && <span className="px-2 py-0.5 rounded-full text-xs font-black text-white" style={{ background: cfg.color }}>Current</span>}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{cfg.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Current stage detail */}
        {currentStage && STAGE_CONFIG[currentStage] && (
          <div className="mt-6 p-4 rounded-xl border-2" style={{ borderColor: STAGE_CONFIG[currentStage].color + '40', background: STAGE_CONFIG[currentStage].bg }}>
            <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: STAGE_CONFIG[currentStage].color }}>Where You Are Now</p>
            <p className="text-sm font-bold text-slate-900 mb-1">{STAGE_CONFIG[currentStage].description}</p>
            <p className="text-xs text-slate-600">{STAGE_CONFIG[currentStage].outcome}</p>
            {monthsActive !== undefined && (
              <p className="text-xs text-slate-400 mt-2">{monthsActive} month{monthsActive !== 1 ? 's' : ''} of consistent authority growth</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
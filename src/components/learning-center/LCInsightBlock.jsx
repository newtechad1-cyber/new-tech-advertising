import React from 'react';
import { Sparkles, Building2, Lightbulb, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LCInsightBlock({ type, title, children }) {
  const configs = {
    ai_tip: {
      icon: Sparkles,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    real_world: {
      icon: Building2,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    },
    nta_found: {
      icon: Search,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    business_insight: {
      icon: Lightbulb,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    }
  };

  const config = configs[type] || configs.business_insight;
  const Icon = config.icon;

  return (
    <div className={cn("my-10 p-6 md:p-8 rounded-2xl border relative overflow-hidden", config.bg, config.border)}>
      <div className={cn("absolute top-0 left-0 w-1 h-full", config.color.replace('text-', 'bg-'))} />
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
        <div className={cn("flex-shrink-0 mt-1 p-3 rounded-xl bg-slate-900 border", config.border)}>
          <Icon className={cn("w-6 h-6", config.color)} />
        </div>
        <div>
          <h4 className={cn("text-lg font-bold mb-2", config.color)}>{title}</h4>
          <div className="text-slate-300 leading-relaxed text-[1.05rem]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
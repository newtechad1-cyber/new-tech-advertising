import React from 'react';
import { AlertCircle, Zap, TrendingUp } from 'lucide-react';

const urgencyIcons = {
  critical: '🚨',
  high: '⚠️',
  medium: '📊',
};

const urgencyColors = {
  critical: 'border-rose-700/50 bg-rose-600/10',
  high: 'border-amber-700/50 bg-amber-600/10',
  medium: 'border-slate-700/30 bg-slate-600/10',
};

export default function CTLeadershipFeed({ insights }) {
  return (
    <div className="bg-[#0d1526] border border-slate-800/60 rounded-3xl p-6">
      <h2 className="text-sm font-bold text-slate-200 mb-4">Leadership Priority Feed</h2>
      
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div key={i} className={`rounded-2xl p-4 border flex items-start gap-3 ${urgencyColors[insight.urgency]}`}>
            <span className="text-lg flex-shrink-0 mt-0.5">{urgencyIcons[insight.urgency]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white leading-snug">{insight.title}</p>
              <p className="text-[11px] text-slate-300 mt-1">{insight.description}</p>
            </div>
            <span className="text-[9px] font-bold uppercase text-slate-500 flex-shrink-0 whitespace-nowrap ml-2">
              #{i + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
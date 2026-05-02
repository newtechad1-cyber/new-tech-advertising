import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

const STAGES = [
  { key: 'strategy',    label: 'Strategy' },
  { key: 'landing_page', label: 'Landing Page' },
  { key: 'seo_pages',  label: 'SEO Pages' },
  { key: 'ads',        label: 'Ads' },
  { key: 'social_posts', label: 'Social Posts' },
  { key: 'video',      label: 'Video' },
  { key: 'approval',   label: 'Approval' },
  { key: 'launch',     label: 'Launch' },
  { key: 'report',     label: 'Report' },
];

export default function CampaignProgressTracker({ progress = {} }) {
  const completedCount = STAGES.filter(s => progress[s.key]).length;
  const pct = Math.round((completedCount / STAGES.length) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Campaign Progress</h2>
        <span className="text-xs font-bold text-white">{completedCount}/{STAGES.length} stages complete</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-800 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Stage pills */}
      <div className="flex flex-wrap gap-2">
        {STAGES.map((stage, i) => {
          const done = progress[stage.key];
          const isNext = !done && STAGES.slice(0, i).every(s => progress[s.key]);
          return (
            <div
              key={stage.key}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                done
                  ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-800/50'
                  : isNext
                  ? 'bg-blue-900/40 text-blue-300 border border-blue-700/50'
                  : 'bg-slate-800 text-slate-500 border border-slate-700'
              }`}
            >
              {done
                ? <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                : <Circle className={`w-3 h-3 ${isNext ? 'text-blue-400' : 'text-slate-600'}`} />}
              {stage.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
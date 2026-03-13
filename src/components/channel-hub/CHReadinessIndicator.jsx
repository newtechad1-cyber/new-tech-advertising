import React from 'react';
import { CheckCircle2, Circle, Rocket, Zap } from 'lucide-react';

const PLATFORM_WEIGHTS = {
  facebook: 25,
  instagram: 20,
  google_business: 25,
  youtube: 20,
  tiktok: 10,
};

const READINESS_LEVELS = [
  { min: 0,  label: 'Not Ready',        color: '#ef4444', desc: 'Connect at least Google Business and Facebook to begin.' },
  { min: 25, label: 'Minimum Viable',   color: '#f59e0b', desc: 'Core channels connected. Adding more unlocks full automation.' },
  { min: 50, label: 'Publishing Ready', color: '#3b82f6', desc: 'Content publishing is active. Streaming + video are pending.' },
  { min: 75, label: 'Authority Ready',  color: '#8b5cf6', desc: 'Strong channel presence. Full content engine is active.' },
  { min: 90, label: 'Fully Powered',    color: '#10b981', desc: 'All channels live. Full visibility + publishing automation active.' },
];

const CAPABILITIES = [
  { label: 'Social Post Publishing',       requires: ['facebook'],                        icon: '📱' },
  { label: 'Instagram Content',            requires: ['instagram'],                       icon: '📸' },
  { label: 'Google Reviews Management',    requires: ['google_business'],                 icon: '⭐' },
  { label: 'Google Business Posts',        requires: ['google_business'],                 icon: '🗺️' },
  { label: 'YouTube Video Publishing',     requires: ['youtube'],                         icon: '🎬' },
  { label: 'TikTok Short-Form Video',      requires: ['tiktok'],                          icon: '🎵' },
  { label: 'Full Cross-Platform Posting',  requires: ['facebook', 'instagram', 'youtube'], icon: '🚀' },
  { label: 'Complete Visibility System',   requires: ['facebook', 'instagram', 'google_business', 'youtube'], icon: '⚡' },
];

export default function CHReadinessIndicator({ connections }) {
  const connectedPlatforms = connections.filter(c => c.status === 'connected').map(c => c.platform);

  const score = connectedPlatforms.reduce((s, p) => s + (PLATFORM_WEIGHTS[p] || 0), 0);
  const level = [...READINESS_LEVELS].reverse().find(l => score >= l.min) || READINESS_LEVELS[0];

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800">
        <h3 className="text-white font-bold text-sm flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" /> Publishing Readiness
        </h3>
      </div>

      {/* Score display */}
      <div className="p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" fill="none" stroke="#1e293b" strokeWidth="8" />
              <circle cx="40" cy="40" r="32" fill="none" stroke={level.color} strokeWidth="8"
                strokeDasharray={`${(score / 100) * 201} 201`} strokeLinecap="round"
                className="transition-all duration-700" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-xl font-black">{score}</span>
            </div>
          </div>
          <div>
            <p className="text-lg font-black" style={{ color: level.color }}>{level.label}</p>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed max-w-48">{level.desc}</p>
          </div>
        </div>

        {/* Score bar */}
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-5">
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${score}%`, background: `linear-gradient(90deg, ${level.color}88, ${level.color})` }} />
        </div>

        {/* Capabilities checklist */}
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-3">Capabilities Unlocked</p>
        <div className="space-y-2">
          {CAPABILITIES.map((cap, i) => {
            const unlocked = cap.requires.every(r => connectedPlatforms.includes(r));
            return (
              <div key={i} className={`flex items-center gap-2.5 p-2 rounded-lg transition-colors ${unlocked ? '' : 'opacity-40'}`}>
                <span className="text-base flex-shrink-0">{cap.icon}</span>
                {unlocked ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-700 flex-shrink-0" />
                )}
                <span className={`text-xs font-medium ${unlocked ? 'text-slate-200' : 'text-slate-500'}`}>{cap.label}</span>
              </div>
            );
          })}
        </div>

        {score >= 90 && (
          <div className="mt-4 p-3 bg-green-950/20 border border-green-800/30 rounded-xl flex items-center gap-2">
            <Rocket className="w-4 h-4 text-green-400 flex-shrink-0" />
            <p className="text-green-400 text-xs font-bold">Full automation active. Your visibility engine is running.</p>
          </div>
        )}
      </div>
    </div>
  );
}
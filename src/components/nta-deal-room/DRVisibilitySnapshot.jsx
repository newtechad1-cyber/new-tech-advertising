import React from 'react';
import { AlertCircle, TrendingUp, CheckCircle2, Video, Star } from 'lucide-react';

const GAPS = [
  { icon: AlertCircle, label: 'Content Gap', detail: 'Publishing fewer than 4x/month — invisible to Google', severity: 'critical' },
  { icon: TrendingUp, label: 'Ranking Gap', detail: 'Not appearing in top 10 for primary service keywords', severity: 'critical' },
  { icon: Video, label: 'Video Gap', detail: 'No active video content on YouTube or social', severity: 'high' },
  { icon: Star, label: 'Review Gap', detail: 'Under 20 Google reviews — below local trust threshold', severity: 'high' },
  { icon: CheckCircle2, label: 'Streaming TV Gap', detail: 'Zero presence on Connected TV platforms', severity: 'medium' },
];

const SEV_CONFIG = {
  critical: { color: '#ef4444', bg: 'bg-red-950/30', border: 'border-red-800/40', label: 'Critical' },
  high: { color: '#f59e0b', bg: 'bg-amber-950/30', border: 'border-amber-800/40', label: 'High Priority' },
  medium: { color: '#3b82f6', bg: 'bg-blue-950/30', border: 'border-blue-800/40', label: 'Opportunity' },
};

const RANK_DATA = [
  { keyword: 'HVAC repair near me', current: null, target: '1–3', volume: '880/mo' },
  { keyword: 'AC installation [city]', current: null, target: '1–5', volume: '590/mo' },
  { keyword: 'furnace replacement', current: 34, target: '1–5', volume: '720/mo' },
  { keyword: 'emergency HVAC service', current: null, target: '1–3', volume: '440/mo' },
];

export default function DRVisibilitySnapshot({ industry }) {
  const keywords = RANK_DATA.map(k => ({
    ...k,
    keyword: k.keyword.replace('HVAC', industry === 'plumbing' ? 'plumbing' : industry === 'roofing' ? 'roofing' : 'HVAC'),
  }));

  return (
    <section className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-800/60">
      <div className="text-center mb-10">
        <h2 className="text-white text-3xl font-black mb-3">Your Current Visibility Gaps</h2>
        <p className="text-slate-400 text-base">An honest look at where you stand today — and what's possible.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-8">
        {GAPS.map((g, i) => {
          const Icon = g.icon;
          const cfg = SEV_CONFIG[g.severity];
          return (
            <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border ${cfg.bg} ${cfg.border}`}>
              <Icon className="w-5 h-5 flex-shrink-0" style={{ color: cfg.color }} />
              <div className="flex-1">
                <span className="text-white font-semibold text-sm">{g.label}</span>
                <p className="text-slate-400 text-xs mt-0.5">{g.detail}</p>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ color: cfg.color, background: `${cfg.color}18` }}>
                {cfg.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Ranking opportunity table */}
      <div className="bg-slate-800/50 border border-slate-700/40 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700/50">
          <h3 className="text-white font-bold text-sm">Keyword Ranking Opportunity</h3>
          <p className="text-slate-500 text-xs mt-0.5">Where you could rank within 90–180 days</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/40">
              <th className="text-left px-5 py-3 text-slate-500 text-xs font-medium">Keyword</th>
              <th className="text-center px-4 py-3 text-slate-500 text-xs font-medium">Current Rank</th>
              <th className="text-center px-4 py-3 text-slate-500 text-xs font-medium">Target Rank</th>
              <th className="text-right px-5 py-3 text-slate-500 text-xs font-medium">Monthly Searches</th>
            </tr>
          </thead>
          <tbody>
            {keywords.map((k, i) => (
              <tr key={i} className="border-b border-slate-700/30 last:border-0">
                <td className="px-5 py-3 text-white text-xs font-medium">{k.keyword}</td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs text-red-400 font-bold">{k.current || 'Not ranking'}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs text-green-400 font-bold">{k.target}</span>
                </td>
                <td className="px-5 py-3 text-right text-xs text-slate-400">{k.volume}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
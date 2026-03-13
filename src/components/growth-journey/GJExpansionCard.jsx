import React from 'react';
import { ArrowUpRight, Package, MapPin, Zap, TrendingUp, Star, Tv, Video } from 'lucide-react';

const OPP_META = {
  package_upgrade:           { icon: Package,   color: '#8b5cf6', label: 'Authority Level Upgrade' },
  location_expansion:        { icon: MapPin,    color: '#3b82f6', label: 'New Location Authority' },
  seasonal_campaign:         { icon: Zap,       color: '#f59e0b', label: 'Seasonal Campaign' },
  paid_amplification:        { icon: TrendingUp, color: '#06b6d4', label: 'Paid Amplification' },
  reputation_acceleration:   { icon: Star,      color: '#10b981', label: 'Reputation Acceleration' },
  streaming_upgrade:         { icon: Tv,        color: '#ec4899', label: 'Streaming Expansion' },
  video_intensive:           { icon: Video,     color: '#f97316', label: 'Video Intensive' },
  strategy_review:           { icon: ArrowUpRight, color: '#64748b', label: 'Strategy Review' },
};

export default function GJExpansionCard({ opportunity, onInterested, onDefer }) {
  const meta = OPP_META[opportunity.opportunity_type] || OPP_META.strategy_review;
  const Icon = meta.icon;

  return (
    <div className="rounded-2xl border-2 bg-white p-5 transition-shadow hover:shadow-md"
      style={{ borderColor: meta.color + '30' }}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: meta.color + '15' }}>
          <Icon className="w-5 h-5" style={{ color: meta.color }} />
        </div>
        <div className="flex-1">
          <p className="text-xs font-black uppercase tracking-widest mb-0.5" style={{ color: meta.color }}>{meta.label}</p>
          <p className="text-sm font-bold text-slate-900 leading-snug">{opportunity.positioning_message}</p>
        </div>
      </div>

      {opportunity.estimated_impact && (
        <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-xs font-bold text-slate-600 mb-0.5">Projected Growth Impact</p>
          <p className="text-xs text-slate-500 leading-relaxed">{opportunity.estimated_impact}</p>
        </div>
      )}

      {opportunity.trigger_reason && (
        <p className="text-xs text-slate-400 italic mb-4 leading-relaxed">"{opportunity.trigger_reason}"</p>
      )}

      <div className="flex gap-2">
        <button onClick={() => onInterested?.(opportunity.id)}
          className="flex-1 py-2.5 rounded-xl text-xs font-black text-white transition-colors"
          style={{ background: meta.color }}>
          Tell Me More
        </button>
        <button onClick={() => onDefer?.(opportunity.id)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 border border-slate-200 hover:border-slate-300 transition-colors">
          Not Now
        </button>
      </div>
    </div>
  );
}
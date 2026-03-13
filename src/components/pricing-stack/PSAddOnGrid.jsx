import React from 'react';
import { Plus, Check, Zap, TrendingUp, Star, MapPin, Tv, Video, Search } from 'lucide-react';

const ADDON_META = {
  seasonal_campaign:       { icon: Zap,        color: '#f59e0b', label: 'Seasonal Authority Campaign',   desc: 'Timed market-surge campaigns aligned to seasonal demand spikes in your vertical.' },
  paid_amplification:      { icon: TrendingUp,  color: '#3b82f6', label: 'Paid Amplification Engine',    desc: 'Strategic paid reach layered on top of organic authority content for compound visibility.' },
  reputation_acceleration: { icon: Star,        color: '#10b981', label: 'Reputation Acceleration',      desc: 'Automated review generation, response management, and trust signal amplification.' },
  location_expansion:      { icon: MapPin,      color: '#8b5cf6', label: 'Additional Location Authority', desc: 'Full authority system deployment for an additional service location or territory.' },
  streaming_upgrade:       { icon: Tv,          color: '#06b6d4', label: 'Streaming TV Upgrade',         desc: 'Premium streaming placement expansion across additional networks and audiences.' },
  video_intensive:         { icon: Video,       color: '#ec4899', label: 'Video Production Intensive',   desc: 'Increase monthly video output with premium scripts, b-roll direction, and distribution.' },
  authority_audit:         { icon: Search,      color: '#64748b', label: 'Deep Market Authority Audit',  desc: 'One-time comprehensive competitive landscape and visibility gap analysis for your market.' },
};

export default function PSAddOnGrid({ selectedAddons, onToggle }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4">
        <h3 className="font-black text-slate-900 text-sm mb-0.5">Growth Accelerators</h3>
        <p className="text-xs text-slate-400">Optional add-ons that compound authority results</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {Object.entries(ADDON_META).map(([key, meta]) => {
          const Icon = meta.icon;
          const isSelected = selectedAddons.includes(key);
          return (
            <button key={key} onClick={() => onToggle(key)}
              className={`text-left p-3.5 rounded-xl border-2 transition-all ${isSelected ? 'shadow-sm' : 'hover:border-slate-300'}`}
              style={{ borderColor: isSelected ? meta.color : '#e2e8f0', background: isSelected ? meta.color + '08' : 'white' }}>
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: meta.color + '15' }}>
                  <Icon className="w-4 h-4" style={{ color: meta.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900 leading-tight">{meta.label}</p>
                    {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: meta.color }} />}
                  </div>
                  <p className="text-xs text-slate-500 leading-snug mt-1">{meta.desc}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
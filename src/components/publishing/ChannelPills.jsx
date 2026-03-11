import React from 'react';
import { Globe, Facebook, Instagram, Youtube, Music2, MapPin, Lightbulb } from 'lucide-react';

const CHANNEL_CONFIG = {
  website: { icon: Globe, label: 'Website', color: 'bg-slate-100 text-slate-700' },
  facebook: { icon: Facebook, label: 'Facebook', color: 'bg-blue-100 text-blue-700' },
  instagram: { icon: Instagram, label: 'Instagram', color: 'bg-pink-100 text-pink-700' },
  youtube: { icon: Youtube, label: 'YouTube', color: 'bg-red-100 text-red-700' },
  tiktok: { icon: Music2, label: 'TikTok', color: 'bg-black/10 text-slate-900' },
  gbp: { icon: MapPin, label: 'GBP', color: 'bg-amber-100 text-amber-700' },
  linkedin: { icon: Lightbulb, label: 'LinkedIn', color: 'bg-blue-200 text-blue-800' },
};

export default function ChannelPills({ channels = [], compact = false }) {
  if (!channels || channels.length === 0) {
    return <span className="text-xs text-slate-400">No destinations selected</span>;
  }

  return (
    <div className={compact ? 'flex gap-1 flex-wrap' : 'flex gap-2 flex-wrap'}>
      {channels.map((channel) => {
        const config = CHANNEL_CONFIG[channel];
        if (!config) return null;

        const Icon = config.icon;
        return (
          <div
            key={channel}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md ${config.color} ${
              compact ? 'text-xs' : 'text-xs'
            }`}
          >
            <Icon className={compact ? 'w-3 h-3' : 'w-3 h-3'} />
            <span>{config.label}</span>
          </div>
        );
      })}
    </div>
  );
}
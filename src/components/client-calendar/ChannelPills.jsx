import React from 'react';
import { Facebook, Instagram, Globe, Youtube, Linkedin } from 'lucide-react';

const CHANNEL_CONFIG = {
  facebook: { icon: Facebook, label: 'Facebook', color: 'bg-blue-100 text-blue-700', bgDark: 'bg-blue-900 text-blue-300' },
  instagram: { icon: Instagram, label: 'Instagram', color: 'bg-pink-100 text-pink-700', bgDark: 'bg-pink-900 text-pink-300' },
  website: { icon: Globe, label: 'Website', color: 'bg-slate-100 text-slate-700', bgDark: 'bg-slate-700 text-slate-300' },
  youtube: { icon: Youtube, label: 'YouTube', color: 'bg-red-100 text-red-700', bgDark: 'bg-red-900 text-red-300' },
  tiktok: { icon: null, label: 'TikTok', color: 'bg-slate-900 text-white', bgDark: 'bg-slate-800 text-white' },
  google: { icon: null, label: 'Google', color: 'bg-amber-100 text-amber-700', bgDark: 'bg-amber-900 text-amber-300' },
  linkedin: { icon: Linkedin, label: 'LinkedIn', color: 'bg-sky-100 text-sky-700', bgDark: 'bg-sky-900 text-sky-300' },
};

export default function ChannelPills({ platforms = [], darkMode = false, size = 'md' }) {
  const validPlatforms = Array.isArray(platforms) 
    ? platforms.filter(p => CHANNEL_CONFIG[p])
    : CHANNEL_CONFIG[platforms] ? [platforms] : [];

  if (validPlatforms.length === 0) return null;

  const sizeClass = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-2.5 py-1.5 text-sm';
  const colorClass = darkMode ? 'bgDark' : 'color';

  return (
    <div className="flex flex-wrap gap-2">
      {validPlatforms.map(platform => {
        const config = CHANNEL_CONFIG[platform];
        const Icon = config.icon;
        const bgClass = darkMode ? config.bgDark : config.color;

        return (
          <div
            key={platform}
            className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClass} ${bgClass}`}
          >
            {Icon ? (
              <Icon className="w-3.5 h-3.5" />
            ) : (
              <span className="font-bold text-xs">●</span>
            )}
            <span>{config.label}</span>
          </div>
        );
      })}
    </div>
  );
}
/**
 * C-001 Canon Library — Entry Card
 * Displays a single canon entry as a card.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Star } from 'lucide-react';
import { THEME_COLORS, CONTENT_TYPE_META } from './canonData';
import * as LucideIcons from 'lucide-react';

const THEME_COLOR_MAP = {
  'AI & Technology': 'purple',
  'Digital Trust & Reputation': 'emerald',
  'Growth Systems': 'blue',
  'Local Marketing': 'cyan',
  'Business Philosophy': 'amber',
  'Founder Journey': 'rose',
  'Client Success': 'teal',
  'Web Accessibility': 'indigo',
  'Video & Storytelling': 'orange',
  'Sales & Authority': 'red',
  'Community Impact': 'emerald',
  'Leadership': 'amber',
};

export default function CanonCard({ entry, compact = false, showSeries = true, index }) {
  const themeColor = THEME_COLOR_MAP[entry.primary_theme] || 'blue';
  const colors = THEME_COLORS[themeColor];
  const typeMeta = CONTENT_TYPE_META[entry.content_type] || {};
  const TypeIcon = LucideIcons[typeMeta.icon] || LucideIcons.FileText;

  if (compact) {
    return (
      <Link
        to={entry.original_url}
        className="group flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 transition-all"
      >
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${colors.bg} ${colors.border} border flex items-center justify-center`}>
          <TypeIcon className={`w-5 h-5 ${colors.text}`} />
        </div>
        <div className="flex-grow min-w-0">
          <h4 className="text-white font-semibold text-sm truncate group-hover:text-blue-400 transition-colors">
            {entry.title}
          </h4>
          <p className="text-slate-500 text-xs mt-0.5">{entry.content_type} · {entry.estimated_read_time} min</p>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
      </Link>
    );
  }

  return (
    <Link
      to={entry.original_url}
      className="group relative flex flex-col h-full rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all overflow-hidden"
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${colors.gradient}`} />

      <div className="p-6 flex flex-col flex-grow">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center`}>
            <TypeIcon className={`w-5 h-5 ${colors.text}`} />
          </div>
          {entry.featured && (
            <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
          )}
        </div>

        {/* Content type badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>
            {entry.content_type}
          </span>
          {showSeries && entry.series && (
            <>
              <span className="text-slate-700">·</span>
              <span className="text-xs text-slate-500">{entry.series}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors leading-tight">
          {entry.title}
        </h3>

        {/* Subtitle */}
        {entry.subtitle && (
          <p className="text-sm text-slate-400 mb-3 leading-relaxed">{entry.subtitle}</p>
        )}

        {/* Summary */}
        <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-grow">{entry.summary}</p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-800/50">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <Clock className="w-3.5 h-3.5" />
            {entry.estimated_read_time} min read
          </div>
          <span className="text-xs text-slate-600 group-hover:text-blue-400 transition-colors flex items-center gap-1">
            Read <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

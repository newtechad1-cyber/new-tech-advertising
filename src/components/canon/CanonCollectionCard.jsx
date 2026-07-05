/**
 * C-001 Canon Library — Collection Card
 * Displays a collection as a visual card on the Canon Explorer.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { THEME_COLORS, getCollectionEntries, getCollectionReadTime } from './canonData';

export default function CanonCollectionCard({ collection, size = 'normal' }) {
  const colors = THEME_COLORS[collection.color] || THEME_COLORS.blue;
  const Icon = LucideIcons[collection.icon] || BookOpen;
  const entries = getCollectionEntries(collection.slug);
  const totalTime = getCollectionReadTime(collection.slug);
  const entryCount = entries.length;

  if (size === 'featured') {
    return (
      <Link
        to={`/canon/collection/${collection.slug}`}
        className="group relative flex flex-col md:flex-row items-stretch rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all overflow-hidden"
      >
        {/* Left accent */}
        <div className={`hidden md:block w-2 bg-gradient-to-b ${colors.gradient}`} />
        <div className={`md:hidden h-1.5 w-full bg-gradient-to-r ${colors.gradient}`} />

        <div className="flex-grow p-8 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${colors.text}`} />
            </div>
            <div>
              <span className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>Collection</span>
              <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors leading-tight">
                {collection.title}
              </h3>
            </div>
          </div>

          {collection.subtitle && (
            <p className="text-base text-slate-400 mb-3 font-medium">{collection.subtitle}</p>
          )}

          <p className="text-sm text-slate-500 mb-6 leading-relaxed">{collection.purpose}</p>

          <div className="flex items-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {totalTime} min total
            </span>
            <span className={`flex items-center gap-1 ${colors.text} font-semibold group-hover:gap-2 transition-all`}>
              Begin Reading <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Right side — entry preview */}
        <div className="hidden lg:flex flex-col gap-2 p-6 pl-0 w-72 justify-center">
          {entries.slice(0, 3).map((entry, i) => (
            <div key={entry.id} className="flex items-center gap-3 text-sm">
              <span className={`w-6 h-6 rounded-full ${colors.bg} ${colors.border} border flex items-center justify-center text-xs font-bold ${colors.text}`}>
                {i + 1}
              </span>
              <span className="text-slate-400 truncate">{entry.title}</span>
            </div>
          ))}
          {entryCount > 3 && (
            <span className="text-xs text-slate-600 pl-9">+{entryCount - 3} more</span>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/canon/collection/${collection.slug}`}
      className="group flex flex-col h-full rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all overflow-hidden"
    >
      <div className={`h-1 w-full bg-gradient-to-r ${colors.gradient}`} />

      <div className="p-6 flex flex-col flex-grow">
        <div className={`w-11 h-11 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-4`}>
          <Icon className={`w-5 h-5 ${colors.text}`} />
        </div>

        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
          {collection.title}
        </h3>

        {collection.subtitle && (
          <p className="text-sm text-slate-400 mb-3">{collection.subtitle}</p>
        )}

        <p className="text-sm text-slate-500 flex-grow mb-4 line-clamp-2">{collection.purpose}</p>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              {entryCount}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {totalTime}m
            </span>
          </div>
          <span className={`text-xs ${colors.text} font-semibold flex items-center gap-1`}>
            Read <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

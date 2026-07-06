/**
 * R0.6.2 — Reader Journey Component
 * Dynamic reading progress and navigation within Canon collections.
 * Supports: Introduction, Reading Order, Progress Tracking,
 *           Continue Reading, Completion Status, Estimated Time.
 *
 * Reads from CanonCollection + PublishingArticle entities via Knowledge Graph.
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, CheckCircle2, Circle,
  Clock, BookOpen, ArrowRight, Play
} from 'lucide-react';
import { THEME_COLORS, ASSET_TYPE_META } from '@/lib/knowledgeGraph';

// ─── Local storage for reading progress ─────────────────────────────────────
const STORAGE_KEY = 'nta_reading_progress';

function getReadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch { return {}; }
}

function markRead(collectionSlug, canonId) {
  const progress = getReadProgress();
  if (!progress[collectionSlug]) progress[collectionSlug] = [];
  if (!progress[collectionSlug].includes(canonId)) {
    progress[collectionSlug].push(canonId);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function isRead(collectionSlug, canonId) {
  const progress = getReadProgress();
  return (progress[collectionSlug] || []).includes(canonId);
}

function getCollectionProgress(collectionSlug, totalEntries) {
  const progress = getReadProgress();
  const read = (progress[collectionSlug] || []).length;
  return { read, total: totalEntries, percent: totalEntries > 0 ? Math.round((read / totalEntries) * 100) : 0 };
}

// ─── Journey Navigation Bar (prev/next within a collection) ─────────────────
export function JourneyNavBar({ position, collectionSlug, collectionTitle, color = 'blue' }) {
  if (!position) return null;
  const colors = THEME_COLORS[color] || THEME_COLORS.blue;

  return (
    <div className={`rounded-xl ${colors.bg} border ${colors.border} p-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.text}`}>
          {collectionTitle} · {position.current} of {position.total}
        </span>
        <span className="text-[10px] text-slate-500">{position.progress}% complete</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-800 rounded-full mb-4">
        <div
          className={`h-1 ${colors.solid} rounded-full transition-all`}
          style={{ width: `${position.progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        {position.prev ? (
          <Link
            to={position.prev.canonical_url || `/${position.prev.slug}`}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="truncate max-w-[200px]">{position.prev.title}</span>
          </Link>
        ) : <div />}

        {position.next ? (
          <Link
            to={position.next.canonical_url || `/${position.next.slug}`}
            className="flex items-center gap-2 text-sm text-white hover:text-blue-400 transition-colors font-semibold"
          >
            <span className="truncate max-w-[200px]">{position.next.title}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <span className="flex items-center gap-1 text-sm text-green-400 font-bold">
            <CheckCircle2 className="w-4 h-4" /> Journey Complete
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Collection Overview Card (for Canon Explorer) ──────────────────────────
export function CollectionCard({ collection, entries = [] }) {
  const colors = THEME_COLORS[collection.color] || THEME_COLORS.blue;
  const entryCount = entries.length || collection.entry_count || 0;
  const totalTime = entries.reduce((sum, e) => sum + (e.estimated_read_time || 4), 0);
  const progress = getCollectionProgress(collection.slug, entryCount);

  return (
    <Link
      to={`/canon/collection/${collection.slug}`}
      className="group block p-5 rounded-xl bg-slate-900/30 border border-slate-800 hover:border-slate-700 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center`}>
          <BookOpen className={`w-5 h-5 ${colors.text}`} />
        </div>
        {progress.read > 0 && (
          <span className="text-[10px] text-slate-500">{progress.percent}%</span>
        )}
      </div>

      <h3 className="text-base font-black text-white mb-1 group-hover:text-blue-400 transition-colors">
        {collection.title}
      </h3>
      {collection.subtitle && (
        <p className="text-xs text-slate-400 mb-3">{collection.subtitle}</p>
      )}
      {collection.purpose && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{collection.purpose}</p>
      )}

      <div className="flex items-center gap-4 text-[10px] text-slate-600">
        <span className="flex items-center gap-1">
          <BookOpen className="w-3 h-3" /> {entryCount} entries
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" /> {totalTime} min
        </span>
      </div>

      {/* Mini progress bar */}
      {progress.read > 0 && (
        <div className="h-0.5 bg-slate-800 rounded-full mt-3">
          <div
            className={`h-0.5 ${colors.solid} rounded-full transition-all`}
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      )}
    </Link>
  );
}

// ─── Collection Entry List (reading order) ──────────────────────────────────
export function CollectionEntryList({ collectionSlug, entries = [], color = 'blue' }) {
  const colors = THEME_COLORS[color] || THEME_COLORS.blue;

  return (
    <div className="space-y-2">
      {entries.map((entry, i) => {
        const read = isRead(collectionSlug, entry.canon_id);
        const url = entry.canonical_url || `/${entry.slug}`;
        const meta = ASSET_TYPE_META[entry.asset_type] || ASSET_TYPE_META.article;

        return (
          <Link
            key={entry.canon_id || i}
            to={url}
            onClick={() => markRead(collectionSlug, entry.canon_id)}
            className="group flex items-start gap-3 p-4 rounded-lg bg-slate-900/30 border border-slate-800 hover:border-slate-700 transition-all"
          >
            {/* Step number / check */}
            <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5">
              {read ? (
                <CheckCircle2 className={`w-5 h-5 ${colors.text}`} />
              ) : (
                <span className="text-xs font-bold text-slate-500 border border-slate-700 rounded-full w-6 h-6 flex items-center justify-center">
                  {i + 1}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {meta.label}
                </span>
                {entry.has_video && (
                  <Play className="w-3 h-3 text-red-400" />
                )}
                {entry.estimated_read_time && (
                  <span className="text-[10px] text-slate-600 flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" /> {entry.estimated_read_time}m
                  </span>
                )}
              </div>
              <p className={`text-sm font-bold ${read ? 'text-slate-400' : 'text-white'} group-hover:text-blue-400 transition-colors`}>
                {entry.title}
              </p>
              {entry.summary && (
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{entry.summary}</p>
              )}
            </div>

            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 flex-shrink-0 mt-1 transition-colors" />
          </Link>
        );
      })}
    </div>
  );
}

// ─── Exports ────────────────────────────────────────────────────────────────
export { getReadProgress, markRead, isRead, getCollectionProgress };

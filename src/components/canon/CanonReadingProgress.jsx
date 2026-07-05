/**
 * C-001 Canon Library — Reading Progress
 * Shows progress within a collection and enables "Continue Reading".
 * Uses localStorage to track which entries the reader has visited.
 */
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, ArrowRight, BookOpen } from 'lucide-react';
import { THEME_COLORS } from './canonData';

const STORAGE_KEY = 'nta-canon-progress';

/** Get all read entry IDs from localStorage */
export function getReadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

/** Mark an entry as read */
export function markEntryRead(entryId) {
  const read = getReadEntries();
  if (!read.includes(entryId)) {
    read.push(entryId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(read));
  }
}

/** Check if an entry has been read */
export function isEntryRead(entryId) {
  return getReadEntries().includes(entryId);
}

/** Get progress for a collection */
export function getCollectionProgress(entries) {
  const read = getReadEntries();
  const total = entries.length;
  const completed = entries.filter(e => read.includes(e.id)).length;
  return { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
}

/** Get the next unread entry in a collection */
export function getNextUnreadEntry(entries) {
  const read = getReadEntries();
  return entries.find(e => !read.includes(e.id));
}

// ─── Progress Bar Component ─────────────────────────────────────────────────

export function CollectionProgressBar({ entries, color = 'blue', showLabel = true }) {
  const { completed, total, percent } = useMemo(() => getCollectionProgress(entries), [entries]);
  const colors = THEME_COLORS[color];

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-sm mb-2">
          <span className={`font-bold ${colors.text}`}>
            {completed === total ? '✓ Complete' : `${completed} of ${total} read`}
          </span>
          <span className="text-slate-500">{percent}%</span>
        </div>
      )}
      <div className={`h-2 w-full rounded-full ${colors.bg} overflow-hidden`}>
        <div
          className={`h-full rounded-full ${colors.solid} transition-all duration-700 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

// ─── Continue Reading Banner ────────────────────────────────────────────────

export function ContinueReadingBanner({ entries, collectionTitle, color = 'blue' }) {
  const nextEntry = useMemo(() => getNextUnreadEntry(entries), [entries]);
  const { completed, total } = useMemo(() => getCollectionProgress(entries), [entries]);
  const colors = THEME_COLORS[color];

  if (!nextEntry || completed === total) return null;

  return (
    <Link
      to={nextEntry.original_url}
      className={`group flex items-center gap-4 p-4 rounded-xl ${colors.bg} ${colors.border} border hover:border-slate-600 transition-all`}
    >
      <BookOpen className={`w-5 h-5 ${colors.text} flex-shrink-0`} />
      <div className="flex-grow min-w-0">
        <p className="text-xs text-slate-500 mb-0.5">Continue {collectionTitle}</p>
        <p className="text-sm text-white font-semibold truncate group-hover:text-blue-400 transition-colors">
          {nextEntry.title}
        </p>
      </div>
      <ArrowRight className={`w-4 h-4 ${colors.text} group-hover:translate-x-1 transition-transform flex-shrink-0`} />
    </Link>
  );
}

// ─── Reading Order List ─────────────────────────────────────────────────────

export function ReadingOrderList({ entries, color = 'blue', currentEntryId }) {
  const readEntries = useMemo(() => getReadEntries(), []);
  const colors = THEME_COLORS[color];

  return (
    <div className="space-y-1">
      {entries.map((entry, i) => {
        const isRead = readEntries.includes(entry.id);
        const isCurrent = entry.id === currentEntryId;

        return (
          <Link
            key={entry.id}
            to={entry.original_url}
            className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isCurrent
                ? `${colors.bg} ${colors.border} border`
                : 'hover:bg-slate-800/50'
            }`}
          >
            {/* Step indicator */}
            <div className="flex-shrink-0">
              {isRead ? (
                <CheckCircle2 className={`w-5 h-5 ${colors.text}`} />
              ) : (
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                  isCurrent ? `${colors.border} ${colors.text}` : 'border-slate-700 text-slate-600'
                }`}>
                  {i + 1}
                </div>
              )}
            </div>

            {/* Entry info */}
            <div className="flex-grow min-w-0">
              <p className={`text-sm font-medium truncate ${
                isCurrent ? 'text-white' : isRead ? 'text-slate-400' : 'text-slate-300 group-hover:text-white'
              } transition-colors`}>
                {entry.title}
              </p>
              <p className="text-xs text-slate-600">{entry.estimated_read_time} min · {entry.content_type}</p>
            </div>

            {isCurrent && (
              <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.text}`}>Reading</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

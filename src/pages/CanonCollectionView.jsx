/**
 * C-001 Canon Library — Collection View
 * Book-like reading experience for a single collection.
 * Shows overview, purpose, reading order with progress tracking,
 * and "Continue Reading" capability.
 * Route: /canon/collection/:slug
 */
import React, { useEffect, useMemo } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, BookOpen, Clock, ChevronRight,
  Library, Sparkles
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import CanonCard from '@/components/canon/CanonCard';
import {
  CANON_COLLECTIONS,
  getCollection,
  getCollectionEntries,
  getCollectionReadTime,
  THEME_COLORS,
} from '@/components/canon/canonData';
import {
  CollectionProgressBar,
  ContinueReadingBanner,
  ReadingOrderList,
  getCollectionProgress,
  getNextUnreadEntry,
} from '@/components/canon/CanonReadingProgress';

export default function CanonCollectionView() {
  const { slug } = useParams();
  const collection = getCollection(slug);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!collection) {
    return <Navigate to="/canon" replace />;
  }

  const entries = useMemo(() => getCollectionEntries(slug), [slug]);
  const totalTime = getCollectionReadTime(slug);
  const colors = THEME_COLORS[collection.color] || THEME_COLORS.blue;
  const Icon = LucideIcons[collection.icon] || BookOpen;
  const progress = getCollectionProgress(entries);
  const nextEntry = getNextUnreadEntry(entries);

  // Find prev/next collections
  const sorted = [...CANON_COLLECTIONS].sort((a, b) => a.display_order - b.display_order);
  const currentIdx = sorted.findIndex(c => c.slug === slug);
  const prevCollection = currentIdx > 0 ? sorted[currentIdx - 1] : null;
  const nextCollection = currentIdx < sorted.length - 1 ? sorted[currentIdx + 1] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <SEOHead
        title={`${collection.title} | The Rick Hesse Canon`}
        description={collection.purpose}
      />
      <MarketingNav />

      <main className="flex-grow">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <header className="relative pt-24 pb-12 px-6 border-b border-slate-800">
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-br ${colors.gradient} opacity-[0.06] blur-[100px] rounded-full pointer-events-none`} />

          <div className="max-w-4xl mx-auto relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
              <Link to="/canon" className="hover:text-white transition-colors flex items-center gap-1">
                <Library className="w-3.5 h-3.5" /> Canon
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className={colors.text}>{collection.title}</span>
            </nav>

            {/* Collection header */}
            <div className="flex items-start gap-5 mb-6">
              <div className={`w-16 h-16 rounded-2xl ${colors.bg} ${colors.border} border flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-8 h-8 ${colors.text}`} />
              </div>
              <div>
                <span className={`text-xs font-bold uppercase tracking-wider ${colors.text} mb-1 block`}>
                  Collection {collection.display_order} of {CANON_COLLECTIONS.length}
                </span>
                <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                  {collection.title}
                </h1>
                {collection.subtitle && (
                  <p className="text-lg text-slate-400 mt-1">{collection.subtitle}</p>
                )}
              </div>
            </div>

            {/* Stats bar */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 mb-6">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {totalTime} min total reading time
              </span>
              {progress.completed > 0 && (
                <span className={`flex items-center gap-1.5 ${colors.text} font-semibold`}>
                  <Sparkles className="w-4 h-4" />
                  {progress.percent}% complete
                </span>
              )}
            </div>

            {/* Progress bar */}
            <CollectionProgressBar entries={entries} color={collection.color} />
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* ── Purpose & Overview ────────────────────────────────────────── */}
          <section className="mb-12">
            <div className={`p-6 rounded-2xl ${colors.bg} ${colors.border} border`}>
              <h2 className={`text-sm font-bold uppercase tracking-wider ${colors.text} mb-3`}>
                About This Collection
              </h2>
              <p className="text-white text-base leading-relaxed">{collection.purpose}</p>
              {collection.overview && (
                <div className="mt-4 text-slate-400 text-sm leading-relaxed prose prose-invert prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: collection.overview }}
                />
              )}
            </div>
          </section>

          {/* ── Continue Reading Banner ───────────────────────────────────── */}
          {entries.length > 0 && progress.completed > 0 && progress.completed < entries.length && (
            <section className="mb-8">
              <ContinueReadingBanner
                entries={entries}
                collectionTitle={collection.title}
                color={collection.color}
              />
            </section>
          )}

          {/* ── Start Reading CTA (if not started) ───────────────────────── */}
          {entries.length > 0 && progress.completed === 0 && (
            <section className="mb-8">
              <Link
                to={entries[0].original_url}
                className={`group flex items-center gap-4 p-5 rounded-xl ${colors.solid} ${colors.hover} transition-all`}
              >
                <BookOpen className="w-6 h-6 text-white flex-shrink-0" />
                <div className="flex-grow">
                  <p className="text-white/80 text-xs font-semibold mb-0.5">Begin this collection</p>
                  <p className="text-white font-bold text-lg">{entries[0].title}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </Link>
            </section>
          )}

          {/* ── Reading Order ────────────────────────────────────────────── */}
          <section className="mb-12">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-slate-500" />
              Reading Order
            </h2>
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
              <ReadingOrderList entries={entries} color={collection.color} />
            </div>
          </section>

          {/* ── Entry Cards (detailed view) ──────────────────────────────── */}
          <section className="mb-12">
            <h2 className="text-lg font-bold text-white mb-6">Entries in This Collection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {entries.map((entry, i) => (
                <CanonCard key={entry.id} entry={entry} index={i} showSeries={false} />
              ))}
            </div>

            {entries.length === 0 && (
              <div className="text-center py-16">
                <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500">This collection is being curated. Check back soon.</p>
              </div>
            )}
          </section>

          {/* ── Collection Navigation ────────────────────────────────────── */}
          <nav className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-800">
            {prevCollection ? (
              <Link
                to={`/canon/collection/${prevCollection.slug}`}
                className="flex-1 group flex items-center gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Previous collection</p>
                  <p className="text-sm text-white font-semibold truncate">{prevCollection.title}</p>
                </div>
              </Link>
            ) : <div className="flex-1" />}

            {nextCollection && (
              <Link
                to={`/canon/collection/${nextCollection.slug}`}
                className="flex-1 group flex items-center justify-end gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all text-right"
              >
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">Next collection</p>
                  <p className="text-sm text-white font-semibold truncate">{nextCollection.title}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors flex-shrink-0" />
              </Link>
            )}
          </nav>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

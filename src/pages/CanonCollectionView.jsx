/**
 * R0.6.2 — Canon Collection View (Public)
 * Dynamic collection page with reading order, progress tracking,
 * and estimated time. Fully entity-driven.
 * Route: /canon/collection/:slug
 */
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { useKnowledgeGraph, THEME_COLORS } from '@/lib/knowledgeGraph';
import { CollectionEntryList, getCollectionProgress } from '@/components/knowledge/ReaderJourney';
import {
  ArrowLeft, BookOpen, Clock, CheckCircle2,
  Loader2, Compass
} from 'lucide-react';

export default function CanonCollectionView() {
  const { slug } = useParams();
  const kg = useKnowledgeGraph();

  const collectionData = useMemo(() => {
    return kg.getCollectionWithEntries(slug);
  }, [kg, slug]);

  if (kg.loading) {
    return (
      <>
        <MarketingNav />
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      </>
    );
  }

  if (!collectionData) {
    return (
      <>
        <MarketingNav />
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-2xl font-black mb-4">Collection Not Found</h1>
            <Link to="/canon" className="text-cyan-400 hover:underline text-sm">
              ← Back to Canon
            </Link>
          </div>
        </div>
      </>
    );
  }

  const { entries, ...collection } = collectionData;
  const colors = THEME_COLORS[collection.color] || THEME_COLORS.blue;
  const totalTime = entries.reduce((sum, e) => sum + (e.estimated_read_time || 4), 0);
  const progress = getCollectionProgress(collection.slug, entries.length);

  return (
    <>
      <SEOHead
        title={`${collection.title} — The Rick Hesse Canon`}
        description={collection.purpose || collection.subtitle || `Explore the ${collection.title} collection at NTA.`}
        canonicalPath={`/canon/collection/${slug}`}
      />
      <MarketingNav />

      <div className="min-h-screen bg-slate-950 text-white">
        {/* Header */}
        <section className="pt-24 pb-8 px-6">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/canon"
              className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Canon
            </Link>

            <div className="flex items-center gap-2 mb-4">
              <div className={`w-10 h-10 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                <Compass className={`w-5 h-5 ${colors.text}`} />
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest ${colors.text}`}>
                {collection.collection_type === 'reader_journey' ? 'Reader Journey' : 'Collection'}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black leading-tight mb-3">
              {collection.title}
            </h1>
            {collection.subtitle && (
              <p className="text-lg text-slate-400 mb-4">{collection.subtitle}</p>
            )}
            {collection.purpose && (
              <p className="text-sm text-slate-500 leading-relaxed mb-6">{collection.purpose}</p>
            )}
            {collection.introduction && (
              <div className="text-sm text-slate-400 leading-relaxed mb-6 prose prose-invert prose-sm max-w-none">
                {collection.introduction}
              </div>
            )}

            {/* Stats bar */}
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> {entries.length} entries
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {totalTime} min total
              </span>
              {progress.read > 0 && (
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className={`w-4 h-4 ${colors.text}`} />
                  {progress.read}/{progress.total} read ({progress.percent}%)
                </span>
              )}
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-slate-800 rounded-full mt-4">
              <div
                className={`h-1.5 ${colors.solid} rounded-full transition-all duration-500`}
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
        </section>

        {/* Reading List */}
        <section className="pb-16 px-6">
          <div className="max-w-3xl mx-auto">
            <CollectionEntryList
              collectionSlug={collection.slug}
              entries={entries}
              color={collection.color}
            />
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}

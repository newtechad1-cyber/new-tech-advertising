/**
 * R0.6.2 — Canon Explorer (Public)
 * The front door to the Rick Hesse Knowledge System.
 * 100% entity-driven — reads from PublishingArticle + CanonCollection.
 * Route: /canon
 */
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { useKnowledgeGraph, THEME_COLORS, ASSET_TYPE_META, BUYER_STAGE_COLORS } from '@/lib/knowledgeGraph';
import { CollectionCard } from '@/components/knowledge/ReaderJourney';
import {
  Search, BookOpen, Filter, X, ArrowRight,
  Clock, Play, Loader2, Compass, FileText,
  GraduationCap, BarChart3, Briefcase
} from 'lucide-react';

function AssetCard({ article }) {
  const meta = ASSET_TYPE_META[article.asset_type] || ASSET_TYPE_META.article;
  const stageColor = BUYER_STAGE_COLORS[article.buyer_stage] || {};
  const url = article.canonical_url || `/${article.slug}`;

  return (
    <Link
      to={url}
      className="group block p-4 rounded-xl bg-slate-900/30 border border-slate-800 hover:border-slate-700 transition-all"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {meta.label}
        </span>
        {article.has_video && <Play className="w-3 h-3 text-red-400" />}
        {article.buyer_stage && (
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${stageColor.bg || ''} ${stageColor.text || ''} border ${stageColor.border || ''}`}>
            {article.buyer_stage}
          </span>
        )}
      </div>
      <h3 className="text-sm font-bold text-white mb-1 group-hover:text-blue-400 transition-colors line-clamp-2">
        {article.title}
      </h3>
      {article.summary && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-2">{article.summary}</p>
      )}
      <div className="flex items-center gap-3 text-[10px] text-slate-600">
        {article.estimated_read_time && (
          <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> {article.estimated_read_time}m</span>
        )}
        {article.canon_id && (
          <span className="font-mono">{article.canon_id}</span>
        )}
      </div>
    </Link>
  );
}

export default function CanonExplorer() {
  const kg = useKnowledgeGraph();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStage, setFilterStage] = useState('all');

  const collectionsWithEntries = useMemo(() => {
    return kg.getCollectionsWithCounts().filter(c => c.status === 'Published');
  }, [kg]);

  const featuredCollections = useMemo(() => {
    return collectionsWithEntries.filter(c => c.featured);
  }, [collectionsWithEntries]);

  const allPublished = useMemo(() => {
    return kg.getPublished()
      .filter(a => a.asset_type === 'article' || a.asset_type === 'lesson' || a.asset_type === 'case_study')
      .sort((a, b) => (a.suggested_reading_order || 99) - (b.suggested_reading_order || 99));
  }, [kg]);

  const filteredArticles = useMemo(() => {
    let results = searchQuery ? kg.search(searchQuery) : allPublished;

    if (filterType !== 'all') {
      results = results.filter(a => a.asset_type === filterType);
    }
    if (filterStage !== 'all') {
      results = results.filter(a => a.buyer_stage === filterStage);
    }

    return results.filter(a => a.asset_type === 'article' || a.asset_type === 'lesson' || a.asset_type === 'case_study');
  }, [searchQuery, filterType, filterStage, kg, allPublished]);

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

  return (
    <>
      <SEOHead
        title="The Rick Hesse Canon — NTA Knowledge Library"
        description="Explore the complete knowledge system: articles, lessons, case studies, and reader journeys from Rick Hesse and New Tech Advertising."
        canonicalPath="/canon"
      />
      <MarketingNav />

      <div className="min-h-screen bg-slate-950 text-white">
        {/* Hero */}
        <section className="pt-24 pb-12 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">
                The Rick Hesse Canon
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
              Knowledge Library
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
              {allPublished.length} articles, lessons, and case studies.{' '}
              {collectionsWithEntries.length} curated reading journeys.{' '}
              Decades of business knowledge, organized and connected.
            </p>
          </div>
        </section>

        {/* Featured Collections */}
        {featuredCollections.length > 0 && (
          <section className="pb-12 px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
                Featured Journeys
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredCollections.map(col => {
                  const entries = (col.entry_canon_ids || []).map(id => kg.getByCanonId(id)).filter(Boolean);
                  return <CollectionCard key={col.slug} collection={col} entries={entries} />;
                })}
              </div>
            </div>
          </section>
        )}

        {/* All Collections */}
        <section className="pb-12 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
              All Collections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collectionsWithEntries.map(col => {
                const entries = (col.entry_canon_ids || []).map(id => kg.getByCanonId(id)).filter(Boolean);
                return <CollectionCard key={col.slug} collection={col} entries={entries} />;
              })}
            </div>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="pb-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search the Canon..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-700"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="px-3 py-2.5 bg-slate-900/50 border border-slate-800 rounded-lg text-sm text-white focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="article">Articles</option>
                <option value="lesson">Lessons</option>
                <option value="case_study">Case Studies</option>
              </select>
              <select
                value={filterStage}
                onChange={e => setFilterStage(e.target.value)}
                className="px-3 py-2.5 bg-slate-900/50 border border-slate-800 rounded-lg text-sm text-white focus:outline-none"
              >
                <option value="all">All Stages</option>
                <option value="Awareness">Awareness</option>
                <option value="Consideration">Consideration</option>
                <option value="Decision">Decision</option>
              </select>
            </div>

            <div className="text-xs text-slate-500 mb-4">{filteredArticles.length} results</div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.map(article => (
                <AssetCard key={article.id || article.canon_id} article={article} />
              ))}
            </div>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}

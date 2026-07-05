/**
 * C-001 Canon Library — Explorer Page
 * The main entry point to the Rick Hesse Canon.
 * Provides search, theme/series/type filters, and collection browsing.
 * Route: /canon
 */
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, BookOpen, Filter, X, Sparkles, ArrowRight,
  Library, SlidersHorizontal, LayoutGrid, List
} from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import CanonCard from '@/components/canon/CanonCard';
import CanonCollectionCard from '@/components/canon/CanonCollectionCard';
import {
  CANON_ENTRIES, CANON_COLLECTIONS,
  searchCanon, filterCanonEntries,
  getAllThemes, getAllSeries, getAllContentTypes,
} from '@/components/canon/canonData';

export default function CanonExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTheme, setActiveTheme] = useState(null);
  const [activeSeries, setActiveSeries] = useState(null);
  const [activeType, setActiveType] = useState(null);
  const [viewMode, setViewMode] = useState('collections'); // collections | entries
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const themes = useMemo(() => getAllThemes(), []);
  const series = useMemo(() => getAllSeries(), []);
  const contentTypes = useMemo(() => getAllContentTypes(), []);

  const filteredEntries = useMemo(() => {
    let results;
    if (searchQuery.trim()) {
      results = searchCanon(searchQuery);
    } else {
      results = filterCanonEntries({
        theme: activeTheme,
        series: activeSeries,
        contentType: activeType,
      });
    }
    return results;
  }, [searchQuery, activeTheme, activeSeries, activeType]);

  const featuredCollections = CANON_COLLECTIONS.filter(c => c.featured);
  const allCollections = [...CANON_COLLECTIONS].sort((a, b) => a.display_order - b.display_order);
  const hasActiveFilters = activeTheme || activeSeries || activeType || searchQuery;
  const publishedCount = CANON_ENTRIES.filter(e => e.status === 'Published').length;

  function clearFilters() {
    setActiveTheme(null);
    setActiveSeries(null);
    setActiveType(null);
    setSearchQuery('');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <SEOHead
        title="The Rick Hesse Canon | New Tech Advertising"
        description="Explore Rick Hesse's collected writings on AI marketing, business philosophy, digital trust, and building better local businesses. Articles, journals, case studies, and lessons learned across 45 years."
      />
      <MarketingNav />

      <main className="flex-grow">
        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <header className="relative pt-24 pb-16 px-6 text-center border-b border-slate-800">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/8 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-4xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
              <Library className="w-4 h-4" />
              The Rick Hesse Canon
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-[1.1] text-white tracking-tight">
              45 Years of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Business Wisdom</span>
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto mb-8">
              Articles, journals, case studies, and lessons from Rick Hesse —
              organized into reading journeys that build on each other.
              Not a blog. A body of work.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <BookOpen className="w-4 h-4" />
                <span><strong className="text-white">{publishedCount}</strong> entries</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Sparkles className="w-4 h-4" />
                <span><strong className="text-white">{allCollections.length}</strong> collections</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Filter className="w-4 h-4" />
                <span><strong className="text-white">{themes.length}</strong> themes</span>
              </div>
            </div>

            {/* Search bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search the Canon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all text-base"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* ── View Toggle & Filters ────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            {/* View toggle */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
              <button
                onClick={() => { setViewMode('collections'); clearFilters(); }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  viewMode === 'collections' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2"><LayoutGrid className="w-4 h-4" /> Collections</span>
              </button>
              <button
                onClick={() => setViewMode('entries')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  viewMode === 'entries' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2"><List className="w-4 h-4" /> All Entries</span>
              </button>
            </div>

            {/* Filter toggle (entries view only) */}
            {viewMode === 'entries' && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                  showFilters || hasActiveFilters
                    ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                )}
              </button>
            )}
          </div>

          {/* ── Filter Panel ──────────────────────────────────────────────── */}
          {viewMode === 'entries' && showFilters && (
            <div className="mb-8 p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Filter by</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-blue-400 hover:text-blue-300 font-semibold">
                    Clear all
                  </button>
                )}
              </div>

              {/* Themes */}
              <div className="mb-4">
                <label className="text-xs text-slate-500 font-semibold mb-2 block">Theme</label>
                <div className="flex flex-wrap gap-2">
                  {themes.map(theme => (
                    <button
                      key={theme}
                      onClick={() => setActiveTheme(activeTheme === theme ? null : theme)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        activeTheme === theme
                          ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              {/* Series */}
              <div className="mb-4">
                <label className="text-xs text-slate-500 font-semibold mb-2 block">Series</label>
                <div className="flex flex-wrap gap-2">
                  {series.map(s => (
                    <button
                      key={s}
                      onClick={() => setActiveSeries(activeSeries === s ? null : s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        activeSeries === s
                          ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Types */}
              <div>
                <label className="text-xs text-slate-500 font-semibold mb-2 block">Type</label>
                <div className="flex flex-wrap gap-2">
                  {contentTypes.map(t => (
                    <button
                      key={t}
                      onClick={() => setActiveType(activeType === t ? null : t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        activeType === t
                          ? 'bg-purple-500/20 border-purple-500/30 text-purple-400'
                          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Collections View ──────────────────────────────────────────── */}
          {viewMode === 'collections' && !hasActiveFilters && (
            <>
              {/* Start Here CTA */}
              <div className="mb-12">
                <Link
                  to="/canon/collection/start-here"
                  className="group block p-8 rounded-2xl bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 hover:border-blue-500/40 transition-all"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-1">New here?</p>
                      <h2 className="text-2xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors">
                        Start Your Reading Journey
                      </h2>
                      <p className="text-slate-400">
                        Begin with Rick's founding story, understand the patterns that drive everything, and discover what makes NTA different.
                      </p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-blue-400 group-hover:translate-x-2 transition-transform flex-shrink-0" />
                  </div>
                </Link>
              </div>

              {/* Featured Collections */}
              <section className="mb-12">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Featured Collections
                </h2>
                <div className="space-y-4">
                  {featuredCollections.map(col => (
                    <CanonCollectionCard key={col.slug} collection={col} size="featured" />
                  ))}
                </div>
              </section>

              {/* All Collections Grid */}
              <section>
                <h2 className="text-xl font-bold text-white mb-6">All Collections</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {allCollections.map(col => (
                    <CanonCollectionCard key={col.slug} collection={col} />
                  ))}
                </div>
              </section>
            </>
          )}

          {/* ── Entries View / Search Results ────────────────────────────── */}
          {(viewMode === 'entries' || hasActiveFilters) && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">
                  {searchQuery
                    ? `Results for "${searchQuery}"`
                    : hasActiveFilters
                      ? 'Filtered Entries'
                      : 'All Canon Entries'
                  }
                  <span className="text-slate-500 font-normal ml-2">({filteredEntries.length})</span>
                </h2>
              </div>

              {filteredEntries.length === 0 ? (
                <div className="text-center py-20">
                  <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg mb-2">No entries found</p>
                  <p className="text-slate-600 text-sm mb-6">Try adjusting your search or filters</p>
                  <button onClick={clearFilters} className="text-blue-400 hover:text-blue-300 text-sm font-semibold">
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEntries.map((entry, i) => (
                    <CanonCard key={entry.id} entry={entry} index={i} />
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
        <section className="border-t border-slate-800 py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to See What's Possible?</h2>
            <p className="text-slate-400 mb-8">
              Get a free AI Gap Audit and discover where your business stands in the new digital landscape.
            </p>
            <Link
              to="/gap-audit"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-blue-600/20"
            >
              Request Your Free Gap Audit <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

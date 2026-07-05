/**
 * J-001 NTA Journal — Landing Page (Public)
 * Weekly publication documenting the public building of New Tech Advertising.
 * Route: /journal
 */
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import {
  Newspaper, Search, Clock, ArrowRight, BookOpen,
  ChevronRight, Calendar, Tag, Filter, X, Rss, Mail,
  Loader2, Eye
} from 'lucide-react';
import {
  JOURNAL_CATEGORIES, CATEGORY_COLORS, SECTION_LABELS,
  formatIssueDate, formatShortDate, estimateReadTime
} from '../components/journal/journalData';

function IssueCard({ issue, featured = false }) {
  const catColor = CATEGORY_COLORS[issue.category] || CATEGORY_COLORS['Building NTA'];
  const readTime = estimateReadTime(issue);

  if (featured) {
    return (
      <Link
        to={`/journal/${issue.slug || `issue-${issue.issue_number}`}`}
        className="group block p-6 md:p-8 rounded-2xl bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 hover:border-blue-500/40 transition-all"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {issue.featured_image_url && (
            <div className="w-full md:w-64 h-48 md:h-auto rounded-xl overflow-hidden flex-shrink-0">
              <img src={issue.featured_image_url} alt={issue.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">
                Issue #{issue.issue_number} · Vol. {issue.volume || 1}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${catColor.bg} ${catColor.text} border ${catColor.border}`}>
                {issue.category}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3 group-hover:text-blue-400 transition-colors leading-tight">
              {issue.title}
            </h2>
            {issue.summary && (
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{issue.summary}</p>
            )}
            {issue.from_ricks_desk && (
              <p className="text-slate-500 text-sm italic line-clamp-2 mb-4">
                "{issue.from_ricks_desk.slice(0, 200)}..."
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatShortDate(issue.date)}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {readTime} min read</span>
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {issue.views || 0} views</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/journal/${issue.slug || `issue-${issue.issue_number}`}`}
      className="group block p-4 rounded-xl bg-slate-900/30 border border-slate-800 hover:border-slate-700 transition-all"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-slate-500 text-[10px] font-bold">#{issue.issue_number}</span>
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${catColor.bg} ${catColor.text} border ${catColor.border}`}>
          {issue.category}
        </span>
      </div>
      <h3 className="text-sm font-bold text-white mb-1 group-hover:text-blue-400 transition-colors line-clamp-2">
        {issue.title}
      </h3>
      {issue.summary && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-2">{issue.summary}</p>
      )}
      <div className="flex items-center gap-3 text-[10px] text-slate-600">
        <span>{formatShortDate(issue.date)}</span>
        <span>{readTime} min</span>
      </div>
    </Link>
  );
}

export default function JournalLanding() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    window.scrollTo(0, 0);
    async function load() {
      try {
        const data = await base44.entities.JournalIssue.list('-issue_number', 200);
        setIssues(data.filter(i => i.status === 'Published'));
      } catch (err) {
        console.error('Failed to load journal:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    let result = [...issues];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i =>
        i.title?.toLowerCase().includes(q) ||
        i.summary?.toLowerCase().includes(q) ||
        i.from_ricks_desk?.toLowerCase().includes(q) ||
        i.what_we_built?.toLowerCase().includes(q) ||
        i.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    if (activeCategory) {
      result = result.filter(i => i.category === activeCategory);
    }
    return result;
  }, [issues, searchQuery, activeCategory]);

  const latestIssue = issues[0];
  const olderIssues = filtered.slice(latestIssue && !searchQuery && !activeCategory ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <SEOHead
        title="The NTA Journal | New Tech Advertising"
        description="Weekly dispatches from the front lines of building a modern advertising agency. Rick Hesse documents what we build, what we learn, and what it means for your business."
      />
      <MarketingNav />

      <main className="flex-grow">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <header className="relative pt-24 pb-16 px-6 text-center border-b border-slate-800">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-600/8 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-4xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
              <Newspaper className="w-4 h-4" />
              The NTA Journal
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-[1.1] text-white tracking-tight">
              Building in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Public</span>
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto mb-8">
              Weekly dispatches from Rick Hesse documenting what we build, what we learn,
              and what it means for your business. New issues every Monday at 7:00 AM.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <BookOpen className="w-4 h-4" />
                <span><strong className="text-white">{issues.length}</strong> issues</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>Every <strong className="text-white">Monday</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Clock className="w-4 h-4" />
                <span><strong className="text-white">7:00 AM</strong> CT</span>
              </div>
            </div>

            {/* Search */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search the Journal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all text-base"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* ── Categories ───────────────────────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                !activeCategory ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              All Issues
            </button>
            {JOURNAL_CATEGORIES.map(cat => {
              const c = CATEGORY_COLORS[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    activeCategory === cat ? `${c.bg} ${c.border} ${c.text}` : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          ) : issues.length === 0 ? (
            <div className="text-center py-20">
              <Newspaper className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">First Issue Coming Soon</h2>
              <p className="text-slate-500 max-w-md mx-auto">
                The NTA Journal launches with Issue #1. Subscribe to be notified.
              </p>
            </div>
          ) : (
            <>
              {/* Featured (latest) issue */}
              {latestIssue && !searchQuery && !activeCategory && (
                <section className="mb-12">
                  <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4">Latest Issue</h2>
                  <IssueCard issue={latestIssue} featured />
                </section>
              )}

              {/* Archive grid */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {searchQuery ? `Results for "${searchQuery}"` : activeCategory || 'All Issues'}
                    <span className="ml-2 text-slate-600">({olderIssues.length})</span>
                  </h2>
                </div>

                {olderIssues.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No issues found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {olderIssues.map(issue => (
                      <IssueCard key={issue.id} issue={issue} />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>

        {/* ── Subscribe CTA ──────────────────────────────────────────────── */}
        <section className="border-t border-slate-800 py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Mail className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">Never Miss an Issue</h2>
            <p className="text-slate-400 mb-6">
              Get The NTA Journal delivered to your inbox every Monday morning.
              Real stories from building a modern advertising agency.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                to="/gap-audit"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
              >
                <Mail className="w-5 h-5" /> Subscribe
              </Link>
              <a
                href="/rss"
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-4 rounded-xl transition-colors"
              >
                <Rss className="w-4 h-4 text-orange-400" /> RSS
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

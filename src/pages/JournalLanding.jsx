/**
 * J-001 NTA Journal — Landing Page (Public)
 * Public archive for complete NTA Journal newsletter editions.
 * Route: /journal
 */
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import { useKnowledgeGraph } from '@/lib/knowledgeGraph';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import {
  Newspaper, Search, Clock, BookOpen,
  Calendar, X, Rss, Mail, ArrowRight,
  Loader2, Eye
} from 'lucide-react';
import {
  JOURNAL_CATEGORIES, CATEGORY_COLORS, JOURNAL_CATEGORY_GUIDES,
  formatShortDate, estimateReadTime
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
  const kg = useKnowledgeGraph();
  const loading = kg.loading;
  const issues = useMemo(() =>
    (kg.journals || [])
      .filter(i => i.status === 'Published')
      .sort((a, b) => (b.issue_number || 0) - (a.issue_number || 0)),
    [kg.journals]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

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
  const activeCategoryGuide = activeCategory ? JOURNAL_CATEGORY_GUIDES[activeCategory] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <SEOHead
        title="The NTA Journal Archive | New Tech Advertising"
        description="Browse complete editions of The NTA Journal, with practical business, growth, customer trust, and useful AI guidance from Rick Hesse."
      />
      <MarketingNav />

      <main className="flex-grow">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <header className="relative pt-24 pb-16 px-6 text-center border-b border-slate-800">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-600/8 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-4xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
              <Newspaper className="w-4 h-4" />
              Journal Archive
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-[1.1] text-white tracking-tight">
              Complete editions of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">The NTA Journal</span>
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto mb-8">
              Read past issues of NTA's free weekly publication for practical business thinking,
              useful AI guidance, and honest lessons from doing the work.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <BookOpen className="w-4 h-4" />
                <span><strong className="text-white">{issues.length}</strong> issues</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>Every <strong className="text-white">Tuesday</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Clock className="w-4 h-4" />
                <span><strong className="text-white">Morning</strong> CT</span>
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
            <Link
              to="/nta-journal#subscribe"
              className="mt-6 inline-flex items-center gap-2 font-bold text-indigo-400 hover:text-indigo-300"
            >
              Learn about the Journal and subscribe <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        {issues.length > 0 && (
          <section className="border-b border-slate-800 bg-slate-900/20 px-6 py-8" aria-labelledby="published-issues-heading">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">Published issues</p>
                  <h2 id="published-issues-heading" className="mt-1 text-2xl font-black text-white">The NTA Journal, issue by issue</h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-400">
                    Browse the published issues and follow the Knowledge Library lesson behind each one.
                  </p>
                </div>
                <Link
                  to="/nta-journal#subscribe"
                  className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300"
                >
                  Subscribe <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                {issues.map(issue => (
                  <div key={issue.id || issue.issue_number} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                    <Link
                      to={`/journal/${issue.slug || `issue-${issue.issue_number}`}`}
                      className="group block"
                    >
                      <span className="text-xs font-bold text-indigo-400">Issue #{issue.issue_number}</span>
                      <span className="mt-1 block text-sm font-semibold leading-snug text-white group-hover:text-indigo-300">
                        {issue.title}
                      </span>
                      <span className="mt-3 block text-xs font-bold text-slate-500 group-hover:text-slate-300">
                        Read the issue <ArrowRight className="ml-1 inline h-3 w-3" />
                      </span>
                    </Link>
                    {issue.cta_url?.startsWith('/canon/') && (
                      <Link
                        to={issue.cta_url}
                        className="mt-4 flex items-center gap-1 border-t border-slate-800 pt-3 text-xs font-bold text-indigo-400 hover:text-indigo-300"
                      >
                        Related Knowledge Library lesson <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

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
              const issueCount = issues.filter(issue => issue.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  aria-pressed={activeCategory === cat}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    activeCategory === cat ? `${c.bg} ${c.border} ${c.text}` : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat} <span className="ml-1 opacity-60">({issueCount})</span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Browse by topic. Existing lessons are available now, and future Journal issues will be added to these same topics.
          </p>

          {activeCategoryGuide && (
            <section className="mb-10 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-slate-900/60 to-slate-900/30 p-6 md:p-8" aria-live="polite">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="max-w-2xl">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-400">{activeCategoryGuide.eyebrow}</p>
                  <h2 className="mb-3 text-2xl font-black text-white">{activeCategoryGuide.title}</h2>
                  <p className="text-sm leading-relaxed text-slate-400">{activeCategoryGuide.description}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {olderIssues.length > 0 ? (
                      <>{olderIssues.length} Journal issue{olderIssues.length === 1 ? '' : 's'} in this topic</>
                    ) : 'No Journal issue in this topic yet'}
                  </p>
                </div>
                <Link
                  to={activeCategoryGuide.collectionUrl}
                  className="inline-flex shrink-0 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-sm font-bold text-indigo-300 transition-colors hover:bg-indigo-500/20"
                >
                  Explore {activeCategoryGuide.collectionLabel}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 border-t border-slate-800/80 pt-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Related reading now</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {activeCategoryGuide.resources.map(resource => (
                    <Link
                      key={resource.url}
                      to={resource.url}
                      className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 transition-colors hover:border-indigo-500/40 hover:bg-slate-950/70"
                    >
                      <span className="text-sm font-semibold leading-snug text-white">{resource.title}</span>
                      <span className="mt-2 block text-xs font-bold text-indigo-400">Read now <ArrowRight className="ml-1 inline h-3 w-3" /></span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

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

        {/* ── Featured Perspective ────────────────────────────────────────── */}
        <section className="border-t border-slate-800 py-12 px-6 bg-slate-900/30">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 block">
                Featured NTA Perspective
              </span>
              <h2 className="text-2xl font-black text-white mb-3">Tools vs. Systems: What Advertising and AI Cannot Do Alone</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Business owners are sold tools every day. But access to another tool is not the same as having a system that makes it useful.
              </p>
              <Link to="/knowledge/articles/they-sold-me-the-tools-they-didnt-give-me-a-system" className="text-indigo-400 hover:text-indigo-300 font-bold text-sm">
                Read the Flagship Article →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Newsletter landing CTA ────────────────────────────────────── */}
        <section className="border-t border-slate-800 py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Mail className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">Want the Journal in Your Inbox?</h2>
            <p className="text-slate-400 mb-6">
              Visit the Journal subscription page to see what each edition includes,
              read the first issue, and join the free Monday email.
            </p>
            <Link
              to="/nta-journal#subscribe"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-500"
            >
              Learn More & Subscribe <ArrowRight className="h-5 w-5" />
            </Link>
            <div className="mt-5 flex items-center justify-center">
              <Link
                to="/journal"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
              >
                <Rss className="w-4 h-4 text-orange-400" /> Browse the Journal
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

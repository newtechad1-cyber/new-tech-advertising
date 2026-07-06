/**
 * R0.6.2 — Dynamic Homepage Sections
 * Non-destructive components that can replace hardcoded content blocks
 * on the homepage with data from the Publishing Engine.
 *
 * These are drop-in components — the homepage layout, messaging, branding,
 * and primary CTAs remain unchanged. Only content blocks update automatically.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Compass, Clock, Play,
  FileText, BarChart3, Newspaper
} from 'lucide-react';

// ─── Featured Articles Row ──────────────────────────────────────────────────
// Replaces any hardcoded "latest articles" or "insights" section.
export function DynamicFeaturedArticles({ articles = [], title = 'From the Canon' }) {
  if (articles.length === 0) return null;

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-black text-white">{title}</h2>
          </div>
          <Link
            to="/canon"
            className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Explore All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(0, 6).map(article => (
            <Link
              key={article.id || article.canon_id}
              to={article.canonical_url || `/${article.slug}`}
              className="group block p-5 rounded-xl bg-slate-900/30 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                {article.has_video ? (
                  <Play className="w-3.5 h-3.5 text-red-400" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {article.asset_type === 'case_study' ? 'Case Study' : article.content_type || 'Article'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                {article.title}
              </h3>
              {article.summary && (
                <p className="text-xs text-slate-500 line-clamp-2 mb-3">{article.summary}</p>
              )}
              <div className="flex items-center gap-3 text-[10px] text-slate-600">
                {article.estimated_read_time && (
                  <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> {article.estimated_read_time}m</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Latest Journal Section ─────────────────────────────────────────────────
// Replaces any hardcoded news/updates section.
export function DynamicLatestJournal({ journals = [] }) {
  if (journals.length === 0) return null;

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-black text-white">The NTA Journal</h2>
          </div>
          <Link
            to="/journal"
            className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            All Issues <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {journals.slice(0, 3).map(journal => (
            <Link
              key={journal.id}
              to={`/journal/${journal.slug || `issue-${journal.issue_number}`}`}
              className="group block p-5 rounded-xl bg-slate-900/30 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-2 block">
                Issue #{journal.issue_number} · {journal.category || 'Building NTA'}
              </span>
              <h3 className="text-sm font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                {journal.title}
              </h3>
              {journal.summary && (
                <p className="text-xs text-slate-500 line-clamp-2">{journal.summary}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Featured Collections Strip ─────────────────────────────────────────────
// Replaces any hardcoded "explore" or "learn more" sections.
export function DynamicCollectionsStrip({ collections = [] }) {
  if (collections.length === 0) return null;

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-black text-white">Start a Journey</h2>
          </div>
          <Link
            to="/canon"
            className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            All Journeys <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {collections.slice(0, 4).map(col => (
            <Link
              key={col.slug}
              to={`/canon/collection/${col.slug}`}
              className="group block p-4 rounded-xl bg-slate-900/30 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <h3 className="text-sm font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                {col.title}
              </h3>
              {col.subtitle && (
                <p className="text-xs text-slate-500 line-clamp-1 mb-2">{col.subtitle}</p>
              )}
              <span className="text-[10px] text-slate-600">
                {col.entry_count || (col.entry_canon_ids || []).length} entries
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Case Studies Section ───────────────────────────────────────────────────
export function DynamicCaseStudies({ caseStudies = [] }) {
  if (caseStudies.length === 0) return null;

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-400" />
            <h2 className="text-xl font-black text-white">Success Stories</h2>
          </div>
          <Link
            to="/canon/collection/success-stories"
            className="flex items-center gap-1 text-sm text-teal-400 hover:text-teal-300 transition-colors"
          >
            All Stories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {caseStudies.slice(0, 3).map(cs => (
            <Link
              key={cs.id || cs.canon_id}
              to={cs.canonical_url || `/${cs.slug}`}
              className="group block p-5 rounded-xl bg-slate-900/30 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 mb-2 block">
                Case Study
              </span>
              <h3 className="text-sm font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">
                {cs.title}
              </h3>
              {cs.summary && (
                <p className="text-xs text-slate-500 line-clamp-2">{cs.summary}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * J-001 NTA Journal — Issue View (Public)
 * Individual journal issue with all sections, navigation, and cross-links.
 * Route: /journal/:slug
 */
import { useEffect, useMemo } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { useKnowledgeGraph } from '@/lib/knowledgeGraph';
import {
  Newspaper, ArrowLeft, ArrowRight, BookOpen, Clock, Calendar,
  ChevronRight, Mail, Pen, Hammer, Lightbulb, Target,
  Rocket, Eye, Tag, Loader2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const LucideIcons = { Pen, Hammer, Lightbulb, Target, Rocket, BookOpen };
import {
  CATEGORY_COLORS, SECTION_LABELS, SECTION_ICONS, SECTION_ORDER,
  formatIssueDate, estimateReadTime
} from '../components/journal/journalData';

function JournalSection({ sectionKey, content }) {
  if (!content) return null;
  const label = SECTION_LABELS[sectionKey];
  const iconName = SECTION_ICONS[sectionKey];
  const Icon = LucideIcons[iconName] || BookOpen;

  const sectionColors = {
    from_ricks_desk: 'border-blue-500/20 bg-blue-500/5',
    what_we_built: 'border-green-500/20 bg-green-500/5',
    what_we_learned: 'border-amber-500/20 bg-amber-500/5',
    what_it_means_for_your_business: 'border-purple-500/20 bg-purple-500/5',
    this_weeks_challenge: 'border-red-500/20 bg-red-500/5',
  };
  const iconColors = {
    from_ricks_desk: 'text-blue-400',
    what_we_built: 'text-green-400',
    what_we_learned: 'text-amber-400',
    what_it_means_for_your_business: 'text-purple-400',
    this_weeks_challenge: 'text-red-400',
  };

  return (
    <section className={`p-6 md:p-8 rounded-2xl border ${sectionColors[sectionKey] || 'border-slate-800 bg-slate-900/30'} mb-6`}>
      <div className="flex items-center gap-3 mb-4">
        <Icon className={`w-5 h-5 ${iconColors[sectionKey] || 'text-slate-400'}`} />
        <h2 className="text-lg font-black text-white">{label}</h2>
      </div>
      <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed">
        {content.split('\n').map((line, i) => {
          if (!line.trim()) return <br key={i} />;
          if (line.startsWith('# ')) return <h3 key={i} className="text-lg font-bold text-white mt-4 mb-2">{line.slice(2)}</h3>;
          if (line.startsWith('## ')) return <h4 key={i} className="text-base font-bold text-white mt-3 mb-1">{line.slice(3)}</h4>;
          if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc">{line.slice(2)}</li>;
          if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold text-white">{line.slice(2, -2)}</p>;
          return <p key={i} className="mb-2">{line}</p>;
        })}
      </div>
    </section>
  );
}

export default function JournalIssueView() {
  const { slug } = useParams();
  const kg = useKnowledgeGraph();
  const loading = kg.loading;
  const published = useMemo(() =>
    (kg.journals || [])
      .filter(item => item.status === 'Published')
      .sort((a, b) => (b.issue_number || 0) - (a.issue_number || 0)),
    [kg.journals]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const issue = useMemo(() => {
    const exact = published.find(item => item.slug === slug);
    if (exact) return exact;

    const match = slug?.match(/^issue-(\d+)/);
    if (!match) return null;
    const issueNumber = Number.parseInt(match[1], 10);
    return published.find(item => item.issue_number === issueNumber) || null;
  }, [published, slug]);

  const issueIndex = issue ? published.indexOf(issue) : -1;
  const nextIssue = issueIndex > 0 ? published[issueIndex - 1] : null;
  const prevIssue = issueIndex >= 0 && issueIndex < published.length - 1
    ? published[issueIndex + 1]
    : null;

  if (!loading && !issue) return <Navigate to="/journal" replace />;

  const catColor = issue ? (CATEGORY_COLORS[issue.category] || CATEGORY_COLORS['Building NTA']) : {};
  const readTime = issue ? estimateReadTime(issue) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      {issue && (
        <SEOHead
          title={`${issue.title} — NTA Journal #${issue.issue_number}`}
          description={issue.summary || `Issue #${issue.issue_number} of The NTA Journal by Rick Hesse.`}
        />
      )}
      <MarketingNav />

      <main className="flex-grow">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : issue && (
          <>
            {/* ── Issue Header ───────────────────────────────────────────── */}
            <header className="relative pt-24 pb-12 px-6 border-b border-slate-800">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/6 blur-[100px] rounded-full pointer-events-none" />

              <div className="max-w-3xl mx-auto relative z-10">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                  <Link to="/journal" className="hover:text-white transition-colors flex items-center gap-1">
                    <Newspaper className="w-3.5 h-3.5" /> Journal
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-indigo-400">Issue #{issue.issue_number}</span>
                </nav>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-indigo-400 text-sm font-bold">
                    Issue #{issue.issue_number} · Vol. {issue.volume || 1}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${catColor.bg} ${catColor.text} border ${catColor.border}`}>
                    {issue.category}
                  </span>
                  {issue.series && (
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                      {issue.series}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
                  {issue.title}
                </h1>

                {issue.summary && (
                  <p className="text-lg text-slate-400 leading-relaxed mb-6">{issue.summary}</p>
                )}

                {issue.introductory_message && (
                  <div className="prose prose-invert prose-slate max-w-none text-slate-300 mt-8 mb-6">
                    <ReactMarkdown>{issue.introductory_message}</ReactMarkdown>
                  </div>
                )}

                {issue.cta_text && issue.cta_url && issue.cta_url.startsWith('/canon/') && (
                  <div className="mt-8 mb-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                      Related Knowledge Library lesson
                    </p>
                    <Link
                      to={issue.cta_url}
                      className="inline-flex items-center gap-2 text-base font-bold text-white hover:text-indigo-300 transition-colors"
                    >
                      {issue.cta_text}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}

                {/* Author + Stats */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
                  <span className="font-semibold text-white">{issue.author || 'Rick Hesse'}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatIssueDate(issue.date)}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {readTime} min read</span>
                  {(issue.views || 0) > 0 && (
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {issue.views} views</span>
                  )}
                </div>
              </div>
            </header>

            {/* ── Featured Image ──────────────────────────────────────────── */}
            {issue.featured_image_url && (
              <div className="max-w-3xl mx-auto px-6 -mt-1">
                <div className="rounded-2xl overflow-hidden border border-slate-800 mt-8">
                  <img src={issue.featured_image_url} alt={issue.title} className="w-full h-auto" />
                </div>
              </div>
            )}

            {/* ── Sections ────────────────────────────────────────────────── */}
            <div className="max-w-3xl mx-auto px-6 py-12">
              {/* Table of Contents */}
              <nav className="mb-8 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">In This Issue</h3>
                <div className="space-y-1.5">
                  {SECTION_ORDER.filter(k => issue[k]).map(key => {
                    const Icon = LucideIcons[SECTION_ICONS[key]] || BookOpen;
                    return (
                      <a
                        key={key}
                        href={`#${key}`}
                        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors py-1"
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {SECTION_LABELS[key]}
                      </a>
                    );
                  })}
                </div>
              </nav>

              {/* Sections */}
              {SECTION_ORDER.map(key => (
                <div key={key} id={key}>
                  <JournalSection sectionKey={key} content={issue[key]} />
                </div>
              ))}
              
              {issue.closing_message && (
                <div className="prose prose-invert prose-slate max-w-none text-slate-300 mt-8 mb-6">
                  <ReactMarkdown>{issue.closing_message}</ReactMarkdown>
                </div>
              )}

              {/* Tags */}
              {issue.tags?.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-8 pt-4 border-t border-slate-800">
                  <Tag className="w-3.5 h-3.5 text-slate-600" />
                  {issue.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-400 border border-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA */}
              {issue.cta_text && issue.cta_url && !issue.cta_url.startsWith('/canon/') && (
                <Link
                  to={issue.cta_url}
                  className="block p-6 rounded-2xl bg-gradient-to-r from-indigo-600/10 to-blue-600/10 border border-indigo-500/20 hover:border-indigo-500/40 transition-all text-center group"
                >
                  <p className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {issue.cta_text}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">→ {issue.cta_url}</p>
                </Link>
              )}

              {/* ── Issue Navigation ─────────────────────────────────────── */}
              <nav className="flex flex-col sm:flex-row gap-4 pt-8 mt-8 border-t border-slate-800">
                {prevIssue ? (
                  <Link
                    to={`/journal/${prevIssue.slug || `issue-${prevIssue.issue_number}`}`}
                    className="flex-1 group flex items-center gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all"
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-white flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-500">Previous Issue</p>
                      <p className="text-sm text-white font-semibold truncate">#{prevIssue.issue_number}: {prevIssue.title}</p>
                    </div>
                  </Link>
                ) : <div className="flex-1" />}

                {nextIssue && (
                  <Link
                    to={`/journal/${nextIssue.slug || `issue-${nextIssue.issue_number}`}`}
                    className="flex-1 group flex items-center justify-end gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all text-right"
                  >
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-500">Next Issue</p>
                      <p className="text-sm text-white font-semibold truncate">#{nextIssue.issue_number}: {nextIssue.title}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white flex-shrink-0" />
                  </Link>
                )}
              </nav>

              {/* ── Published Issue Archive ──────────────────────────────── */}
              <section className="mt-10 pt-8 border-t border-slate-800" aria-labelledby="journal-archive-heading">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">The NTA Journal</p>
                    <h2 id="journal-archive-heading" className="text-xl font-black text-white mt-1">Published issues</h2>
                  </div>
                  <Link
                    to="/journal"
                    className="inline-flex items-center gap-1 text-sm font-bold text-indigo-400 hover:text-indigo-300"
                  >
                    View full archive <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {published.map(archiveIssue => (
                    <Link
                      key={archiveIssue.id || archiveIssue.issue_number}
                      to={`/journal/${archiveIssue.slug || `issue-${archiveIssue.issue_number}`}`}
                      aria-current={archiveIssue.issue_number === issue.issue_number ? 'page' : undefined}
                      className={`rounded-xl border p-4 transition-all ${
                        archiveIssue.issue_number === issue.issue_number
                          ? 'border-indigo-500/40 bg-indigo-500/10'
                          : 'border-slate-800 bg-slate-900/30 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold text-indigo-400">Issue #{archiveIssue.issue_number}</span>
                      <span className="mt-1 block text-sm font-semibold text-white line-clamp-2">{archiveIssue.title}</span>
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            {/* ── Subscribe ──────────────────────────────────────────────── */}
            <section className="border-t border-slate-800 py-12 px-6">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-xl font-bold text-white mb-3">Enjoyed This Issue?</h2>
                <p className="text-slate-400 text-sm mb-6">Get The NTA Journal in your inbox every Monday morning.</p>
                <Link
                  to="/nta-journal#subscribe"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition-colors hover:bg-indigo-500"
                >
                  <Mail className="h-4 w-4" /> Learn More & Subscribe
                </Link>
              </div>
            </section>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

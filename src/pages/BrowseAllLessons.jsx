import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Search, SlidersHorizontal } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { masterCurriculumMap } from '@/data/masterCurriculum';

const subjectForCollection = {
  'business-foundations': 'Business Foundations',
  'what-a-lifetime-in-business-taught-me': 'NTA Point of View',
  'truth-about-business-growth': 'Business Growth',
  'how-customers-decide-who-to-trust': 'Customers & Trust',
  'how-businesses-turn-trust-into-lasting-relationships': 'Customers & Trust',
  'turning-what-a-business-knows-into-an-asset': 'Knowledge & Systems',
  'ai-foundations': 'AI',
  'building-a-small-business-with-ai': 'AI',
  'what-is-digital-trust': 'Websites & Digital Trust'
};

const subjects = [
  'All topics',
  'AI',
  'Business Foundations',
  'Business Growth',
  'Customers & Trust',
  'Websites & Digital Trust',
  'Knowledge & Systems',
  'NTA Point of View'
];

export default function BrowseAllLessons() {
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('All topics');
  const [level, setLevel] = useState('All levels');
  const [sort, setSort] = useState('library');

  const levels = useMemo(() => {
    const found = Array.from(new Set(masterCurriculumMap.map(item => item.level).filter(Boolean)));
    return ['All levels', ...found];
  }, []);

  const lessons = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = masterCurriculumMap.filter(item => {
      const itemSubject = subjectForCollection[item.collectionSlug] || item.collectionTitle;
      const matchesSubject = subject === 'All topics' || itemSubject === subject;
      const matchesLevel = level === 'All levels' || item.level === level;
      const searchable = [
        item.lessonTitle,
        item.collectionTitle,
        item.takeaway,
        itemSubject
      ].filter(Boolean).join(' ').toLowerCase();
      const matchesQuery = !normalized || searchable.includes(normalized);
      return matchesSubject && matchesLevel && matchesQuery;
    });

    if (sort === 'az') {
      return [...filtered].sort((a, b) => a.lessonTitle.localeCompare(b.lessonTitle));
    }
    if (sort === 'collection') {
      return [...filtered].sort((a, b) =>
        a.collectionTitle.localeCompare(b.collectionTitle) || a.lessonNumber - b.lessonNumber
      );
    }
    return filtered;
  }, [query, subject, level, sort]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <SEOHead
        title="Browse All Lessons | NTA Knowledge Library"
        description="Search and browse every lesson in the NTA Knowledge Library by topic, collection, level, or title."
      />
      <MarketingNav />

      <main>
        <section className="border-b border-slate-800 px-6 pb-12 pt-24">
          <div className="mx-auto max-w-6xl">
            <Link to="/knowledge" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Back to the Knowledge Library
            </Link>

            <div className="mt-8 max-w-4xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Knowledge Library catalog</p>
              <h1 className="mt-3 text-4xl font-black text-white md:text-5xl">Browse all {masterCurriculumMap.length} lessons</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                Looking for something you remember, or simply want to see what is here? Search the complete lesson library, narrow it by topic, or browse it in the order the learning paths were built.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-800 bg-slate-900/45 px-6 py-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
              <label className="relative block">
                <span className="sr-only">Search lessons</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="Search lesson titles, ideas, or topics..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-white outline-none transition focus:border-blue-400"
                />
              </label>

              <label>
                <span className="sr-only">Filter by topic</span>
                <select value={subject} onChange={event => setSubject(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-400">
                  {subjects.map(item => <option key={item}>{item}</option>)}
                </select>
              </label>

              <label>
                <span className="sr-only">Filter by level</span>
                <select value={level} onChange={event => setLevel(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-400">
                  {levels.map(item => <option key={item}>{item}</option>)}
                </select>
              </label>

              <label>
                <span className="sr-only">Sort lessons</span>
                <select value={sort} onChange={event => setSort(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-400">
                  <option value="library">Learning path order</option>
                  <option value="az">A–Z</option>
                  <option value="collection">Collection name</option>
                </select>
              </label>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
              <p className="font-semibold text-slate-300">{lessons.length} lesson{lessons.length === 1 ? '' : 's'} shown</p>
              {(query || subject !== 'All topics' || level !== 'All levels' || sort !== 'library') && (
                <button
                  onClick={() => { setQuery(''); setSubject('All topics'); setLevel('All levels'); setSort('library'); }}
                  className="inline-flex items-center gap-2 font-semibold text-cyan-300 hover:text-white"
                >
                  <SlidersHorizontal className="h-4 w-4" /> Clear filters
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="px-6 py-12">
          <div className="mx-auto max-w-6xl">
            {lessons.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
                <h2 className="text-2xl font-bold text-white">No lessons matched that search.</h2>
                <p className="mt-3 text-slate-400">Try a broader word or clear one of the filters.</p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {lessons.map(item => {
                  const itemSubject = subjectForCollection[item.collectionSlug] || item.collectionTitle;
                  return (
                    <Link
                      key={item.canonicalUrl}
                      to={item.canonicalUrl}
                      className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition hover:border-blue-500/60 hover:bg-slate-900"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
                        <span className="rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2.5 py-1 text-cyan-300">{itemSubject}</span>
                        {item.level && <span className="rounded-full border border-slate-700 px-2.5 py-1 text-slate-400">{item.level}</span>}
                        {item.readingTime && <span className="text-slate-500">{item.readingTime}</span>}
                      </div>
                      <h2 className="mt-4 text-xl font-bold leading-snug text-white transition group-hover:text-blue-300">{item.lessonTitle}</h2>
                      <p className="mt-2 text-sm font-semibold text-slate-500">{item.collectionTitle} · Lesson {item.lessonNumber}</p>
                      {item.takeaway && <p className="mt-4 line-clamp-3 leading-7 text-slate-400">{item.takeaway}</p>}
                      <span className="mt-5 inline-flex items-center gap-2 font-bold text-blue-300 group-hover:text-white">Read lesson <ArrowRight className="h-4 w-4" /></span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-slate-800 bg-slate-900/35 px-6 py-12">
          <div className="mx-auto flex max-w-6xl flex-col gap-5 rounded-3xl border border-blue-500/20 bg-slate-950 p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-300">Not sure what to read?</p>
              <h2 className="mt-2 text-2xl font-black text-white">You do not have to browse all of it.</h2>
              <p className="mt-3 max-w-2xl leading-7 text-slate-400">Start with a question or follow one of the guided learning paths. The catalog is here when you want to find a specific idea.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/knowledge/questions" className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-500">Start with a question</Link>
              <Link to="/knowledge#collections" className="rounded-xl border border-slate-600 px-5 py-3 font-bold text-white hover:border-blue-300">Learning paths</Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

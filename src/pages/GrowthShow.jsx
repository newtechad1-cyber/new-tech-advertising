import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calendar, Loader2, Newspaper, Play, Search, Share2 } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { useGrowthShow } from '@/hooks/useGrowthShow';

function EpisodeCard({ episode }) {
  return (
    <Link
      to={`/growth-show/${episode.slug}`}
      className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 transition-all hover:-translate-y-1 hover:border-blue-500/40"
    >
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950">
        {episode.thumbnailUrl ? (
          <img
            src={episode.thumbnailUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Play className="h-16 w-16 text-blue-400/70" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        <span className="absolute bottom-4 left-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
          <Play className="h-5 w-5 fill-current" />
        </span>
      </div>
      <div className="p-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-400">
          {episode.episodeNumber ? `Episode ${episode.episodeNumber}` : 'NTA Growth Show'}
        </p>
        <h2 className="text-xl font-black leading-tight text-white transition-colors group-hover:text-blue-300">{episode.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">{episode.summary}</p>
        <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {episode.lessons.length || 1} lesson connection</span>
          <span className="inline-flex items-center gap-1"><Newspaper className="h-3.5 w-3.5" /> Journal</span>
          <span className="inline-flex items-center gap-1"><Share2 className="h-3.5 w-3.5" /> Social</span>
        </div>
      </div>
    </Link>
  );
}

export default function GrowthShow() {
  const { episodes, loading } = useGrowthShow();
  const [query, setQuery] = useState('');
  const featured = episodes[0];
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return episodes.slice(1);
    return episodes.filter(episode => (
      episode.title.toLowerCase().includes(normalized) ||
      episode.summary.toLowerCase().includes(normalized) ||
      episode.lessons.some(lesson => lesson.title?.toLowerCase().includes(normalized))
    ));
  }, [episodes, query]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <SEOHead
        title="The NTA Growth Show | Practical Business and AI Conversations"
        description="Watch the NTA Growth Show and continue each conversation through connected Knowledge Library lessons, Journal material, books, social content, and practical next steps."
      />
      <MarketingNav />

      <main>
        <header className="relative overflow-hidden border-b border-slate-800 px-6 pb-16 pt-28">
          <div className="absolute left-1/2 top-24 h-80 w-[720px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="relative mx-auto max-w-5xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-bold uppercase tracking-widest text-blue-400">
              <Play className="h-4 w-4 fill-current" /> The NTA Growth Show
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">One useful conversation. A complete learning path.</h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
              The NTA Growth Show turns practical business conversations into connected learning. Watch the episode, read the related lessons, explore the Journal, and follow the idea across the NTA publishing system.
            </p>
            <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              {[
                ['Watch', 'YouTube episode'],
                ['Learn', 'Knowledge Library'],
                ['Continue', 'Journal and books'],
                ['Share', 'Social clips'],
              ].map(([label, text]) => (
                <div key={label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <strong className="block text-white">{label}</strong>
                  <span className="mt-1 block text-xs text-slate-500">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-6 py-14">
          {loading ? (
            <div className="flex min-h-64 items-center justify-center text-slate-500">
              <Loader2 className="mr-3 h-6 w-6 animate-spin" /> Loading the show…
            </div>
          ) : featured ? (
            <>
              <Link to={`/growth-show/${featured.slug}`} className="group grid overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-950/40 to-slate-900 lg:grid-cols-2">
                <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 lg:aspect-auto">
                  {featured.thumbnailUrl ? (
                    <img src={featured.thumbnailUrl} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full min-h-64 items-center justify-center">
                      <Play className="h-20 w-20 text-blue-400/70" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20">
                    <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl">
                      <Play className="h-7 w-7 fill-current" />
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-center p-8 md:p-10">
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-400">Featured episode</p>
                  <h2 className="mt-3 text-3xl font-black leading-tight text-white">{featured.title}</h2>
                  <p className="mt-4 leading-7 text-slate-400">{featured.summary}</p>
                  {featured.publishedDate && (
                    <p className="mt-5 inline-flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="h-4 w-4" /> {featured.publishedDate}
                    </p>
                  )}
                  <span className="mt-7 inline-flex items-center gap-2 font-bold text-blue-400">Watch and explore the episode <ArrowRight className="h-4 w-4" /></span>
                </div>
              </Link>

              <div className="mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-blue-400">Episode library</p>
                  <h2 className="mt-2 text-3xl font-black text-white">Continue through the show</h2>
                </div>
                <label className="relative block w-full sm:w-80">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                    placeholder="Search episodes…"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-blue-500/50"
                  />
                </label>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map(episode => <EpisodeCard key={episode.id} episode={episode} />)}
              </div>
              {filtered.length === 0 && <p className="mt-10 text-center text-slate-500">No episodes match that search.</p>}
            </>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-10 text-center">
              <Play className="mx-auto h-10 w-10 text-blue-400" />
              <h2 className="mt-4 text-2xl font-bold text-white">The show home is ready.</h2>
              <p className="mx-auto mt-3 max-w-xl text-slate-400">Published NTA YouTube lessons will appear here automatically as Growth Show episodes.</p>
            </div>
          )}
        </section>

        <section className="border-y border-slate-800 bg-slate-900/40 px-6 py-16 text-center">
          <h2 className="text-3xl font-black text-white">The show is one part of the NTA learning system.</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">Every useful idea can become a video, lesson, Journal article, book chapter, social conversation, and practical next step—without losing the original thought.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/knowledge" className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500">Explore the Knowledge Library</Link>
            <Link to="/journal" className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 font-bold text-white hover:bg-slate-800">Read the NTA Journal</Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

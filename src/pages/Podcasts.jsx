import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Headphones, Play, BookOpen, Search } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import LearningFormatNav from '@/components/knowledge/LearningFormatNav';
import { useGrowthShow } from '@/hooks/useGrowthShow';
import { readingForVideo } from '@/data/videoLearningConnections';

export default function Podcasts() {
  const { episodes, loading } = useGrowthShow();
  const [query, setQuery] = useState('');
  const available = episodes.filter(episode => episode.audioReady);
  const filtered = useMemo(() => available.filter(e => (e.title + ' ' + e.summary).toLowerCase().includes(query.trim().toLowerCase())), [available, query]);
  return <div className="min-h-screen bg-slate-950 text-slate-300">
    <SEOHead title="Listen to NTA Podcasts | The NTA Growth Show" description="Listen to complete NTA Growth Show episodes on the website. Find practical business and AI conversations, related videos and lessons, and the podcast RSS feed." canonical="https://newtechadvertising.com/podcasts" />
    <MarketingNav />
    <main className="mx-auto max-w-6xl px-6 pb-20 pt-20">
      <header>
        <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-cyan-300"><Headphones className="h-5 w-5" /> NTA Podcasts</p>
        <h1 className="mt-5 text-4xl font-black text-white md:text-6xl">Prefer to listen? Start here.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8">Listen to the complete Growth Show while you drive, work, or take a break. The original voices and full conversation are here, alongside each episode’s video and related reading.</p>
        <LearningFormatNav />
        <div className="flex flex-wrap items-center justify-between gap-5 border-y border-slate-800 py-5">
          <a href="/growth-show.xml" className="rounded-xl bg-cyan-300 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-200">Podcast RSS feed</a>
          <label className="flex w-full items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 sm:w-80"><Search className="h-5 w-5" aria-hidden="true" /><span className="sr-only">Search podcasts</span><input className="w-full bg-transparent text-white outline-none" type="search" placeholder="Search podcasts…" value={query} onChange={e => setQuery(e.target.value)} /></label>
        </div>
      </header>
      <p className="mt-7 text-sm text-slate-400" role="status">{loading ? 'Loading podcast connections…' : available.length + ' complete episodes available to listen to'}</p>
      <div className="mt-7 grid gap-6 md:grid-cols-2">
        {filtered.map(episode => {
          const reading = readingForVideo(episode.youtubeVideoId);
          const audioPath = new URL(episode.audioUrl).hostname === 'newtechadvertising.com' ? new URL(episode.audioUrl).pathname : episode.audioUrl;
          return <article key={episode.id} id={episode.slug} className="scroll-mt-24 rounded-2xl border border-cyan-300/25 bg-slate-900 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">{episode.publishedDate} · Full episode audio</p>
            <h2 className="mt-3 text-2xl font-bold text-white">{episode.title}</h2>
            <p className="mt-4 text-sm leading-7">{episode.summary}</p>
            <audio controls preload="none" className="mt-5 w-full" aria-label={'Listen to ' + episode.title}><source src={audioPath} type={episode.audioContentType} /></audio>
            <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold">
              <Link to={'/growth-show/' + episode.slug + '#watch'} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-white"><Play className="h-4 w-4" /> Watch video</Link>
              {reading && <Link to={reading.href} className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-3 text-cyan-200"><BookOpen className="h-4 w-4" /> Read related lesson</Link>}
              <Link to={'/growth-show/' + episode.slug} className="py-3 text-cyan-300">Episode and resources →</Link>
            </div>
          </article>;
        })}
      </div>
      {!loading && !filtered.length && <p className="mt-10">No podcasts match this search. Try another word.</p>}
    </main>
    <SiteFooter />
  </div>;
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowDown, ArrowUpRight, Film, Loader2, Play, Search, X, Youtube } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import { useLearningContent } from '@/hooks/useLearningContent';
import { NTA_YOUTUBE_CHANNEL_URL } from '@/data/videoGallery';
import { filterGalleryVideos, galleryCategories, galleryDateLabel, resolveGalleryCategory } from '@/lib/videoGallery';

const PAGE_SIZE = 12;
const focusStyle = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950';

export default function LCVideoLibrary() {
  const { data, isFetching } = useLearningContent();
  const videos = data?.videos || [];
  const [params, setParams] = useSearchParams();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const lastTrigger = useRef(null);
  const categories = useMemo(() => galleryCategories(videos), [videos]);
  const category = resolveGalleryCategory(params.get('category'), categories);
  const search = (params.get('q') || '').slice(0, 200);
  const filtered = useMemo(() => filterGalleryVideos(videos, category, search), [videos, category, search]);
  const featured = videos.find(video => video.galleryCategory === 'Growth Show') || videos[0];

  useEffect(() => { window.scrollTo(0, 0); }, []);

  function updateFilters(key, value) {
    const next = new URLSearchParams(params);
    if (!value || value === 'All') next.delete(key);
    else next.set(key, value);
    setVisibleCount(PAGE_SIZE);
    setParams(next, { replace: true });
  }

  function resetFilters() {
    const next = new URLSearchParams(params);
    next.delete('category');
    next.delete('q');
    setVisibleCount(PAGE_SIZE);
    setParams(next, { replace: true });
  }

  function watch(video, event) {
    lastTrigger.current = event.currentTarget;
    setSelectedVideo(video);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <MarketingNav />
      <main className="pt-28 pb-20 sm:pt-32">
        <section className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                <Film className="h-4 w-4" aria-hidden="true" /> Watch. Learn. See the work.
              </p>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">NTA Video Gallery</h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Business ideas, practical AI, and stories told through video. Explore the Growth Show and a selection of our work—watch here or continue on YouTube.
              </p>
            </div>
            <a href={NTA_YOUTUBE_CHANNEL_URL + '/videos'} target="_blank" rel="noopener noreferrer"
              className={'inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border border-slate-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:border-cyan-300 hover:bg-slate-900 ' + focusStyle}>
              <Youtube className="h-5 w-5 text-red-400" aria-hidden="true" /> Visit our YouTube channel <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          {featured && (
            <div className="mt-10 grid overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 lg:grid-cols-[1.25fr_1fr]">
              <button type="button" onClick={event => watch(featured, event)} aria-label={'Watch ' + featured.title}
                className={'group relative block aspect-video w-full overflow-hidden bg-black ' + focusStyle}>
                <img src={featured.thumbnail} alt="" className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.03]" fetchPriority="high" width="480" height="360" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute left-5 top-5 rounded-full bg-slate-950/90 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-200">Featured video</span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-950 shadow-xl transition-transform group-hover:scale-110 sm:h-20 sm:w-20">
                    <Play className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" aria-hidden="true" />
                  </span>
                </span>
                <span className="absolute bottom-5 left-5 flex items-center gap-2 text-sm font-semibold text-white"><Play className="h-4 w-4" aria-hidden="true" /> Watch here</span>
              </button>
              <div className="flex min-w-0 flex-col justify-center p-6 sm:p-8 lg:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">{featured.galleryCategory}</p>
                <h2 className="mt-4 text-2xl font-bold leading-tight text-white sm:text-3xl">{featured.title}</h2>
                {featured.summary && <p className="mt-4 leading-relaxed text-slate-300">{featured.summary}</p>}
                {featured.publishedAt && <p className="mt-4 text-sm text-slate-400">{galleryDateLabel(featured.publishedAt)}</p>}
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-4">
                  <a href={featured.youtubeUrl} target="_blank" rel="noopener noreferrer" className={'inline-flex items-center gap-2 rounded text-sm font-bold text-white hover:text-cyan-200 ' + focusStyle}>Watch on YouTube <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
                  <Link to="/growth-show" className={'inline-flex items-center gap-2 rounded text-sm font-bold text-cyan-300 hover:text-cyan-100 ' + focusStyle}>Explore the Growth Show <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="mx-auto mt-14 max-w-7xl px-5 sm:px-8" aria-labelledby="browse-videos">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="browse-videos" className="text-2xl font-bold text-white">Find something worth watching</h2>
              <p className="mt-2 text-sm text-slate-400">Recent uploads and selected videos from the NTA channel.</p>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <label htmlFor="gallery-search" className="sr-only">Search videos</label>
              <Search className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400" aria-hidden="true" />
              <input id="gallery-search" type="search" value={search} maxLength={200} onChange={event => updateFilters('q', event.target.value)}
                placeholder="Search videos" className={'w-full rounded-xl border border-slate-600 bg-slate-900 py-3 pl-12 pr-4 text-base text-white placeholder:text-slate-400 ' + focusStyle} />
            </div>
          </div>

          <div className="mt-6 sm:hidden">
            <label htmlFor="gallery-category" className="mb-2 block text-sm font-medium text-slate-300">Browse by topic</label>
            <select id="gallery-category" value={category} onChange={event => updateFilters('category', event.target.value)}
              className={'w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-base text-white ' + focusStyle}>
              {['All', ...categories].map(value => <option key={value} value={value}>{value === 'All' ? 'All videos' : value}</option>)}
            </select>
          </div>
          <div className="mt-6 hidden flex-wrap gap-2 sm:flex" aria-label="Filter videos by topic">
            {['All', ...categories].map(value => (
              <button key={value} type="button" aria-pressed={value === category} onClick={() => updateFilters('category', value)}
                className={'rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ' + (value === category ? 'border-cyan-300 bg-cyan-300 text-slate-950' : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-400 hover:text-white') + ' ' + focusStyle}>
                {value === 'All' ? 'All videos' : value}
              </button>
            ))}
          </div>

          {data?.feedStatus === 'saved' && (
            <p role="status" className="mt-5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm leading-relaxed text-slate-300">
              You can still browse these selected videos. For every upload, <a href={NTA_YOUTUBE_CHANNEL_URL + '/videos'} target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-300 underline underline-offset-4">visit our YouTube channel</a>.
            </p>
          )}
          <div className="my-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
            <p role="status" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'video' : 'videos'}{category !== 'All' ? ' in ' + category : ''}{search ? ' matching “' + search + '”' : ''}</p>
            {isFetching && <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Checking for new videos</span>}
          </div>

          {filtered.length ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.slice(0, visibleCount).map(video => (
                <article key={video.youtubeId} className="group min-w-0">
                  <button type="button" onClick={event => watch(video, event)} aria-label={'Watch ' + video.title}
                    className={'relative block aspect-video w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900 ' + focusStyle}>
                    <img src={video.thumbnail} alt="" loading="lazy" width="480" height="360" className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.03]" />
                    <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/25" />
                    <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-950 shadow-lg"><Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden="true" /></span>
                    <span className="absolute right-3 top-3 rounded-full bg-slate-950/90 px-2.5 py-1 text-[11px] font-semibold text-white">{video.galleryCategory}</span>
                  </button>
                  <div className="pt-4">
                    {video.publishedAt && <p className="mb-2 text-xs text-slate-400">{galleryDateLabel(video.publishedAt)}</p>}
                    <h3 className="text-lg font-bold leading-snug text-white">
                      <button type="button" onClick={event => watch(video, event)} className={'rounded text-left hover:text-cyan-200 ' + focusStyle}>{video.title}</button>
                    </h3>
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
                      <button type="button" onClick={event => watch(video, event)} aria-label={'Watch ' + video.title + ' here'} className={'inline-flex items-center gap-1.5 rounded font-semibold text-cyan-300 hover:text-cyan-100 ' + focusStyle}><Play className="h-3.5 w-3.5" aria-hidden="true" /> Watch here</button>
                      <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label={'Watch ' + video.title + ' on YouTube (opens a new tab)'} className={'inline-flex items-center gap-1 rounded text-slate-300 hover:text-white ' + focusStyle}>YouTube <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-700 bg-slate-900 px-6 py-16 text-center">
              <Search className="mx-auto mb-4 h-8 w-8 text-cyan-300" aria-hidden="true" />
              <h3 className="text-xl font-bold text-white">No videos match those filters.</h3>
              <p className="mt-2 text-slate-300">Try another word or browse all the videos.</p>
              <button type="button" onClick={resetFilters} className={'mt-5 rounded-xl bg-cyan-300 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-200 ' + focusStyle}>Clear filters</button>
            </div>
          )}
          {visibleCount < filtered.length && (
            <div className="mt-10 text-center">
              <button type="button" onClick={() => setVisibleCount(count => count + PAGE_SIZE)}
                className={'inline-flex items-center gap-2 rounded-xl border border-slate-600 px-6 py-3 font-semibold text-white hover:border-cyan-300 hover:bg-slate-900 ' + focusStyle}>
                Show more videos <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </section>

        <section className="mx-auto mt-16 max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-6 rounded-2xl border border-cyan-300/20 bg-cyan-950/20 p-6 sm:p-9 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-white">Help people see what you do.</h2>
              <p className="mt-3 leading-relaxed text-slate-300">A useful video can explain your work, answer a customer's question, or introduce the people behind your business. See how NTA can help you tell that story.</p>
            </div>
            <Link to="/ai-video-marketing" className={'inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-cyan-300 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-200 ' + focusStyle}>Explore video services <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </section>
      </main>
      <SiteFooter />

      <Dialog.Root open={Boolean(selectedVideo)} onOpenChange={open => { if (!open) setSelectedVideo(null); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100000] bg-slate-950/90 backdrop-blur-sm" />
          <Dialog.Content onCloseAutoFocus={event => { event.preventDefault(); lastTrigger.current?.focus(); }}
            className="fixed left-1/2 top-1/2 z-[100001] max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-slate-600 bg-slate-900 text-white shadow-2xl focus:outline-none">
            {selectedVideo && (
              <>
                <div className="relative p-5 pr-16 sm:p-6 sm:pr-16">
                  <Dialog.Title className="text-lg font-bold leading-snug sm:text-xl">{selectedVideo.title}</Dialog.Title>
                  <Dialog.Description className="mt-2 text-sm text-slate-300">Watch this NTA video here, or open it on YouTube.</Dialog.Description>
                  <Dialog.Close aria-label="Close video" className={'absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-white hover:bg-slate-700 ' + focusStyle}><X className="h-5 w-5" aria-hidden="true" /></Dialog.Close>
                </div>
                <div className="aspect-video w-full bg-black">
                  <iframe key={selectedVideo.youtubeId} src={selectedVideo.embedUrl + '&autoplay=1'} title={selectedVideo.title}
                    className="h-full w-full border-0" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
                  {selectedVideo.relatedUrl || selectedVideo.hasArticle ? <Link to={selectedVideo.relatedUrl || '/' + selectedVideo.slug} className={'rounded text-sm font-semibold text-cyan-300 hover:text-cyan-100 ' + focusStyle}>Continue learning on NTA</Link> : <span className="text-sm text-slate-400">{selectedVideo.galleryCategory}</span>}
                  <a href={selectedVideo.youtubeUrl} target="_blank" rel="noopener noreferrer" className={'inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-cyan-100 ' + focusStyle}><Youtube className="h-5 w-5" aria-hidden="true" /> Watch on YouTube <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

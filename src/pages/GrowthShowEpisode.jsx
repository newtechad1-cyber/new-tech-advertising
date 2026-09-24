import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Download, ExternalLink, Headphones, Loader2, Newspaper, Play, Quote, Share2 } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { ContentNextSteps } from '@/components/knowledge/ContentNextSteps';
import { useGrowthShow } from '@/hooks/useGrowthShow';
import { findGrowthShowEpisode } from '@/lib/growthShow';
import VideoWatchPage from '@/components/video/VideoWatchPage';

function ResourceCard({ icon: Icon, eyebrow, title, description, to, external = false }) {
  const content = (
    <>
      <Icon className="h-5 w-5 text-blue-400" />
      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-500">{eyebrow}</p>
      <h3 className="mt-2 text-lg font-bold capitalize text-white">{title}</h3>
      {description && <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>}
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-400">
        Continue <ArrowRight className="h-4 w-4" />
      </span>
    </>
  );

  const className = 'block rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-colors hover:border-blue-500/40';
  return external
    ? <a href={to} target="_blank" rel="noopener noreferrer" className={className}>{content}</a>
    : <Link to={to} className={className}>{content}</Link>;
}

export default function GrowthShowEpisode({ initialVideo = null }) {
  const { slug: routeSlug } = useParams();
  const slug = routeSlug || initialVideo?.path.split('/').pop();
  const { episodes, loading } = useGrowthShow();
  const episode = findGrowthShowEpisode(episodes, slug);

  if (loading) {
    return initialVideo
      ? <VideoWatchPage video={initialVideo} />
      : <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400"><Loader2 className="mr-3 h-6 w-6 animate-spin" /> Loading episode…</div>;
  }

  if (!episode && initialVideo) return <VideoWatchPage video={initialVideo} />;

  if (!episode) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-300">
        <MarketingNav />
        <main className="mx-auto max-w-3xl px-6 pb-24 pt-32 text-center">
          <Play className="mx-auto h-10 w-10 text-blue-400" />
          <h1 className="mt-5 text-3xl font-black text-white">Episode not found</h1>
          <p className="mt-3 text-slate-400">This episode may not be published yet.</p>
          <Link to="/growth-show" className="mt-7 inline-flex items-center gap-2 font-bold text-blue-400"><ArrowLeft className="h-4 w-4" /> Return to the NTA Growth Show</Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const primaryLesson = episode.lessons[0] || episode.article;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <SEOHead
        title={`${episode.title} | The NTA Growth Show`}
        description={episode.summary}
        videoData={initialVideo?.publishedAt ? {
          name: initialVideo.title,
          description: initialVideo.description,
          thumbnailUrl: initialVideo.thumbnailUrl,
          uploadDate: initialVideo.publishedAt,
          embedUrl: initialVideo.embedUrl,
        } : null}
      />
      <MarketingNav />

      <main>
        <header className="border-b border-slate-800 px-6 pb-12 pt-28">
          <div className="mx-auto max-w-5xl">
            <Link to="/growth-show" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> The NTA Growth Show
            </Link>
            <p className="mt-8 text-xs font-bold uppercase tracking-widest text-blue-400">
              {episode.episodeNumber ? `Episode ${episode.episodeNumber}` : 'NTA Growth Show episode'}
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight text-white md:text-6xl">{episode.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">{episode.summary}</p>
          </div>
        </header>

        <section className="mx-auto max-w-5xl px-6 py-12">
          <div className="aspect-video overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-2xl">
            {episode.youtubeVideoId ? (
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${episode.youtubeVideoId}`}
                title={episode.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <video
                className="h-full w-full object-contain"
                src={episode.videoUrl}
                title={episode.title}
                controls
                playsInline
                preload="metadata"
              />
            )}
          </div>
          {episode.youtubeUrl && (
            <div className="mt-4 flex justify-end">
              <a href={episode.youtubeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white">
                Watch on YouTube <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </section>

        {episode.testimonial && (
          <section className="mx-auto max-w-5xl px-6 pb-4">
            <div className="rounded-2xl border border-blue-400/25 bg-blue-500/5 p-6 md:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-300">
                {episode.testimonial.label || 'A viewer’s response'}
              </p>
              <Quote className="mt-5 h-8 w-8 text-blue-400/70" aria-hidden="true" />
              <blockquote className="mt-3">
                <p className="text-2xl font-medium leading-relaxed text-white md:text-3xl">
                  “{episode.testimonial.quote}”
                </p>
                <footer className="mt-5 text-sm font-bold text-slate-200">
                  — {episode.testimonial.attribution}
                  {episode.testimonial.business && `, ${episode.testimonial.business}`}
                  {episode.testimonial.location && ` · ${episode.testimonial.location}`}
                </footer>
              </blockquote>
              {episode.testimonial.context && (
                <p className="mt-5 text-sm leading-6 text-slate-400">{episode.testimonial.context}</p>
              )}
            </div>
          </section>
        )}

        <section className="mx-auto max-w-5xl px-6 pb-16">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-400">Continue the idea</p>
            <h2 className="mt-2 text-3xl font-black text-white">Read more, try the idea, or ask a question.</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {primaryLesson && (
              <ResourceCard
                icon={BookOpen}
                eyebrow="Knowledge Library"
                title={primaryLesson.title}
                description={primaryLesson.summary}
                to={primaryLesson.canonical_url || `/${primaryLesson.slug}`}
              />
            )}

            {episode.journals.length > 0 ? episode.journals.map(journal => (
              <ResourceCard
                key={journal.id || journal.slug}
                icon={Newspaper}
                eyebrow="NTA Journal"
                title={journal.title}
                description={journal.summary}
                to={`/journal/${journal.slug || `issue-${journal.issue_number}`}`}
              />
            )) : (
              <ResourceCard
                icon={Newspaper}
                eyebrow="NTA Journal"
                title="Continue with the NTA Journal"
                description="Explore weekly practical lessons and the ideas being built across NTA."
                to="/journal"
              />
            )}

            {episode.books.map(book => (
              <ResourceCard
                key={book.slug}
                icon={BookOpen}
                eyebrow="NTA Book"
                title={book.title}
                description={book.description}
                to={`/${book.slug}`}
              />
            ))}

            {episode.socialAssets.map(asset => (
              <ResourceCard
                key={`${asset.platform}-${asset.url}`}
                icon={Share2}
                eyebrow={`${asset.platform} content`}
                title={asset.label || `${episode.title} on ${asset.platform}`}
                description="Follow the conversation and share it with another business owner."
                to={asset.url}
                external
              />
            ))}

            {episode.downloadableResources.map(resource => (
              <ResourceCard
                key={resource.url}
                icon={Download}
                eyebrow="Download"
                title={resource.title}
                description={resource.description}
                to={resource.url}
                external
              />
            ))}

            {episode.podcastUrl && (
              <ResourceCard
                icon={Headphones}
                eyebrow="Podcast"
                title="Listen to this episode"
                description="Continue the same conversation in audio form."
                to={episode.podcastUrl}
                external
              />
            )}
          </div>

          <div className="mt-12">
            <ContentNextSteps title={episode.title} path={'/growth-show/' + episode.slug} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

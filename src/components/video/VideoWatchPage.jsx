import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { videoSchemaFor } from '@/data/videoSeo.js';

export default function VideoWatchPage({ video }) {
  const schema = videoSchemaFor(video);
  useEffect(() => {
    // The route-aware production HTML has its own initial structured data.
    document.head.querySelectorAll('script[data-seo-static-video-schema="true"]').forEach(script => script.remove());
  }, []);

  if (!video) return null;
  const parent = video.category === 'Growth Show' ? '/growth-show' : '/learning-center/videos';
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <SEOHead title={video.title + ' | New Tech Advertising'} description={video.description} canonical={'https://newtechadvertising.com' + video.path} />
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />}
      <MarketingNav />
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-28">
        <nav aria-label="Breadcrumb" className="mb-7 text-sm">
          <Link to={parent} className="font-semibold text-cyan-300 hover:text-cyan-100">{video.category === 'Growth Show' ? 'The NTA Growth Show' : 'NTA Video Gallery'}</Link>
        </nav>
        <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">{video.category}</p>
        <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-white md:text-5xl">{video.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">{video.description}</p>
        {video.publishedAt && <p className="mt-3 text-sm text-slate-400">Published <time dateTime={video.publishedAt}>{new Date(video.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</time></p>}
        <div className="mt-9 aspect-video overflow-hidden rounded-2xl border border-slate-700 bg-black">
          <iframe
            className="h-full w-full"
            src={video.embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="mt-5"><a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-300 hover:text-cyan-100">Watch on YouTube ↗</a></p>
        {(video.reading || video.relatedUrl) && (
          <section className="mt-12 border-t border-slate-800 pt-8">
            <h2 className="text-2xl font-bold text-white">Continue the idea</h2>
            {video.reading && <p className="mt-4"><Link to={video.reading.href} className="text-cyan-300 hover:text-cyan-100">Read the related lesson: {video.reading.title}</Link></p>}
            {video.relatedUrl && <p className="mt-3"><Link to={video.relatedUrl} className="text-cyan-300 hover:text-cyan-100">Explore the related NTA story</Link></p>}
          </section>
        )}
        <p className="mt-10"><Link to={parent} className="text-sm font-semibold text-slate-300 hover:text-white">Explore more {video.category === 'Growth Show' ? 'Growth Show episodes' : 'videos'}</Link></p>
      </main>
      <SiteFooter />
    </div>
  );
}

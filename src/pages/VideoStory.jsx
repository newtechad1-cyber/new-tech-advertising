import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

export default function VideoStory() {
  const slug = new URLSearchParams(window.location.search).get('slug');
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const stories = slug
          ? await base44.entities.WebsiteVideoStory.filter({ slug })
          : [];
        if (active) setStory(stories[0] || null);
      } catch (error) {
        console.error('Unable to load video story:', error);
        if (active) setStory(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => { active = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <MarketingNav />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <MarketingNav />
        <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
          <h1 className="text-3xl font-bold">Video story not found</h1>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 text-indigo-300 hover:text-indigo-200">
            <ArrowLeft className="h-4 w-4" /> Return to NTA
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <SEOHead
        title={story.seo_title || story.title}
        description={story.seo_description || story.summary || ''}
      />
      <MarketingNav />

      <main className="mx-auto max-w-5xl px-6 py-20">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 hover:text-indigo-200"
        >
          <ArrowLeft className="h-4 w-4" /> Back to NTA
        </Link>

        <article>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-400">
            {story.category || 'NTA Video'}
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-6xl">
            {story.title}
          </h1>
          {story.summary && (
            <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-300">{story.summary}</p>
          )}

          <div className="mt-10 overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-2xl">
            <video
              src={story.video_url}
              controls
              playsInline
              preload="metadata"
              className="aspect-video w-full"
            />
          </div>

          {story.body && (
            <div className="mt-10 max-w-3xl whitespace-pre-wrap text-lg leading-8 text-slate-300">
              {story.body}
            </div>
          )}

          <a
            href={story.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-200 hover:border-slate-500 hover:bg-slate-900"
          >
            Open/download video file <ExternalLink className="h-4 w-4" />
          </a>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}

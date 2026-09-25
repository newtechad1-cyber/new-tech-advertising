// Generated native video page. Source: verified public selection in src/data/videoGallery.js.
// The title, description, watch URL, upload date, and video markup live in this route file.
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

const TITLE = "AI isn’t a business strategy. It’s a tool";
const DESCRIPTION = "Watch AI isn’t a business strategy. It’s a tool from New Tech Advertising, then explore related practical business and AI learning.";
const CANONICAL = "https://newtechadvertising.com/learning-center/videos/CbNxn-P74D8";
const VIDEO_URL = "https://www.youtube.com/watch?v=CbNxn-P74D8";
const EMBED_URL = "https://www.youtube-nocookie.com/embed/CbNxn-P74D8?rel=0";
const UPLOAD_DATE = "2026-08-26T14:09:05+00:00";
const VIDEO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "AI isn’t a business strategy. It’s a tool",
  "description": "Watch AI isn’t a business strategy. It’s a tool from New Tech Advertising, then explore related practical business and AI learning.",
  "thumbnailUrl": "https://i.ytimg.com/vi/CbNxn-P74D8/hqdefault.jpg",
  "uploadDate": "2026-08-26T14:09:05+00:00",
  "embedUrl": "https://www.youtube-nocookie.com/embed/CbNxn-P74D8?rel=0",
  "url": "https://newtechadvertising.com/learning-center/videos/CbNxn-P74D8",
  "publisher": {
    "@type": "Organization",
    "name": "New Tech Advertising",
    "url": "https://newtechadvertising.com"
  }
};

export default function NativeVideoPage05() {
  useEffect(() => {
    document.head.querySelectorAll('script[data-seo-static-video-schema="true"]').forEach(script => script.remove());
  }, []);
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      <SEOHead title={TITLE + " | New Tech Advertising"} description={DESCRIPTION} canonical={CANONICAL} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(VIDEO_SCHEMA).replace(/</g, "\\u003c") }} />
      <MarketingNav />
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-28">
        <nav aria-label="Breadcrumb" className="mb-7 text-sm">
          <Link to="/learning-center/videos" className="font-semibold text-cyan-300 hover:text-cyan-100">NTA Video Gallery</Link>
        </nav>
        <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">NTA video</p>
        <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-white md:text-5xl">{TITLE}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">{DESCRIPTION}</p>
        <p className="mt-3 text-sm text-slate-400">Published <time dateTime={UPLOAD_DATE}>August 26, 2026</time></p>
        <div className="mt-9 aspect-video overflow-hidden rounded-2xl border border-slate-700 bg-black">
          <iframe className="h-full w-full" src={EMBED_URL} title={TITLE} loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
        </div>
        <p className="mt-5"><a href={VIDEO_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-300 hover:text-cyan-100">Watch on YouTube ↗</a></p>
        <section className="mt-12 border-t border-slate-800 pt-8">
          <h2 className="text-2xl font-bold text-white">Continue the idea</h2>
          <p className="mt-4"><Link to="/knowledge/ai-foundations/start-with-the-work-not-the-tool" className="text-cyan-300 hover:text-cyan-100">Read the related lesson: Start With the Work, Not the Tool</Link></p>
          <p className="mt-4"><Link to="/growth-conversation" className="text-cyan-300 hover:text-cyan-100">Ask a question about your business</Link></p>
        </section>
        <p className="mt-10"><Link to="/learning-center/videos" className="text-sm font-semibold text-slate-300 hover:text-white">Explore more videos</Link></p>
      </main>
      <SiteFooter />
    </div>
  );
}

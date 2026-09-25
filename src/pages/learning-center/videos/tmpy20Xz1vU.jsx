// Generated native video page. Source: verified public selection in src/data/videoGallery.js.
// The title, description, watch URL, upload date, and video markup live in this route file.
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

const TITLE = "Johnson Heating & AC — Brand Showcase #17";
const DESCRIPTION = "A 41-second brand message from NTA's public Johnson Heating showcase series.";
const CANONICAL = "https://newtechadvertising.com/learning-center/videos/tmpy20Xz1vU";
const VIDEO_URL = "https://www.youtube.com/watch?v=tmpy20Xz1vU";
const EMBED_URL = "https://www.youtube-nocookie.com/embed/tmpy20Xz1vU?rel=0";
const UPLOAD_DATE = "2026-05-10T13:02:16-07:00";
const VIDEO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Johnson Heating & AC — Brand Showcase #17",
  "description": "A 41-second brand message from NTA's public Johnson Heating showcase series.",
  "thumbnailUrl": "https://i.ytimg.com/vi/tmpy20Xz1vU/hqdefault.jpg",
  "uploadDate": "2026-05-10T13:02:16-07:00",
  "embedUrl": "https://www.youtube-nocookie.com/embed/tmpy20Xz1vU?rel=0",
  "url": "https://newtechadvertising.com/learning-center/videos/tmpy20Xz1vU",
  "publisher": {
    "@type": "Organization",
    "name": "New Tech Advertising",
    "url": "https://newtechadvertising.com"
  }
};

export default function NativeVideoPage13() {
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
        <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">Video Work</p>
        <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-white md:text-5xl">{TITLE}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">{DESCRIPTION}</p>
        <p className="mt-3 text-sm text-slate-400">Published <time dateTime={UPLOAD_DATE}>May 10, 2026</time></p>
        <div className="mt-9 aspect-video overflow-hidden rounded-2xl border border-slate-700 bg-black">
          <iframe className="h-full w-full" src={EMBED_URL} title={TITLE} loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
        </div>
        <p className="mt-5"><a href={VIDEO_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-300 hover:text-cyan-100">Watch on YouTube ↗</a></p>
        <section className="mt-12 border-t border-slate-800 pt-8">
          <h2 className="text-2xl font-bold text-white">Continue the idea</h2>
          <p className="mt-4"><Link to="/case-studies/johnson-heating" className="text-cyan-300 hover:text-cyan-100">Explore the related NTA story</Link></p>
          <p className="mt-4"><Link to="/growth-conversation" className="text-cyan-300 hover:text-cyan-100">Ask a question about your business</Link></p>
        </section>
        <p className="mt-10"><Link to="/learning-center/videos" className="text-sm font-semibold text-slate-300 hover:text-white">Explore more videos</Link></p>
      </main>
      <SiteFooter />
    </div>
  );
}

// Generated native video page. Source: verified public selection in src/data/videoGallery.js.
// The title, description, watch URL, upload date, and video markup live in this route file.
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

const TITLE = "Your Business Comes First. Technology Comes Second. | Growth Show Ep. 7";
const DESCRIPTION = "A practical conversation about understanding your business before choosing the technology to support it.";
const CANONICAL = "https://newtechadvertising.com/growth-show/before-you-add-ai-understand-your-business";
const VIDEO_URL = "https://www.youtube.com/watch?v=PmXSEkj03ak";
const EMBED_URL = "https://www.youtube-nocookie.com/embed/PmXSEkj03ak?rel=0";
const UPLOAD_DATE = "2026-09-15T14:00:49+00:00";
const VIDEO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Your Business Comes First. Technology Comes Second. | Growth Show Ep. 7",
  "description": "A practical conversation about understanding your business before choosing the technology to support it.",
  "thumbnailUrl": "https://i.ytimg.com/vi/PmXSEkj03ak/hqdefault.jpg",
  "uploadDate": "2026-09-15T14:00:49+00:00",
  "embedUrl": "https://www.youtube-nocookie.com/embed/PmXSEkj03ak?rel=0",
  "url": "https://newtechadvertising.com/growth-show/before-you-add-ai-understand-your-business",
  "publisher": {
    "@type": "Organization",
    "name": "New Tech Advertising",
    "url": "https://newtechadvertising.com"
  }
};

export default function NativeVideoPage01() {
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
          <Link to="/growth-show" className="font-semibold text-cyan-300 hover:text-cyan-100">The NTA Growth Show</Link>
        </nav>
        <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">The NTA Growth Show</p>
        <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-white md:text-5xl">{TITLE}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">{DESCRIPTION}</p>
        <p className="mt-3 text-sm text-slate-400">Published <time dateTime={UPLOAD_DATE}>September 15, 2026</time></p>
        <div className="mt-9 aspect-video overflow-hidden rounded-2xl border border-slate-700 bg-black">
          <iframe className="h-full w-full" src={EMBED_URL} title={TITLE} loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
        </div>
        <p className="mt-5"><a href={VIDEO_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-300 hover:text-cyan-100">Watch on YouTube ↗</a></p>
        <section className="mt-12 border-t border-slate-800 pt-8">
          <h2 className="text-2xl font-bold text-white">Continue the idea</h2>
          <p className="mt-4"><Link to="/knowledge/business-foundations/understanding-before-spending" className="text-cyan-300 hover:text-cyan-100">Read the related lesson: Understanding Before Spending</Link></p>
          <p className="mt-4"><Link to="/journal/issue-7-are-you-building-a-business-or-just-a-website" className="text-cyan-300 hover:text-cyan-100">Read the related NTA Journal</Link></p>
          <p className="mt-4"><Link to="/books" className="text-cyan-300 hover:text-cyan-100">Explore the free business books</Link></p>
          <p className="mt-4"><Link to="/growth-conversation" className="text-cyan-300 hover:text-cyan-100">Ask a question about your business</Link></p>
        </section>
        <p className="mt-10"><Link to="/growth-show" className="text-sm font-semibold text-slate-300 hover:text-white">Explore more Growth Show episodes</Link></p>
      </main>
      <SiteFooter />
    </div>
  );
}

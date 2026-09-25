import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { VIDEO_WATCH_PAGES } from '../src/data/videoSeo.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pagesRoot = path.join(root, 'src/pages');
const q = JSON.stringify;
if (VIDEO_WATCH_PAGES.length !== 13) throw new Error('Review the video page list before generating new routes.');

const extras = {
  'PmXSEkj03ak': [
    { title: 'Read the related NTA Journal', path: '/journal/issue-7-are-you-building-a-business-or-just-a-website' },
    { title: 'Explore the free business books', path: '/books' },
  ],
  '6lhiYFHFsCQ': [
    { title: 'Read the related NTA Journal', path: '/journal/issue-6-ai-finally-taught-me-how-to-multitask' },
  ],
};
const testimonial = {
  '6lhiYFHFsCQ': {
    quote: 'I like this one. Very useful, and I will put it into practice.',
    attribution: 'Pete Gardner, Cattleman’s Dining · Belmond, Iowa',
  },
};

function generate(video, index) {
  if (!video.publishedAt) throw new Error('Missing verified upload date: ' + video.path);
  const canonical = 'https://newtechadvertising.com' + video.path;
  const parent = video.category === 'Growth Show' ? '/growth-show' : '/learning-center/videos';
  const parentLabel = video.category === 'Growth Show' ? 'The NTA Growth Show' : 'NTA Video Gallery';
  const publishedLabel = new Date(video.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  });
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.publishedAt,
    embedUrl: video.embedUrl,
    url: canonical,
    publisher: { '@type': 'Organization', name: 'New Tech Advertising', url: 'https://newtechadvertising.com' },
  };
  const lines = [
    '// Generated native video page. Source: verified public selection in src/data/videoGallery.js.',
    '// The title, description, watch URL, upload date, and video markup live in this route file.',
    "import { useEffect } from 'react';",
    "import { Link } from 'react-router-dom';",
    "import MarketingNav from '@/components/nav/MarketingNav';",
    "import SiteFooter from '@/components/marketing/SiteFooter';",
    "import SEOHead from '@/components/shared/SEOHead';",
    '',
    'const TITLE = ' + q(video.title) + ';',
    'const DESCRIPTION = ' + q(video.description) + ';',
    'const CANONICAL = ' + q(canonical) + ';',
    'const VIDEO_URL = ' + q(video.youtubeUrl) + ';',
    'const EMBED_URL = ' + q(video.embedUrl) + ';',
    'const UPLOAD_DATE = ' + q(video.publishedAt) + ';',
    'const VIDEO_SCHEMA = ' + q(schema, null, 2) + ';',
    '',
    'export default function NativeVideoPage' + String(index).padStart(2, '0') + '() {',
    '  useEffect(() => {',
    '    document.head.querySelectorAll(\'script[data-seo-static-video-schema="true"]\').forEach(script => script.remove());',
    '  }, []);',
    '  return (',
    '    <div className="min-h-screen bg-slate-950 text-slate-300">',
    '      <SEOHead title={TITLE + " | New Tech Advertising"} description={DESCRIPTION} canonical={CANONICAL} />',
    '      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(VIDEO_SCHEMA).replace(/</g, "\\\\u003c") }} />',
    '      <MarketingNav />',
    '      <main className="mx-auto max-w-5xl px-6 pb-20 pt-28">',
    '        <nav aria-label="Breadcrumb" className="mb-7 text-sm">',
    '          <Link to=' + q(parent) + ' className="font-semibold text-cyan-300 hover:text-cyan-100">' + parentLabel + '</Link>',
    '        </nav>',
    '        <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">' + (video.category === 'Growth Show' ? 'The NTA Growth Show' : video.category) + '</p>',
    '        <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-white md:text-5xl">{TITLE}</h1>',
    '        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">{DESCRIPTION}</p>',
    '        <p className="mt-3 text-sm text-slate-400">Published <time dateTime={UPLOAD_DATE}>' + publishedLabel + '</time></p>',
    '        <div className="mt-9 aspect-video overflow-hidden rounded-2xl border border-slate-700 bg-black">',
    '          <iframe className="h-full w-full" src={EMBED_URL} title={TITLE} loading="lazy"',
    '            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />',
    '        </div>',
    '        <p className="mt-5"><a href={VIDEO_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-300 hover:text-cyan-100">Watch on YouTube ↗</a></p>',
  ];
  if (testimonial[video.id]) {
    lines.push(
      '        <section className="mt-12 rounded-2xl border border-blue-400/25 bg-blue-500/5 p-6">',
      '          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-300">A viewer’s response</h2>',
      '          <blockquote className="mt-4 text-xl text-white">“' + testimonial[video.id].quote + '”</blockquote>',
      '          <p className="mt-3 text-sm text-slate-300">— ' + testimonial[video.id].attribution + '</p>',
      '        </section>',
    );
  }
  const links = [
    ...(video.reading ? [{ title: 'Read the related lesson: ' + video.reading.title, path: video.reading.href }] : []),
    ...(video.relatedUrl ? [{ title: 'Explore the related NTA story', path: video.relatedUrl }] : []),
    ...(extras[video.id] || []),
  ];
  lines.push('        <section className="mt-12 border-t border-slate-800 pt-8">',
    '          <h2 className="text-2xl font-bold text-white">Continue the idea</h2>');
  for (const link of links) {
    lines.push('          <p className="mt-4"><Link to=' + q(link.path) + ' className="text-cyan-300 hover:text-cyan-100">' + link.title + '</Link></p>');
  }
  lines.push(
    '          <p className="mt-4"><Link to="/growth-conversation" className="text-cyan-300 hover:text-cyan-100">Ask a question about your business</Link></p>',
    '        </section>',
    '        <p className="mt-10"><Link to=' + q(parent) + ' className="text-sm font-semibold text-slate-300 hover:text-white">Explore more ' + (video.category === 'Growth Show' ? 'Growth Show episodes' : 'videos') + '</Link></p>',
    '      </main>',
    '      <SiteFooter />',
    '    </div>',
    '  );',
    '}',
    '',
  );
  return lines.join('\n');
}

for (const [index, video] of VIDEO_WATCH_PAGES.entries()) {
  const output = path.join(pagesRoot, video.path.slice(1) + '.jsx');
  if (!fs.existsSync(output)) throw new Error('Existing route file missing: ' + output);
  fs.writeFileSync(output, generate(video, index + 1));
}
console.log('Generated ' + VIDEO_WATCH_PAGES.length + ' native video pages with route-specific source content.');

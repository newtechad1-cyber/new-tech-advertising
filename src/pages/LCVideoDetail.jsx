import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import { useLearningContent } from '@/hooks/useLearningContent';
import LCCallToAction from '@/components/learning-center/LCCallToAction';
import LCRelatedVideos from '@/components/learning-center/LCRelatedVideos';
import { ArrowLeft, Clock, Tag, BookOpen, Loader2 } from 'lucide-react';

export default function LCVideoDetail() {
  const { id } = useParams();
  const { data, isLoading } = useLearningContent();
  const video = data?.videos?.find(v => v.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (video) {
      document.title = `${video.title} | Knowledge Library`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', video.description || 'Knowledge Library Video');
      }

      // Inject VideoObject Schema for SEO
      if (video.youtubeId) {
        const schema = {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          "name": video.title,
          "description": video.description || video.title,
          "thumbnailUrl": `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
          "uploadDate": video.date || new Date().toISOString().split('T')[0],
          "embedUrl": `https://www.youtube.com/embed/${video.youtubeId}`
        };
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'video-schema';
        script.innerHTML = JSON.stringify(schema);
        document.head.appendChild(script);

        return () => {
          const existingScript = document.getElementById('video-schema');
          if (existingScript) {
            existingScript.remove();
          }
        };
      }
    }
  }, [id, video]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
        <MarketingNav />
        <main className="flex-grow pt-32 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
          <p>Loading video details...</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
        <MarketingNav />
        <main className="flex-grow pt-32 text-center">
          <h1 className="text-3xl text-white font-bold">Video Not Found</h1>
          <Link to="/learning-center/videos" className="text-blue-400 mt-4 inline-block hover:underline">Back to Video Library</Link>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <MarketingNav />
      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <Link to="/learning-center/videos" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Video Library
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                <Tag className="w-3 h-3" /> {video.category}
              </span>

            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">{video.title}</h1>
            <VideoDescription text={video.description} />
          </div>

          {video.youtubeId ? (
            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800 mb-10">
              <iframe 
                src={`https://www.youtube.com/embed/${video.youtubeId}`} 
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                title={video.title}
              />
            </div>
          ) : (
            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-800 mb-10 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="bg-slate-800/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Video Coming Soon</h3>
                <p className="text-slate-400">This video is currently in production and will be available shortly.</p>
              </div>
            </div>
          )}

          {video.hasArticle ? (
            <div className="flex justify-center mb-16">
              <Link to={`/${video.slug}`} className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 text-lg w-full sm:w-auto">
                 <BookOpen className="w-5 h-5" /> Read The Full Article
              </Link>
            </div>
          ) : (
            <div className="flex justify-center mb-16">
              <div className="inline-flex items-center justify-center gap-2 bg-slate-800 text-slate-400 font-bold px-8 py-4 rounded-xl border border-slate-700 text-lg w-full sm:w-auto">
                 <BookOpen className="w-5 h-5" /> Full Article Coming Soon
              </div>
            </div>
          )}

          <LCRelatedVideos currentVideoId={video.id} category={video.category} />

          <div className="max-w-4xl mx-auto mb-16 mt-8">
             <LCCallToAction 
               type="audit" 
               title="Want to apply this to your business?" 
               description="Get a free AI Gap Audit and discover exactly how AI search engines are ranking your local business against competitors."
             />
          </div>

        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function VideoDescription({ text }) {
  const [expanded, setExpanded] = React.useState(false);
  
  if (!text) return null;

  const formatText = (content) => {
    return content.split('\n').map((line, i) => {
      if (!line.trim()) return <div key={i} className="h-2" />;
      
      const parts = line.split(/(https?:\/\/[^\s]+)/g);
      return (
        <p key={i} className="mb-3 last:mb-0 leading-relaxed">
          {parts.map((part, j) => {
            if (part.match(/^https?:\/\//)) {
              return (
                <a key={j} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors break-words">
                  {part}
                </a>
              );
            }
            return <React.Fragment key={j}>{part}</React.Fragment>;
          })}
        </p>
      );
    });
  };

  const isLong = text.length > 350;
  let displayText = text;
  
  if (!expanded && isLong) {
    const lastSpace = text.lastIndexOf(' ', 350);
    displayText = text.slice(0, lastSpace > 0 ? lastSpace : 350) + '...';
  }

  return (
    <div className="text-lg text-slate-400">
      <div className={expanded ? "" : "relative overflow-hidden"}>
        {formatText(displayText)}
        {!expanded && isLong && (
          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
        )}
      </div>
      {isLong && (
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-blue-400 hover:text-blue-300 font-bold mt-2 focus:outline-none transition-colors"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
}
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import { LEARNING_VIDEOS } from '@/utils/learningData';
import LCCallToAction from '@/components/learning-center/LCCallToAction';
import LCRelatedVideos from '@/components/learning-center/LCRelatedVideos';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import BuildingDigitalTrustArticle from '@/components/learning-center/articles/BuildingDigitalTrustArticle';

export default function LCVideoDetail() {
  const { id } = useParams();
  const video = LEARNING_VIDEOS.find(v => v.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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
              <span className="inline-flex items-center gap-1.5 text-slate-400 text-sm font-medium">
                <Clock className="w-4 h-4" /> {video.duration}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">{video.title}</h1>
            <p className="text-lg text-slate-400">{video.description}</p>
          </div>

          {video.youtubeId ? (
            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800 mb-16">
              <iframe 
                src={`https://www.youtube.com/embed/${video.youtubeId}`} 
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                title={video.title}
              />
            </div>
          ) : (
            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-800 mb-16 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="bg-slate-800/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Video Coming Soon</h3>
                <p className="text-slate-400">This video is currently in production and will be available shortly.</p>
              </div>
            </div>
          )}

          {video.id === 'v7' && (
            <div className="mb-16">
              <BuildingDigitalTrustArticle />
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
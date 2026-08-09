import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import LCVideoCard from '@/components/learning-center/LCVideoCard';
import { useLearningContent } from '@/hooks/useLearningContent';
import { PlayCircle, FileText, ArrowLeft, FolderOpen, ArrowRight, Loader2 } from 'lucide-react';
import LCCallToAction from '@/components/learning-center/LCCallToAction';

export default function LCCategory() {
  const { id } = useParams();
  const { data, isLoading } = useLearningContent();
  const category = data?.categories?.find(c => c.id === id);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
        <MarketingNav />
        <main className="flex-grow pt-32 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
          <p>Loading category...</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
        <MarketingNav />
        <main className="flex-grow pt-32 text-center">
          <h1 className="text-3xl text-white font-bold">Category Not Found</h1>
          <Link to="/learning-center" className="text-blue-400 mt-4 inline-block hover:underline">Back to Learning Center</Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const categoryVideos = data?.videos?.filter(v => v.category === category.title) || [];
  // For articles, we look at videos that have articles, or planned articles
  const categoryArticles = data?.videos?.filter(a => a.category === category.title && a.hasArticle) || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <MarketingNav />
      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <Link to="/learning-center" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Learning Center
          </Link>

          <div className="mb-12 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
              <FolderOpen className="w-4 h-4" />
              Playlist Category
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">{category.title}</h1>
            <p className="text-xl text-slate-400 leading-relaxed">{category.description}</p>
          </div>

          {categoryVideos.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-800">
                <PlayCircle className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Video Lessons</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryVideos.map(video => (
                  <LCVideoCard key={video.id} video={video} />
                ))}
              </div>
            </div>
          )}

          {categoryArticles.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-800">
                <FileText className="w-6 h-6 text-emerald-400" />
                <h2 className="text-2xl font-bold text-white">Featured Guides</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categoryArticles.map(article => (
                  <div key={article.id} className="relative h-full">
                    <Link to={article.link} className={`group flex flex-col bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-colors h-full ${(article.status === 'planned' || article.status === 'needs_article' || article.status === 'placeholder') ? 'opacity-70 pointer-events-none' : 'hover:border-blue-500/50'}`}>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className={`text-xl font-bold text-white ${(article.status === 'planned' || article.status === 'needs_article' || article.status === 'placeholder') ? '' : 'group-hover:text-blue-400'} transition-colors`}>{article.title}</h3>
                          {(article.status === 'planned' || article.status === 'needs_article' || article.status === 'placeholder') && (
                            <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Coming Soon
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 leading-relaxed">{article.description}</p>
                      </div>
                      <div className={`mt-6 flex items-center font-semibold transition-all ${(article.status === 'planned' || article.status === 'needs_article' || article.status === 'placeholder') ? 'text-slate-500' : 'text-blue-500 group-hover:gap-2'}`}>
                        Read Guide <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-20 max-w-5xl mx-auto">
             <LCCallToAction type="talk" />
          </div>

        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
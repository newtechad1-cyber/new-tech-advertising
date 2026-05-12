import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import LCVideoCard from '@/components/learning-center/LCVideoCard';
import { LEARNING_CATEGORIES, LEARNING_VIDEOS, LEARNING_ARTICLES } from '@/utils/learningData';
import { PlayCircle, FileText, ArrowLeft, FolderOpen, ArrowRight } from 'lucide-react';
import LCCallToAction from '@/components/learning-center/LCCallToAction';

export default function LCCategory() {
  const { id } = useParams();
  const category = LEARNING_CATEGORIES.find(c => c.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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

  const categoryVideos = LEARNING_VIDEOS.filter(v => v.category === category.title);
  const categoryArticles = LEARNING_ARTICLES.filter(a => a.category === category.title);

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
                  <Link key={article.id} to={article.link} className="group flex flex-col bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-colors h-full">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{article.title}</h3>
                      <p className="text-slate-400 leading-relaxed">{article.description}</p>
                    </div>
                    <div className="mt-6 flex items-center text-blue-500 font-semibold group-hover:gap-2 transition-all">
                      Read Guide <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </Link>
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
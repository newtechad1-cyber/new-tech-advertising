import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import LCVideoCard from '@/components/learning-center/LCVideoCard';
import { VIDEO_CATEGORIES } from '@/utils/learningData';
import { PlayCircle, Filter, Loader2 } from 'lucide-react';
import LCCallToAction from '@/components/learning-center/LCCallToAction';
import { useLearningContent } from '@/hooks/useLearningContent';

export default function LCVideoLibrary() {
  const [activeCategory, setActiveCategory] = useState('All');
  const { data, isLoading } = useLearningContent();
  const videos = data?.videos || [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredVideos = activeCategory === 'All' 
    ? videos 
    : videos.filter(v => v.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <MarketingNav />
      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
              <PlayCircle className="w-4 h-4" />
              Watch + Learn
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Video Learning Center</h1>
            <p className="text-lg text-slate-400">Actionable, practical video insights on AI, search, and visibility for small businesses.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="md:w-64 flex-shrink-0">
              <div className="sticky top-28 bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 z-20">
                <div className="hidden md:flex items-center gap-2 text-white font-bold mb-4 pb-4 border-b border-slate-800">
                  <Filter className="w-5 h-5 text-blue-400" /> Categories
                </div>
                <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide no-scrollbar -mx-2 px-2 md:mx-0 md:px-0">
                  {VIDEO_CATEGORIES.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`text-left px-4 py-2 md:px-3 md:py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap md:whitespace-normal flex-shrink-0 ${activeCategory === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800 bg-slate-800/50 md:bg-transparent'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
                  <p>Loading video library...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVideos.map(video => (
                      <LCVideoCard key={video.id} video={video} />
                    ))}
                  </div>
                  {filteredVideos.length === 0 && (
                    <div className="text-center py-24 bg-slate-900 border border-slate-800 rounded-2xl">
                      <PlayCircle className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">No videos found</h3>
                      <p className="text-slate-400">We don't have any videos in this category yet.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="mt-20 max-w-5xl mx-auto">
             <LCCallToAction type="talk" />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
import React, { useEffect } from 'react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import LCHeader from '@/components/learning-center/LCHeader';
import LCRelatedVideos from '@/components/learning-center/LCRelatedVideos';
import BuildingDigitalTrustArticle from '@/components/learning-center/articles/BuildingDigitalTrustArticle';

export default function BuildingDigitalTrust() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <MarketingNav />
      
      <main className="pt-24 pb-20">
        <LCHeader 
          title="Building Digital Trust"
          category="Digital Trust & Reputation"
          readingTime="6 min read"
          breadcrumbs={[
            { label: 'Learning Center', path: '/learning-center' },
            { label: 'Digital Trust & Reputation', path: '/learning-center/category/digital-trust-reputation' },
            { label: 'Building Digital Trust' }
          ]}
        />

        <div className="max-w-4xl mx-auto px-6 mt-12">
          {/* Featured Video */}
          <div className="mb-14 relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
            <iframe 
              src="https://www.youtube.com/embed/E5vE1kXlAhw?rel=0" 
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="autoplay; encrypted-media; fullscreen" 
              title="Building Digital Trust"
            />
          </div>

          <BuildingDigitalTrustArticle />

          <div className="mt-20 pt-12 border-t border-slate-800">
            <LCRelatedVideos currentVideoId="building-digital-trust" limit={3} category="Digital Trust & Reputation" />
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
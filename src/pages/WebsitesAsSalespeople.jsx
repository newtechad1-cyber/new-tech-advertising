import React, { useEffect } from 'react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import LCHeader from '@/components/learning-center/LCHeader';
import LCRelatedVideos from '@/components/learning-center/LCRelatedVideos';
import LCCallToAction from '@/components/learning-center/LCCallToAction';
import { TrackProgress, TrackBottomNav } from '@/components/learning-center/TrackNavigation';

export default function WebsitesAsSalespeople() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <MarketingNav />
      
      <main className="pt-24 pb-20">
        <LCHeader 
          title="Websites as Salespeople"
          category="Modern Marketing Systems"
          readingTime="4 min read"
          breadcrumbs={[
            { label: 'Learning Center', path: '/learning-center' },
            { label: 'Modern Marketing Systems', path: '/learning-center/category/modern-marketing-systems' },
            { label: 'Websites as Salespeople' }
          ]}
        />

        <div className="max-w-4xl mx-auto px-6 mt-12">
          <TrackProgress trackName="Fix My Marketing" currentStep={2} totalSteps={6} color="blue" />

          {/* Featured Video */}
          <div className="mb-14 relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
            <iframe 
              src="https://www.youtube.com/embed/elcnGAfYdgk?rel=0" 
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="autoplay; encrypted-media; fullscreen" 
              title="Websites as Salespeople"
            />
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-xl text-slate-300 leading-relaxed mb-10">
              Modern websites are no longer digital brochures. They act like salespeople by building trust, answering questions, educating customers, and helping businesses get found in AI search, Google, voice search, and social platforms.
            </p>

            <p>Your website should not just sit online looking pretty.</p>
            <p>It should work like a salesperson for your business 24 hours a day.</p>
            
            <p>Today, customers research before they call:</p>
            <ul className="space-y-3 mb-8 list-none pl-0">
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">↳</span> <strong>They ask AI tools</strong></li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">↳</span> <strong>Read reviews</strong></li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">↳</span> <strong>Watch videos</strong></li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">↳</span> <strong>Compare businesses</strong></li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">↳</span> <strong>Look for trust signals</strong></li>
            </ul>

            <p>If your website is outdated, slow, confusing, or missing helpful information, you may be losing customers before you ever hear from them.</p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Modern websites need to:</h2>
            <ul className="space-y-3 mb-8 list-none pl-0">
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Build trust quickly</strong></li>
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Answer real customer questions</strong></li>
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Show proof and authority</strong></li>
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Help people understand your business</strong></li>
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Connect with Google, AI search, and voice search</strong></li>
            </ul>

            <p>The businesses winning online today are not just advertising more.<br />They are educating better and building trust faster.</p>

            <p>In this video, we break down why websites now need to function like digital salespeople and what local businesses can do to stay competitive in the AI search era.</p>

            <div className="not-prose mt-16">
              <LCCallToAction 
                type="audit" 
                title="Keep Building Your AI Strategy" 
                description="Master AI Search, Digital Trust, and Modern Websites in our complete Learning Center." 
                buttonText="Visit the AI Learning Center"
                link="/learning-center"
              />
            </div>

            <TrackBottomNav 
              prevLink="/growth-systems-vs-campaigns"
              prevText="← Previous"
              nextLink="/reputation-is-now-a-growth-engine"
              nextText="Next: Reputation is Now a Growth Engine →"
              color="blue"
            />
          </div>

          <div className="mt-20 pt-12 border-t border-slate-800">
            <LCRelatedVideos currentVideoId="websites-as-salespeople" limit={3} category="Modern Marketing Systems" />
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
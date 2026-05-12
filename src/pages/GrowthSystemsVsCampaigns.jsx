import React, { useEffect } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import LCHeader from '@/components/learning-center/LCHeader';
import LCInsightBlock from '@/components/learning-center/LCInsightBlock';
import LCRelatedVideos from '@/components/learning-center/LCRelatedVideos';
import LCCallToAction from '@/components/learning-center/LCCallToAction';

export default function GrowthSystemsVsCampaigns() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <MarketingNav />
      
      <main className="pt-24 pb-20">
        <LCHeader 
          title="Growth Systems vs Campaigns"
          category="Modern Marketing Systems"
          readingTime="6 min read"
          breadcrumbs={[
            { label: 'Learning Center', path: '/learning-center' },
            { label: 'Modern Marketing Systems', path: '/learning-center/category/modern-marketing-systems' },
            { label: 'Growth Systems vs Campaigns' }
          ]}
        />

        <div className="max-w-4xl mx-auto px-6 mt-12">
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-xl text-slate-300 leading-relaxed mb-10">
              Many local businesses find themselves trapped in a cycle of running disconnected marketing campaigns—spending money on ads, SEO, or social media with no compounding return. Discover why transitioning from standalone campaigns to an integrated <strong>Growth System</strong> is the key to predictable, scalable revenue.
            </p>

            <div className="mb-12 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/50 shadow-2xl aspect-video relative">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/6kB55gnGGHo?rel=0"
                title="Growth Systems vs Campaigns"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>

            <LCInsightBlock 
              type="business_insight"
              title="The Campaign Trap"
              content="Campaigns are temporary by nature. When you stop funding a campaign, the results stop immediately. You're renting your visibility rather than owning it."
            />

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">What is a Growth System?</h2>
            <p>
              A growth system is an interconnected ecosystem of marketing assets that work together to build compounding authority, digital trust, and continuous lead generation. Unlike campaigns, a system builds equity over time.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-400 mb-4">Marketing Campaigns</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3"><span className="text-red-500 mt-1">✕</span> Disconnected efforts</li>
                  <li className="flex items-start gap-3"><span className="text-red-500 mt-1">✕</span> Short-term focus</li>
                  <li className="flex items-start gap-3"><span className="text-red-500 mt-1">✕</span> Rented visibility (Ads)</li>
                  <li className="flex items-start gap-3"><span className="text-red-500 mt-1">✕</span> Stop spending = stop leads</li>
                </ul>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-emerald-400 mb-4">Growth Systems</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">✓</span> Integrated ecosystem</li>
                  <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">✓</span> Long-term compounding equity</li>
                  <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">✓</span> Owned authority</li>
                  <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">✓</span> Sustainable lead generation</li>
                </ul>
              </div>
            </div>

            <LCInsightBlock 
              type="nta_found"
              title="Building Digital Trust"
              content="A proper Growth System leverages your reviews, authentic video content, and consistent business data to build Digital Trust—the ultimate ranking factor for modern AI Search Engines."
            />

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Key Takeaways</h2>
            <ul className="space-y-4 mb-12">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                <span><strong>Shift your mindset:</strong> Stop thinking in 30-day sprints and start thinking about building digital assets that work 24/7.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                <span><strong>Connect your efforts:</strong> Ensure your social media, website, and reputation management are all working toward the same goal.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                <span><strong>Own your authority:</strong> Invest in content and AI Search Optimization (AISO) to establish yourself as the trusted local leader.</span>
              </li>
            </ul>

            <LCCallToAction mode="audit" />
          </div>

          <div className="mt-20 pt-12 border-t border-slate-800">
            <LCRelatedVideos currentVideoId="v9" limit={2} />
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
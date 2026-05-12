import React, { useEffect } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import LCHeader from '@/components/learning-center/LCHeader';
import LCInsightBlock from '@/components/learning-center/LCInsightBlock';
import LCRelatedVideos from '@/components/learning-center/LCRelatedVideos';
import LCCallToAction from '@/components/learning-center/LCCallToAction';

export default function TheHiddenCostOfOutdatedMarketing() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <MarketingNav />
      
      <main className="pt-24 pb-20">
        <LCHeader 
          title="The Hidden Cost of Outdated Marketing"
          category="Modern Marketing Systems"
          readingTime="6 min read"
          breadcrumbs={[
            { label: 'Learning Center', path: '/learning-center' },
            { label: 'Modern Marketing Systems', path: '/learning-center/category/modern-marketing-systems' },
            { label: 'The Hidden Cost of Outdated Marketing' }
          ]}
        />

        <div className="max-w-4xl mx-auto px-6 mt-12">
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-xl text-slate-300 leading-relaxed mb-10">
              Holding onto legacy SEO practices, traditional brochure websites, and fragmented marketing campaigns is no longer just ineffective—it's actively bleeding your business dry. Learn the hidden costs of outdated marketing and how to transition to a modern growth system.
            </p>

            <div className="mb-12 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/50 shadow-2xl aspect-video relative">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/jU_2Wae-_14?rel=0"
                title="The Hidden Cost of Outdated Marketing"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>

            <LCInsightBlock 
              type="ai_tip"
              title="AI Values Cohesion Over Tricks"
              content="Outdated SEO relied on keywords and backlinks to trick search engines. Modern AI visibility looks at your entire digital footprint holistically. Fragmented campaigns confuse AI, while a unified growth system establishes clear topical authority."
            />

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">The True Cost of Inaction</h2>
            <p>
              When your marketing is disconnected, every new initiative starts from scratch. You pay for ads that don't convert because the website isn't optimized, you invest in SEO but neglect your reputation, and you create social content that doesn't tie back to a central conversion goal. The result is a leaky bucket where marketing dollars are wasted.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-slate-300 mb-4">Outdated Marketing</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3"><span className="text-slate-500 mt-1">✕</span> Disconnected campaigns</li>
                  <li className="flex items-start gap-3"><span className="text-slate-500 mt-1">✕</span> Keyword stuffing & link buying</li>
                  <li className="flex items-start gap-3"><span className="text-slate-500 mt-1">✕</span> Brochure-style websites</li>
                  <li className="flex items-start gap-3"><span className="text-slate-500 mt-1">✕</span> Hope-based lead generation</li>
                </ul>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Modern Growth System</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> Integrated omnipresence</li>
                  <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> Trust verification & AI readiness</li>
                  <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> Conversion-optimized funnels</li>
                  <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> Predictable, scalable growth</li>
                </ul>
              </div>
            </div>

            <LCInsightBlock 
              type="business_insight"
              title="The Compounding Effect"
              content="A modern growth system compounds over time. When your website, reputation, content, and outreach work together, each element amplifies the others, reducing your customer acquisition cost (CAC) month over month."
            />

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Key Takeaways</h2>
            <ul className="space-y-4 mb-12">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                <span><strong>Stop Buying Random Tactics:</strong> Ad-hoc marketing services rarely produce ROI. You need a comprehensive system.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                <span><strong>Your Website Is a Salesperson:</strong> It shouldn't just look pretty; it needs to capture leads, verify trust, and rank in AI search.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                <span><strong>Embrace the AI Shift:</strong> Businesses that adapt their infrastructure for AI discovery now will dominate local markets for the next decade.</span>
              </li>
            </ul>

            <LCCallToAction mode="audit" />
          </div>

          <div className="mt-20 pt-12 border-t border-slate-800">
            <LCRelatedVideos currentVideoId="v12" limit={2} />
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
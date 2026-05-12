import React, { useEffect } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import LCHeader from '@/components/learning-center/LCHeader';
import LCInsightBlock from '@/components/learning-center/LCInsightBlock';
import LCRelatedVideos from '@/components/learning-center/LCRelatedVideos';
import LCCallToAction from '@/components/learning-center/LCCallToAction';

export default function ReputationIsNowAGrowthEngine() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <MarketingNav />
      
      <main className="pt-24 pb-20">
        <LCHeader 
          title="Reputation Is Now a Growth Engine"
          category="Digital Trust & Reputation"
          readingTime="5 min read"
          breadcrumbs={[
            { label: 'Learning Center', path: '/learning-center' },
            { label: 'Digital Trust & Reputation', path: '/learning-center/category/digital-trust-reputation' },
            { label: 'Reputation Is Now a Growth Engine' }
          ]}
        />

        <div className="max-w-4xl mx-auto px-6 mt-12">
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-xl text-slate-300 leading-relaxed mb-10">
              For years, businesses treated reviews as a nice-to-have or just a badge of honor on their website. Today, your reputation is the single most powerful driver for AI Visibility and local search dominance. Learn how to transform static reviews into an active growth engine.
            </p>

            <div className="mb-12 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/50 shadow-2xl aspect-video relative">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/BT3WY2WdVDY?rel=0"
                title="Reputation Is Now a Growth Engine"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>

            <LCInsightBlock 
              type="ai_tip"
              title="AI Engines Read Reviews First"
              content="When ChatGPT or Google AI Overviews are deciding which local business to recommend, they don't just look at your website. They heavily weight the volume, recency, and sentiment of your third-party reviews to determine Digital Trust."
            />

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">From Passive Feedback to Active Growth</h2>
            <p>
              A passive reputation strategy relies on hoping happy customers will leave a review. An active reputation growth engine systemizes the review collection process, responds to all feedback strategically, and syndicates those reviews across your marketing assets to build compounding authority.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-slate-300 mb-4">Passive Reputation</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3"><span className="text-slate-500 mt-1">✕</span> Asking for reviews randomly</li>
                  <li className="flex items-start gap-3"><span className="text-slate-500 mt-1">✕</span> Ignoring negative feedback</li>
                  <li className="flex items-start gap-3"><span className="text-slate-500 mt-1">✕</span> Leaving reviews un-responded</li>
                  <li className="flex items-start gap-3"><span className="text-slate-500 mt-1">✕</span> Reviews hidden only on Google</li>
                </ul>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Active Growth Engine</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> Automated review requests</li>
                  <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> Strategic, keyword-rich responses</li>
                  <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> Syndicating reviews to social media</li>
                  <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> Showcasing trust on your website</li>
                </ul>
              </div>
            </div>

            <LCInsightBlock 
              type="business_insight"
              title="The Conversion Multiplier"
              content="Having a massive catalog of fresh, 5-star reviews acts as a conversion multiplier. It makes every other marketing dollar you spend more effective because your baseline trust is so high."
            />

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Key Takeaways</h2>
            <ul className="space-y-4 mb-12">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                <span><strong>Volume and Velocity Matter:</strong> AI models look for a steady stream of new reviews, not just a high average rating from 3 years ago.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                <span><strong>Context in Responses:</strong> Responding to reviews is an opportunity to naturally inject keywords and context about the services you provided.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                <span><strong>Systemize the Ask:</strong> Build the review request directly into your standard operating procedures or use automation to ensure every happy customer is asked.</span>
              </li>
            </ul>

            <LCCallToAction mode="audit" />
          </div>

          <div className="mt-20 pt-12 border-t border-slate-800">
            <LCRelatedVideos currentVideoId="v10" limit={2} />
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
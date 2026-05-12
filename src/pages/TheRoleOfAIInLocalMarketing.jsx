import React, { useEffect } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import LCHeader from '@/components/learning-center/LCHeader';
import LCInsightBlock from '@/components/learning-center/LCInsightBlock';
import LCRelatedVideos from '@/components/learning-center/LCRelatedVideos';
import LCCallToAction from '@/components/learning-center/LCCallToAction';

export default function TheRoleOfAIInLocalMarketing() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <MarketingNav />
      
      <main className="pt-24 pb-20">
        <LCHeader 
          title="The Role of AI in Local Marketing"
          category="AI Basics For Small Businesses"
          readingTime="7 min read"
          breadcrumbs={[
            { label: 'Learning Center', path: '/learning-center' },
            { label: 'AI Basics For Small Businesses', path: '/learning-center/category/ai-basics-small-businesses' },
            { label: 'The Role of AI in Local Marketing' }
          ]}
        />

        <div className="max-w-4xl mx-auto px-6 mt-12">
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-xl text-slate-300 leading-relaxed mb-10">
              There is a lot of noise about AI, but how does it actually help a local business get more customers? Cut through the hype and discover the practical, revenue-generating role AI plays in modern local marketing.
            </p>

            <div className="mb-12 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/50 shadow-2xl aspect-video relative">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/scPcJSMFn-E?rel=0"
                title="The Role of AI in Local Marketing"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>

            <LCInsightBlock 
              type="business_insight"
              title="AI is the New Front Door"
              content="Consumers are increasingly asking ChatGPT, Claude, and Google AI Overviews for local recommendations instead of scrolling through traditional search results. If your business isn't optimized for AI discovery, you're invisible to this growing segment of buyers."
            />

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Beyond Just Generating Content</h2>
            <p>
              While many business owners think of AI simply as a tool to write blog posts or social media captions, its real power in local marketing lies in automation, personalization, and search visibility. AI is transforming how customers find you, how they interact with your brand, and how efficiently you can deliver a premium customer experience.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-slate-300 mb-4">Old Paradigm</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3"><span className="text-slate-500 mt-1">✕</span> Guessing what customers want</li>
                  <li className="flex items-start gap-3"><span className="text-slate-500 mt-1">✕</span> Manual review responses</li>
                  <li className="flex items-start gap-3"><span className="text-slate-500 mt-1">✕</span> One-size-fits-all messaging</li>
                  <li className="flex items-start gap-3"><span className="text-slate-500 mt-1">✕</span> Invisible to AI search engines</li>
                </ul>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-400 mb-4">AI-Empowered Marketing</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> Data-driven customer insights</li>
                  <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> Automated, contextual responses</li>
                  <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> Hyper-personalized outreach</li>
                  <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> Dominating zero-click search</li>
                </ul>
              </div>
            </div>

            <LCInsightBlock 
              type="ai_tip"
              title="The Trust Verification Loop"
              content="AI engines don't just read your website; they cross-reference your claims against external data sources, reviews, and directories. Using AI to monitor and manage this 'Trust Verification Loop' ensures you always appear as the most authoritative option."
            />

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Key Takeaways</h2>
            <ul className="space-y-4 mb-12">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                <span><strong>AI Search is Here:</strong> People are using AI to find local services right now. Your digital footprint must be structured for LLMs, not just traditional search crawlers.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                <span><strong>Automation Drives Efficiency:</strong> AI can handle repetitive tasks like review requests, initial lead responses, and content scheduling, freeing you to focus on running your business.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                <span><strong>Start with Fundamentals:</strong> Before exploring complex AI tools, ensure your core business data, reviews, and website content are accurate and clearly structured for AI ingestion.</span>
              </li>
            </ul>

            <LCCallToAction mode="ai_visibility" />
          </div>

          <div className="mt-20 pt-12 border-t border-slate-800">
            <LCRelatedVideos currentVideoId="v14" limit={2} />
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
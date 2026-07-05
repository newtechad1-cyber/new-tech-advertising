import React, { useEffect } from 'react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import LCHeader from '@/components/learning-center/LCHeader';
import LCInsightBlock from '@/components/learning-center/LCInsightBlock';
import LCRelatedVideos from '@/components/learning-center/LCRelatedVideos';
import LCCallToAction from '@/components/learning-center/LCCallToAction';
import { TrackProgress, TrackBottomNav } from '@/components/learning-center/TrackNavigation';

import SEOHead from '@/components/shared/SEOHead';
export default function ReputationIsNowAGrowthEngine() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <SEOHead 
        title="Reputation Is Now a Growth Engine | New Tech Advertising"
        description="How online reputation management drives growth for local businesses. AI-powered review management and brand building strategies."
      />
      <MarketingNav />
      
      <main className="pt-24 pb-20">
        <LCHeader 
          title="Reputation Is Now a Growth Engine"
          category="Digital Trust & Reputation"
          readingTime="9 min read"
          breadcrumbs={[
            { label: 'Learning Center', path: '/learning-center' },
            { label: 'Digital Trust & Reputation', path: '/learning-center/category/digital-trust-reputation' },
            { label: 'Reputation Is Now a Growth Engine' }
          ]}
        />

        <div className="max-w-4xl mx-auto px-6 mt-12">
          <TrackProgress trackName="Fix My Marketing" currentStep={3} totalSteps={6} color="blue" />

          {/* Featured Video */}
          <div className="mb-14 relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
            <iframe 
              src="https://www.youtube.com/embed/BT3WY2WdVDY?rel=0" 
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="autoplay; encrypted-media; fullscreen" 
              title="Reputation Is Now a Growth Engine"
            />
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-xl text-slate-300 leading-relaxed mb-10">
              For years, small businesses treated online reviews as a passive digital suggestion box—nice to have, but rarely the main focus. Today, customer research happens long before they ever call your business. Your reputation has evolved from passive word-of-mouth into an active growth engine that directly influences your visibility, AI search rankings, SEO, and overall customer acquisition.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">How Reputation Has Changed</h2>
            <p>
              In the past, a local business's reputation spread primarily through personal referrals and local relationships. You did good work, a customer told their neighbor, and the phone rang.
            </p>
            <p>
              While personal referrals still matter, the definition of reputation has drastically expanded. Today, your reputation includes:
            </p>
            <ul className="space-y-3 mb-8 list-none pl-0">
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Online Reviews:</strong> Google, Yelp, Facebook, and industry-specific directories.</li>
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Star Ratings:</strong> Your average score across all platforms.</li>
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Social Proof:</strong> Video testimonials, case studies, and before/after portfolios.</li>
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Website Trust:</strong> A modern, secure, accessible, and fast website that looks professional.</li>
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Responsiveness:</strong> How quickly and professionally you reply to reviews and messages.</li>
            </ul>

            <LCInsightBlock 
              type="business_insight"
              title="The Silent Buyer"
              content="Up to 80% of the buying decision is now made before a customer contacts you. They are reading your reviews, watching your videos, and judging your website. If your digital reputation is weak, they silently move to a competitor without ever letting you know."
            />

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Why Reputation Impacts Visibility</h2>
            <p>
              Google, AI search engines, and recommendation systems all share the same goal: providing users with the best, most trustworthy answers. They use reputation as a primary filter.
            </p>
            <p>
              Search algorithms actively evaluate:
            </p>
            <ul className="space-y-3 mb-8 list-none pl-0">
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">↳</span> <strong>Review Quality & Volume:</strong> A business with 200 detailed, positive reviews is seen as vastly more authoritative than one with 5 generic reviews.</li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">↳</span> <strong>Review Frequency:</strong> Recency matters. If your last review was 14 months ago, search engines assume your business is stagnant.</li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">↳</span> <strong>Trust Signals:</strong> Mentions of specific services in reviews act as keywords, validating what your business actually does.</li>
            </ul>
            <p>
              When algorithms see strong trust signals and a great customer experience documented online, they reward you with higher local map rankings and better overall visibility.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">How AI Search Uses Reputation Signals</h2>
            <p>
              As search transitions from traditional links to AI-generated answers (like ChatGPT and Google AI Overviews), reputation becomes even more critical. AI models do not just count links; they read sentiment.
            </p>
            <p>
              AI systems evaluate your business by analyzing:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 not-prose">
              {[
                'Overall customer sentiment',
                'Business consistency across the web',
                'Keyword context within reviews',
                'Authority signals and expertise',
                'Quality of educational content',
                'Responsiveness to complaints',
                'Authenticity of video content',
                'Overall trustworthiness'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-4 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-300 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <LCInsightBlock 
              type="ai_impact"
              title="AI Acts Like a Human Researcher"
              content="When an AI is asked to recommend a local plumber, it scans the web for consensus. It reads reviews to find out if you are reliable, fast, and fair. If your reviews confirm your expertise, the AI confidently recommends you."
            />

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Common Reputation Problems Small Businesses Have</h2>
            <p>
              Many small businesses unknowingly sabotage their growth by neglecting their digital reputation. Common mistakes include:
            </p>
            <ul className="space-y-3 mb-8 list-none pl-0">
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> <strong>No Review Strategy:</strong> Hoping customers leave reviews instead of actively asking them.</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> <strong>Ignored Feedback:</strong> Failing to respond to negative (or positive) reviews.</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> <strong>Outdated Websites:</strong> A slow or broken website instantly destroys trust.</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> <strong>Inconsistent Branding:</strong> Different logos, phone numbers, or addresses across various directories.</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> <strong>No Video Presence:</strong> Missing the opportunity to build human connection and familiarity before the sale.</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Turning Reputation Into A Growth System</h2>
            <p>
              To turn reputation into a predictable growth engine, you must systematize it. Here are practical strategies to implement:
            </p>
            <ul className="space-y-3 mb-8 list-none pl-0">
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">1.</span> <strong>Ask Consistently:</strong> Automate review requests via email or text immediately after a completed job or successful transaction.</li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">2.</span> <strong>Respond to Everything:</strong> Reply to every review. Thank positive reviewers and address negative reviews professionally and publicly.</li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">3.</span> <strong>Use Video Testimonials:</strong> Ask your best customers to record a short 30-second video on their phone. Video provides undeniable social proof.</li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">4.</span> <strong>Publish Educational Content:</strong> Writing articles and answering common questions builds authority and proves you are an expert.</li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">5.</span> <strong>Improve Website Trust Signals:</strong> Prominently display your review rating, industry associations, licenses, and guarantees on your website.</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Real-World Business Comparison</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10 not-prose">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Business A: Ignored Reputation</h3>
                <p className="text-slate-400 mb-4 text-sm leading-relaxed">
                  Relies heavily on paid ads. Has 14 Google reviews, the last one from 8 months ago. Website hasn't been updated since 2018.
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Ad traffic converts poorly due to lack of trust.</li>
                  <li>• Fails to appear in local "best [service] near me" searches.</li>
                  <li>• Competes heavily on price to win business.</li>
                </ul>
              </div>
              <div className="bg-slate-900 border border-emerald-900/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Business B: Active Reputation</h3>
                <p className="text-slate-400 mb-4 text-sm leading-relaxed">
                  Automates review requests, answers customer questions via video, and maintains a modern, accessible website.
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• High conversion rate because prospects arrive pre-sold.</li>
                  <li>• Dominates local SEO and AI recommendations.</li>
                  <li>• Commands premium pricing based on proven expertise.</li>
                </ul>
              </div>
            </div>

            <LCInsightBlock 
              type="strategy"
              title="The Review-SEO Connection"
              content="Reviews are local SEO. When a customer writes, 'They did a great job replacing our water heater,' they are giving you a free, highly trusted keyword backlink on Google's own platform. That directly drives future visibility."
            />

            <h2 className="text-2xl font-bold text-white mt-16 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4 mb-16 not-prose">
              {[
                { q: "Do reviews actually affect SEO?", a: "Yes. Google explicitly states that high-quality, positive reviews from your customers improve your business visibility and increase the likelihood of ranking in the local map pack." },
                { q: "Why do reviews matter for AI search?", a: "AI engines read the sentiment of the entire web. If an AI sees a consensus of positive sentiment surrounding your business, it is much more likely to recommend you to users asking for local suggestions." },
                { q: "How many reviews should a business have?", a: "There is no magic number, but you should aim to have a higher volume and more recent reviews than your top 3 local competitors. Consistency is more important than a sudden spike." },
                { q: "Should businesses respond to negative reviews?", a: "Absolutely. A calm, professional response shows future prospects how you handle conflict. Often, readers judge the business owner's response more than the original complaint." },
                { q: "Can reputation affect conversions?", a: "Yes. A strong reputation drastically increases the percentage of website visitors who actually call you. It is the ultimate conversion rate optimizer." },
              ].map((faq, i) => (
                <details key={i} className="group bg-slate-900 border border-slate-800 rounded-xl">
                  <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-5 text-white">
                    <span>{faq.q}</span>
                    <span className="transition group-open:rotate-180">
                      <ChevronDown className="w-5 h-5 text-slate-500" />
                    </span>
                  </summary>
                  <div className="text-slate-400 p-5 pt-0 leading-relaxed border-t border-slate-800 mt-2">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>

            <div className="not-prose">
              <LCCallToAction 
                mode="audit" 
                title="Is Your Reputation Costing You Leads?" 
                description="Get a free AI visibility audit to discover how your digital reputation compares to your top local competitors and see exactly what AI search engines think of your business." 
              />
            </div>

            <TrackBottomNav 
              prevLink="/websites-as-salespeople"
              prevText="← Previous"
              nextLink="/building-digital-trust"
              nextText="Next: Building Digital Trust →"
              color="blue"
            />
          </div>

          <div className="mt-20 pt-12 border-t border-slate-800">
            <LCRelatedVideos currentVideoId="reputation-is-now-a-growth-engine" limit={3} category="Digital Trust & Reputation" />
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
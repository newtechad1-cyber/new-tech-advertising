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
export default function TheRoleOfAIInLocalMarketing() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <SEOHead 
        title="The Role of AI in Local Marketing | New Tech Advertising"
        description="How AI is transforming local marketing for small businesses. From automated content to intelligent optimization."
      />
      <MarketingNav />
      
      <main className="pt-24 pb-20">
        <LCHeader 
          title="The Role of AI in Local Marketing"
          category="AI Basics For Small Businesses"
          readingTime="8 min read"
          breadcrumbs={[
            { label: 'Learning Center', path: '/learning-center' },
            { label: 'AI Basics For Small Businesses', path: '/learning-center/category/ai-basics-small-businesses' },
            { label: 'The Role of AI in Local Marketing' }
          ]}
        />

        <div className="max-w-4xl mx-auto px-6 mt-12">
          <TrackProgress trackName="I'm New to AI" currentStep={5} totalSteps={5} color="emerald" />

          {/* Featured Video */}
          <div className="mb-14 relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
            <iframe 
              src="https://www.youtube.com/embed/scPcJSMFn-E?rel=0" 
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="autoplay; encrypted-media; fullscreen" 
              title="The Role of AI in Local Marketing"
            />
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-xl text-slate-300 leading-relaxed mb-10">
              Artificial Intelligence isn't just a buzzword for tech companies—it is quietly reshaping how local customers discover, compare, and choose businesses in your town. Understanding how AI impacts local marketing, search visibility, and customer trust is no longer optional for small business owners who want to stay competitive.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">What AI Means In Local Marketing</h2>
            <p>
              When we talk about AI in local marketing, we aren't talking about replacing human workers with robots. We are talking about the systems that connect customers to your business. In practical terms, AI means:
            </p>
            <ul className="space-y-3 mb-8 list-none pl-0">
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">↳</span> <strong>AI Search Summaries:</strong> Search engines like Google now use AI to read websites and summarize answers for users instantly.</li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">↳</span> <strong>Recommendation Engines:</strong> Platforms use AI to decide which local business to show when someone searches for "best plumber near me."</li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">↳</span> <strong>Voice Search:</strong> Smart speakers and virtual assistants using AI to parse conversational questions and deliver one definitive answer.</li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">↳</span> <strong>Automated Content Understanding:</strong> AI reading your website to figure out not just <em>what</em> you sell, but <em>how trustworthy</em> you are.</li>
            </ul>

            <LCInsightBlock 
              type="business_insight"
              title="A Shift in Discovery"
              content="AI doesn't change the services you provide; it changes how people find those services. If your business information isn't structured for AI to understand, you are invisible to the modern customer."
            />

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">How Customer Behavior Is Changing</h2>
            <p>
              Customers have fundamentally changed how they search for local services. Because of AI and advanced search tools, patience is at an all-time low. Customers now expect immediate clarity:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 not-prose">
              {[
                'Asking AI tools direct questions',
                'Faster comparison shopping',
                'Mobile-first behavior',
                'Trust-first decision making',
                'Reading AI-generated search summaries',
                'Ignoring generic, unhelpful websites',
                'Relying heavily on verified reviews',
                'Expecting instant, accurate answers'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-4 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-300 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Why AI Visibility Matters</h2>
            <p>
              AI Visibility (AISO - AI Search Optimization) is the process of making your business the undisputed, trusted answer that AI engines recommend. Unlike traditional SEO, which just required stuffing keywords onto a page, AI visibility requires actual substance.
            </p>
            <p>
              To be recommended by AI, your business needs:
            </p>
            <ul className="space-y-3 mb-8 list-none pl-0">
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Clear Information:</strong> No vague language; state exactly what you do.</li>
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Educational Content:</strong> Deep articles answering real customer questions.</li>
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Structured Websites:</strong> Code that AI bots can easily crawl and parse.</li>
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Trust Signals:</strong> Consistent business profiles, high review volume, and authentic video presence.</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">How AI Uses Business Information</h2>
            <p>
              How does an AI model decide if you are a good business? It evaluates you like a highly critical researcher. It scans the web looking for consensus.
            </p>
            <p>
              AI systems evaluate:
            </p>
            <p>
              <strong>Reputation:</strong> Are real people saying good things about you across multiple platforms?<br/>
              <strong>Consistency:</strong> Do your business name, address, and hours match exactly everywhere?<br/>
              <strong>Clarity & Content:</strong> Does your website comprehensively explain your processes, pricing factors, and solutions?<br/>
              <strong>Engagement:</strong> Do you have videos that people actually watch? Do you respond to reviews?
            </p>

            <LCInsightBlock 
              type="ai_impact"
              title="AI Looks for Consensus"
              content="If your website claims you are the 'best roofer in town,' but you have no reviews and no educational content to back it up, AI systems will ignore your claim and recommend a competitor who proves their expertise."
            />

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Common Mistakes Small Businesses Make</h2>
            <p>
              Because AI search is relatively new, many small businesses are making critical errors that cost them visibility:
            </p>
            <ul className="space-y-3 mb-8 list-none pl-0">
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> <strong>Relying only on old SEO:</strong> Focusing purely on backlinks and keywords instead of helpful content.</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> <strong>Outdated Websites:</strong> Having a site that is slow, hard to read, or broken on mobile devices.</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> <strong>No Educational Content:</strong> Forcing users (and AI) to guess how you solve specific problems.</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> <strong>Ignoring Reviews:</strong> Failing to actively collect reviews, which starves the AI of trust signals.</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> <strong>No Video Presence:</strong> Missing out on the human connection that builds trust before a customer ever calls.</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Practical Ways Businesses Can Adapt</h2>
            <p>
              Adapting to the AI era doesn't require a degree in computer science. It requires a commitment to being the most helpful, clear, and trusted business in your local market.
            </p>
            <ul className="space-y-3 mb-8 list-none pl-0">
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">1.</span> <strong>Answer Customer Questions:</strong> Write articles or create FAQ pages that answer the exact questions prospects ask you on the phone.</li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">2.</span> <strong>Improve Website Clarity:</strong> Ensure your site explicitly states what you do, who you serve, and where you are located.</li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">3.</span> <strong>Add Authentic Videos:</strong> Put a face to your brand. Video is one of the hardest things to fake, making it a massive trust signal.</li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">4.</span> <strong>Strengthen Review Systems:</strong> Automate the process of asking every happy customer for a review.</li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">5.</span> <strong>Build Authority Over Time:</strong> View your website not as a digital brochure, but as a growing library of your expertise.</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">AI Is Not Replacing Human Trust</h2>
            <p>
              It is crucial to understand that AI is not replacing human trust; it is simply filtering the options for the customer. AI helps prospects narrow down a list of 50 local plumbers to the top 3 most trusted options.
            </p>
            <p>
              Once a customer is looking at those top 3, <strong>human trust still wins</strong>. They will choose the business with the best reviews, the most authentic video presence, and the clearest communication. You still need relationships, expertise, and credibility.
            </p>

            <LCInsightBlock 
              type="strategy"
              title="The Ultimate Goal"
              content="Your goal is not to 'trick' the AI. Your goal is to build such a helpful, trustworthy, and authoritative digital presence that the AI has no choice but to recommend you to its users."
            />

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Real-World Business Comparison</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10 not-prose">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Business A: Ignored AI Trends</h3>
                <p className="text-slate-400 mb-4 text-sm leading-relaxed">
                  Has a 5-page static website, inconsistent directory listings, and relies entirely on word-of-mouth.
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Invisible in AI-generated search summaries</li>
                  <li>• Competes heavily on price</li>
                  <li>• Misses out on mobile-first researchers</li>
                </ul>
              </div>
              <div className="bg-slate-900 border border-emerald-900/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Business B: AI-Friendly Leader</h3>
                <p className="text-slate-400 mb-4 text-sm leading-relaxed">
                  Consistently publishes educational content, maintains a high volume of reviews, and features humanizing videos on their site.
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Frequently cited as the top recommendation by AI</li>
                  <li>• Prospects call pre-sold and ready to buy</li>
                  <li>• Dominates local market authority</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mt-16 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4 mb-16 not-prose">
              {[
                { q: "Is AI replacing SEO?", a: "AI isn't replacing SEO; it is evolving it. Traditional SEO was about ranking links. AI visibility (AISO) is about becoming the trusted answer that AI engines synthesize for users." },
                { q: "Do small businesses actually need to worry about AI?", a: "Yes. Customers are already using AI tools and AI-powered search (like Google AI Overviews) to find local services. If you aren't optimizing for it, your competitors will." },
                { q: "What exactly is AI visibility?", a: "It is the process of structuring your digital footprint (website, reviews, content, consistency) so that AI models understand, trust, and confidently recommend your business." },
                { q: "How do reviews affect AI search?", a: "AI engines read reviews to gauge public consensus. A high volume of detailed, positive reviews tells the AI that your business is safe to recommend." },
                { q: "Can AI help local businesses compete against big corporations?", a: "Absolutely. Big corporations struggle to create hyper-local, deeply authentic content. Small businesses can win by being highly relevant, intensely helpful, and deeply integrated into their community." },
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
                title="Is Your Business AI-Ready?" 
                description="Get a free AI visibility audit to discover how AI search engines currently view your digital footprint compared to your local competitors." 
              />
            </div>

            <TrackBottomNav 
              prevLink="/practical-ai-for-small-businesses"
              prevText="← Previous"
              nextLink="/gap-audit"
              nextText="🎉 Track Complete! Take the Free AI Audit →"
              color="emerald"
            />
          </div>

          <div className="mt-20 pt-12 border-t border-slate-800">
            <LCRelatedVideos currentVideoId="role-of-ai-in-local-marketing" limit={3} category="AI Basics For Small Businesses" />
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
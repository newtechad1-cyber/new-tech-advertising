import React, { useEffect } from 'react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import LCHeader from '@/components/learning-center/LCHeader';
import LCInsightBlock from '@/components/learning-center/LCInsightBlock';
import LCRelatedVideos from '@/components/learning-center/LCRelatedVideos';
import LCCallToAction from '@/components/learning-center/LCCallToAction';

export default function CampaignsVsAuthority() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <MarketingNav />
      
      <main className="pt-24 pb-20">
        <LCHeader 
          title="Campaigns vs Authority"
          category="AI Visibility & Search"
          readingTime="8 min read"
          breadcrumbs={[
            { label: 'Learning Center', path: '/learning-center' },
            { label: 'AI Visibility & Search', path: '/learning-center/category/ai-visibility-search' },
            { label: 'Campaigns vs Authority' }
          ]}
        />

        <div className="max-w-4xl mx-auto px-6 mt-12">
          {/* Featured Video */}
          <div className="mb-14 relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
            <iframe 
              src="https://www.youtube.com/embed/6Toyby7CTsA?rel=0" 
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="autoplay; encrypted-media; fullscreen" 
              title="Campaigns vs Authority"
            />
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-xl text-slate-300 leading-relaxed mb-10">
              For decades, small businesses have relied on short-term marketing campaigns to generate leads. But as modern search engines evolve and customer behavior shifts towards trust-first buying decisions, isolated campaigns are losing their effectiveness. Today, the businesses that win are the ones building long-term digital authority.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">What Is A Marketing Campaign?</h2>
            <p>
              A marketing campaign is a specific, time-bound initiative designed to achieve a short-term goal, usually generating immediate leads or sales. Examples include:
            </p>
            <ul className="space-y-3 mb-8 list-none pl-0">
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">↳</span> <strong>Ads:</strong> Running Facebook or Google ads for a month.</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">↳</span> <strong>Seasonal Promotions:</strong> Offering a discount for a holiday or specific season.</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">↳</span> <strong>Temporary Traffic Pushes:</strong> Buying email blasts or sponsored posts.</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">↳</span> <strong>Short-term Lead Generation:</strong> Collecting phone numbers in exchange for a quick offer.</li>
            </ul>
            <p>
              <strong>The Strength:</strong> Campaigns can generate immediate action. <br/>
              <strong>The Weakness:</strong> When the budget stops, the leads stop. Campaigns do not build permanent assets for your business.
            </p>

            <LCInsightBlock 
              type="business_insight"
              title="The Campaign Treadmill"
              content="Relying solely on campaigns puts your business on a treadmill. You have to keep spending money every month just to maintain the same level of leads. You never build momentum."
            />

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">What Is Digital Authority?</h2>
            <p>
              Digital authority is the compounding trust and visibility your business earns over time. It is not something you buy for a month; it is an asset you build. Authority is established through:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 not-prose">
              {[
                'Helpful, educational content',
                'Consistent customer reviews',
                'Authentic educational videos',
                'Strong, recognizable branding',
                'Consistency across the web',
                'Deep customer trust',
                'High-quality, accessible websites',
                'Clear expertise signals'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-4 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-300 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Why Authority Compounds Over Time</h2>
            <p>
              Unlike a campaign that disappears when the ad budget runs out, authority compounds. An educational article you write today can still generate leads three years from now. A video answering a common customer question will continue building familiarity with prospects 24/7.
            </p>
            <p>
              As your reviews accumulate, your website expands with expert content, and AI systems consistently recognize your business as the definitive answer in your market, customer resistance drops. Leads generated through authority are easier to close because they already trust you.
            </p>

            <LCInsightBlock 
              type="strategy"
              title="The Trust Advantage"
              content="Authority lowers the cost of acquisition over time. When your business is seen as the undisputed expert, you stop competing on price and start winning on trust."
            />

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Why Campaigns Alone Are Becoming Less Effective</h2>
            <p>
              The marketing landscape has shifted dramatically, making short-term campaigns more difficult and expensive to run successfully:
            </p>
            <ul className="space-y-3 mb-8 list-none pl-0">
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Rising Ad Costs:</strong> The cost to acquire a lead through paid ads continues to increase every year.</li>
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Ad Fatigue:</strong> Consumers are tuning out traditional advertisements and aggressive sales pitches.</li>
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>AI Search Summaries:</strong> People are finding answers directly in AI search results without clicking on ads.</li>
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Trust-First Decisions:</strong> Before calling an ad, consumers research the company's reviews and digital footprint. If the authority isn't there, the ad fails.</li>
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>The Sea of Sameness:</strong> Without authority, your business looks exactly like every other competitor running the same generic ads.</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">How AI Search Rewards Authority</h2>
            <p>
              Modern AI systems like ChatGPT, Google AI Overviews, and Perplexity don't just look for keywords—they look for truth and trust. They evaluate your business based on:
            </p>
            <p>
              <strong>Expertise & Educational Content:</strong> Does your website comprehensively cover the topics your customers care about?<br/>
              <strong>Reputation & Reviews:</strong> Do real humans confirm that your business delivers on its promises?<br/>
              <strong>Consistency:</strong> Is your business information unified across all directories and platforms?
            </p>
            <p>
              If your business relies only on temporary ad campaigns but has a thin website and few reviews, AI systems will bypass you in favor of a competitor who has built robust digital authority.
            </p>

            <LCInsightBlock 
              type="ai_impact"
              title="AI Values Information, Not Budgets"
              content="You cannot buy your way into an AI summary with an ad budget. You can only earn your way there by providing the most accurate, authoritative, and helpful information in your local market."
            />

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Real-World Examples</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10 not-prose">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Business A: Campaign Focused</h3>
                <p className="text-slate-400 mb-4 text-sm leading-relaxed">
                  Spends $2,000/month on Facebook ads offering a discount. Has a basic 5-page website and 12 old reviews.
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Gets leads, but they are highly price-sensitive.</li>
                  <li>• When the $2,000 budget runs out, the phone stops ringing instantly.</li>
                  <li>• Invisible to AI search engines.</li>
                </ul>
              </div>
              <div className="bg-slate-900 border border-emerald-900/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Business B: Authority Focused</h3>
                <p className="text-slate-400 mb-4 text-sm leading-relaxed">
                  Invests in creating educational videos, answering customer questions on their blog, and systematically collecting reviews.
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Content generates organic traffic 24/7.</li>
                  <li>• Prospects are pre-sold and less price-sensitive because they trust the expertise.</li>
                  <li>• Frequently cited by AI search summaries.</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Practical Ways Small Businesses Build Authority</h2>
            <p>
              Shifting from a campaign mindset to an authority mindset requires a systematic approach. Here is how you start:
            </p>
            <ul className="space-y-3 mb-8 list-none pl-0">
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">✓</span> <strong>Publish Educational Content:</strong> Write articles that answer the exact questions your customers ask during sales calls.</li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">✓</span> <strong>Create Authentic Videos:</strong> Show your face, explain your processes, and demonstrate your expertise on camera.</li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">✓</span> <strong>Improve Your Website:</strong> Make sure your site is fast, accessible, and structured clearly so AI can read it.</li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">✓</span> <strong>Collect Reviews Relentlessly:</strong> Build a system to capture positive feedback after every successful job.</li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">✓</span> <strong>Build Topic Clusters:</strong> Don't just mention a service once; create a hub of content explaining everything related to that specific service.</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-16 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4 mb-16 not-prose">
              {[
                { q: "Are ads still important?", a: "Yes, ads are a great way to amplify your message or test new offers quickly. But they should support your authority-building efforts, not replace them." },
                { q: "What is authority marketing?", a: "Authority marketing is the practice of positioning your business as the undisputed expert in your field through education, trust signals, and high-quality content." },
                { q: "Does content help SEO?", a: "Absolutely. High-quality, helpful content is the primary driver of both traditional SEO and modern AI search visibility." },
                { q: "Why do videos build authority?", a: "Video humanizes your business. It proves you are a real expert, allows prospects to hear your tone, and builds familiarity before they ever contact you." },
                { q: "Can small businesses compete without huge ad budgets?", a: "Yes. In an authority-based ecosystem, the business that provides the most helpful information wins, regardless of their ad budget. Consistency beats capital." },
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
                title="Is Your Authority Working For You?" 
                description="Get a free gap audit to discover how AI search engines and customers view your digital footprint compared to your competitors." 
              />
            </div>
          </div>

          <div className="mt-20 pt-12 border-t border-slate-800">
            <LCRelatedVideos currentVideoId="campaigns-vs-authority" limit={3} category="AI Visibility & Search" />
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
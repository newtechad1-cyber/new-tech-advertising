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
export default function GrowthSystemsVsCampaigns() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <SEOHead 
        title="Growth Systems vs. Marketing Campaigns | New Tech Advertising"
        description="Why growth systems deliver better ROI than one-off marketing campaigns for small businesses. Build a sustainable marketing engine."
      />
      <MarketingNav />
      
      <main className="pt-24 pb-20">
        <LCHeader 
          title="Growth Systems vs Campaigns"
          category="Modern Marketing Systems"
          readingTime="10 min read"
          breadcrumbs={[
            { label: 'Learning Center', path: '/learning-center' },
            { label: 'Modern Marketing Systems', path: '/learning-center/category/modern-marketing-systems' },
            { label: 'Growth Systems vs Campaigns' }
          ]}
        />

        <div className="max-w-4xl mx-auto px-6 mt-12">
          <TrackProgress trackName="Fix My Marketing" currentStep={1} totalSteps={6} color="blue" />

          {/* Featured Video */}
          <div className="mb-14 relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
            <iframe 
              src="https://www.youtube.com/embed/6kB55gnGGHo?rel=0" 
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="autoplay; encrypted-media; fullscreen" 
              title="Growth Systems vs Campaigns"
            />
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-xl text-slate-300 leading-relaxed mb-10">
              For decades, local businesses have been sold on the idea of marketing "campaigns"—isolated bursts of activity designed to generate a quick spike in leads. But as consumer behavior shifts and AI search engines prioritize deep, verifiable trust signals, this disconnected approach is failing. Discover why transitioning from random marketing campaigns to a unified <strong>Growth System</strong> is the only way to build predictable, long-term momentum.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">What Is A Marketing Campaign?</h2>
            <p>
              A marketing campaign is typically a short-term, isolated initiative focused on an immediate outcome. While campaigns can be useful for promoting a specific event, relying on them as your primary growth strategy creates a dangerous dependency on constant spending. Common examples include:
            </p>
            <ul className="space-y-3 mb-8 list-none pl-0">
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">↳</span> <strong>Ad Campaigns:</strong> Running Facebook or Google ads for a month to drive traffic.</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">↳</span> <strong>Seasonal Promotions:</strong> A temporary discount pushed out via email or direct mail.</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">↳</span> <strong>Temporary Boosts:</strong> Hiring a company to do a "one-off SEO push" or website refresh without ongoing strategy.</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">↳</span> <strong>Isolated Social Media:</strong> Posting heavily for two weeks, then going silent for a month.</li>
            </ul>
            <p>
              The biggest flaw of a campaign is that it lacks compounding value. When the budget stops, the leads stop. You are renting visibility rather than owning authority.
            </p>

            <LCInsightBlock 
              type="business_insight"
              title="The Inconsistency Trap"
              content="Campaigns create a 'feast or famine' cycle. You get busy from an ad run, stop marketing because you're busy, the work dries up, and you have to start a new campaign from scratch. There is no momentum."
            />

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">What Is A Growth System?</h2>
            <p>
              A Growth System is an interconnected ecosystem where every marketing effort supports and amplifies the others. Instead of running isolated tactics, a growth system builds permanent digital equity. It connects:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 not-prose">
              {[
                'Your website structure',
                'Your customer reviews',
                'Your SEO and AI visibility',
                'Your educational video content',
                'Your social media presence',
                'Your customer trust signals',
                'Your lead follow-up systems',
                'Your online reputation'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-4 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-300 font-medium">{item}</span>
                </div>
              ))}
            </div>
            <p>
              In a system, a video doesn't just live on YouTube; it gets embedded on a relevant website page, shared on social media, sent in a follow-up email, and transcribed to boost your AI search visibility. One asset works across the entire ecosystem.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Why Systems Create Momentum</h2>
            <p>
              Systems win because they compound over time. When you publish an educational article today, it continues to rank and drive traffic three years from now. When you systematize review collection, your average rating climbs every month, permanently improving your conversion rate.
            </p>
            <ul className="space-y-3 mb-8 list-none pl-0">
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Content Compounds:</strong> Each new page adds to your overall domain authority.</li>
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Reviews Build Trust:</strong> A steady stream of reviews proves consistency to both humans and AI.</li>
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Videos Increase Familiarity:</strong> Prospects feel like they already know you before they call.</li>
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>AI Recognizes Authority:</strong> AI search engines learn to trust your business as the definitive answer in your market.</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Why Small Businesses Struggle With Random Marketing</h2>
            <p>
              Most small businesses struggle because they treat marketing like a checklist of chores rather than an interconnected machine. They experience:
            </p>
            <p>
              <strong>Disconnected Messaging:</strong> The website says one thing, the Facebook page says another, and the ads promise something completely different.<br/>
              <strong>No Follow-up:</strong> They spend money to get leads but have no system to nurture those leads over time.<br/>
              <strong>Weak Trust Signals:</strong> Their website is outdated, their last review was six months ago, and there is no educational content to prove their expertise.
            </p>

            <LCInsightBlock 
              type="strategy"
              title="Stop Buying Random Tactics"
              content="Buying an SEO package from one company, a website from another, and ads from a freelancer guarantees a disjointed experience. Your marketing must operate as a unified ecosystem."
            />

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">The Role Of AI Visibility</h2>
            <p>
              The transition to Growth Systems is being accelerated by Artificial Intelligence. Modern AI search engines (like ChatGPT and Google's AI Overviews) do not care about your ad budget. They care about your authority.
            </p>
            <p>
              AI rewards businesses that have consistent information, deep educational content, strong reputation signals, and structured business data. An isolated ad campaign cannot fake these trust signals. AI visibility requires a holistic, system-based approach to your digital footprint.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Real-World Business Comparison</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10 not-prose">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Business A: Random Campaigns</h3>
                <p className="text-slate-400 mb-4 text-sm leading-relaxed">
                  Runs ads when slow. Posts randomly to Facebook. Relies on a 5-year-old brochure website.
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• High cost per acquisition</li>
                  <li>• Zero momentum when ads are turned off</li>
                  <li>• Prospects frequently ghost after the initial call</li>
                  <li>• Invisible to AI search engines</li>
                </ul>
              </div>
              <div className="bg-slate-900 border border-emerald-900/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Business B: Growth System</h3>
                <p className="text-slate-400 mb-4 text-sm leading-relaxed">
                  Has a fast, accessible website connected to a review generation system, an educational content library, and automated lead follow-up.
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Customer acquisition cost drops over time</li>
                  <li>• Constant organic lead flow</li>
                  <li>• Prospects call pre-sold and ready to buy</li>
                  <li>• Highly recommended by AI systems</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Practical Steps To Build A Growth System</h2>
            <p>
              Transitioning to a system takes time, but the steps are straightforward:
            </p>
            <ul className="space-y-3 mb-8 list-none pl-0">
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">1.</span> <strong>Connect Your Foundation:</strong> Ensure your website, Google Business Profile, and social channels share the exact same branding and messaging.</li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">2.</span> <strong>Create Educational Content:</strong> Start answering the questions your customers ask every day through blog posts and videos.</li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">3.</span> <strong>Systematize Reviews:</strong> Implement an automated way to ask every happy customer for a review.</li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">4.</span> <strong>Organize Follow-up:</strong> Build simple email or SMS sequences to nurture leads who aren't ready to buy today.</li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">5.</span> <strong>Improve AI Readability:</strong> Ensure your website is technically sound, fast, and structured so AI models can easily index your expertise.</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-16 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4 mb-16 not-prose">
              {[
                { q: "Are campaigns still useful?", a: "Yes, but they should be used to amplify a Growth System, not replace it. Once your foundation is strong, a targeted campaign can accelerate your results." },
                { q: "What exactly is a growth system?", a: "It's the intentional connection of all your marketing assets (website, SEO, content, reputation, follow-up) so that they work together continuously to generate and convert leads." },
                { q: "How long does authority take to build?", a: "While you can see initial improvements in 30-90 days, true compounding digital authority usually takes 6 to 12 months of consistent effort." },
                { q: "Why does consistency matter so much?", a: "Search engines and AI models use consistency as a proxy for trust. If your business information or content publishing is erratic, AI systems view your business as unreliable." },
                { q: "Can small businesses compete without huge budgets?", a: "Absolutely. A tightly integrated growth system focused on a specific local niche will outperform a massive, disconnected ad budget every time." },
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
                title="Is Your Marketing Disconnected?" 
                description="Get a free AI gap audit to see if your current marketing is building long-term authority or just burning through cash." 
              />
            </div>

            <TrackBottomNav 
              nextLink="/websites-as-salespeople"
              nextText="Next: Websites as Salespeople →"
              color="blue"
            />
          </div>

          <div className="mt-20 pt-12 border-t border-slate-800">
            <LCRelatedVideos currentVideoId="growth-systems-vs-campaigns" limit={3} category="Modern Marketing Systems" />
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
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
export default function TheHiddenCostOfOutdatedMarketing() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <SEOHead 
        title="The Hidden Cost of Outdated Marketing | New Tech Advertising"
        description="What outdated marketing is really costing your small business. The hidden expenses of not adopting AI-powered marketing."
      />
      <MarketingNav />
      
      <main className="pt-24 pb-20">
        <LCHeader 
          title="The Hidden Cost of Outdated Marketing"
          category="Modern Marketing Systems"
          readingTime="9 min read"
          breadcrumbs={[
            { label: 'Learning Center', path: '/learning-center' },
            { label: 'Modern Marketing Systems', path: '/learning-center/category/modern-marketing-systems' },
            { label: 'The Hidden Cost of Outdated Marketing' }
          ]}
        />

        <div className="max-w-4xl mx-auto px-6 mt-12">
          <TrackProgress trackName="Fix My Marketing" currentStep={6} totalSteps={6} color="blue" />

          {/* Featured Video */}
          <div className="mb-14 relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
            <iframe 
              src="https://www.youtube.com/embed/jU_2Wae-_14?rel=0" 
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="autoplay; encrypted-media; fullscreen" 
              title="The Hidden Cost of Outdated Marketing"
            />
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-xl text-slate-300 leading-relaxed mb-10">
              Many local businesses are losing opportunities every single day without realizing it. They aren't losing because their services are bad, but because their marketing systems no longer match modern customer behavior. Outdated digital footprints quietly cost you leads, trust, visibility, and long-term growth.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">What Outdated Marketing Looks Like</h2>
            <p>
              Marketing has shifted from static advertising to dynamic, trust-driven ecosystems. Yet, many businesses still operate with digital assets that look and function like they did a decade ago. Outdated marketing typically includes:
            </p>
            <ul className="space-y-3 mb-8 list-none pl-0">
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> <strong>Brochure-Style Websites:</strong> Sites that just list services and a phone number without answering customer questions.</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> <strong>Outdated SEO Tactics:</strong> Keyword stuffing and buying cheap links instead of building real authority.</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> <strong>Inconsistent Branding:</strong> Different logos, messaging, and hours across social media, Google, and the website.</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> <strong>No Educational Content:</strong> Forcing customers to call to get basic answers to common problems.</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> <strong>Little to No Video:</strong> Relying entirely on stock photos instead of showing the real people behind the business.</li>
              <li className="flex items-start gap-3"><span className="text-rose-500 mt-1">✕</span> <strong>No Review Strategy:</strong> Hoping people leave reviews rather than having a system to capture them.</li>
            </ul>

            <LCInsightBlock 
              type="business_insight"
              title="The Invisible Leak"
              content="The biggest cost of outdated marketing isn't the money you spend on maintaining an old website—it's the revenue you lose from prospects who look at your digital presence, instantly lose trust, and leave before ever calling you."
            />

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">How Customer Behavior Has Changed</h2>
            <p>
              The way people buy has fundamentally changed. Customers are no longer willing to jump through hoops to find out if they can trust you. They expect immediate clarity:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 not-prose">
              {[
                'AI and voice search summaries',
                'Trust-first buying decisions',
                'Mobile-first browsing habits',
                'Faster comparison shopping',
                'Expectation of immediate answers',
                'Zero tolerance for slow websites',
                'Reliance on video for proof',
                'Demand for authentic reviews'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-4 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-300 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Why Websites Alone No Longer Work</h2>
            <p>
              Ten years ago, just having a website put you ahead of the competition. Today, a basic website is not enough. If your site functions merely as a digital business card, it is failing you.
            </p>
            <p>
              Modern websites must act as your best salesperson. They need:
            </p>
            <ul className="space-y-3 mb-8 list-none pl-0">
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Trust Signals:</strong> Prominently displayed reviews, awards, and guarantees.</li>
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Educational Content:</strong> Deep dives into the problems you solve, not just the services you sell.</li>
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Video Integration:</strong> Founder videos and testimonials that build immediate human connection.</li>
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>AI-Readable Structure:</strong> Clear, accessible code that AI search engines can easily parse and understand.</li>
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Accessibility:</strong> ADA-compliant design that works for all users (and proves technical competence to search engines).</li>
            </ul>

            <LCInsightBlock 
              type="strategy"
              title="The Shift to Ecosystems"
              content="Your website shouldn't stand alone. It must be the hub of a connected ecosystem—linking your social media, Google Business Profile, reputation management, and content into one unified trust engine."
            />

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">The Financial Cost Of Outdated Marketing</h2>
            <p>
              Holding onto outdated marketing strategies carries a heavy, compounding financial cost:
            </p>
            <p>
              <strong>Missed Leads:</strong> Prospects find you, but your outdated site pushes them to a modern competitor.<br/>
              <strong>Low Conversion Rates:</strong> The traffic you do get doesn't convert because trust signals are missing.<br/>
              <strong>Higher Advertising Costs:</strong> You have to spend more on ads to overcome the friction of a poor digital footprint.<br/>
              <strong>Blending In:</strong> Without video or strong branding, your business looks exactly like every other generic competitor in town, forcing you to compete on price rather than value.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">How AI Search Is Changing Visibility</h2>
            <p>
              The rise of AI search tools like ChatGPT and Google AI Overviews is accelerating the death of outdated marketing. AI systems don't just look for keywords—they look for truth, expertise, and authority.
            </p>
            <p>
              AI rewards businesses that provide structured information, maintain consistent content across the web, and have strong reputation signals. If your digital footprint is fragmented, outdated, or lacking in real educational value, AI models will simply skip over your business and recommend the market leader.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Modern Marketing Systems vs Old Marketing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10 not-prose">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">The Old Model</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Isolated, disconnected campaigns</li>
                  <li>• Static "brochure" websites</li>
                  <li>• Inconsistent social media activity</li>
                  <li>• Reactive marketing (only when slow)</li>
                  <li>• Hoping for reviews</li>
                  <li>• Keyword-stuffed SEO</li>
                </ul>
              </div>
              <div className="bg-slate-900 border border-emerald-900/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">The Modern System</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Connected visibility ecosystems</li>
                  <li>• Educational, dynamic websites</li>
                  <li>• Authentic video presence</li>
                  <li>• Ongoing authority building</li>
                  <li>• Automated review collection</li>
                  <li>• AI Visibility Optimization (AISO)</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Practical Steps To Modernize</h2>
            <p>
              Modernizing your presence doesn't happen overnight, but you can start making immediate improvements:
            </p>
            <ul className="space-y-3 mb-8 list-none pl-0">
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">1.</span> <strong>Audit Your Clarity:</strong> Look at your website on a phone. Is it instantly clear what you do, why you're better, and how to contact you?</li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">2.</span> <strong>Start Teaching:</strong> Write down the top 10 questions your customers ask. Create a detailed page or video for each one.</li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">3.</span> <strong>Add Human Video:</strong> Record a simple welcome video introducing yourself and your team. Place it on your homepage.</li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">4.</span> <strong>Systemize Reviews:</strong> Implement a tool or process to ask every satisfied customer for a review automatically.</li>
              <li className="flex items-start gap-3"><span className="text-emerald-500 mt-1">5.</span> <strong>Unify Your Brand:</strong> Ensure your Google profile, website, and social channels all use the exact same name, address, phone number, and branding.</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-16 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4 mb-16 not-prose">
              {[
                { q: "Is SEO still important?", a: "Yes, but the definition has changed. Traditional SEO focused on hacking algorithms with keywords. Modern SEO focuses on building deep topical authority, great user experiences, and verifiable trust signals." },
                { q: "Why are old websites less effective?", a: "Old websites are often slow, not optimized for mobile, lack accessibility features, and fail to provide the immediate trust signals (like video and reviews) that modern consumers demand." },
                { q: "Does video actually help conversions?", a: "Massively. Video humanizes your brand, proves you are a real business, and allows prospects to feel comfortable with you before they ever make a phone call." },
                { q: "Why does website accessibility matter?", a: "Beyond being the right thing to do (and protecting you from lawsuits), accessibility proves to search engines that your site is technically sound and user-friendly, which boosts your rankings." },
                { q: "What is AI visibility?", a: "AI visibility is the practice of ensuring your business is recommended by AI tools like ChatGPT, Gemini, and Google's AI Overviews. It requires strong digital trust, structured data, and high-quality educational content." },
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
                title="Is Your Marketing Outdated?" 
                description="Get a free AI visibility audit to see exactly where your digital footprint is leaking trust, traffic, and revenue compared to modern competitors." 
              />
            </div>

            <TrackBottomNav 
              prevLink="/campaigns-vs-authority"
              prevText="← Previous"
              nextLink="https://calendar.app.google/p6ieYanvwhixXxZ67"
              nextText="🎉 Track Complete! Book a Free Call →"
              color="blue"
            />
          </div>

          <div className="mt-20 pt-12 border-t border-slate-800">
            <LCRelatedVideos currentVideoId="hidden-cost-of-outdated-marketing" limit={3} category="Modern Marketing Systems" />
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
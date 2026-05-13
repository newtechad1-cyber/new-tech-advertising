import React, { useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import LCHeader from '@/components/learning-center/LCHeader';
import LCInsightBlock from '@/components/learning-center/LCInsightBlock';
import LCRelatedVideos from '@/components/learning-center/LCRelatedVideos';
import LCCallToAction from '@/components/learning-center/LCCallToAction';

export default function VideoStorytellingBuildsConfidence() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <MarketingNav />
      
      <main className="pt-24 pb-20">
        <LCHeader 
          title="Video Storytelling Builds Confidence"
          category="Video & CTV Marketing"
          readingTime="6 min read"
          breadcrumbs={[
            { label: 'Learning Center', path: '/learning-center' },
            { label: 'Video & CTV Marketing', path: '/learning-center/category/video-ctv-marketing' },
            { label: 'Video Storytelling' }
          ]}
        />

        <div className="max-w-4xl mx-auto px-6 mt-12">
          {/* Featured Video */}
          <div className="mb-14 relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
            <iframe 
              src="https://www.youtube.com/embed/3_P36VrK9jc?rel=0" 
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="autoplay; encrypted-media; fullscreen" 
              title="Video Storytelling Builds Confidence"
            />
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-xl text-slate-300 leading-relaxed mb-10">
              Stop selling and start showing. The modern consumer is skeptical, well-researched, and highly protective of their time. In an environment where anyone can claim to be an expert using AI-generated text, authentic video storytelling has become the ultimate shortcut to building customer confidence.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Why Text Is Losing Trust</h2>
            <p>
              When a prospect visits your website and sees a wall of text, their first instinct is often doubt. Did a real person write this? Does this business actually exist? Text alone no longer carries the weight it once did because the barrier to producing it has dropped to zero.
            </p>
            <p>
              Video, however, cannot be faked easily. When a prospect sees your face, hears your voice, and watches you explain your process, they instantly form a human connection.
            </p>

            <LCInsightBlock 
              type="business_insight"
              title="The Authenticity Premium"
              content="Consumers are willing to pay a premium for a service provider they feel they 'know' before ever speaking to them. Video bridges the gap between digital obscurity and personal familiarity."
            />

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Key Takeaways for Small Businesses</h2>
            <ul className="space-y-3 mb-8 list-none pl-0">
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Humanize Your Brand:</strong> Show the people behind the business. Introduce your team and your workspace.</li>
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Answer Questions Proactively:</strong> Create videos that address the top 5 questions your sales team gets every day.</li>
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Show, Don't Tell:</strong> Walk through a recent project, demonstrating your expertise in action rather than just claiming it.</li>
              <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> <strong>Quality Over Production Value:</strong> A slightly unpolished, genuine video shot on a smartphone builds more trust than a highly scripted, impersonal commercial.</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Leveraging CTV for Local Dominance</h2>
            <p>
              Connected TV (CTV) allows local businesses to place these authentic, trust-building videos directly into the living rooms of their ideal customers. Instead of competing in crowded social media feeds, your story plays alongside premium streaming content, instantly elevating your brand's perceived authority.
            </p>

            <LCInsightBlock 
              type="real_world"
              title="The CTV Advantage"
              content="By combining the authenticity of founder-led video storytelling with the prestige of television advertising, small businesses can achieve 'local celebrity' status in their target zip codes for a fraction of the cost of traditional broadcast."
            />

            <h2 className="text-2xl font-bold text-white mt-16 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4 mb-16 not-prose">
              {[
                { q: "I'm not comfortable on camera. What should I do?", a: "Start small. You don't need to be the star. You can do voiceovers on project walk-throughs, or have a team member who is more comfortable take the lead. The key is showing real people." },
                { q: "Do I need expensive equipment?", a: "No. A modern smartphone, a cheap ring light, and a $20 lapel microphone are all you need to start producing high-converting trust content." },
                { q: "How long should my videos be?", a: "It depends on the platform. For your website's homepage, 1-2 minutes is ideal. For social media, aim for 30-60 seconds. For CTV, 15-30 second spots work best." },
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
              <LCCallToAction mode="audit" title="Ready to Build Your Video Strategy?" description="Get a free gap audit to discover how video storytelling can elevate your local visibility and customer trust." />
            </div>
          </div>

          <div className="mt-20 pt-12 border-t border-slate-800">
            <LCRelatedVideos currentVideoId="v15" limit={3} category="Video & CTV Marketing" />
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import LCHeader from '@/components/learning-center/LCHeader';
import LCInsightBlock from '@/components/learning-center/LCInsightBlock';
import LCRelatedVideos from '@/components/learning-center/LCRelatedVideos';
import LCCallToAction from '@/components/learning-center/LCCallToAction';

import SEOHead from '@/components/shared/SEOHead';
export default function WebAccessibilityTrust() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <SEOHead 
        title="Web Accessibility Builds Trust | New Tech Advertising"
        description="How usable navigation, readable content, and accessible forms can improve the experience for customers."
      />
      <MarketingNav />
      
      <main className="pt-24 pb-20">
        <LCHeader 
          title="Web Accessibility: The Foundation of Digital Trust"
          category="Digital Trust & Reputation"
          readingTime="6 min read"
          breadcrumbs={[
            { label: "Knowledge Library", path: '/learning-center' },
            { label: 'Digital Trust & Reputation', path: '/learning-center/category/digital-trust-reputation' },
            { label: 'Web Accessibility' }
          ]}
        />

        <div className="max-w-4xl mx-auto px-6 mt-12">
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-xl text-slate-300 leading-relaxed mb-10">
              Web accessibility means making information and tasks usable by people with different abilities and devices. It is an ongoing part of trustworthy website design.
            </p>

            <LCInsightBlock 
              type="business_insight"
              title="A Signal of Quality"
              content="Clear structure and usable controls help visitors find information and complete tasks. WCAG is a practical guide for checking those experiences."
            />

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Why Accessibility and AI Go Hand-in-Hand</h2>
            <p>
              AI engines like ChatGPT and Google's AI Overviews don't "see" websites the way humans do. They read the underlying code. Clear semantic HTML, descriptive alternatives for images, and logical headings can help people and search systems understand page content. They do not guarantee a recommendation or a search ranking.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-slate-300 mb-4">Non-Accessible Sites</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3"><span className="text-slate-500 mt-1">✕</span> Confusing navigation for screen readers</li>
                  <li className="flex items-start gap-3"><span className="text-slate-500 mt-1">✕</span> Invisible images (no alt text)</li>
                  <li className="flex items-start gap-3"><span className="text-slate-500 mt-1">✕</span> AI models struggle to extract facts</li>
                  <li className="flex items-start gap-3"><span className="text-slate-500 mt-1">✕</span> High legal and reputational risk</li>
                </ul>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Accessible, Modern Sites</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> Designed for more people and ways of using the web</li>
                  <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> Rich semantic context for AI</li>
                  <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> Usable at high zoom and on small screens</li>
                  <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> Clearer paths to information and help</li>
                </ul>
              </div>
            </div>

            <LCInsightBlock 
              type="ai_tip"
              title="Structured Data is Universal"
              content="Keyboard access and screen reader support require real interaction testing. Structured content can also help search systems identify facts, but it cannot guarantee what AI tools will say."
            />

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Moving Beyond the "Lawsuit Fear"</h2>
            <p>
              While ADA lawsuits against small businesses are a real concern, treating accessibility solely as a legal shield is a missed opportunity. Improving contrast, control size, and form instructions can remove friction for many visitors. Poor contrast, tiny buttons, and broken forms hurt everyone, not just those using assistive technologies.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Key Takeaways</h2>
            <ul className="space-y-4 mb-12">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                <span><strong>Accessibility = Readability:</strong> Clear text and structure can help both visitors and search systems understand a page.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                <span><strong>Trust is Visual and Technical:</strong> A website that is easier to use can show care for customers.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                <span><strong>Don't Band-Aid, Rebuild:</strong> Overlay widgets cannot fix every underlying barrier. Review the pages, content, and interactions after every significant change.</span>
              </li>
            </ul>

            <LCCallToAction mode="audit" />
          </div>

          <div className="mt-20 pt-12 border-t border-slate-800">
            <LCRelatedVideos currentVideoId="v7" limit={2} />
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
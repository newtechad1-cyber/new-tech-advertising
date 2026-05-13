import React, { useEffect } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import LCHeader from '@/components/learning-center/LCHeader';
import LCInsightBlock from '@/components/learning-center/LCInsightBlock';
import LCRelatedVideos from '@/components/learning-center/LCRelatedVideos';
import LCCallToAction from '@/components/learning-center/LCCallToAction';

export default function WebAccessibilityTrust() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <MarketingNav />
      
      <main className="pt-24 pb-20">
        <LCHeader 
          title="Web Accessibility: The Foundation of Digital Trust"
          category="Digital Trust & Reputation"
          readingTime="6 min read"
          breadcrumbs={[
            { label: 'Learning Center', path: '/learning-center' },
            { label: 'Digital Trust & Reputation', path: '/learning-center/category/digital-trust-reputation' },
            { label: 'Web Accessibility' }
          ]}
        />

        <div className="max-w-4xl mx-auto px-6 mt-12">
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-xl text-slate-300 leading-relaxed mb-10">
              For years, web accessibility was treated primarily as a legal requirement—a box to check to avoid ADA lawsuits. But in the era of AI search and heightened consumer expectations, accessibility has become a core driver of digital trust and visibility.
            </p>

            <LCInsightBlock 
              type="business_insight"
              title="A Signal of Quality"
              content="When your website is built to modern accessibility standards (WCAG 2.1 AA), it doesn't just help users with disabilities. It signals to search engines, AI models, and all visitors that your business invests in a premium, trustworthy digital experience."
            />

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Why Accessibility and AI Go Hand-in-Hand</h2>
            <p>
              AI engines like ChatGPT and Google's AI Overviews don't "see" websites the way humans do. They read the underlying code. The requirements for an accessible website—clear semantic HTML, descriptive alt text for images, logical heading structures—are the exact same requirements that allow AI models to perfectly understand and recommend your business.
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
                  <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> Usable by 100% of your audience</li>
                  <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> Rich semantic context for AI</li>
                  <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> Faster mobile load times</li>
                  <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> Built-in digital credibility</li>
                </ul>
              </div>
            </div>

            <LCInsightBlock 
              type="ai_tip"
              title="Structured Data is Universal"
              content="By ensuring your site is accessible via keyboard navigation and screen readers, you naturally create a clean data hierarchy. AI agents rely on this hierarchy to answer user questions about your services with absolute certainty."
            />

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Moving Beyond the "Lawsuit Fear"</h2>
            <p>
              While ADA lawsuits against small businesses are a real concern, treating accessibility solely as a legal shield is a missed opportunity. A rebuilt, accessible website is faster, cleaner, and converts at a higher rate because the user experience is universally better. Poor contrast, tiny buttons, and broken forms hurt everyone, not just those using assistive technologies.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Key Takeaways</h2>
            <ul className="space-y-4 mb-12">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                <span><strong>Accessibility = Readability:</strong> What helps a screen reader understand your site helps an AI engine recommend your business.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                <span><strong>Trust is Visual and Technical:</strong> A compliant website demonstrates professionalism and care for all customers.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                <span><strong>Don't Band-Aid, Rebuild:</strong> Overlay widgets don't fix underlying code issues. A proper rebuild ensures long-term compliance and performance.</span>
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
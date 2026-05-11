import React from 'react';
import LCHeader from '@/components/learning-center/LCHeader';
import LCInsightBlock from '@/components/learning-center/LCInsightBlock';
import LCCallToAction from '@/components/learning-center/LCCallToAction';
import LCRelatedArticles from '@/components/learning-center/LCRelatedArticles';

export default function AIVisibilityBasics() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans pb-20">
      <LCHeader 
        title="AI Visibility Basics"
        subtitle="How ChatGPT, Gemini, and Google's AI Overview choose which local businesses to recommend."
        breadcrumbs={[
          { label: "NTA Learning Center", link: "/learning-center" },
          { label: "AI Visibility Basics" }
        ]}
        category="Visibility"
        readTime="4 min"
        date="June 2026"
      />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <article className="prose prose-invert prose-lg max-w-none prose-a:text-blue-400 hover:prose-a:text-blue-300">
          <p className="text-xl leading-relaxed text-slate-200">
            For years, search engines relied on keywords. If someone typed "plumber near me," the search engine looked for websites with the word "plumber." Today, AI models don't just look for words; they look for entities, context, and trust.
          </p>

          <LCInsightBlock type="business_insight" title="The Shift in Search">
            Instead of matching keywords to text, AI reads your website, your reviews, your social media, and third-party directories to build a "mental model" of your business. It asks: "Is this the best answer to the user's specific problem?"
          </LCInsightBlock>

          <h2 className="text-3xl font-bold text-slate-50 mt-12 mb-6">How AI Evaluates Your Business</h2>
          
          <h3 className="text-2xl font-semibold text-white mt-8 mb-4">1. Structured Data is Your Translator</h3>
          <p>
            AI doesn't have eyes. It reads data. Structured data (like Schema Markup) is the language AI speaks. It explicitly tells the AI: "This is our business name, these are our services, here is our service area, and these are our reviews." 
          </p>

          <h3 className="text-2xl font-semibold text-white mt-8 mb-4">2. Topical Authority beats Thin Content</h3>
          <p>
            A five-page website with a single "Services" page doesn't signal authority to an AI. To be recommended for "tankless water heater repair," you need dedicated, in-depth content specifically addressing that topic, common issues, and your expertise.
          </p>

          <LCInsightBlock type="ai_tip" title="AI Search Optimization">
            AI prioritizes detail. If a competitor has a dedicated page explaining exactly how they install a specific type of roof, the AI will recommend them over a roofer whose website just says "We do roofs."
          </LCInsightBlock>

          <h3 className="text-2xl font-semibold text-white mt-8 mb-4">3. Consensus Across the Web</h3>
          <p>
            AI cross-references your claims. If your website says you're open 24/7, but your Google Business Profile says you close at 5 PM, the AI loses trust and drops your visibility. Consistency across Yelp, Facebook, Google, and your website is mandatory.
          </p>

          <LCInsightBlock type="nta_found" title="What NTA Has Found">
            Businesses that actively manage their Google Business Profile and respond to reviews with context (e.g., "Thanks for trusting us with your AC repair in Mason City") appear in AI overviews up to 40% more frequently.
          </LCInsightBlock>

        </article>

        <LCCallToAction type="ai_visibility" className="mt-16" />

        <LCRelatedArticles 
          articles={[
            {
              tag: "AI Search",
              title: "What Changed Online",
              description: "Understand zero-click searches, AI overviews, and what to do next.",
              link: "/what-changed-online",
              date: "Guide"
            },
            {
              tag: "Strategy",
              title: "SEO vs AI Search",
              description: "Why traditional SEO is dying and how AI Search Optimization replaces it.",
              link: "/seo-vs-ai-search",
              date: "Guide"
            }
          ]}
        />
      </main>
    </div>
  );
}
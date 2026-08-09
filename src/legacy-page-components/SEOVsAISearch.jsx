import React from 'react';
import LCHeader from '@/components/learning-center/LCHeader';
import LCInsightBlock from '@/components/learning-center/LCInsightBlock';
import LCCallToAction from '@/components/learning-center/LCCallToAction';
import LCRelatedArticles from '@/components/learning-center/LCRelatedArticles';
import LCRelatedVideos from '@/components/learning-center/LCRelatedVideos';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import { TrackProgress, TrackBottomNav } from '@/components/learning-center/TrackNavigation';

import SEOHead from '@/components/shared/SEOHead';
export default function SEOVsAISearch() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <SEOHead 
        title="SEO vs AI Search: What Local Businesses Need to Know | NTA"
        description="Traditional SEO vs AI-powered search optimization. What's changing and how local businesses should adapt their strategy."
      />
      <MarketingNav />
      <div className="flex-grow">
      <LCHeader 
        title="SEO vs AI Search: The Shift"
        subtitle="Why traditional SEO is dying and how AI Search Optimization (AISO) is replacing it as the main driver of local traffic."
        breadcrumbs={[
          { label: "Knowledge Library", link: "/learning-center" },
          { label: "SEO vs AI Search" }
        ]}
        category="Strategy"
        readTime="5 min"
        date="June 2026"
      />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <TrackProgress trackName="I'm New to AI" currentStep={3} totalSteps={5} color="emerald" />
        <article className="prose prose-invert prose-lg max-w-none prose-a:text-blue-400 hover:prose-a:text-blue-300">
          <p className="text-xl leading-relaxed text-slate-200">
            For twenty years, Search Engine Optimization (SEO) was a game of keywords and backlinks. You put "best plumber in [City]" on your page 10 times, bought some links, and ranked #1. That era is over. Welcome to AI Search Optimization (AISO).
          </p>

          <LCInsightBlock type="business_insight" title="The Core Difference">
            Traditional SEO optimized for <strong>discovery</strong> (getting Google to show your link). AI Search optimizes for <strong>answers</strong> (getting Google or ChatGPT to use your data as the definitive answer).
          </LCInsightBlock>

          <h2 className="text-3xl font-bold text-slate-50 mt-12 mb-6">The Death of the "Ten Blue Links"</h2>
          <p>
            When users search today, they don't want to browse five different websites. They want an immediate, synthesized answer. Google's AI Overviews and tools like ChatGPT provide this directly. If your website is just a brochure, you won't be cited as a source.
          </p>

          <div className="overflow-x-auto my-10">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-slate-700 bg-slate-900/50">
                  <th className="p-4 text-slate-300 font-bold w-1/2">Traditional SEO</th>
                  <th className="p-4 text-slate-300 font-bold w-1/2 border-l border-slate-800">AI Search Optimization</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-800 bg-slate-900/20">
                  <td className="p-4 text-slate-400">Keyword stuffing & repeating words</td>
                  <td className="p-4 text-slate-200 border-l border-slate-800">Entity clustering and semantics</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="p-4 text-slate-400">Blog posts for sheer traffic volume</td>
                  <td className="p-4 text-slate-200 border-l border-slate-800">Deep, expert "Knowledge Base" content</td>
                </tr>
                <tr className="border-b border-slate-800 bg-slate-900/20">
                  <td className="p-4 text-slate-400">Focus on arbitrary rankings (e.g. #1)</td>
                  <td className="p-4 text-slate-200 border-l border-slate-800">Focus on citations and brand authority</td>
                </tr>
                <tr>
                  <td className="p-4 text-slate-400">Generic bullet-point service pages</td>
                  <td className="p-4 text-slate-200 border-l border-slate-800">Granular, problem-solving resource pages</td>
                </tr>
              </tbody>
            </table>
          </div>

          <LCInsightBlock type="ai_tip" title="Experience & Expertise (E-E-A-T)">
            AI engines prioritize Experience, Expertise, Authoritativeness, and Trustworthiness. Showing real photos of your team, posting case studies, and getting detailed reviews proves you are a real expert, not just an SEO spammer.
          </LCInsightBlock>

          <h2 className="text-3xl font-bold text-slate-50 mt-12 mb-6">How to Win in AISO</h2>
          <ul>
            <li className="mb-2"><strong>Structure your data:</strong> Ensure your Schema markup is flawless so AI knows exactly what you do.</li>
            <li className="mb-2"><strong>Answer direct questions:</strong> Build robust FAQ sections that answer the exact questions customers ask.</li>
            <li><strong>Build a brand, not just a site:</strong> AI values entities with a strong footprint across YouTube, social media, and local directories.</li>
          </ul>

          <LCInsightBlock type="nta_found" title="What NTA Has Found">
            Local businesses that shift from writing generic blog posts to building deep, authoritative "Service Guides" see a massive increase in inclusion in AI Overviews.
          </LCInsightBlock>

        </article>

        <TrackBottomNav 
          prevLink="/ai-visibility-basics"
          prevText="← Previous"
          nextLink="/practical-ai-for-small-businesses"
          nextText="Next: Practical AI For Small Businesses →"
          color="emerald"
        />

        <LCRelatedVideos category="SEO vs AI Search" />

        <LCCallToAction type="audit" className="mt-16" />

        <LCRelatedArticles 
          articles={[
            {
              tag: "Visibility",
              title: "AI Visibility Basics",
              description: "How ChatGPT and Gemini choose which local businesses to recommend.",
              link: "/ai-visibility-basics",
              date: "Guide"
            },
            {
              tag: "AI Search",
              title: "What Changed Online",
              description: "Understand zero-click searches, AI overviews, and what to do next.",
              link: "/what-changed-online",
              date: "Guide"
            }
          ]}
        />
      </main>
      </div>
      <SiteFooter />
    </div>
  );
}
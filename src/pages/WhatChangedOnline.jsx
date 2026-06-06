import React from 'react';
import LCHeader from '@/components/learning-center/LCHeader';
import LCInsightBlock from '@/components/learning-center/LCInsightBlock';
import LCCallToAction from '@/components/learning-center/LCCallToAction';
import LCRelatedArticles from '@/components/learning-center/LCRelatedArticles';
import LCRelatedVideos from '@/components/learning-center/LCRelatedVideos';
import MarketingNav from '@/components/nav/MarketingNav';
import SEOHead from '@/components/shared/SEOHead';
import SiteFooter from '@/components/marketing/SiteFooter';
import { TrackProgress, TrackBottomNav } from '@/components/learning-center/TrackNavigation';

export default function WhatChangedOnline() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <SEOHead 
        title="What Changed Online | New Tech Advertising"
        description="The internet changed. AI is rewriting how customers find businesses. Learn what changed and what small businesses need to do now. New Tech Advertising."
      />
      <MarketingNav />
      <div className="flex-grow">
      <LCHeader 
        title="What Changed Online: The New Rules of Local Visibility"
        subtitle="Search has fundamentally changed. If you're not optimized for AI recommendations, you're losing to competitors who are."
        breadcrumbs={[
          { label: "NTA Learning Center", link: "/learning-center" },
          { label: "What Changed Online" }
        ]}
        category="AI Search"
        readTime="5 min"
        date="May 2026"
      />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <TrackProgress trackName="I'm New to AI" currentStep={1} totalSteps={5} color="emerald" />
        <article className="prose prose-invert prose-lg max-w-none prose-a:text-blue-400 hover:prose-a:text-blue-300">
          <p className="text-xl leading-relaxed text-slate-200">
            For years, local marketing meant having a basic website and occasionally posting on Facebook. Today, that is no longer enough. The introduction of AI overviews, zero-click searches, and advanced local algorithms has completely shifted how customers find you.
          </p>

          <h2 className="text-3xl font-bold text-slate-50 mt-12 mb-6">The Rise of AI Search</h2>
          <p>
            When a customer asks their phone for the "best HVAC company near me," they don't get a list of ten blue links anymore. They get a synthesized, AI-generated answer.
          </p>

          <LCInsightBlock type="ai_tip" title="AI Visibility Tip">
            AI engines like ChatGPT and Google's AI Overview pull from structured data, reviews, and detailed service pages. If your website only has a generic "Services" page, the AI cannot confidently recommend you for specific problems.
          </LCInsightBlock>

          <h2 className="text-3xl font-bold text-slate-50 mt-12 mb-6">Zero-Click Searches</h2>
          <p>
            Over 50% of local searches now end without the user ever clicking a link. They find your phone number, hours, and reviews directly on the search results page via your Google Business Profile.
          </p>

          <LCInsightBlock type="real_world" title="Real-World Example">
            A local plumber in Rochester saw website traffic drop by 20%, but phone calls increased by 40%. Why? We optimized their Google Business Profile to answer questions directly on the search page. The traffic didn't disappear; it converted faster.
          </LCInsightBlock>

          <h2 className="text-3xl font-bold text-slate-50 mt-12 mb-6">What You Need To Do Now</h2>
          <p>
            To survive this shift, you need a robust digital footprint that feeds these new engines what they want:
          </p>
          <ul>
            <li><strong>Granular Service Pages:</strong> Don't bundle services. Build specific pages (e.g., "Emergency AC Repair in Mason City").</li>
            <li><strong>Review Density:</strong> Consistent, detailed reviews mentioning specific services.</li>
            <li><strong>Technical Structure:</strong> Fast loading, mobile-first design, and correct schema markup.</li>
          </ul>

          <LCInsightBlock type="nta_found" title="What NTA Has Found">
            Businesses that adopt a "knowledge-first" approach—publishing detailed FAQs, clear pricing guidelines, and specific service areas—are recommended by AI tools 3x more often than competitors with traditional "brochure" websites.
          </LCInsightBlock>

        </article>

        <TrackBottomNav 
          nextLink="/ai-visibility-basics"
          nextText="Next: AI Visibility Basics →"
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
              tag: "Video",
              title: "AI Video Marketing",
              description: "Scale your presence with AI-powered video.",
              link: "/ai-video-marketing",
              date: "Guide"
            },
            {
              tag: "Lead Gen",
              title: "Local Lead Systems",
              description: "Connect your marketing efforts into a single, predictable lead generation engine.",
              link: "/local-lead-systems",
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
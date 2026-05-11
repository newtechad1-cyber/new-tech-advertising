import React from 'react';
import LCHeader from '@/components/learning-center/LCHeader';
import LCInsightBlock from '@/components/learning-center/LCInsightBlock';
import LCCallToAction from '@/components/learning-center/LCCallToAction';
import LCRelatedArticles from '@/components/learning-center/LCRelatedArticles';

export default function PracticalAIForSmallBusinesses() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans pb-20">
      <LCHeader 
        title="Practical AI For Small Businesses"
        subtitle="Real tools and strategies you can use today to save time, generate more leads, and punch above your weight class."
        breadcrumbs={[
          { label: "NTA Learning Center", link: "/learning-center" },
          { label: "Practical AI" }
        ]}
        category="Operations"
        readTime="6 min"
        date="June 2026"
      />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <article className="prose prose-invert prose-lg max-w-none prose-a:text-blue-400 hover:prose-a:text-blue-300">
          <p className="text-xl leading-relaxed text-slate-200">
            Forget the sci-fi movies. For a local service business, AI isn't about robots taking over; it's about automation, efficiency, and scaling your marketing without hiring a massive team.
          </p>

          <LCInsightBlock type="real_world" title="Punching Above Your Weight Class">
            A small roofing company with 3 employees can now produce the same volume of high-quality educational content, video marketing, and follow-ups as a company with a 10-person marketing department. That is the true power of practical AI.
          </LCInsightBlock>

          <h2 className="text-3xl font-bold text-slate-50 mt-12 mb-6">3 Ways to Use AI Today</h2>
          
          <h3 className="text-2xl font-semibold text-white mt-8 mb-4">1. Automated Lead Follow-Up</h3>
          <p>
            When a customer fills out a form on your website at 10 PM, they don't want to wait until 9 AM the next day. AI-driven chat and SMS systems can immediately engage them, answer basic questions based on your knowledge base, and even book a consultation.
          </p>

          <h3 className="text-2xl font-semibold text-white mt-8 mb-4">2. Content Multiplication</h3>
          <p>
            You don't need to write a blog post, film a video, and draft a social media post separately. You can record a simple 3-minute video on your phone, and use AI to automatically transcribe it, turn it into an SEO-optimized blog post, and generate 5 social media captions.
          </p>

          <LCInsightBlock type="ai_tip" title="Repurposing is Key">
            Instead of constantly creating "new" things, use AI to take your best past work (a great customer review, a completed project) and turn it into case studies, emails, and social updates.
          </LCInsightBlock>

          <h3 className="text-2xl font-semibold text-white mt-8 mb-4">3. Automated Review Responses</h3>
          <p>
            Responding to reviews is critical for local visibility, but it's tedious. AI tools can detect the sentiment of a review and draft a professional, contextual response. You just click "approve."
          </p>

          <LCInsightBlock type="nta_found" title="What NTA Has Found">
            Businesses that implement automated follow-up systems see a 60% higher conversion rate from website traffic compared to businesses relying on manual email replies. Speed is everything.
          </LCInsightBlock>

        </article>

        <LCCallToAction type="talk" className="mt-16" />

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
            }
          ]}
        />
      </main>
    </div>
  );
}
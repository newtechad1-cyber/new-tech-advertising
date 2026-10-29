import LCHeader from '@/components/learning-center/LCHeader';
import LCInsightBlock from '@/components/learning-center/LCInsightBlock';
import LCCallToAction from '@/components/learning-center/LCCallToAction';
import LCRelatedArticles from '@/components/learning-center/LCRelatedArticles';
import LCRelatedVideos from '@/components/learning-center/LCRelatedVideos';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import { TrackProgress, TrackBottomNav } from '@/components/learning-center/TrackNavigation';

import SEOHead from '@/components/shared/SEOHead';
export default function AIVisibilityBasics() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <SEOHead 
        title="How to Get Found in AI Search | AI Visibility Basics"
        description="Learn practical ways to make a small business easier for search engines and AI answer systems to understand, verify, and cite."
        learningData={{
          name: 'AI Visibility Basics',
          description: 'A practical introduction to clear business information, useful content, structured data, consistent public facts, and outside evidence for AI and search visibility.',
          educationalLevel: 'Beginner',
          learningResourceType: 'Practical guide'
        }}
      />
      <MarketingNav />
      <div className="flex-grow">
      <LCHeader 
        title="AI Visibility Basics"
        subtitle="What can help search engines and AI answer systems understand, verify, and cite a local business."
        breadcrumbs={[
          { label: "Knowledge Library", link: "/learning-center" },
          { label: "AI Visibility Basics" }
        ]}
        category="Visibility"
        readTime="4 min"
        date="June 2026"
      />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <TrackProgress trackName="I'm New to AI" currentStep={2} totalSteps={5} color="emerald" />
        <article className="prose prose-invert prose-lg max-w-none prose-a:text-blue-400 hover:prose-a:text-blue-300">
          <p className="speakable text-xl leading-relaxed text-slate-200">
            Search visibility is no longer only about repeating the right phrase on a page. Modern search and AI answer systems can use many signals—page content, links, structured data, business listings, reviews, and other public sources—to understand what a business is, what it does, and whether the information is useful for a question.
          </p>

          <LCInsightBlock type="business_insight" title="The Shift in Search">
            Public information from your website and other sources can help search and AI systems connect facts about your business. No single page, review, directory, or schema block guarantees that an AI assistant will mention or recommend you.
          </LCInsightBlock>

          <h2 className="text-3xl font-bold text-slate-50 mt-12 mb-6">How AI Evaluates Your Business</h2>
          
          <h3 className="text-2xl font-semibold text-white mt-8 mb-4">1. Structured Data Gives Machines Explicit Labels</h3>
          <p>
            Structured data can label facts such as a business name, service, author, article, video, or location in a machine-readable format. It can reduce ambiguity and support search understanding, but it works best when it matches the visible page and the underlying facts.
          </p>

          <h3 className="text-2xl font-semibold text-white mt-8 mb-4">2. Useful Depth Is Better Than Thin Claims</h3>
          <p>
            A generic services list gives people and machines less context than useful pages that answer real questions about the work. Specific explanations, examples, limitations, and evidence can make a subject easier to understand and cite.
          </p>

          <LCInsightBlock type="ai_tip" title="AI Search Optimization">
            Build content because it answers a real customer question well—not because you are trying to manufacture hundreds of keyword pages. Depth, clarity, originality, and useful evidence create a stronger source than a thin page that simply repeats a service name.
          </LCInsightBlock>

          <h3 className="text-2xl font-semibold text-white mt-8 mb-4">3. Consistent Public Facts Reduce Ambiguity</h3>
          <p>
            If your website, business profile, directories, and other public sources disagree about basic facts such as hours, location, services, or contact information, people and machines have a harder time knowing which version is current. Keeping important facts consistent is a practical trust and visibility habit.
          </p>

          <LCInsightBlock type="nta_found" title="What NTA Has Found">
            Consistent, specific review responses give customers and search systems more useful evidence about the work your business does and the people it serves.
          </LCInsightBlock>

        </article>

        <TrackBottomNav 
          prevLink="/what-changed-online"
          prevText="← Previous: What Changed Online"
          nextLink="/seo-vs-ai-search"
          nextText="Next: SEO vs AI Search →"
          color="emerald"
        />

        <LCRelatedVideos category="AI Visibility" />

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
              description: "See where traditional SEO and AI search visibility overlap, where they differ, and why useful source content still matters.",
              link: "/seo-vs-ai-search",
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
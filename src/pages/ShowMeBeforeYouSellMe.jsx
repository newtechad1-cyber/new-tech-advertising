import { Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import LessonArticle from '@/components/knowledge/LessonArticle';
import LessonMediaOptions from '@/components/knowledge/LessonMediaOptions';
import { lesson9 as lesson } from '@/data/truthAboutBusinessGrowthLesson9';

export default function ShowMeBeforeYouSellMe() {
  return <div className="min-h-screen bg-slate-950 text-slate-300">
    <SEOHead title={lesson.title} description={lesson.searchDescription} canonical="/knowledge/truth-about-business-growth/show-me-before-you-sell-me" articleData={{title:lesson.title,author:'Rick Hesse',datePublished:lesson.publishedDate}} />
    <MarketingNav />
    <main className="mx-auto max-w-4xl px-6 pt-28 pb-20">
      <Link to="/knowledge/truth-about-business-growth" className="text-cyan-300 hover:text-white">The Truth About Business Growth</Link>
      <p className="mt-8 text-sm font-bold uppercase tracking-widest text-cyan-300">NTA Point of View · Knowledge Library</p>
      <h1 className="mt-4 text-4xl font-black leading-tight text-white md:text-5xl">{lesson.title}</h1>
      <p className="mt-6 text-xl leading-8">{lesson.description}</p>
      <p className="mt-5 mb-12 text-sm text-slate-400">By Rick Hesse · {lesson.readingTime}</p>
      <LessonMediaOptions path="/knowledge/truth-about-business-growth/show-me-before-you-sell-me" />
      <div id="lesson-reading" className="scroll-mt-24"><LessonArticle content={lesson.content} /></div>
      <section id="appliance-outlet-next-steps" className="mt-14 scroll-mt-24 rounded-2xl border border-cyan-500/30 bg-slate-900 p-7 md:p-9" aria-labelledby="appliance-outlet-update-heading">
        <p className="text-sm font-bold uppercase tracking-widest text-cyan-300">Case study update · October 16, 2026</p>
        <h2 id="appliance-outlet-update-heading" className="mt-3 text-2xl font-bold text-white">The proposal changed when the conversation got clearer</h2>
        <p className="mt-4 leading-8">The original Appliance Outlet proposal explored a broad connected system. Further conversations helped clarify the practical decision-making process and where to focus next. Scott's experience with the business and advertising helped shape the larger picture; continuing discussions with Don O'Connor helped focus the next steps. Rather than push the original scope, I scaled the idea back to something concrete we could look at together.</p>
        <p className="mt-4 leading-8">That led to two new demonstrations: a sample customer-facing website and a short promotional video. I also developed an idea for a recognizable local character, The Appliance Guy, to help build a community brand over time. The limited-quantity $299 gas dryer was a sample promotion used to explore the concept, not a claim that a campaign had been approved or launched.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <a href="https://smart-appliance-deals.base44.app/" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-5 hover:border-cyan-300"><span className="block font-bold text-white">Explore the example website ↗</span><span className="mt-2 block text-sm text-slate-300">A demonstration of what a customer might experience</span></a>
          <a href="https://youtu.be/GaKXps01M7U" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-5 hover:border-cyan-300"><span className="block font-bold text-white">Watch the sample video ↗</span><span className="mt-2 block text-sm text-slate-300">An example of a possible creative direction</span></a>
        </div>
        <p className="mt-6 text-sm leading-7 text-slate-400">These are exploratory examples, not an accepted final proposal, a live client campaign, or measured results. The next step is to review the ideas with the business and decide together what, if anything, is worth pursuing.</p>
      </section>
      <nav aria-label="Continue reading" className="mt-14 rounded-2xl border border-cyan-500/25 bg-cyan-950/15 p-7">
        <h2 className="text-xl font-bold text-white">Continue the conversation</h2>
        <div className="mt-5 flex flex-col gap-5">
          <Link to="/knowledge/truth-about-business-growth/business-owners-are-tired-of-being-sold" className="text-cyan-300 hover:text-white">Previous lesson: Business Owners Are Tired of Being Sold</Link>
          <Link to="/journal/issue-11-show-me-before-you-sell-me" className="text-cyan-300 hover:text-white">Read Journal Issue 11: Show Me Before You Sell Me</Link>
          <Link to="/growth-show/show-me-before-you-sell-me" className="text-cyan-300 hover:text-white">Watch Growth Show Episode 11</Link>
          <Link to="/knowledge" className="text-cyan-300 hover:text-white">Explore the Knowledge Library</Link>
        </div>
      </nav>
    </main>
    <SiteFooter />
  </div>;
}

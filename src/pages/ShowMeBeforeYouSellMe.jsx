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
      <nav aria-label="Continue reading" className="mt-14 rounded-2xl border border-cyan-500/25 bg-cyan-950/15 p-7">
        <h2 className="text-xl font-bold text-white">Continue the conversation</h2>
        <div className="mt-5 flex flex-col gap-5">
          <Link to="/knowledge/truth-about-business-growth/business-owners-are-tired-of-being-sold" className="text-cyan-300 hover:text-white">Previous lesson: Business Owners Are Tired of Being Sold</Link>
          <Link to="/journal/issue-11-show-me-before-you-sell-me" className="text-cyan-300 hover:text-white">Read Journal Issue 11: Show Me Before You Sell Me</Link>
          <Link to="/knowledge" className="text-cyan-300 hover:text-white">Explore the Knowledge Library</Link>
        </div>
      </nav>
    </main>
    <SiteFooter />
  </div>;
}

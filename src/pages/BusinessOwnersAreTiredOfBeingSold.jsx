import { Link } from 'react-router-dom';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import LessonArticle from '@/components/knowledge/LessonArticle';
import { lesson8 as lesson } from '@/data/truthAboutBusinessGrowthLesson8';

export default function BusinessOwnersAreTiredOfBeingSold() {
  return <div className="min-h-screen bg-slate-950 text-slate-300">
    <SEOHead title={lesson.title} description={lesson.searchDescription} canonical="/knowledge/truth-about-business-growth/business-owners-are-tired-of-being-sold" articleData={{title:lesson.title,author:'Rick Hesse',datePublished:lesson.publishedDate}} />
    <MarketingNav />
    <main className="mx-auto max-w-4xl px-6 pt-28 pb-20">
      <Link to="/knowledge/truth-about-business-growth" className="text-cyan-300 hover:text-white">The Truth About Business Growth</Link>
      <p className="mt-8 text-sm font-bold uppercase tracking-widest text-cyan-300">NTA Point of View · Knowledge Library</p>
      <h1 className="mt-4 text-4xl font-black leading-tight text-white md:text-5xl">{lesson.title}</h1>
      <p className="mt-6 text-xl leading-8">{lesson.description}</p>
      <p className="mt-5 mb-12 text-sm text-slate-400">By Rick Hesse · {lesson.readingTime}</p>
      <section className="mb-12 rounded-2xl border border-blue-500/25 bg-blue-950/20 p-6">
        <h2 className="text-2xl font-bold text-white">Watch the conversation — Episode 10</h2>
        <p className="mt-3 leading-7">Rick Hesse and the Free AI Guy discuss a better way to buy advertising.</p>
        <div className="mt-5 aspect-video overflow-hidden rounded-xl">
          <iframe className="h-full w-full" src="https://www.youtube-nocookie.com/embed/814-k8Tl-LE?rel=0" title="Business Owners Are Tired of Being Sold — NTA Growth Show Episode 10" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
        </div>
        <div className="mt-5 flex flex-wrap gap-6">
          <Link to="/growth-show/business-owners-are-tired-of-being-sold" className="text-cyan-300 hover:text-white">Explore Episode 10</Link>
          <Link to="/journal/issue-10-a-better-way-to-buy-advertising" className="text-cyan-300 hover:text-white">Read Journal Issue 10</Link>
        </div>
      </section>
      <LessonArticle content={lesson.content} />
      <aside className="mt-14 rounded-2xl border border-cyan-500/25 bg-cyan-950/15 p-7">
        <h2 className="text-xl font-bold text-white">Put it to work</h2>
        <p className="mt-4 leading-8">Choose one advertising offer you are considering. Use the five questions in this lesson to write down what you understand and what still needs explaining. Bring the unanswered questions into the conversation before committing.</p>
      </aside>
      <div className="mt-10 flex flex-wrap gap-6">
        <Link to="/knowledge" className="text-cyan-300 hover:text-white">Explore the Knowledge Library</Link>
        <Link to="/journal" className="text-cyan-300 hover:text-white">Read the NTA Journal</Link>
        <Link to="/growth-show" className="text-cyan-300 hover:text-white">Explore the Growth Show</Link>
      </div>
    </main>
    <SiteFooter />
  </div>;
}

// Generated native lesson page. Source content: src/data/masterCurriculum.js.
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import LessonArticle from '@/components/knowledge/LessonArticle';
import ContentNextSteps from '@/components/knowledge/ContentNextSteps';
import { addCompletedModule, getJourneyMemory, updateJourneyMemory } from '@/lib/journeyMemory';

// The lesson text is part of this native Base44 page's source so its first HTML
// can contain the complete answer at the existing canonical URL.
const TITLE = "Why NTA Exists";
const LESSON_PATH = "/knowledge/business-foundations/why-nta-exists";
const COLLECTION_PATH = "/knowledge/business-foundations";
const COLLECTION_TITLE = "Business Foundations";
const LESSON_NUMBER = 1;
const READING_TIME = "8–10 min read";
const LEVEL = "Beginner";
const AUTHOR_LABEL = "Your Digital Growth Guide™";
const PREVIOUS_LABEL = "Series overview: Business Foundations";
const NEXT_LABEL = "Next Lesson: How Businesses Really Grow";
const PUBLISHED_DATE = "2026-07-15";
const MODIFIED_DATE = "2026-07-23";
const READER_RESPONSE = null;
const DESCRIPTION = "Marketing is broken because it focuses on selling magic pills instead of building long-term systems. NTA exists to change that.";
const CONTENT = "\n### Before We Begin\n\nIf you're looking for another marketing company to sell you a package, you may be disappointed by this lesson.\n\nBecause that's not why I built New Tech Advertising.\n\nI didn't start NTA because I wanted another agency.\n\nI started it because, after spending most of my life in business, I realized something that bothered me.\n\nBusiness owners aren't usually lacking effort.\n\nThey're lacking clarity.\n\nThey work long hours.\n\nThey care about their customers.\n\nThey invest in advertising.\n\nThey build websites.\n\nThey try social media.\n\nThey buy software.\n\nYet many still feel like they're guessing.\n\nI've been there.\n\nI know what it feels like to spend money on marketing while wondering if it would have been better spent on your family, your employees, or simply left in the bank.\n\nThat's not a good feeling.\n\nAnd it shouldn't be the normal way to run a business.\n\n### My Story Isn't About Marketing\n\nOver the years I've owned businesses, sold advertising, built websites, produced television commercials, studied search engines, and now spend my days working alongside artificial intelligence.\n\nPeople sometimes ask,\n\n\"So... what business are you really in?\"\n\nThe answer has changed over the years.\n\nToday it's simple.\n\nI'm in the business of helping people understand.\n\nBecause understanding changes decisions.\n\nAnd better decisions change businesses.\n\n### The Problem Isn't Technology\n\nMost people think small businesses struggle because they don't have enough technology.\n\nI don't believe that.\n\nTechnology has never been more available.\n\nThe problem is that technology has become more confusing.\n\nEvery week there's another platform.\n\nAnother expert.\n\nAnother promise.\n\nAnother tool that's supposed to solve everything.\n\nBusiness owners don't need more confusion.\n\nThey need someone who can help them see which pieces actually matter.\n\n### Why AI Changed Everything\n\nFor decades I had ideas that were bigger than the team I could build.\n\nI needed programmers.\n\nDesigners.\n\nWriters.\n\nResearchers.\n\nVideo editors.\n\nDevelopers.\n\nSometimes I found wonderful people.\n\nSometimes I didn't.\n\nToday I still believe people matter most.\n\nBut now I also have something I never had before.\n\nAI.\n\nNot because it replaces people.\n\nBecause it gives experienced people better tools.\n\nI often describe AI this way:\n\nIt's the team I've been trying to build for forty years.\n\nThat doesn't make AI the teacher.\n\nIt makes it a powerful partner.\n\nMy responsibility is still to ask good questions, make wise decisions, and help business owners understand what we're building together.\n\n### Teaching Before Selling\n\nThis may be the biggest difference between NTA and many marketing companies.\n\nI'm not trying to convince you that you need my services.\n\nI'm trying to help you understand your business more clearly.\n\nSometimes that means you'll become a client.\n\nSometimes it means you'll leave with a better understanding of your business and never spend a dollar with me.\n\nI'm okay with either outcome.\n\nBecause my mission is bigger than making a sale.\n\nMy mission is helping business owners make better decisions.\n\n### The Kind of People I Hope to Work With\n\nNot every business owner is the right fit for NTA.\n\nThat's intentional.\n\nThe people I enjoy working with are curious.\n\nThey ask questions.\n\nThey're willing to learn.\n\nThey know they don't have all the answers, and they're comfortable admitting it.\n\nThey don't expect miracles.\n\nThey expect honesty.\n\nThose relationships become partnerships.\n\nAnd partnerships build businesses.\n\n### My Promise\n\nEverything we build at NTA begins with one simple promise.\n\n\"If you can offer me enough trust to begin, I will work to earn enough trust to continue.\"\n\nI don't expect trust because I have a website.\n\nOr because I know AI.\n\nOr because I've been in business a long time.\n\nTrust should be earned.\n\nOne conversation.\n\nOne recommendation.\n\nOne project.\n\nOne lesson at a time.\n\n### The Lesson\n\nTechnology will continue to change.\n\nMarketing will continue to change.\n\nArtificial intelligence will continue to change.\n\nThe principles that build healthy businesses won't.\n\nThose principles are what you'll learn throughout the NTA Knowledge Library.\n\nIf they help you build a better business, then everything I've learned over the past fifty years will have been worth passing on.\n\n***\n\n### Reflection Questions\n\nBefore moving to the next lesson, ask yourself:\n\n* What part of growing my business feels most confusing right now?\n* Am I looking for another marketing tactic—or trying to understand the larger system?\n* What decision would become easier if I understood the reason behind it?\n* Do the people helping my business take time to teach me, or do they mainly try to sell me something?\n* What would I like to understand better before I spend more money?\n\nYou don't need to solve everything today. Clarity often begins by identifying the question you really need answered.\n    ";
const TAKEAWAY = "Business owners don't need another company trying to sell them more marketing. They need someone who will help them understand how modern business growth really works.";
const SEO_TITLE = "Why Practical AI Education Matters for Small Business Owners | NTA Knowledge Library";
const CANONICAL = "https://newtechadvertising.com/knowledge/business-foundations/why-nta-exists";
const LESSON_ID = 1;
const PREVIOUS_PATH = "/knowledge/business-foundations";
const NEXT_PATH = "/knowledge/business-foundations/how-businesses-really-grow";
const RELATED_LESSONS = [
  {
    "title": "Why Understanding Comes Before Advertising",
    "description": "When a business needs more customers, advertising feels like the logical first step. But spending money and creating growth are not the same thing.",
    "path": "/knowledge/truth-about-business-growth/why-understanding-comes-before-advertising"
  },
  {
    "title": "Start With the Work, Not the Tool",
    "description": "The best place to begin with AI is not by choosing a product. It is by understanding the work you are trying to accomplish.",
    "path": "/knowledge/ai-foundations/start-with-the-work-not-the-tool"
  }
];

export default function NativeLessonPage001() {
  const navigate = useNavigate();
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setIsComplete(getJourneyMemory().completedModules.includes(LESSON_ID));
    updateJourneyMemory({ lastVisitedLessonId: LESSON_ID });
    window.scrollTo(0, 0);
  }, []);

  const markComplete = () => {
    addCompletedModule(LESSON_ID);
    setIsComplete(true);
    navigate(NEXT_PATH);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col">
      <SEOHead
        title={SEO_TITLE}
        description={DESCRIPTION}
        canonical={CANONICAL}
        articleData={{
          title: TITLE,
          description: DESCRIPTION,
          author: 'Rick Hesse',
          datePublished: PUBLISHED_DATE,
          dateModified: MODIFIED_DATE,
          slug: LESSON_PATH
        }}
        learningData={{
          name: TITLE,
          description: DESCRIPTION,
          educationalLevel: LEVEL,
          learningResourceType: 'lesson'
        }}
      />
      <MarketingNav />
      <main className="flex-grow">
        <header className="border-b border-slate-800 bg-slate-900/30 px-6 pb-12 pt-24">
          <div className="mx-auto max-w-3xl">
            <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
              <Link to="/knowledge" className="hover:text-white"><BookOpen className="mr-1 inline h-4 w-4" />Knowledge Library</Link>
              <span aria-hidden="true">/</span>
              <Link to={COLLECTION_PATH} className="hover:text-white">{COLLECTION_TITLE}</Link>
              <span aria-hidden="true">/</span>
              <span className="text-white">Lesson {LESSON_NUMBER}</span>
            </nav>
            <p className="mb-5 text-xs font-bold uppercase tracking-widest text-blue-400">{['Lesson ', LESSON_NUMBER, ' · ', READING_TIME, ' · ', LEVEL].join('')}</p>
            <h1 className="mb-6 text-3xl font-black leading-tight text-white md:text-5xl">{TITLE}</h1>
            <p className="mb-8 text-lg leading-relaxed text-slate-400">{DESCRIPTION}</p>
            <p className="border-t border-slate-800 pt-6 text-sm font-bold text-white">Rick Hesse <span className="font-normal text-slate-500">· {AUTHOR_LABEL}</span></p>
          </div>
        </header>
        <article className="px-6 py-12"><div className="mx-auto max-w-3xl">
          <LessonArticle content={CONTENT} />
          {READER_RESPONSE && <section className="mt-12 rounded-2xl border border-blue-400/25 bg-blue-500/5 p-6 md:p-8">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-blue-300">{READER_RESPONSE.label || 'A reader’s response'}</p>
            <blockquote className="text-2xl font-medium leading-relaxed text-white">“{READER_RESPONSE.quote}”</blockquote>
            <p className="mt-5 text-sm font-bold text-slate-200">— {READER_RESPONSE.attribution}</p>
            {READER_RESPONSE.context && <p className="mt-5 text-sm leading-6 text-slate-400">{READER_RESPONSE.context}</p>}
          </section>}
          <aside className="mt-16 border-t border-slate-800 pt-10" aria-labelledby="related-lessons-heading">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-400">Continue Learning</p>
            <h2 id="related-lessons-heading" className="mb-6 text-2xl font-black text-white">Keep exploring this idea</h2>
            <div className="grid gap-4 md:grid-cols-2">{RELATED_LESSONS.map(resource => (
              <Link key={resource.path} to={resource.path} className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 hover:border-blue-500/60">
                <h3 className="mb-2 text-lg font-bold text-white">{resource.title}</h3>
                <p className="text-sm leading-6 text-slate-400">{resource.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-blue-400">Read this next <ArrowRight className="h-4 w-4" /></span>
              </Link>
            ))}</div>
          </aside>
        </div></article>
        <section className="border-t border-slate-800 bg-slate-900 px-6 py-12">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 rounded-2xl border border-blue-500/20 bg-blue-900/20 p-8">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-blue-400">Key Takeaway</h2>
              <p className="text-xl font-medium leading-relaxed text-white">{TAKEAWAY}</p>
            </div>
            <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:flex-row">
              <div><h2 className="font-bold text-white">Progress Check</h2><p className="text-sm text-slate-400">Marking this complete saves your spot.</p></div>
              <button type="button" onClick={markComplete} disabled={isComplete} className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500 disabled:cursor-default disabled:bg-emerald-950 disabled:text-emerald-400"><CheckCircle className="h-5 w-5" />{isComplete ? 'Lesson Completed' : 'Mark as Complete'}</button>
            </div>
          </div>
        </section>
        <section className="px-6 py-12"><div className="mx-auto max-w-3xl"><ContentNextSteps title={TITLE} path={LESSON_PATH} /></div></section>
        <nav className="border-t border-slate-800 px-6 py-8" aria-label="Lesson navigation">
          <div className="mx-auto flex max-w-4xl flex-col justify-between gap-6 sm:flex-row">
            <Link to={PREVIOUS_PATH} className="flex items-center gap-3 rounded-xl p-4 font-bold text-slate-300 hover:bg-slate-900 hover:text-white"><ArrowLeft className="h-5 w-5" />{PREVIOUS_LABEL}</Link>
            <Link to={NEXT_PATH} className="flex items-center gap-3 rounded-xl p-4 font-bold text-slate-300 hover:bg-slate-900 hover:text-white">{NEXT_LABEL}<ArrowRight className="h-5 w-5" /></Link>
          </div>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}

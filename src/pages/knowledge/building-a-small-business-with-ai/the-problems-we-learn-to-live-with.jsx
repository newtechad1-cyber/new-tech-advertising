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
const TITLE = "The Problems We Learn to Live With";
const LESSON_PATH = "/knowledge/building-a-small-business-with-ai/the-problems-we-learn-to-live-with";
const COLLECTION_PATH = "/knowledge/building-a-small-business-with-ai";
const COLLECTION_TITLE = "Building a Small Business With AI";
const LESSON_NUMBER = 1;
const READING_TIME = "8–10 min read";
const LEVEL = "Beginner";
const AUTHOR_LABEL = "Your Digital Growth Guide™";
const PREVIOUS_LABEL = "Series overview: Building a Small Business With AI";
const NEXT_LABEL = "Next Lesson: AI Gives Small Business Its Speed Back";
const PUBLISHED_DATE = "2026-08-18";
const MODIFIED_DATE = "2026-08-18";
const READER_RESPONSE = null;
const DESCRIPTION = "Small-business owners often know what needs fixing, but for years many could not afford the people, time, or systems required to solve every problem. AI changes that equation.";
const CONTENT = "\n## I've Spent Most of My Life Selling to Business Owners\n\nI've spent most of my life selling to business owners.\n\nOver the years, I learned something that took me a long time to accept:\n\n**Seeing a problem doesn't mean someone is ready to solve it.**\n\nI could walk into a business and see things almost immediately.\n\nThe phone wasn't always being answered.\n\nCustomers weren't being followed up with.\n\nMarketing was inconsistent.\n\nThe website wasn't doing enough.\n\nNobody was asking happy customers for reviews.\n\nSales opportunities were being missed.\n\nPaperwork was piling up.\n\nThe owner was doing work somebody else should have been doing.\n\nSometimes the owner knew every one of those problems existed.\n\nThat didn't mean anything changed.\n\nFor a long time, that frustrated me.\n\nI spent a career in sales believing that if I could help someone clearly see the problem, the natural next step would be to fix it.\n\nIt doesn't always work that way.\n\n## We Get Used to Problems\n\nPeople learn to live with problems.\n\nBusinesses do too.\n\nThe thing that didn't get done yesterday doesn't get done today.\n\nA broken process eventually becomes \"the way we've always done it.\"\n\nA missed opportunity becomes normal.\n\nAn unanswered phone becomes part of doing business.\n\nThe owner knows the website should be better.\n\nThey know somebody should follow up with customers.\n\nThey know marketing needs attention.\n\nThey know the numbers should probably be watched more closely.\n\nBut there is always something more urgent.\n\nEventually the problem almost disappears into the background.\n\nIt hasn't actually disappeared.\n\nWe've just learned how to live with it.\n\n## Sometimes the Problem Wasn't Motivation\n\nThere is another side of this that I understand better today.\n\nSometimes the owner wasn't refusing to solve the problem.\n\nThey couldn't afford to solve all of them.\n\nIf a small business really wanted to operate the way a larger company could, it might need:\n\n- a receptionist,\n- a salesperson,\n- a marketing person,\n- someone creating content,\n- someone handling customer follow-up,\n- someone doing administrative work,\n- someone watching the numbers,\n- and someone managing all those people.\n\nUnderstanding the problem didn't put another few hundred thousand dollars into payroll.\n\nThat's important.\n\nBecause eventually I realized I had been living the same problem myself.\n\n## I Knew the Company I Wanted\n\nFor years, I knew what I wanted New Tech Advertising to become.\n\nI knew how I wanted the company to operate.\n\nI knew how customers should be greeted.\n\nI knew how leads should be followed up with.\n\nI knew how content should be created and distributed.\n\nI knew information should be organized instead of scattered.\n\nI knew I needed better prospecting.\n\nI knew somebody should constantly be watching what was working and what wasn't.\n\nI knew what I wanted.\n\nWhat I didn't always have was enough money, enough people, or enough hours in the day to make all of it happen.\n\nThen AI changed the economics.\n\n## I've Already Proved It to Myself\n\nThis isn't a story about something I hope to build someday.\n\nI've already built it.\n\nI've built the marketing systems.\n\nI've built the content systems.\n\nI've built the client workflows.\n\nI've connected tools.\n\nI've created ways for AI to help educate, organize, write, analyze, communicate, build, and manage work.\n\nThere are pieces I'm continuing to expand.\n\nProspecting is one of the biggest ones I'm concentrating on now.\n\nThe business-facing receptionist is another.\n\nAnd there will always be another improvement because business never reaches a final version.\n\nBut the basic question has already been answered for me:\n\n**Can a small business use AI to build capabilities that once required a much larger organization?**\n\nYes.\n\nI'm doing it.\n\n## That Changes the Sales Conversation\n\nThis also changes how I think about helping another business owner.\n\nI don't want to walk in and simply hand somebody another list of everything they're doing wrong.\n\nMost owners already have a pretty good idea where the pain is.\n\nThey live with it every day.\n\nThe better question is:\n\n**Can we finally give them a practical way to do something about it?**\n\nThat's where AI becomes interesting to me.\n\nNot because it's the latest technology.\n\nNot because everybody is talking about it.\n\nBecause it changes the economics of what a small company can actually accomplish.\n\nA business that couldn't justify adding another five employees may still be able to add many of the capabilities those employees would have provided.\n\nThat doesn't solve every business problem.\n\nNothing does.\n\nBut it removes an obstacle that existed for most of my career.\n\nIf you want to see the larger system behind that idea, read [What Building My Own Digital Growth Office Taught Me](/knowledge/business-foundations/what-building-my-own-digital-growth-office-taught-me).\n\n## Business Doesn't Have a Finish Line\n\nOne of the other things I've learned is that you never finish building a business.\n\nYou solve one problem and discover another opportunity.\n\nTechnology changes.\n\nCustomers change.\n\nCompetitors improve.\n\nMarkets move.\n\nThat's business.\n\nFor years, that could feel exhausting.\n\nToday I see it differently.\n\nI don't need to finish building New Tech Advertising.\n\nI need to build a company capable of continuing to improve.\n\nAI has given me the leverage to do that.\n\nAnd now I can bring that same capability to other small businesses.\n\nNot someday.\n\nNow.\n";
const TAKEAWAY = "AI lets a small business build capabilities that once required a much larger company, making it practical to solve problems owners may have understood for years but could not afford to staff around.";
const SEO_TITLE = "The Problems Small Businesses Learn to Live With | NTA Knowledge Library";
const CANONICAL = "https://newtechadvertising.com/knowledge/building-a-small-business-with-ai/the-problems-we-learn-to-live-with";
const LESSON_ID = 1;
const PREVIOUS_PATH = "/knowledge/building-a-small-business-with-ai";
const NEXT_PATH = "/knowledge/building-a-small-business-with-ai/ai-gives-small-business-its-speed-back";
const RELATED_LESSONS = [
  {
    "title": "What Building My Own Digital Growth Office Taught Me",
    "description": "Why a business's public website and private operating system should be connected—but built to do different jobs.",
    "path": "/knowledge/business-foundations/what-building-my-own-digital-growth-office-taught-me"
  },
  {
    "title": "Start With the Work, Not the Tool",
    "description": "The best place to begin with AI is not by choosing a product. It is by understanding the work you are trying to accomplish.",
    "path": "/knowledge/ai-foundations/start-with-the-work-not-the-tool"
  }
];

export default function NativeLessonPage057() {
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

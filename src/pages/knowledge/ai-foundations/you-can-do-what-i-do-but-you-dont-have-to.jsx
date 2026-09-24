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
const TITLE = "Benefit from AI Without Learning Every Technology";
const LESSON_PATH = "/knowledge/ai-foundations/you-can-do-what-i-do-but-you-dont-have-to";
const COLLECTION_PATH = "/knowledge/ai-foundations";
const COLLECTION_TITLE = "AI Foundations";
const LESSON_NUMBER = 13;
const READING_TIME = "8–10 min read";
const LEVEL = "Beginner";
const AUTHOR_LABEL = "Your Digital Growth Guide™";
const PREVIOUS_LABEL = "Previous Lesson: AI Does Not Have to Be a Monster";
const NEXT_LABEL = "Next Lesson: Use the Model That Gets the Job Done";
const PUBLISHED_DATE = "2026-07-15";
const MODIFIED_DATE = "2026-07-23";
const READER_RESPONSE = null;
const DESCRIPTION = "AI makes complex work more accessible, but small-business owners should be able to benefit without spending years learning every website, software, automation, and AI system.";
const CONTENT = "\n### The Two Years Your Business Does Not Have\n\nA business owner could spend two years learning AI, websites, automation, and connected tools.\n\nI know that because I have spent a great deal of time doing exactly that.\n\nBut most business owners should be able to benefit without making that investment of time.\n\nTheir time belongs to running the business. They have customers to serve, employees to lead, equipment to maintain, bills to pay, and decisions to make. They do not need another full-time job learning every tool that appears on the internet.\n\nAI has made complex systems much more accessible than they used to be. It can help a small business owner write, organize, research, plan, communicate, and build things that once required a team of specialists.\n\nBut AI has not made the learning process effortless.\n\nSomeone still has to know what matters, what connects, what can be left out, and what should not be trusted without checking.\n\nThat is where experience becomes valuable.\n\n### I Learned the Long Way\n\nI have spent thousands of hours and thousands of steps learning how to communicate with AI, connect tools, build websites, work through problems, improve visibility in search, and figure out what is actually useful.\n\nA lot of that work was necessary for me to understand the whole system.\n\nBut most businesses do not need everything I have built.\n\nThey need a few practical pieces that work together.\n\nThey may need a clear website, a way for people to contact them, a simple way to follow up, useful information that builds trust, and a system that helps them keep working without creating more confusion.\n\nThey do not need every feature just because a platform offers it.\n\nThe value is not in adding more technology.\n\nThe value is in knowing what to choose and what to leave out.\n\n### Why I Moved Beyond DIY\n\nDIY tools can be useful for learning and experimenting. They helped me learn.\n\nBut a business owner who is already responsible for the business usually cannot spend two years learning every technology and maintaining the entire system.\n\nI started by building tools in DIY platforms because I needed to understand what was possible. Over time, the work grew into something far more involved than most small businesses need.\n\nThat taught me an important distinction:\n\nThe system I built for learning is not necessarily the system another business needs to operate.\n\nAI lowers the technical barrier.\n\nIt does not eliminate the need for judgment.\n\n### The Bridge Between Possibility and Need\n\nMy job is to act as a bridge between what these tools can do and what a real small business actually needs.\n\nThat means simplifying the choices, explaining the parts in plain language, implementing the right amount, and keeping the cost reasonable enough that even the smallest businesses can get useful help.\n\nThis is why I have priced my services as reasonably as I can. I want practical help to be available to small businesses—not only to companies with large budgets or full-time technology staff.\n\nThe goal is not to ask business owners to recreate NTA’s technical learning process.\n\nThe goal is to help them benefit from AI while keeping their attention on the business.\n\nThat is the difference between selling a pile of tools and helping someone build a useful system.\n\n### The Lesson\n\nYou can learn to do what I do.\n\nYou can spend the time, ask the questions, solve the problems, and gradually understand how the pieces fit together.\n\nBut a business should not need that amount of technical learning before it can benefit.\n\nA business owner should be able to benefit from the result without spending years learning every technology and system behind it.\n\nThe real value is not merely knowing what is possible.\n\nIt is knowing what is enough.\n\n### Reflection Questions\n\n* What work am I spending time learning that someone else could simplify for me?\n* Which parts of my business actually need technology?\n* What could I leave out without hurting the customer experience?\n* Am I buying tools because I need them, or because I am excited about what they can do?\n* Would a smaller, clearer system help me more than a larger one?\n* What would help me benefit from AI without taking on unnecessary technology learning?\n";
const TAKEAWAY = "The value is in knowing what matters, simplifying the choices, and implementing only what a real small business needs—not asking the owner to learn the entire technical system first.";
const SEO_TITLE = "How Small Businesses Benefit from AI Without Learning Every Technology | NTA Knowledge Library";
const CANONICAL = "https://newtechadvertising.com/knowledge/ai-foundations/you-can-do-what-i-do-but-you-dont-have-to";
const LESSON_ID = 13;
const PREVIOUS_PATH = "/knowledge/ai-foundations/ai-does-not-have-to-be-a-monster";
const NEXT_PATH = "/knowledge/ai-foundations/use-the-model-that-gets-the-job-done";
const RELATED_LESSONS = [
  {
    "title": "The Work You Don’t See: Why Setup Matters",
    "description": "Why experienced setup and system design matter when technology is supposed to feel simple to use.",
    "path": "/canon/the-work-you-dont-see-why-setup-matters"
  },
  {
    "title": "I See Artificial Intelligence Differently",
    "description": "Why a useful approach to AI begins with people, purpose, trust, and the larger business system—not code, novelty, or another disconnected tool.",
    "path": "/knowledge/ai-foundations/i-see-artificial-intelligence-differently"
  },
  {
    "title": "What Building My Own Digital Growth Office Taught Me",
    "description": "Why a business's public website and private operating system should be connected—but built to do different jobs.",
    "path": "/knowledge/business-foundations/what-building-my-own-digital-growth-office-taught-me"
  }
];

export default function NativeLessonPage054() {
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

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
const TITLE = "Use the Model That Gets the Job Done";
const LESSON_PATH = "/knowledge/ai-foundations/use-the-model-that-gets-the-job-done";
const COLLECTION_PATH = "/knowledge/ai-foundations";
const COLLECTION_TITLE = "AI Foundations";
const LESSON_NUMBER = 14;
const READING_TIME = "8–10 min read";
const LEVEL = "Beginner";
const AUTHOR_LABEL = "Your Digital Growth Guide™";
const PREVIOUS_LABEL = "Previous Lesson: Benefit from AI Without Learning Every Technology";
const NEXT_LABEL = "Next Lesson: AI Finally Taught Me How to Multitask";
const PUBLISHED_DATE = "2026-07-15";
const MODIFIED_DATE = "2026-07-23";
const READER_RESPONSE = null;
const DESCRIPTION = "The newest or most expensive AI model is not automatically the right choice. Match the capability and cost to the work you actually need done.";
const CONTENT = "\n### Latest Is Not Automatically Best\n\nOne of the most useful lessons I have learned about AI is also one of the simplest:\n\nThe newest or most expensive model is not automatically the right model for every job.\n\nFor a while, it is easy to assume that the latest model must be the smart choice. If it is newer, it must be better. If it costs more, it must produce a better result.\n\nSometimes that is true.\n\nBut it is not true often enough to build a business around the assumption.\n\nAn older model may still do the work you need very well. If it can produce a reliable result for the task, paying extra for a more capable model may not improve the outcome enough to justify the cost.\n\nThe smart choice is to match the model to the job.\n\n### Capability Should Match the Work\n\nA simple task does not need the same level of capability as a difficult one.\n\nWriting a short internal note, organizing information, summarizing a known source, or handling a repetitive step may not require the most advanced model available.\n\nA complicated analysis, a delicate client communication, a difficult coding problem, or a high-stakes decision may justify using something stronger.\n\nThat is not settling for less.\n\nIt is learning how to spend intelligently.\n\n### Software Pricing Has Changed\n\nThis is part of a much larger change in software pricing.\n\nSoftware used to be a major purchase. A business might spend thousands or even hundreds of thousands of dollars to obtain capabilities that are now available through free or low-cost tools.\n\nFree usually has a catch.\n\nThere may be usage limits, slower service, fewer features, weaker models, advertising, or less support.\n\nBut the basic pattern has changed. A small business can now experiment with capabilities that once belonged only to larger companies.\n\nThat creates an opportunity, but it also creates a new responsibility.\n\nWhen the cost of trying tools becomes low, it becomes easy to collect too many tools, pay for too many subscriptions, and choose by excitement instead of by results.\n\n### The Questions That Matter\n\nThe question is no longer simply, “What does the software cost?”\n\nThe better questions are:\n\n* What does this level of capability cost for this job?\n* Will it produce a reliable result?\n* What does the result save, improve, or make possible?\n* When does paying for more capability become worthwhile?\n* What happens to the cost when this tool is used repeatedly?\n\nThe cheapest option is not always the best option.\n\nA cheap tool that wastes time or produces unreliable work can cost more than a better tool.\n\nBut the most expensive option is not automatically the best option either.\n\nThe right model is the least expensive one that reliably does the job.\n\n### This Applies Beyond AI Models\n\nThat principle applies beyond AI models.\n\nIt applies to software subscriptions, automation platforms, website tools, storage, and outside services.\n\nGood business decisions match the cost of the tool to the value of the result.\n\nDo not buy capability just because it is available.\n\nStart with the job you need done. Choose the simplest and least expensive option that can do that job reliably. Move up to a stronger or more expensive option when the work actually justifies it.\n\nThe goal is not to use the newest model.\n\nThe goal is to produce a useful result at a cost that makes sense.\n\n### Reflection Questions\n\n* What recurring AI or software task am I paying for today?\n* What does that task actually require?\n* Am I using a stronger model than the work needs?\n* What are the limits and tradeoffs of a less expensive option?\n* How will I test whether the cheaper option is reliable?\n* What result would justify paying for more capability?\n* Am I measuring the value of the result, or just comparing subscription prices?\n";
const TAKEAWAY = "Choose the least expensive model that reliably does the job, then move up when the work genuinely justifies the additional cost.";
const SEO_TITLE = "How to Choose the Right AI Model for the Work | NTA Knowledge Library";
const CANONICAL = "https://newtechadvertising.com/knowledge/ai-foundations/use-the-model-that-gets-the-job-done";
const LESSON_ID = 14;
const PREVIOUS_PATH = "/knowledge/ai-foundations/you-can-do-what-i-do-but-you-dont-have-to";
const NEXT_PATH = "/knowledge/ai-foundations/ai-finally-taught-me-how-to-multitask";
const RELATED_LESSONS = [
  {
    "title": "AI Isn't Magic Either",
    "description": "Artificial intelligence is powerful, but it is not magic. Understanding what it can and cannot do is the first step toward using it wisely.",
    "path": "/knowledge/ai-foundations/ai-isnt-magic-either"
  },
  {
    "title": "Automation Comes After Understanding",
    "description": "Automation can make good work faster and more consistent. But when we automate a process we do not understand, we often make confusion move faster too.",
    "path": "/knowledge/ai-foundations/automation-comes-after-understanding"
  },
  {
    "title": "Start With the Work, Not the Tool",
    "description": "The best place to begin with AI is not by choosing a product. It is by understanding the work you are trying to accomplish.",
    "path": "/knowledge/ai-foundations/start-with-the-work-not-the-tool"
  }
];

export default function NativeLessonPage055() {
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

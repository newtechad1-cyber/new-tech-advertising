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
const TITLE = "AI Isn't Magic Either";
const LESSON_PATH = "/knowledge/ai-foundations/ai-isnt-magic-either";
const COLLECTION_PATH = "/knowledge/ai-foundations";
const COLLECTION_TITLE = "AI Foundations";
const LESSON_NUMBER = 1;
const READING_TIME = "9–10 min read";
const LEVEL = "Beginner";
const AUTHOR_LABEL = "Your Digital Growth Guide™";
const PREVIOUS_LABEL = "Series overview: AI Foundations";
const NEXT_LABEL = "Next Lesson: Start With the Work, Not the Tool";
const PUBLISHED_DATE = "2026-07-15";
const MODIFIED_DATE = "2026-07-23";
const READER_RESPONSE = null;
const DESCRIPTION = "Artificial intelligence is powerful, but it is not magic. Understanding what it can and cannot do is the first step toward using it wisely.";
const CONTENT = "\n### The Question Behind Most AI Questions\n\nWhen business owners ask me about artificial intelligence, the question they say out loud is usually:\n\n“What can AI do for my business?”\n\nBut I think there is often another question underneath it.\n\n“Am I falling behind?”\n\nThat fear is understandable.\n\nEverywhere you look, someone is saying AI will change everything.\n\nIt will replace jobs.\n\nBuild companies.\n\nWrite books.\n\nCreate videos.\n\nAnswer customers.\n\nRun marketing campaigns.\n\nMake people rich.\n\nOr possibly destroy civilization before lunch.\n\nDepending on who you listen to, AI is either going to solve every problem we have or create problems we can’t survive.\n\nI don’t believe either extreme is particularly helpful to a business owner.\n\nAI is powerful.\n\nIt may be the most powerful business tool I have encountered in my lifetime.\n\nBut it isn’t magic.\n\nAnd treating it like magic is one of the fastest ways to become disappointed by it.\n\n### I’ve Seen This Before\n\nAI isn’t the first technology that was supposed to change everything.\n\nI remember when businesses were told they needed a website.\n\nThen they needed search engine optimization.\n\nThen social media.\n\nThen video.\n\nThen marketing automation.\n\nEach of those things became valuable.\n\nBut none of them became the answer to every business problem.\n\nA website couldn’t fix poor service.\n\nSocial media couldn’t create trust by itself.\n\nAutomation couldn’t repair a process nobody understood.\n\nTechnology changed.\n\nThe principles didn’t.\n\nThat is why the first collection in the NTA Knowledge Library was Business Foundations—not AI Foundations.\n\nBefore we talk about what AI can do, we need to understand what makes a healthy business grow.\n\nOtherwise, AI simply becomes another tool we buy before we understand what problem we are trying to solve.\n\n### What AI Actually Does\n\nThe simplest way I know to explain AI is this:\n\nAI works with what we give it.\n\nWe give it a question.\n\nAn instruction.\n\nA problem.\n\nA document.\n\nA conversation.\n\nAn example.\n\nA collection of information.\n\nIt looks for patterns in that material and helps us produce something useful from it.\n\nThat might be an answer.\n\nA summary.\n\nA plan.\n\nA first draft.\n\nA list of ideas.\n\nAn analysis.\n\nA picture.\n\nA video.\n\nA better question.\n\nSometimes the result is remarkable.\n\nSometimes it is ordinary.\n\nSometimes it is wrong.\n\nThe difference often depends on what we gave it, how clearly we explained the task, and whether we knew enough to recognize a good answer when we saw one.\n\nThat is why AI still needs us.\n\n### Put AI in the Right Place\n\nI find it helpful to put AI in the same category as other useful business tools. A calculator can help with numbers, but it does not decide whether an investment is wise. A spreadsheet can organize customer information, but it does not build the relationship. A website can make a business easier to find, but it cannot make the business trustworthy.\n\nAI has a much wider range than those tools, which is one reason it can feel different. It can work with language, images, plans, questions, and ideas. It can respond in a way that feels surprisingly natural. Still, the basic principle has not changed: the tool serves the work.\n\nThis first lesson is not asking you to master AI. It is asking you to place it correctly. AI is more useful than a gimmick, less dependable than an unquestionable authority, and most valuable when a thoughtful person gives it a clear purpose.\n\nThe later lessons will deal separately with context, wrong answers, judgment, conversation, and automation. For now, the important thing is to leave the extremes behind. You do not have to worship the technology or run from it. You can learn what it does, try it on something real, and decide from experience where it belongs.\n\n### Don’t Begin With Fear\n\nSome business owners avoid AI because they are afraid of it.\n\nOthers rush into it because they are afraid of being left behind.\n\nBoth reactions begin with fear.\n\nI think there is a better place to begin.\n\nCuriosity.\n\nAsk:\n\n“What could this help me understand?”\n\n“What work could it help me do?”\n\n“What information would it need from me?”\n\n“What should always remain my responsibility?”\n\nYou don’t need to understand every technical detail before using AI.\n\nMost people drive a car without knowing how to rebuild an engine.\n\nBut you should understand enough to know where you are going, why you are using it, and when you need to keep your hands on the wheel.\n\n### You Don’t Need Every AI Tool\n\nNew AI tools appear almost every day.\n\nEach one promises to save time, create content, find customers, automate work, or transform your business.\n\nYou do not need all of them.\n\nIn fact, collecting tools can become another form of confusion.\n\nThe goal is not to have the most AI.\n\nThe goal is to use the right amount of AI in the right places for the right reasons.\n\nOne useful tool that helps solve a real problem is worth more than twenty subscriptions you barely understand.\n\nWe will get to the tools later.\n\nFirst, we need to understand the work.\n\n### The Lesson\n\nArtificial intelligence is not magic.\n\nIt does not automatically understand your business.\n\nIt does not replace experience.\n\nIt does not remove responsibility.\n\nAnd it does not turn a confused process into a wise one simply because technology was added.\n\nAI is a powerful partner that can help thoughtful people accomplish more.\n\nBut its value depends on the knowledge, direction, questions, and judgment we bring to the relationship.\n\nThe best place to begin is neither fear nor excitement.\n\nIt is understanding.\n\n***\n\n### Reflection Questions\n\nBefore moving to the next lesson, ask yourself:\n\n* When I think about AI, am I mostly curious, excited, confused, or afraid?\n* Am I hoping AI will solve a problem I haven’t clearly identified?\n* What experience or knowledge do I have that AI could help me use more effectively?\n* What decisions in my business should always remain human responsibilities?\n* Am I collecting AI tools, or am I learning to use one useful tool well?\n* What would I like to understand about AI before investing more time or money in it?\n\nStart with the business question. You should be able to benefit without spending unnecessary time learning every AI tool or system.\n\nLearn enough to ask better questions and choose the next useful step.\n";
const TAKEAWAY = "AI can help you think, create, organize, and accomplish more—but it still needs human experience, direction, and judgment. It is a powerful tool, not a magic answer.";
const SEO_TITLE = "Is AI Magic? A Practical Introduction for Small Business | NTA Knowledge Library";
const CANONICAL = "https://newtechadvertising.com/knowledge/ai-foundations/ai-isnt-magic-either";
const LESSON_ID = 1;
const PREVIOUS_PATH = "/knowledge/ai-foundations";
const NEXT_PATH = "/knowledge/ai-foundations/start-with-the-work-not-the-tool";
const RELATED_LESSONS = [
  {
    "title": "AI Is My Team, Not My Replacement",
    "description": "How to properly frame the role of Artificial Intelligence in a local service business.",
    "path": "/knowledge/business-foundations/ai-is-my-team-not-my-replacement"
  },
  {
    "title": "AI Needs Context Before It Can Be Helpful",
    "description": "AI may know a great deal about business in general, but it does not automatically understand your business. Useful results begin by providing the right context.",
    "path": "/knowledge/ai-foundations/ai-needs-context-before-it-can-be-helpful"
  }
];

export default function NativeLessonPage043() {
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

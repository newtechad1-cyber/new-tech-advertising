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
const TITLE = "AI Finally Taught Me How to Multitask";
const LESSON_PATH = "/knowledge/ai-foundations/ai-finally-taught-me-how-to-multitask";
const COLLECTION_PATH = "/knowledge/ai-foundations";
const COLLECTION_TITLE = "AI Foundations";
const LESSON_NUMBER = 15;
const READING_TIME = "8–10 min read";
const LEVEL = "Beginner";
const AUTHOR_LABEL = "Your Digital Growth Guide™";
const PREVIOUS_LABEL = "Previous Lesson: Use the Model That Gets the Job Done";
const NEXT_LABEL = "Continue Learning";
const PUBLISHED_DATE = "2026-09-04";
const MODIFIED_DATE = "2026-07-23";
const READER_RESPONSE = {"label":"A reader's response","quote":"I like this one. Very useful, and I will put it into practice.","attribution":"Pete Gardner","context":"Pete shared this after receiving the NTA Journal issue built around this lesson and the related Growth Show conversation."};
const DESCRIPTION = "AI did not make Rick’s brain multitask. It helped him carry less context while directing more ideas, projects, decisions, and work forward.";
const CONTENT = "\n### People Have Been Trying to Figure Out How to Multitask\n\nPeople have been trying to figure out how to multitask for as long as I can remember.\n\nIt makes sense. We all have more things we'd like to get done than we have time to do them. So we try to answer an email while we're on the phone, think about one problem while we're working on another, and keep three or four things running around in our heads at the same time.\n\nI've never been particularly good at that.\n\nMy mind moves fast. I'll be thinking about one thing and suddenly another idea shows up. Then another one. Sometimes I can have a pretty good idea and lose it before I even get ChatGPT open to talk about it.\n\nI've actually been learning to slow my thinking down just enough to hold onto the thought long enough to do something with it.\n\nAnd somewhere along the way, I realized something:\n\n**AI finally taught me how to multitask.**\n\nNot because AI somehow trained my brain to concentrate on four things simultaneously.\n\nIt did something much more useful.\n\n**It allowed me to stop carrying all four things in my head.**\n\n### I'm Not Doing Four Things. I'm Directing Four Things.\n\nThat distinction has changed the way I work.\n\nI might be working on the New Tech Advertising website and realize something needs to change. I can open a conversation, explain what I'm seeing, talk through what I want to accomplish, and get that work moving.\n\nThen I might think of something that needs to happen for a client's website.\n\nI can move to another conversation and start working on that.\n\nThen an idea for an article might hit me. Instead of telling myself, \"I'll remember that later,\" I can start another conversation and capture it while it's fresh.\n\nAt times I've had three or four different conversations going in separate windows.\n\nFrom the outside, that probably looks like multitasking.\n\nBut I don't think that's really what I'm doing.\n\n**I'm directing multiple streams of work.**\n\nAnd AI is carrying much of the context and work that I used to have to carry myself.\n\nThat's the breakthrough for me.\n\n### The Limitation Wasn't Always Time\n\nFor much of my life, if I had an idea, there was still a whole chain of work between the idea and the finished result.\n\nI had to remember the idea.\n\nThink it through.\n\nFigure out how to do it.\n\nDo the work.\n\nKeep track of where I was.\n\nSolve the problems that came up.\n\nAnd somehow remember everything else I was supposed to be doing while I did it.\n\nThere are only so many of those chains a person can carry at once.\n\nAI changes that.\n\nNow I can have the idea and start talking.\n\nI can explain what I'm trying to accomplish, answer questions, correct misunderstandings, make decisions, and then let AI help carry the work forward.\n\nThat leaves my mind available for the part where I believe I'm most valuable: **thinking, recognizing, connecting, deciding and directing.**\n\n### It's Almost Like Having Managers\n\nMaybe \"multitasking\" isn't even the best business comparison.\n\nMaybe it's management.\n\nA good manager doesn't personally perform every task happening inside a company. If the manager tried to do that, the company could never become larger than that person's individual capacity.\n\nThe manager needs to understand what is happening, establish direction, communicate what needs to be accomplished, make decisions and review the results.\n\nI'm beginning to think AI gives an individual person some of that same leverage.\n\nI don't need to personally carry every detail of every project every minute that the project exists.\n\nI need to give the AI enough understanding to help move it forward. Then I need to come back when my judgment, experience, approval or another idea is needed.\n\nThat's very different from asking AI to run everything for me.\n\n**I'm still responsible for the direction.**\n\nAI simply increases how much I can direct.\n\n### That's How I've Built NTA\n\nWhen I look at everything I've built with New Tech Advertising, this is really how I've done it.\n\nThere wasn't one enormous plan that I sat down and executed perfectly from beginning to end.\n\nIt grew through conversation.\n\nI would see something.\n\nI'd have an idea.\n\nI'd talk it through with AI.\n\nWe'd build something.\n\nThat would cause me to see something else.\n\nI'd move over there and work on that.\n\nThen I'd come back.\n\nLittle by little, all of those conversations started connecting into a much larger system.\n\nAnd I realized that AI wasn't simply helping me work faster.\n\n**It was expanding the amount of work I could direct without requiring me to personally carry all of that work in my head.**\n\nThat's a much bigger idea than productivity.\n\n### Maybe We've Been Thinking About Multitasking Wrong\n\nFor years, we tried to make people better at juggling.\n\nMaybe the answer was never becoming a better juggler.\n\nMaybe the answer was having somewhere intelligent to put the ball.\n\nThat's what AI has become for me.\n\nI can take a thought out of my head, put it into a conversation, develop it enough that it has context and direction, and move on without having to keep rehearsing it in my mind so I don't lose it.\n\nThen I can return to it.\n\nThe conversation is still there.\n\nThe context is still there.\n\nThe work is still there.\n\nAnd I can pick it back up.\n\nSo yes, after all these years, I think AI finally taught me how to multitask.\n\nJust not the way I thought multitasking worked.\n\n**AI didn't teach my brain to do more things at once.**\n\n**It allowed my brain to carry less while directing more.**\n\nAnd for me, that has changed almost everything about what one person can accomplish.\n";
const TAKEAWAY = "AI does not make one person do everything. It helps a person capture, contextualize, direct, and return to several worthwhile streams of work without carrying every detail in their head.";
const SEO_TITLE = "AI Finally Taught Me How to Multitask | NTA Knowledge Library";
const CANONICAL = "https://newtechadvertising.com/knowledge/ai-foundations/ai-finally-taught-me-how-to-multitask";
const LESSON_ID = 15;
const PREVIOUS_PATH = "/knowledge/ai-foundations/use-the-model-that-gets-the-job-done";
const NEXT_PATH = "/knowledge/building-a-small-business-with-ai";
const RELATED_LESSONS = [
  {
    "title": "The Work You Don’t See: Why Setup Matters",
    "description": "Why the right system lets people carry less complexity while directing more of the work that matters.",
    "path": "/canon/the-work-you-dont-see-why-setup-matters"
  },
  {
    "title": "The Team I Spent My Life Trying to Build",
    "description": "For much of my life, I have tried to build things with other people. AI has helped me realize that some of the things I was trying to build were not impossible—they just required more consistent support.",
    "path": "/knowledge/ai-foundations/the-team-i-spent-my-life-trying-to-build"
  },
  {
    "title": "From Conversation to a Working Business System",
    "description": "See how an owner’s spoken knowledge can be clarified, approved, and turned into a practical business system without taking authority away from the owner.",
    "path": "/knowledge/ai-foundations/ai-makes-complicated-work-easier"
  }
];

export default function NativeLessonPage056() {
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

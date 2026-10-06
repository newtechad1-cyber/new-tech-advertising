import LessonMediaOptions from '@/components/knowledge/LessonMediaOptions';
// Generated native lesson page. Source content: src/data/masterCurriculum.js.
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import LessonArticle from '@/components/knowledge/LessonArticle';
import ContentNextSteps from '@/components/knowledge/ContentNextSteps';
import LessonDoorwayQuestions from '@/components/knowledge/LessonDoorwayQuestions';
import { addCompletedModule, getJourneyMemory, updateJourneyMemory } from '@/lib/journeyMemory';

// The lesson text is part of this native Base44 page's source so its first HTML
// can contain the complete answer at the existing canonical URL.
const TITLE = "How Do You Put AI to Work in a Real Business?";
const LESSON_PATH = "/knowledge/ai-foundations/how-do-you-put-ai-to-work-in-a-real-business";
const COLLECTION_PATH = "/knowledge/ai-foundations";
const COLLECTION_TITLE = "AI Foundations";
const LESSON_NUMBER = 16;
const READING_TIME = "8 min read";
const LEVEL = "Beginner";
const AUTHOR_LABEL = "Your Digital Growth Guide™";
const PREVIOUS_LABEL = "Previous Lesson: AI Finally Taught Me How to Multitask";
const NEXT_LABEL = "Continue Learning";
const PUBLISHED_DATE = "2026-09-28";
const MODIFIED_DATE = "2026-09-28";
const READER_RESPONSE = null;
const DESCRIPTION = "Rick Hesse explains how business judgment, owner knowledge, and years of AI experimentation help put useful AI capabilities to work in a real small business.";
const CONTENT = "\n### I was trying to do this before the AI could do it\n\nNearly two years ago, I could have a useful conversation with ChatGPT in the morning and feel like I was starting over later that day. It did not hold enough of the larger picture I was trying to build. I wanted to talk through a business problem, return to it, connect it with earlier work, and turn the thinking into something I could actually use. The reasoning often was not strong enough for what I was asking of it.\n\nThat was frustrating. I could see what I wanted to do, but the technology could not reliably help me do it yet. So I tried other AI models. I learned how to work with them, where they helped, and where I still had to step in. At the same time, I watched their capabilities grow. Some of the work I wanted to do two years ago is becoming possible now.\n\nI did not begin with a plan to build an AI team. I began with tools. Then I learned that I needed a better way to work with the tools. That led to systems that could help do the thinking and the work, and to the books, Knowledge Library, Growth Show, and Journal that help me teach what I am learning. The next step grew out of all those earlier steps: give each AI capability a useful job and connect the work around a real business. I think of that as the NTA AI team: different capabilities working on defined parts of a real business problem, with a person checking what they produce.\n\n### The business questions come first\n\nI have spent decades working in and studying businesses. People have brought me many ideas over the years and said, “This would make a great business.” I tend to ask questions: Who needs it? Why would they pay for it? What does it cost to deliver? How will customers find it? What happens after someone buys? Can the people running the business actually keep the promises being made?\n\nSometimes those questions reveal that the idea needs more work. I do not ask them to discourage somebody. A business is tied to people's time, money, families, employees, and livelihoods. I have experienced enough failure myself to take those questions seriously. I want what I have learned, including the painful parts, to help someone else avoid a mistake if I can.\n\nAI did not give me that way of thinking. It is becoming capable enough to help me put that thinking to work in new ways.\n\n### Thinking out loud can become useful work\n\nMuch of my work begins as a conversation. I talk through what I am seeing. I question my first conclusion. I remember something from an earlier business. We look at how the pieces connect. AI can help me capture that conversation, organize it, and make the work visible: a lesson, a website answer, a business process, a proposed Gap Audit, or a clearer next step for a client.\n\nI noticed something while reading the draft of this very lesson. An idea came to mind, so I stopped to write it down or say it before it disappeared. Then I kept reading and found that the next part had already answered my question or made the change I was about to suggest. I still want to capture my own thought. Sometimes my way of saying it adds something. But it is a remarkable feeling when the work begins to follow the way I think. Our conversations, my corrections, and the context we have built are making the collaboration more useful.\n\nI think my years of trying to understand people and businesses have helped me learn to work with AI, too. I pay attention to what someone means, what they leave unsaid, and how a decision will affect them. I also look at how the business earns its living, delivers its promises, and handles the work after a customer says yes. That has taught me to notice when an AI answer sounds good but misses the person or the way the business actually works. AI is not a person. But the habits of listening, asking business questions, and checking whether something makes sense in practice have served me here, too.\n\nBut a clean-looking answer is not the same as a sound business decision. We still have to check the facts, understand the cost and effort, ask whether the people involved will use the process, and decide whether it improves anything for the customer. A good idea in a conversation has to survive contact with the way the business operates on Tuesday afternoon.\n\nThe same is true of your business. The knowledge that matters most may be in the owner's head, in an employee's experience, or in the questions customers keep asking. A system can help capture and use that knowledge. It cannot responsibly invent it.\n\n### Why I am learning to give different AIs different jobs\n\nI could hand a business owner a dashboard with several AI models on it. The owner would still have to decide which one to use, what information to give it, how to check its work, and how to connect the answer to everything else the business does.\n\nMy experience with different models has taught me that they are not interchangeable. I am working out which capabilities fit particular jobs, how their work should be passed along, and where I need to review it myself. The point is not to show an owner how many AIs are involved. The point is to help a real business get useful work done.\n\nThe Business Gap Audit is one place I am developing this approach. To be useful, it needs to look at a business's website **and** its social presence, examine what a potential customer can actually see, and distinguish an observed gap from a guess. AI may help gather and organize that evidence. I still need to verify the findings, use business judgment to prioritize them, and talk with the owner about what is happening behind the scenes. A visible website or social gap is only part of the business story.\n\nThat is the difference between getting an impressive report and finding an appropriate next step.\n\n### Built around the person doing the work\n\nIt has taken me nearly two years of practical work to reach this point. Someone could use the same subscriptions, the same AI models, and even the same prompts and still get a different result. My way of thinking, my experience, my questions, and the way I have learned to correct the work are part of what I built.\n\nI personalized this way of working around myself first. Now I am learning how to shape it around each owner and each business. An owner may prefer to speak, type, email, call, or have someone on the team help keep information moving. The system has to meet the people doing the work and make the next step understandable. It should not require every owner to work like I do.\n\nThe owner knows things about the business that I cannot know from a website. I bring an outside view, years of business questions, and what I have learned about putting AI to work. We need both sides in the conversation.\n\n### A useful place to begin\n\nBefore you subscribe to another AI tool, choose one piece of work in your business and follow it from start to finish. For example, what happens when a prospective customer asks for an estimate?\n\n- How does the request arrive, and who sees it?\n- What information do you need before you can answer well?\n- Where do requests get delayed or forgotten?\n- Who makes the judgment call, and what should never go out without that person's review?\n- What does the customer experience while waiting?\n\nThose answers tell us much more than the name of the latest model. They show where better information, a clearer process, a useful AI capability, or a human follow-up could help. Sometimes the right improvement is very small.\n\n**The NTA Point of View:** Start with the business, the people, and the work. Choose AI only when it has a defined job. Keep the owner informed and the important decisions human. The goal is a system that helps the business operate more clearly and serve people better.\n\nIf you have a piece of work that should be easier but keeps getting stuck, start by describing it in your own words. That is a better first conversation than asking which AI to buy. [Talk to My Office™](/contact) or continue exploring the [NTA Knowledge Library](/knowledge).\n";
const TAKEAWAY = "Start with the people, the business, and the work. Give AI a defined job, check its result, and keep important decisions with the owner.";
const SEO_TITLE = "How Do You Put AI to Work in a Real Business? | NTA Knowledge Library";
const CANONICAL = "https://newtechadvertising.com/knowledge/ai-foundations/how-do-you-put-ai-to-work-in-a-real-business";
const LESSON_ID = 16;
const PREVIOUS_PATH = "/knowledge/ai-foundations/ai-finally-taught-me-how-to-multitask";
const NEXT_PATH = "/knowledge/building-a-small-business-with-ai";
const RELATED_LESSONS = [
  {
    "title": "AI Needs Context Before It Can Be Helpful",
    "description": "AI may know a great deal about business in general, but it does not automatically understand your business. Useful results begin by providing the right context.",
    "path": "/knowledge/ai-foundations/ai-needs-context-before-it-can-be-helpful"
  },
  {
    "title": "The Most Valuable Knowledge Usually Lives in the Owner’s Head",
    "description": "Many business owners assume the important knowledge of the business has already been documented. But those materials usually contain only part of the knowledge required. The rest, and often the most valuable part, is the judgment living in the owner's head.",
    "path": "/knowledge/turning-what-a-business-knows-into-an-asset/the-most-valuable-knowledge-usually-lives-in-the-owners-head"
  },
  {
    "title": "Use the Model That Gets the Job Done",
    "description": "The newest or most expensive AI model is not automatically the right choice. Match the capability and cost to the work you actually need done.",
    "path": "/knowledge/ai-foundations/use-the-model-that-gets-the-job-done"
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
          <LessonMediaOptions path={LESSON_PATH} />
          <div id="lesson-reading" className="scroll-mt-24"><LessonArticle content={CONTENT} /></div>
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
        <LessonDoorwayQuestions lessonPath={LESSON_PATH} />
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

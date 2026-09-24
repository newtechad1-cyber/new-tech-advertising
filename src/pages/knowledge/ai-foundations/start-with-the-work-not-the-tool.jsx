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
const TITLE = "Start With the Work, Not the Tool";
const DESCRIPTION = "The best place to begin with AI is not by choosing a product. It is by understanding the work you are trying to accomplish.";
const CONTENT = "\n### The Question Everyone Wants Answered\n\nOne of the first questions business owners ask me about AI is:\n\n“Which AI tool should I use?”\n\nIt sounds like the right question.\n\nBut usually, it is too early to answer.\n\nBefore I recommend a tool, I need to understand the work.\n\nWhat are you trying to accomplish?\n\nWhat is taking too much time?\n\nWhere are customers getting confused?\n\nWhat keeps being forgotten?\n\nWhat work depends entirely on one person?\n\nWhat information is scattered across emails, documents, notebooks, and someone’s memory?\n\nWhat are you doing repeatedly that could become a process?\n\nUntil we understand those things, choosing a tool is mostly guessing.\n\nAnd guessing is not a good reason to spend money.\n\n### We’ve Been Trained to Shop for Answers\n\nWhen a problem appears in business, our first instinct is often to look for something to buy.\n\nA new website.\n\nA new customer relationship system.\n\nA new scheduling program.\n\nA new marketing platform.\n\nA new AI subscription.\n\nSometimes the purchase is helpful.\n\nBut buying a tool and improving the business are not the same thing.\n\nI have seen businesses own software they barely use.\n\nThe program may be capable of doing wonderful things, but no one clearly decided what job it was supposed to perform.\n\nEventually, the software gets blamed.\n\nPeople say:\n\n“It didn’t work.”\n\nSometimes that is true.\n\nBut sometimes the tool never had a fair chance because the work had not been defined.\n\n### A Tool Needs a Job\n\nThink about walking into a hardware store and asking:\n\n“What is the best tool?”\n\nThe person helping you would probably ask:\n\n“What are you trying to do?”\n\nAre you hanging a picture?\n\nBuilding a deck?\n\nFixing a pipe?\n\nRepairing an engine?\n\nThere is no best tool without a job.\n\nAI works the same way.\n\nIf you want help writing an email, that is one kind of job.\n\nIf you want to organize customer information, that is another.\n\nIf you want to answer common questions, follow up with prospects, analyze sales calls, create a social media calendar, or turn a conversation into a training guide, each requires a different kind of process.\n\nThe tool should be chosen for the work.\n\nThe work should not be invented to justify the tool.\n\n### Begin With What Already Happens\n\nYou do not need to imagine some enormous AI transformation.\n\nLook at the work your business already does.\n\nA customer calls.\n\nSomeone answers the phone.\n\nQuestions are asked.\n\nInformation is written down.\n\nAn estimate is prepared.\n\nA follow-up message is sent.\n\nThe work is scheduled.\n\nThe customer is served.\n\nPayment is collected.\n\nA review may—or may not—be requested.\n\nThat entire journey contains work.\n\nSome of it requires human judgment and personal attention.\n\nSome of it is repetitive.\n\nSome of it is frequently forgotten.\n\nSome of it depends on information that already exists somewhere else.\n\nThose are the places worth examining.\n\nThe first question is not:\n\n“Where can I insert AI?”\n\nThe first question is:\n\n“What is happening here now?”\n\n### Watch for Repeated Work\n\nOne of the easiest places to begin is with work you repeat.\n\nMaybe you answer the same five questions every week.\n\nMaybe every new customer needs the same instructions.\n\nMaybe you write similar follow-up emails after every appointment.\n\nMaybe your staff searches through old documents for information that should be easy to find.\n\nMaybe you turn every recorded conversation into notes, action items, and a proposal.\n\nRepeated work often reveals the beginning of a system.\n\nAI may help make that system faster or more consistent.\n\nBut first, you need to notice the repetition.\n\nBusiness owners become so accustomed to doing certain tasks that they stop seeing them as processes.\n\nThey simply think:\n\n“That is part of my day.”\n\nSometimes the first benefit of exploring AI is not automation.\n\nIt is finally seeing the work clearly.\n\n### Don’t Automate Confusion\n\nImagine that customer information is collected differently every time someone calls.\n\nOne employee writes it on paper.\n\nAnother sends themselves an email.\n\nSomeone else enters part of it into a spreadsheet.\n\nImportant details live inside text messages.\n\nFollow-up depends on who remembers.\n\nA business owner might say:\n\n“We need AI to fix our follow-up.”\n\nPerhaps AI can help.\n\nBut the first problem is not a lack of artificial intelligence.\n\nThe first problem is that there is no agreed-upon process.\n\nIf we add automation before understanding the work, we may simply move confusion faster.\n\nWe may send the wrong information more efficiently.\n\nWe may create more messages without creating better communication.\n\nAI works best when it supports a process people understand.\n\n### Find the Friction\n\nWhen I look at a business, I pay attention to friction.\n\nFriction is where something feels harder than it should.\n\nA customer has to repeat information.\n\nAn employee has to enter the same details twice.\n\nA lead waits three days for an answer.\n\nThe owner cannot find the latest version of a document.\n\nA task depends entirely on someone remembering to do it.\n\nGood people spend hours completing routine work while important decisions wait.\n\nThose moments are telling us something.\n\nThey show us where the work may need to be simplified, documented, organized, or supported.\n\nAI may become part of the answer.\n\nBut even before we use it, we have learned something important about the business.\n\nWe have found a place where the system is creating unnecessary effort.\n\n### Begin With One Small Job\n\nBusiness owners sometimes believe they need a complete AI strategy before they can begin.\n\nI don’t think that is necessary.\n\nStart with one useful job.\n\nNot the entire company.\n\nNot every department.\n\nOne job.\n\nPerhaps AI helps turn a recorded customer conversation into a clear summary.\n\nPerhaps it helps draft a follow-up email based on that conversation.\n\nPerhaps it organizes the most common customer questions.\n\nPerhaps it turns one video into several social media posts.\n\nPerhaps it compares this month’s customer feedback with last month’s.\n\nA small, clearly defined job teaches you more than a large, vague ambition.\n\nYou can observe the result.\n\nCorrect mistakes.\n\nImprove the instructions.\n\nDecide whether it actually saves time or produces better work.\n\nThen you can build from what you learned.\n\n### Keep People Close to the Work\n\nThe people doing the work often understand the problems better than the person buying the software.\n\nThey know which questions customers ask.\n\nThey know which information is usually missing.\n\nThey know where delays occur.\n\nThey know which steps look simple from the outside but require experience and judgment.\n\nBefore introducing AI into someone’s job, talk with them.\n\nAsk what slows them down.\n\nAsk what they repeat.\n\nAsk what they wish they had more time to do.\n\nAsk which parts of their work require a human relationship.\n\nAI should support good people—not be dropped on top of them without explanation.\n\nWhen employees understand the purpose, they can help shape a much better system.\n\n### What Are We Really Trying to Improve?\n\nNot every improvement should be measured only by speed.\n\nFaster is useful.\n\nBut sometimes the real goal is:\n\nFewer missed details.\n\nMore consistent follow-up.\n\nClearer communication.\n\nBetter organization.\n\nMore time with customers.\n\nLess dependence on one person’s memory.\n\nGreater confidence in decisions.\n\nAI can help a business become more efficient.\n\nBut efficiency should serve something meaningful.\n\nSaving ten minutes matters most when we know what we want to do with those ten minutes.\n\nThe goal is not simply to make people work faster.\n\nThe goal is to help them do better work.\n\n### The Lesson\n\nDo not begin your AI journey by shopping for tools.\n\nBegin by looking carefully at the work your business already performs.\n\nFind what is repeated.\n\nFind what is confusing.\n\nFind what is being forgotten.\n\nFind where customers wait.\n\nFind where valuable knowledge is trapped inside one person’s head.\n\nThen choose one small, useful job to improve.\n\nOnce the work is understood, the right tool becomes much easier to recognize.\n\n***\n\n### Reflection Questions\n\nThink about an ordinary week inside your business:\n\n* What work do I or my employees repeat most often?\n* Where do customers have to wait, repeat themselves, or ask for clarification?\n* What important tasks depend on someone remembering to do them?\n* Where is information scattered or difficult to find?\n* What work requires human judgment, empathy, or personal responsibility?\n* What is one small job AI might help us perform more consistently?\n* What result matters most: saving time, reducing mistakes, improving communication, or serving customers better?\n\nYou do not need to transform your entire business.\n\nBegin by understanding one piece of work.\n";
const TAKEAWAY = "Don’t begin by asking which AI tool you should buy. Begin by identifying the work that needs to be understood, improved, or completed.";
const SEO_TITLE = "How to Start Using AI in a Small Business: Begin With the Work | NTA Knowledge Library";
const CANONICAL = "https://newtechadvertising.com/knowledge/ai-foundations/start-with-the-work-not-the-tool";
const LESSON_ID = 2;
const PREVIOUS_PATH = "/knowledge/ai-foundations/ai-isnt-magic-either";
const NEXT_PATH = "/knowledge/ai-foundations/ai-needs-context-before-it-can-be-helpful";
const RELATED_LESSONS = [
  { title: 'Understanding Before Spending', description: 'The importance of education and transparency before investing in growth.', path: '/knowledge/business-foundations/understanding-before-spending' },
  { title: 'Every System Produces Exactly What It Was Designed to Produce', description: 'Why your current results are a direct reflection of your current operational structure.', path: '/knowledge/business-foundations/every-system-produces-exactly-what-it-was-designed-to-produce' }
];

export default function StartWithTheWorkNotTheToolLessonPage() {
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
          datePublished: '2026-07-15',
          dateModified: '2026-07-23',
          slug: '/knowledge/ai-foundations/start-with-the-work-not-the-tool'
        }}
        learningData={{
          name: TITLE,
          description: DESCRIPTION,
          educationalLevel: 'Beginner',
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
              <Link to="/knowledge/ai-foundations" className="hover:text-white">AI Foundations</Link>
              <span aria-hidden="true">/</span>
              <span className="text-white">Lesson 2</span>
            </nav>
            <p className="mb-5 text-xs font-bold uppercase tracking-widest text-blue-400">Lesson 2 · 9–10 min read · Beginner</p>
            <h1 className="mb-6 text-3xl font-black leading-tight text-white md:text-5xl">{TITLE}</h1>
            <p className="mb-8 text-lg leading-relaxed text-slate-400">{DESCRIPTION}</p>
            <p className="border-t border-slate-800 pt-6 text-sm font-bold text-white">Rick Hesse <span className="font-normal text-slate-500">· Your Digital Growth Guide™</span></p>
          </div>
        </header>
        <article className="px-6 py-12"><div className="mx-auto max-w-3xl">
          <LessonArticle content={CONTENT} />
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
        <section className="px-6 py-12"><div className="mx-auto max-w-3xl"><ContentNextSteps title={TITLE} path="/knowledge/ai-foundations/start-with-the-work-not-the-tool" /></div></section>
        <nav className="border-t border-slate-800 px-6 py-8" aria-label="Lesson navigation">
          <div className="mx-auto flex max-w-4xl flex-col justify-between gap-6 sm:flex-row">
            <Link to={PREVIOUS_PATH} className="flex items-center gap-3 rounded-xl p-4 font-bold text-slate-300 hover:bg-slate-900 hover:text-white"><ArrowLeft className="h-5 w-5" />Previous Lesson: AI Isn't Magic Either</Link>
            <Link to={NEXT_PATH} className="flex items-center gap-3 rounded-xl p-4 font-bold text-slate-300 hover:bg-slate-900 hover:text-white">Next Lesson: AI Needs Context Before It Can Be Helpful<ArrowRight className="h-5 w-5" /></Link>
          </div>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}

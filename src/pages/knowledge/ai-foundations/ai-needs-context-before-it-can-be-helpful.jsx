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
const TITLE = "AI Needs Context Before It Can Be Helpful";
const LESSON_PATH = "/knowledge/ai-foundations/ai-needs-context-before-it-can-be-helpful";
const COLLECTION_PATH = "/knowledge/ai-foundations";
const COLLECTION_TITLE = "AI Foundations";
const LESSON_NUMBER = 3;
const READING_TIME = "9–10 min read";
const LEVEL = "Beginner";
const AUTHOR_LABEL = "Your Digital Growth Guide™";
const PREVIOUS_LABEL = "Previous Lesson: Start With the Work, Not the Tool";
const NEXT_LABEL = "Next Lesson: AI Can Assist Judgment—It Cannot Own It";
const PUBLISHED_DATE = "2026-07-15";
const MODIFIED_DATE = "2026-07-23";
const READER_RESPONSE = null;
const DESCRIPTION = "AI may know a great deal about business in general, but it does not automatically understand your business. Useful results begin by providing the right context.";
const CONTENT = "\n### The First Answer Is Usually Too General\n\nOne of the first disappointments people experience with AI happens after they ask it a question and receive an answer that sounds like it could have been written for anyone.\n\nThe response may be polished.\n\nThe grammar may be perfect.\n\nThe ideas may even be reasonable.\n\nBut something is missing.\n\nIt doesn’t sound like them.\n\nIt doesn’t understand their customers.\n\nIt doesn’t recognize how their business is different.\n\nIt gives advice that could apply to a heating company, a furniture store, a dentist, or a restaurant.\n\nThen the business owner says:\n\n“I tried AI. It wasn’t very helpful.”\n\nI understand why they feel that way.\n\nBut the problem may not be that AI failed.\n\nThe problem may be that AI didn’t know enough about the business to provide a useful answer.\n\n### General Knowledge Is Not Your Knowledge\n\nAI can know a great deal about business in general.\n\nIt may understand common marketing strategies.\n\nSales processes.\n\nCustomer service principles.\n\nIndustry terminology.\n\nWriting styles.\n\nSoftware.\n\nAdvertising.\n\nResearch.\n\nBut it does not automatically know your business.\n\nIt doesn’t know why you started.\n\nIt doesn’t know which customers you serve best.\n\nIt doesn’t know the promises you make.\n\nIt doesn’t know which promises you refuse to make.\n\nIt doesn’t know how your employees work.\n\nIt doesn’t know what your customers repeatedly ask.\n\nIt doesn’t know which ideas you tried before or why they failed.\n\nIt doesn’t know what you mean when you say:\n\n“That doesn’t sound like us.”\n\nAll of that is context.\n\nAnd context is what turns a general AI tool into something that can become genuinely helpful.\n\n### Think About a New Employee\n\nImagine hiring a new employee on Monday morning.\n\nThey may be intelligent.\n\nExperienced.\n\nEager to help.\n\nBut you would not hand them the keys, point toward the office, and say:\n\n“Go run the business.”\n\nThey need an introduction.\n\nThey need to understand what the company does.\n\nWho the customers are.\n\nHow the phone should be answered.\n\nWhat good service looks like.\n\nWhich decisions they may make.\n\nWhich decisions require approval.\n\nThey need examples.\n\nCorrections.\n\nPractice.\n\nTime.\n\nAI needs something similar.\n\nNot because it is a person.\n\nIt isn’t.\n\nBut because useful work still depends on useful direction.\n\nIf you treat AI like a new teammate who needs orientation, examples, and clearly defined responsibilities, you will usually get better results than if you treat it like a machine that should somehow know everything you meant.\n\n### Your Business Already Contains the Context\n\nMost businesses already possess the knowledge AI needs.\n\nThe problem is that the knowledge is scattered.\n\nSome of it is on the website.\n\nSome is inside old emails.\n\nSome is in brochures.\n\nSome lives in proposals.\n\nSome is buried in customer reviews.\n\nSome exists in recorded conversations.\n\nSome is written in employee notes.\n\nAnd much of the most valuable knowledge lives inside the owner’s head.\n\nYou know why customers choose you.\n\nYou know which questions reveal whether someone is a good fit.\n\nYou know the difference between a promising opportunity and a problem waiting to happen.\n\nYou know which words customers use when they describe their frustrations.\n\nYou know what you have learned through years of mistakes.\n\nThat knowledge has tremendous value.\n\nBut AI cannot use knowledge it has never been given.\n\n### This Is What We’ve Been Building at NTA\n\nWhen people see what I am building with AI, they may think the AI produced New Tech Advertising.\n\nIt didn’t.\n\nAI helped me build it.\n\nBut the philosophy came from my life.\n\nThe stories came from my experience.\n\nThe lessons came from owning businesses, selling advertising, working with clients, making mistakes, and spending years trying to understand why some things produce results and others don’t.\n\nI have spent countless hours explaining those ideas.\n\nCorrecting the language.\n\nRejecting things that sounded too corporate.\n\nRemoving claims that felt like marketing hype.\n\nSaying:\n\n“That may be technically correct, but it isn’t how I would say it.”\n\nOver time, the AI became more useful because I gave it more context.\n\nIt began to understand that NTA teaches before it sells.\n\nThat trust must be earned.\n\nThat AI is a team, not a replacement.\n\nThat every system produces something.\n\nThat helping someone understand is valuable even if they never become a client.\n\nAI didn’t invent those principles.\n\nIt learned to help me express and organize them.\n\n### Context Is More Than a Better Prompt\n\nPeople often hear that getting better results from AI requires writing better prompts.\n\nThat is true, but it is only part of the story.\n\nA prompt tells AI what you want right now.\n\nContext helps it understand the larger world in which the work belongs.\n\nSuppose you ask:\n\n“Write a follow-up email for a prospect.”\n\nAI can do that.\n\nBut the result becomes more useful when it also knows:\n\n* Who the prospect is.\n* What they asked about.\n* What problem they are trying to solve.\n* What was discussed.\n* What you promised to send.\n* How you normally speak.\n* What you do not want the email to sound like.\n* What the appropriate next step should be.\n\nThe task did not change.\n\nThe context did.\n\nAnd the difference between those two emails may be the difference between generic communication and a message that feels thoughtful and personal.\n\n### Examples Teach Better Than Adjectives\n\nYou can tell AI:\n\n“Make this sound warm, professional, and conversational.”\n\nThat may help.\n\nBut those words can mean different things to different people.\n\nAn example is often much clearer.\n\nShow it an email you wrote that sounds like you.\n\nShow it a proposal you are proud of.\n\nShow it how you answered a customer’s difficult question.\n\nShow it a paragraph you rejected and explain why it felt wrong.\n\nExamples make invisible expectations more visible.\n\nThis is especially important with voice.\n\nYour voice is not merely whether you use short or long sentences.\n\nIt includes what you notice.\n\nWhat you value.\n\nWhat you refuse to exaggerate.\n\nHow you treat people.\n\nWhat you have learned.\n\nA few descriptive words cannot capture all of that.\n\nExamples begin to.\n\n### Context Has a Shelf Life\n\nContext is not something we provide once and forget. Businesses change. Services change. Prices, policies, employees, customers, and priorities change too.\n\nAn AI assistant that relies on last year’s information may perform its assigned job exactly as instructed and still produce the wrong result. That is not a conversation problem. It is a recordkeeping problem.\n\nSomeone must own the source material. Approved information should have a date, a clear location, and a person responsible for keeping it current. Old versions should be removed from active use without erasing the history a business may still need.\n\nThis discipline helps people as much as it helps AI. When the current answer is easy to find, employees do not have to guess which document is right. Context becomes part of the company’s working knowledge instead of another pile of forgotten files.\n\n### Context Must Be Organized\n\nGiving AI more information does not mean dumping everything you have into one conversation and hoping it sorts itself out.\n\nContext should be useful.\n\nAccurate.\n\nCurrent.\n\nRelevant to the job.\n\nA customer follow-up assistant may need your communication style, common questions, service information, and follow-up process.\n\nIt probably does not need every financial record in the company.\n\nA content assistant may need your voice guide, approved lessons, customer concerns, and examples of strong content.\n\nIt should not need private employee information.\n\nGood context has boundaries.\n\nPart of using AI responsibly is deciding what information it needs, what information it does not need, and what sensitive information should never be entered into a tool without understanding how that information will be handled.\n\nMore information is not always better.\n\nThe right information is better.\n\n### Your Knowledge Is a Business Asset\n\nFor years, small-business knowledge often disappeared when an employee left, the owner retired, or an old computer stopped working.\n\nAI gives us a new reason to organize that knowledge.\n\nNot simply so a machine can use it.\n\nSo the business can preserve what it has learned.\n\nCustomer questions can become a useful guide.\n\nRecorded conversations can reveal recurring concerns.\n\nSuccessful proposals can become examples.\n\nMistakes can become instructions.\n\nFounder stories can become lessons.\n\nThe process of preparing context for AI can make the business stronger even before AI does anything with it.\n\nBecause now the knowledge is no longer trapped inside one person’s memory.\n\nIt is becoming something the whole business can learn from.\n\n### The Lesson\n\nAI may have access to enormous amounts of general knowledge.\n\nBut general knowledge is not the same as understanding your business.\n\nTo become useful, AI needs context.\n\nIt needs to know the job.\n\nThe customer.\n\nThe purpose.\n\nThe voice.\n\nThe boundaries.\n\nThe examples.\n\nThe desired outcome.\n\nIt also needs that information to remain accurate and current.\n\nYou do not make AI more helpful by assuming it already understands your business. You make it more helpful by giving it the right knowledge for the job and maintaining that knowledge as the business changes.\n\n***\n\n### Reflection Questions\n\nThink about the knowledge already inside your business:\n\n* What important information currently exists only inside my head?\n* What questions do customers ask repeatedly?\n* Which emails, proposals, videos, or conversations best represent how we work?\n* What examples could help AI understand our voice?\n* What words, promises, or approaches do not fit our business?\n* What information would an AI teammate need to perform one clearly defined job?\n* What private or sensitive information should remain outside that system?\n* If an experienced employee left tomorrow, what valuable knowledge might leave with them?\n\nOrganizing context is not merely preparation for AI.\n\nIt is a way of recognizing what your business has already learned.\n";
const TAKEAWAY = "AI cannot use business knowledge it has never been given. The more clearly you provide your purpose, voice, customers, examples, and expectations, the more useful your AI teammate can become.";
const SEO_TITLE = "Why AI Needs Business Context to Be Useful | NTA Knowledge Library";
const CANONICAL = "https://newtechadvertising.com/knowledge/ai-foundations/ai-needs-context-before-it-can-be-helpful";
const LESSON_ID = 3;
const PREVIOUS_PATH = "/knowledge/ai-foundations/start-with-the-work-not-the-tool";
const NEXT_PATH = "/knowledge/ai-foundations/ai-can-assist-judgment-it-cannot-own-it";
const RELATED_LESSONS = [
  {
    "title": "The Most Valuable Knowledge Usually Lives in the Owner’s Head",
    "description": "Many business owners assume the important knowledge of the business has already been documented. But those materials usually contain only part of the knowledge required. The rest, and often the most valuable part, is the judgment living in the owner's head.",
    "path": "/knowledge/turning-what-a-business-knows-into-an-asset/the-most-valuable-knowledge-usually-lives-in-the-owners-head"
  },
  {
    "title": "From Conversation to a Working Business System",
    "description": "See how an owner’s spoken knowledge can be clarified, approved, and turned into a practical business system without taking authority away from the owner.",
    "path": "/knowledge/ai-foundations/ai-makes-complicated-work-easier"
  }
];

export default function NativeLessonPage044() {
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

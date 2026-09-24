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
const TITLE = "Automation Comes After Understanding";
const LESSON_PATH = "/knowledge/ai-foundations/automation-comes-after-understanding";
const COLLECTION_PATH = "/knowledge/ai-foundations";
const COLLECTION_TITLE = "AI Foundations";
const LESSON_NUMBER = 6;
const READING_TIME = "9–10 min read";
const LEVEL = "Beginner";
const AUTHOR_LABEL = "Your Digital Growth Guide™";
const PREVIOUS_LABEL = "Previous Lesson: Why AI Sometimes Gives You the Wrong Answer";
const NEXT_LABEL = "Next Lesson: Building Your First AI Teammate";
const PUBLISHED_DATE = "2026-07-15";
const MODIFIED_DATE = "2026-07-23";
const READER_RESPONSE = null;
const DESCRIPTION = "Automation can make good work faster and more consistent. But when we automate a process we do not understand, we often make confusion move faster too.";
const CONTENT = "\n### Automation Sounds Like Freedom\n\nWhen business owners hear the word automation, they often imagine freedom.\n\nThe phone answers itself.\n\nEmails send themselves.\n\nAppointments schedule themselves.\n\nContent publishes itself.\n\nLeads receive follow-up without anyone having to remember.\n\nReports appear automatically.\n\nCustomers get answers at any hour.\n\nThe owner finally has time to breathe.\n\nI understand the attraction.\n\nMost business owners are carrying too much.\n\nThey do not need another task.\n\nThey need some of the weight removed.\n\nGood automation can do that.\n\nBut automation is not automatically good.\n\nIt is a system repeating instructions.\n\nIf the instructions are clear and the process is healthy, automation can become extremely valuable.\n\nIf the process is confused, automation can repeat that confusion faster and with fewer opportunities for someone to notice.\n\n### Every Automation Produces Something\n\nWe have already established one of the most important principles in the NTA Knowledge Library:\n\nEvery system produces exactly what it was designed to produce.\n\nAutomation does not change that principle.\n\nIt strengthens it.\n\nA helpful process can become more consistent.\n\nA thoughtful follow-up system can help fewer prospects fall through the cracks.\n\nA reliable reminder can prevent something important from being forgotten.\n\nBut a poor process can also become more consistent.\n\nA confusing email can be sent to hundreds of people.\n\nIncorrect information can reach every customer.\n\nAn aggressive sales message can repeat until people stop listening.\n\nA lead can be moved through a system that never actually understands what the person needs.\n\nAutomation increases the ability of a system to produce.\n\nThat makes understanding the system even more important.\n\n### Doing Something Repeatedly Doesn’t Mean It Is Ready\n\nA task may happen every day and still not be a dependable process.\n\nSuppose every new prospect is supposed to receive a follow-up email.\n\nThat sounds simple.\n\nBut before automating it, we should ask:\n\n* When should the message be sent?\n* Should every prospect receive the same message?\n* What information should it include?\n* What happens if they already responded?\n* What happens if the conversation involved something sensitive?\n* Who checks whether the information is correct?\n* What should happen if the automation fails?\n\nIf those questions do not have clear answers, the process may not be ready.\n\nThe fact that something is repeated does not mean it is understood.\n\n### I Know the Temptation to Build Too Quickly\n\nWhen I see what AI and automation can do, I get excited.\n\nI move quickly.\n\nI can see how one piece might connect to another.\n\nA conversation becomes a transcript.\n\nThe transcript becomes an article.\n\nThe article becomes a video script.\n\nThe video becomes social media content.\n\nThe content becomes part of the Knowledge Library.\n\nThe Knowledge Library helps guide a prospect into a Growth Conversation.\n\nI can see the whole system in my mind.\n\nBut seeing the possibility and having a dependable process are not the same thing.\n\nSometimes I have built the next piece before fully testing the previous one.\n\nThen I discover duplicated information.\n\nAn old version connected to a new system.\n\nA placeholder that looks finished.\n\nA process that technically runs but is not yet producing the experience I intended.\n\nThat has taught me an important lesson:\n\nBuild quickly if you want.\n\nBut understand each connection before asking it to run without you.\n\n### Perform the Work Manually First\n\nOne of the best ways to understand a process is to perform it manually.\n\nBefore automating customer follow-up, write and send the messages yourself.\n\nNotice which questions people ask.\n\nNotice where the information comes from.\n\nNotice when the message should be personal.\n\nNotice which situations do not fit the normal process.\n\nBefore automating content creation, work through several pieces carefully.\n\nLearn what makes the content sound like you.\n\nLearn which corrections appear repeatedly.\n\nLearn which facts need to be verified.\n\nLearn what should never be published without review.\n\nManual work reveals the decisions hidden inside a task.\n\nThose decisions must be understood before the process can become a responsible automation.\n\n### A Checklist Comes Before a Workflow\n\nIf you cannot explain the process as a simple checklist, it may be too early to automate it.\n\nFor example:\n\n* A prospect completes the Growth Conversation.\n* The system records the answers.\n* AI prepares a summary.\n* Rick reviews the summary.\n* The prospect receives an approved follow-up.\n* A reminder is created if no response arrives.\n* Unusual situations are flagged for personal attention.\n\nThat process contains both automation and human judgment.\n\nIt also makes the handoffs visible.\n\nWho—or what—does each part?\n\nWhat information is needed?\n\nWhere does approval happen?\n\nWhat happens next?\n\nA checklist gives us something we can examine before technology begins performing it.\n\n### Begin With Assistance\n\nNot every automation needs to operate without human involvement.\n\nA useful first step is often assisted automation.\n\nAI prepares the draft.\n\nA person reviews it.\n\nThe system recommends the next action.\n\nA person approves it.\n\nAI organizes the information.\n\nA person checks whether anything important is missing.\n\nThe automation handles routine movement while a person remains responsible for meaning and judgment.\n\nThis may not sound as exciting as a business running entirely by itself.\n\nBut it is often safer, more dependable, and more useful.\n\nThe goal is not to remove every human touch.\n\nThe goal is to preserve human attention for the places where it matters most.\n\n### Automate the Predictable, Escalate the Unusual\n\nGood automation knows its boundaries.\n\nIt can handle normal, repeated situations.\n\nIt should recognize when something falls outside those situations.\n\nA customer asking for business hours may receive an immediate answer.\n\nA customer who is angry, frightened, confused, or describing an unusual problem may need a person.\n\nA standard appointment reminder can send automatically.\n\nA message involving a complaint or financial dispute should probably be reviewed.\n\nAn AI system can prepare ordinary content from approved information.\n\nA claim about health, law, safety, finances, or something affecting a person’s well-being requires greater care.\n\nA dependable automation does not simply act.\n\nIt also knows when to stop and ask for help.\n\n### Watch What the System Produces\n\nAutomation should never become invisible simply because it is running.\n\nWe need to watch the results.\n\nAre messages being delivered?\n\nAre customers responding?\n\nAre people becoming confused?\n\nAre employees correcting the same mistake repeatedly?\n\nIs the automation saving time?\n\nIs it creating more work somewhere else?\n\nIs it strengthening relationships—or making communication feel less personal?\n\nA system can run perfectly from a technical standpoint and still produce the wrong experience.\n\nThat is why measurement must include more than whether the automation completed its task.\n\nWe must ask whether it produced something useful.\n\n### Keep a Way Back\n\nBusinesses change.\n\nCustomers change.\n\nTechnology changes.\n\nWhat works today may need adjustment six months from now.\n\nEvery important automation should have a way to be paused, reviewed, corrected, or replaced.\n\nSomeone should know:\n\n* What triggers it.\n* What information it uses.\n* What actions it takes.\n* Where the results are recorded.\n* How to stop it.\n* Who is responsible for it.\n\nAutomation should reduce dependence on memory.\n\nIt should not create dependence on a system nobody understands.\n\n### Automation Should Create More Humanity, Not Less\n\nThis may sound strange, but I believe good automation can make a business more human.\n\nIf routine work takes less time, an employee can spend more time listening to a customer.\n\nIf information is organized automatically, the owner can enter a conversation better prepared.\n\nIf reminders prevent missed follow-ups, people feel remembered.\n\nIf AI prepares the first draft, a person can spend more time improving the message.\n\nThe time saved should return somewhere meaningful.\n\nIf automation only helps us produce more messages, more content, more activity, and more noise, I am not sure we have gained much.\n\nThe goal is not merely to do more.\n\nThe goal is to make room for better work and stronger relationships.\n\n### The Lesson\n\nAutomation is not the beginning of the process.\n\nIt is what may come after the process has been understood.\n\nFirst, identify the work.\n\nPerform it.\n\nObserve it.\n\nDocument it.\n\nFind the decisions inside it.\n\nImprove what is confusing.\n\nDefine where human judgment belongs.\n\nThen automate the parts that are predictable, repeated, and safe.\n\nAutomation can remove unnecessary work.\n\nIt can improve consistency.\n\nIt can help good systems serve more people.\n\nBut it should never be used to avoid understanding the work itself.\n\n***\n\n### Reflection Questions\n\nThink about something you would like to automate:\n\n* Can I explain the current process clearly from beginning to end?\n* Have we performed it manually enough to understand the exceptions?\n* What information does the process require?\n* Where are decisions being made, even if we have never written them down?\n* Which steps are predictable and repeatable?\n* Which steps require human judgment, empathy, or approval?\n* What should cause the automation to stop and ask for help?\n* How will we know whether it is producing a better experience?\n* Can someone pause or correct it if something goes wrong?\n* What meaningful work should receive the time the automation saves?\n\nThe best automation begins with a process someone understands well enough to explain.\n";
const TAKEAWAY = "Do not automate a process simply because technology makes it possible. Understand the work, test it with people, and improve the system before asking AI to repeat it automatically.";
const SEO_TITLE = "When to Automate a Small Business Process: Start With Understanding | NTA Knowledge Library";
const CANONICAL = "https://newtechadvertising.com/knowledge/ai-foundations/automation-comes-after-understanding";
const LESSON_ID = 6;
const PREVIOUS_PATH = "/knowledge/ai-foundations/a-prompt-is-the-beginning-of-a-conversation";
const NEXT_PATH = "/knowledge/ai-foundations/building-your-first-ai-teammate";
const RELATED_LESSONS = [
  {
    "title": "Every System Produces Exactly What It Was Designed to Produce",
    "description": "Why your current results are a direct reflection of your current operational structure.",
    "path": "/knowledge/business-foundations/every-system-produces-exactly-what-it-was-designed-to-produce"
  },
  {
    "title": "Documenting a Process Makes Knowledge Repeatable",
    "description": "A process captures how the business moves from one point to another. But a useful process should do more than list steps. It should preserve the thinking behind those steps.",
    "path": "/knowledge/turning-what-a-business-knows-into-an-asset/documenting-a-process-makes-knowledge-repeatable"
  }
];

export default function NativeLessonPage047() {
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

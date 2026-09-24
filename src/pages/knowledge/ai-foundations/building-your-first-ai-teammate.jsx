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
const TITLE = "Building Your First AI Teammate";
const LESSON_PATH = "/knowledge/ai-foundations/building-your-first-ai-teammate";
const COLLECTION_PATH = "/knowledge/ai-foundations";
const COLLECTION_TITLE = "AI Foundations";
const LESSON_NUMBER = 7;
const READING_TIME = "7–9 min read";
const LEVEL = "Beginner";
const AUTHOR_LABEL = "Your Digital Growth Guide™";
const PREVIOUS_LABEL = "Previous Lesson: Automation Comes After Understanding";
const NEXT_LABEL = "Next Lesson: When Artificial Intelligence Tells You You’re Different";
const PUBLISHED_DATE = "2026-07-15";
const MODIFIED_DATE = "2026-07-23";
const READER_RESPONSE = null;
const DESCRIPTION = "Bring the principles of AI Foundations together by giving AI one clear, useful job with the right context, boundaries, and human oversight.";
const CONTENT = "\n### You Know Enough to Begin\n\nAfter learning about AI, it is easy to feel like there is still one more thing you need to understand before you can use it.\n\nAnother tool.\n\nAnother course.\n\nAnother video.\n\nAnother list of prompts.\n\nAnother expert explaining what is coming next.\n\nThere will always be more to learn.\n\nAI will continue changing.\n\nThe tools will continue changing.\n\nBut you now understand the principles that matter most.\n\nAI isn’t magic.\n\nThe work comes before the tool.\n\nAI needs context.\n\nJudgment remains human.\n\nA prompt begins a conversation.\n\nAutomation comes after understanding.\n\nThat is enough to begin.\n\nNot with everything.\n\nWith one useful job.\n\n### Don’t Start by Building an AI Department\n\nYou do not need an AI strategy for every part of your business today.\n\nYou do not need ten AI employees.\n\nYou do not need a complicated automation connecting every piece of software you own.\n\nYou need one small experience that helps you learn what working with AI actually feels like.\n\nChoose something real.\n\nSomething useful.\n\nSomething you understand.\n\nSomething you perform often enough to evaluate.\n\nYour first AI teammate might help:\n\n* Summarize recorded customer conversations\n* Draft follow-up emails\n* Organize frequently asked questions\n* Turn meeting notes into action items\n* Prepare a weekly social media outline\n* Review customer feedback for recurring themes\n* Create a first draft from your spoken ideas\n* Compare two versions of a proposal\n* Organize information for an upcoming appointment\n\nThe job does not need to be impressive.\n\nIt needs to be helpful.\n\n### Give the Teammate a Job Description\n\nIf you hired a person without explaining their job, you would create frustration for everyone involved.\n\nThe same thing happens with AI.\n\nBefore choosing a tool or writing a long prompt, describe the job in plain language.\n\nFor example:\n\n“This AI teammate helps me follow up after prospect conversations. It reviews my notes, identifies what the prospect is trying to accomplish, prepares a short summary, drafts a warm follow-up email in my voice, and lists any promises I made. I review everything before it is sent.”\n\nThat short description answers several important questions.\n\n* What work is being done?\n* Who is it for?\n* What information will be used?\n* What result should be produced?\n* Where does human review happen?\n* What is outside the AI’s authority?\n\nThe job becomes clearer before technology touches it.\n\n### Define What Success Looks Like\n\nA teammate cannot succeed if success has never been defined.\n\nDo you want to save time?\n\nReduce missed details?\n\nImprove consistency?\n\nRespond more quickly?\n\nPreserve knowledge?\n\nPrepare better for conversations?\n\nCommunicate more clearly?\n\n“Use AI” is not a useful goal.\n\n“Reduce the time required to prepare a customer follow-up while preserving a personal review” is much clearer.\n\nSo is:\n\n“Make sure every promise made during a sales conversation appears in the follow-up notes.”\n\nOr:\n\n“Turn one recorded conversation into a useful article draft without losing Rick’s voice.”\n\nA clear outcome helps you decide whether the AI is helping.\n\nWithout that, you may produce more activity without knowing whether anything improved.\n\n### Create a One-Page Pilot Brief\n\nThe earlier lessons explain context, boundaries, conversation, judgment, and automation separately. This lesson is where you put them together. Do not write another long strategy document. Create a one-page pilot brief with six answers:\n\n1. **Job:** What single task will the AI help perform?\n2. **Input:** What approved information will it receive?\n3. **Output:** What exactly should it prepare?\n4. **Boundary:** What must it never decide, send, or publish?\n5. **Reviewer:** Who checks the work and owns the result?\n6. **Measure:** What improvement are you looking for?\n\nFor a follow-up assistant, the brief might say that AI receives an approved conversation transcript, prepares a summary and email draft, never sends anything, and is reviewed by the owner. Success might mean fewer missed promises and twenty minutes saved after each meeting.\n\nThat is enough structure to begin a real pilot.\n\n### Run Ten Real Tests\n\nImaginary examples are useful for setup, but they do not reveal how the process behaves in daily work. Run the teammate on ten real tasks you already understand.\n\nKeep a simple scorecard for each test:\n\n* Did it capture the important information?\n* Did it invent, assume, or omit anything?\n* Did the result sound appropriate for the business?\n* How much review or rewriting was required?\n* Did it save time or create more work?\n* Would the result have caused a problem if nobody had checked it?\n\nTen tests are usually enough to expose a pattern. One poor result may be an unusual case. The same mistake three times points to a problem in the job, information, instruction, or boundary.\n\n### Keep an Exception List\n\nDo not try to force every situation into the normal process. Write down the cases that need a person.\n\nAn emotional customer, a missing promise, conflicting information, a legal or financial claim, an unusual price request, or a situation involving private information may belong on the exception list. When one appears, the teammate should stop and flag it.\n\nThis list is one of the most valuable results of the pilot. It tells you where routine assistance ends and human attention begins.\n\n### Review the Pilot Before You Expand It\n\nAt the end of the pilot, decide among four honest outcomes:\n\n* **Keep it:** The job is useful and dependable with the current review.\n* **Improve it:** The job is useful, but one recurring weakness needs correction.\n* **Narrow it:** Part of the job works, but the original scope was too broad.\n* **Stop it:** The process adds risk or effort without enough benefit.\n\nStopping a poor pilot is not failure. It prevents a weak process from becoming an expensive system. If the pilot works, document the brief, examples, exception list, scorecard, and approval step before adding another job or any automation.\n\n### What I Built First\n\nWhen AI entered my life, I did not begin with a perfectly designed operating system.\n\nI began with conversations.\n\nI brought ideas I had carried for years.\n\nI explained what I believed.\n\nI corrected what sounded wrong.\n\nI asked questions.\n\nI connected business lessons, stories, systems, and unfinished dreams.\n\nOne conversation became a document.\n\nThe document became part of a larger system.\n\nThe system began helping me see how fifty years of experience could become something useful to other people.\n\nEventually, I realized I was not simply building an AI-powered marketing company.\n\nI was building a school for business owners.\n\nAI helped me build it.\n\nBut it could only help because I remained in the conversation.\n\nI supplied the life.\n\nThe experience.\n\nThe values.\n\nThe questions.\n\nThe judgment.\n\nAI helped me organize and build from them.\n\nThat is what a good AI teammate can do.\n\n### The Lesson\n\nYour first AI teammate does not need to be remarkable.\n\nIt needs a clear job.\n\nA meaningful purpose.\n\nThe right context.\n\nUseful examples.\n\nDefined boundaries.\n\nHuman judgment.\n\nA way to measure the result.\n\nAnd an opportunity to improve.\n\nBegin with one job you understand.\n\nWork alongside AI.\n\nCorrect it.\n\nTeach it.\n\nObserve what it produces.\n\nThen decide what should happen next.\n\nYou are not trying to replace yourself.\n\nYou are learning how to extend what you know, preserve what your business has learned, and create more time for the work only people can do.\n\n***\n\n### Reflection Questions\n\nBefore building your first AI teammate, ask yourself:\n\n* What is one repeated job I understand well enough to explain?\n* Why would improving this job matter?\n* What result would tell me the AI is genuinely helping?\n* What context and examples would it need?\n* What information should it not receive?\n* What actions may it take?\n* What actions must require human approval?\n* What mistakes would create the greatest risk?\n* When should it stop and ask for help?\n* Who will remain responsible for the result?\n* How will I document what we learn?\n* If this process saves time, where should that time be reinvested?\n\nDo not begin by asking how much AI you can add.\n\nBegin by asking where one thoughtful teammate could make the work better.\n\n***\n\n### Completing the Core Foundations\n\nYou have now completed the seven core lessons in AI Foundations. They give you a practical base:\n\n* AI is powerful, but it is not magic.\n* The work comes before the tool.\n* Context makes AI useful.\n* Judgment and responsibility remain human.\n* Prompting is a conversation.\n* Automation follows understanding.\n* A dependable AI teammate begins with one clearly defined job.\n\nYou do not need to master every AI tool. Begin thoughtfully with one job, one measured pilot, and one improvement at a time.\n\nThe next set of lessons forms **AI in Practice**. They move from instruction into Rick’s experience, perspective, and the larger human questions that appeared while he was building with AI.\n\n**Next step:** Complete the AI Teammate Builder, begin an NTA Growth Conversation, or continue to AI in Practice.\n";
const TAKEAWAY = "Your first AI teammate does not need to transform your entire business. Give it one useful job, teach it what it needs to know, keep human judgment involved, and improve the process through experience.";
const SEO_TITLE = "How to Build Your First AI Teammate for Small Business | NTA Knowledge Library";
const CANONICAL = "https://newtechadvertising.com/knowledge/ai-foundations/building-your-first-ai-teammate";
const LESSON_ID = 7;
const PREVIOUS_PATH = "/knowledge/ai-foundations/automation-comes-after-understanding";
const NEXT_PATH = "/knowledge/ai-foundations/when-ai-tells-you-youre-different";
const RELATED_LESSONS = [
  {
    "title": "AI Becomes More Valuable When It Learns From the Business",
    "description": "Generic AI produces generic results. Documented experience gives AI the context it needs to become relevant, consistent, and genuinely helpful.",
    "path": "/knowledge/turning-what-a-business-knows-into-an-asset/ai-becomes-more-valuable-when-it-learns-from-the-business"
  },
  {
    "title": "AI Is My Team, Not My Replacement",
    "description": "How to properly frame the role of Artificial Intelligence in a local service business.",
    "path": "/knowledge/business-foundations/ai-is-my-team-not-my-replacement"
  }
];

export default function NativeLessonPage048() {
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

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
const TITLE = "AI Can Assist Judgment—It Cannot Own It";
const LESSON_PATH = "/knowledge/ai-foundations/ai-can-assist-judgment-it-cannot-own-it";
const COLLECTION_PATH = "/knowledge/ai-foundations";
const COLLECTION_TITLE = "AI Foundations";
const LESSON_NUMBER = 4;
const READING_TIME = "9–10 min read";
const LEVEL = "Beginner";
const AUTHOR_LABEL = "Your Digital Growth Guide™";
const PREVIOUS_LABEL = "Previous Lesson: AI Needs Context Before It Can Be Helpful";
const NEXT_LABEL = "Next Lesson: Why AI Sometimes Gives You the Wrong Answer";
const PUBLISHED_DATE = "2026-07-15";
const MODIFIED_DATE = "2026-07-23";
const READER_RESPONSE = null;
const DESCRIPTION = "AI can organize information, identify patterns, and suggest possible actions. But decisions involving people, values, risk, and responsibility still require human judgment.";
const CONTENT = "\n### A Good Answer Is Not Always the Right Decision\n\nAI can produce an impressive answer in seconds.\n\nIt can compare options.\n\nList advantages and disadvantages.\n\nFind patterns.\n\nSummarize information.\n\nRecommend a course of action.\n\nSometimes the answer is so polished that it feels complete.\n\nBut a good answer and the right decision are not always the same thing.\n\nThe right decision may depend on things AI cannot fully see.\n\nA customer’s history.\n\nAn employee’s circumstances.\n\nA promise made during an earlier conversation.\n\nThe reputation of the business.\n\nThe effect on a family.\n\nThe cost of being wrong.\n\nWhat you believe is fair.\n\nThose things require judgment.\n\nAI can assist that judgment.\n\nIt should not own it.\n\n### Business Has Never Been Just About Information\n\nBusiness owners make decisions every day without having perfect information.\n\nShould I hire this person?\n\nShould I trust this customer?\n\nShould I extend more credit?\n\nShould I spend money on this idea?\n\nShould I keep working with this vendor?\n\nShould I apologize even if I believe I was technically right?\n\nShould I recommend the more expensive service—or tell the customer they don’t really need it?\n\nData can help answer those questions.\n\nExperience can help.\n\nAI can help.\n\nBut eventually, someone must decide.\n\nAnd the person making that decision must be willing to live with the result.\n\nAI cannot do that for us.\n\n### I’ve Made Decisions Both Ways\n\nLooking back over my life, I can see decisions I made thoughtfully.\n\nI asked questions.\n\nI listened.\n\nI considered what the decision might produce.\n\nI tried to understand how it would affect the people involved.\n\nThose decisions were not always perfect, but they were usually made with some wisdom.\n\nI can also see decisions I made because I was afraid.\n\nOr tired.\n\nOr angry.\n\nOr trying to escape.\n\nOr hoping something outside me would solve a problem I had not faced honestly.\n\nThose decisions produced very different results.\n\nThat is one reason judgment matters so much to me now.\n\nA tool can provide more information.\n\nIt cannot decide what kind of person I want to be while using that information.\n\n### AI Does Not Experience Consequences\n\nSuppose AI recommends that a business reduce expenses by eliminating a position.\n\nIt may analyze the numbers correctly.\n\nIt may identify that payroll is high.\n\nIt may even provide a reasonable financial argument.\n\nBut it does not know what it feels like to sit across from someone and tell them their job is ending.\n\nIt does not know that person’s family.\n\nIt does not carry the decision home.\n\nIt does not face the remaining employees the next morning.\n\nIt does not live with the long-term effect on trust.\n\nThat does not mean the recommendation is necessarily wrong.\n\nSometimes hard decisions must be made.\n\nIt means the decision involves more than calculation.\n\nThe owner must consider the numbers and the people.\n\nEfficiency and responsibility.\n\nShort-term survival and long-term trust.\n\nAI can help make the situation clearer.\n\nThe human being must carry the responsibility.\n\n### Patterns Are Helpful, but People Are Not Patterns\n\nAI is very good at finding similarities.\n\nThat can be valuable.\n\nIt may notice that certain leads are more likely to become customers.\n\nIt may identify recurring complaints.\n\nIt may recognize which messages receive more responses.\n\nIt may show that a particular service is becoming less profitable.\n\nThose patterns can help us ask better questions.\n\nBut a pattern is not a person.\n\nIf ten customers behaved one way, the eleventh customer is still an individual.\n\nIf a sales lead resembles people who did not buy, that does not mean the lead should be ignored.\n\nIf an employee’s performance falls, the reason may not appear in the numbers.\n\nPatterns should inform attention.\n\nThey should not become excuses to stop seeing people.\n\n### AI Should Make Decisions More Thoughtful\n\nSome people describe AI as a way to remove humans from decisions.\n\nIn certain routine situations, that may be appropriate.\n\nA system can sort documents.\n\nSchedule a reminder.\n\nRoute a request.\n\nOrganize information.\n\nBut when a decision affects someone’s opportunity, money, health, employment, privacy, safety, or dignity, human review becomes much more important.\n\nThe goal should not be to remove human judgment wherever possible.\n\nThe goal should be to improve human judgment.\n\nAI can help us slow down and consider alternatives.\n\nIt can challenge an assumption.\n\nIt can identify missing information.\n\nIt can ask:\n\n“What else should be considered?”\n\nThat may be one of its most valuable roles.\n\nNot deciding for us.\n\nHelping us make a more informed decision.\n\n### Match the Review to the Consequence\n\nNot every AI-assisted decision carries the same risk. Choosing between three headline ideas is different from deciding whether to extend credit, change an employee’s responsibilities, publish a health claim, or respond to an angry customer.\n\nI would separate the work into three simple levels:\n\n* **Low consequence:** AI can offer options, and a person can choose using ordinary judgment.\n* **Meaningful consequence:** AI can prepare an analysis or recommendation, but the responsible owner or employee reviews the facts before acting.\n* **Serious consequence:** AI may help organize information, but a qualified person must make and document the decision.\n\nThe higher the consequence, the stronger the review should be. That is more useful than saying every AI response needs the same amount of caution.\n\n### Give Every Decision an Owner\n\nWhen several people and systems touch a task, responsibility can become blurry. The AI prepared the recommendation. An automation moved the record. An employee clicked approve. The owner assumed someone else had checked it.\n\nA dependable process names the person who owns the final decision. It also records what information was reviewed, what approval was required, and what should happen if the result needs to be corrected.\n\nThe owner does not have to perform every step. Ownership means someone is answerable for the outcome and has the authority to stop the process.\n\n### Consider Who Lives With the Result\n\nJudgment becomes clearer when we ask who will live with the result. Will a customer receive a confusing promise? Will an employee be treated unfairly? Will the business risk money, trust, safety, or its reputation?\n\nAI can help arrange facts, but it does not bear those consequences. The people involved do. That is why accountability cannot be passed to the tool, even when the tool contributed useful analysis.\n\n### Responsibility Cannot Be Automated\n\nIf an AI-generated message misleads a customer, the business remains responsible.\n\nIf an automated system sends the wrong information, the business remains responsible.\n\nIf AI produces inaccurate advice that we publish without checking, the business remains responsible.\n\nSaying “the AI did it” will not restore someone’s trust.\n\nThe responsibility belongs to the person or organization that chose to use the tool.\n\nThat may sound like a burden.\n\nI see it differently.\n\nResponsibility keeps people at the center.\n\nIt reminds us that technology should serve our values instead of quietly replacing them.\n\n### Create Clear Boundaries\n\nEvery AI teammate should have a defined role.\n\nWhat may it help prepare?\n\nWhat information may it use?\n\nWhat actions may it take automatically?\n\nWhat requires review?\n\nWhat must always be handled by a person?\n\nA content assistant may prepare a first draft but never publish without approval.\n\nA customer-service assistant may answer common questions but pass unusual or emotional situations to a person.\n\nA sales assistant may organize lead information but never decide that someone is unworthy of attention.\n\nA reporting assistant may identify a concern but not make the final business decision.\n\nClear boundaries do not make AI less useful.\n\nThey make it more dependable.\n\n### The Lesson\n\nAI can help us gather information, recognize patterns, compare options, and consider possibilities.\n\nIt can help us see something we might have missed.\n\nBut it does not know what it feels like to live with a decision.\n\nIt cannot accept responsibility.\n\nIt cannot care about a customer, an employee, a family, or a community.\n\nThose responsibilities remain ours.\n\nUse AI to strengthen judgment.\n\nUse it to ask better questions.\n\nUse it to examine assumptions.\n\nUse it to see more clearly.\n\nBut never confuse assistance with authority.\n\nThe final decision—and the responsibility for what it produces—must remain human.\n\n***\n\n### Reflection Questions\n\nThink about the decisions made inside your business:\n\n* Which decisions could benefit from better information or pattern recognition?\n* Which decisions require empathy, experience, or an understanding of consequences?\n* Where might I be tempted to accept an AI recommendation without examining it?\n* What questions should I ask before acting on AI-generated advice?\n* Which AI-assisted actions should always require human approval?\n* What decisions should never be automated in my business?\n* If an AI-supported decision caused harm, who would be responsible?\n* Are my current boundaries clear enough for employees using AI?\n\nAI should help you become a more thoughtful decision-maker—not remove you from the decision.\n";
const TAKEAWAY = "AI can help you see more clearly, but it cannot accept responsibility for what you decide. Judgment and accountability must remain human.";
const SEO_TITLE = "Using AI for Business Decisions Without Giving Up Human Judgment | NTA Knowledge Library";
const CANONICAL = "https://newtechadvertising.com/knowledge/ai-foundations/ai-can-assist-judgment-it-cannot-own-it";
const LESSON_ID = 4;
const PREVIOUS_PATH = "/knowledge/ai-foundations/ai-needs-context-before-it-can-be-helpful";
const NEXT_PATH = "/knowledge/ai-foundations/a-prompt-is-the-beginning-of-a-conversation";
const RELATED_LESSONS = [
  {
    "title": "Why Trust Comes Before Marketing",
    "description": "The fundamental shift in how consumers choose who to hire in the AI era.",
    "path": "/knowledge/business-foundations/why-trust-comes-before-marketing"
  },
  {
    "title": "Trust Means Putting the Relationship Before the Transaction",
    "description": "A transaction can produce revenue today while weakening trust tomorrow. Trust reaches its deepest level when customers believe a business will protect their interests, even when doing so may cost an immediate sale.",
    "path": "/knowledge/how-customers-decide-who-to-trust/trust-means-putting-the-relationship-before-the-transaction"
  }
];

export default function NativeLessonPage045() {
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

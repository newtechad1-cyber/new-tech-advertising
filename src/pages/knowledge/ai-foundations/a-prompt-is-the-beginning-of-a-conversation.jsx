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
const TITLE = "Why AI Sometimes Gives You the Wrong Answer";
const LESSON_PATH = "/knowledge/ai-foundations/a-prompt-is-the-beginning-of-a-conversation";
const COLLECTION_PATH = "/knowledge/ai-foundations";
const COLLECTION_TITLE = "AI Foundations";
const LESSON_NUMBER = 5;
const READING_TIME = "10–12 min read";
const LEVEL = "Beginner";
const AUTHOR_LABEL = "Your Digital Growth Guide™";
const PREVIOUS_LABEL = "Previous Lesson: AI Can Assist Judgment—It Cannot Own It";
const NEXT_LABEL = "Next Lesson: Automation Comes After Understanding";
const PUBLISHED_DATE = "2026-07-15";
const MODIFIED_DATE = "2026-07-28";
const READER_RESPONSE = null;
const DESCRIPTION = "AI can sound confident and still be wrong. Learn how to question, correct, guide, and verify AI through conversation instead of trusting its first answer.";
const CONTENT = "\n### Have You Ever Met Someone Who Thinks They Know Everything?\n\nHave you ever talked to someone who seems to have all the answers?\n\nThey always have an answer.\n\nThey always have an opinion.\n\nAnd they often speak with confidence, whether they understand the whole situation or not.\n\nPeople who act as though they know everything are not usually the people we trust most. Confidence may make an answer sound impressive, but confidence is not the same thing as wisdom.\n\nAI can come across in a similar way.\n\nI do not mean that AI has an attitude, pride, feelings, or a human mind. It does not. But the answer it produces can resemble the behavior of a person who thinks they know everything.\n\nAI is designed to respond. When we ask it a question, it usually tries to give us an answer. It may state that answer clearly and confidently even when it lacks important context, misunderstands what we mean, relies on a weak assumption, or is simply wrong.\n\nThat confidence can fool us.\n\nA polished answer looks finished. A detailed answer looks researched. A fast answer can feel authoritative.\n\nBut none of those things prove that the answer is right.\n\n### Information Is Not the Same as Wisdom\n\nAI can work with an enormous amount of information. That is one of the things that makes it useful.\n\nBut information is not the same as wisdom.\n\nAI has not spent years serving your customers. It has not watched a trusted employee handle a difficult conversation. It has not lived through a bad business decision, repaired a damaged relationship, or learned why one solution works in theory but fails in your town, your industry, or your company.\n\nIt can describe business experience.\n\nIt does not possess your lived business experience.\n\nIt can identify patterns in language and information.\n\nIt does not understand emotion, relationships, responsibility, or common sense in the same way a human being does.\n\nThat is why I keep coming back to this distinction:\n\n**AI may have knowledge, but the business owner brings experience, judgment, context, and wisdom.**\n\nThe two can work together. But they are not interchangeable.\n\n### Why a Confident AI Answer Can Still Be Wrong\n\nSometimes AI gives a poor answer because the question was too general.\n\nSometimes it did not receive enough information about the business.\n\nSometimes it misunderstood what a word, goal, or situation meant.\n\nSometimes the available information is incomplete, outdated, disputed, or unreliable.\n\nSometimes it fills in a missing detail with something that sounds reasonable but is not true.\n\nAnd sometimes it gives a technically correct answer that still does not fit the people, values, risk, timing, or relationships involved in the real decision.\n\nThis is especially important in business. A suggestion about a headline is one thing. Advice that affects money, employees, customers, contracts, health, law, or reputation deserves a much higher level of care.\n\nAI should not be treated as an unquestionable authority.\n\nI think of it as a knowledgeable assistant. It can help me gather ideas, organize information, compare options, find gaps, and see something from another direction. But I remain responsible for deciding whether the answer fits the facts, the business, and the people involved.\n\nThe answer is not to reject AI.\n\nThe answer is to keep the conversation going.\n\n### People Are Afraid of Saying the Wrong Thing\n\nWhen people first begin using AI, they often worry about prompts.\n\nThey hear about prompt engineering.\n\nPrompt libraries.\n\nPrompt formulas.\n\nSpecial words that supposedly unlock better answers.\n\nBefore long, they begin to believe they need to learn a new technical language before they can use AI correctly.\n\nI understand why.\n\nA clear instruction usually produces a better result than a confusing one.\n\nBut I think we have made prompting sound more complicated than it needs to be.\n\nA prompt is simply how you begin the conversation.\n\nIt might be a question.\n\nA request.\n\nAn idea.\n\nA problem.\n\nA paragraph.\n\nA document.\n\nOr even:\n\n“I’m not sure how to explain this yet, but help me think it through.”\n\nYou do not need the perfect prompt before you begin.\n\nYou need enough of a beginning to start working together.\n\n### This Is How I Use AI\n\nMuch of what I build with AI does not begin with a carefully prepared instruction.\n\nIt begins with me talking.\n\nI may have an idea that arrived while I was driving.\n\nA lesson from something that happened years ago.\n\nA problem I noticed in my business.\n\nA connection between two ideas that I cannot fully explain yet.\n\nI tell AI what I am thinking.\n\nSometimes the first result is close.\n\nSometimes it misses completely.\n\nThen I say:\n\n“No, that isn’t what I mean.”\n\nOr:\n\n“That sounds too corporate.”\n\nOr:\n\n“You’re trying to sell the reader. I want to help them understand.”\n\nOr:\n\n“You left out the part that makes this personal.”\n\nOr:\n\n“Ask me questions before you write anything else.”\n\nThat is not a failed prompt.\n\nThat is the work.\n\nThe conversation helps me clarify the idea.\n\n### The First Draft Is Not the Final Answer\n\nAI produces things quickly.\n\nThat speed can make us believe the first response should be finished.\n\nBut speed and completion are not the same thing.\n\nThe first response may be a starting point.\n\nIt gives us something to react to.\n\nWe can see what is missing.\n\nWhat feels wrong.\n\nWhat needs more detail.\n\nWhat sounds generic.\n\nWhat assumption should be corrected.\n\nSometimes I do not know exactly what I want until I see what I do not want.\n\nThat is one reason the conversation matters.\n\nA first draft turns an idea in my head into something I can examine.\n\nThen I can shape it.\n\n### You Already Know How to Do This\n\nImagine asking an employee to prepare a customer letter.\n\nYou might say:\n\n“Write a letter explaining our new maintenance program.”\n\nThe employee returns with a draft.\n\nYou read it and say:\n\n“This is a good beginning, but it sounds too formal.”\n\n“Explain why we created the program.”\n\n“Make the opening more personal.”\n\n“Don’t make it sound like every customer needs it.”\n\n“End by inviting questions instead of pushing for a sale.”\n\nThe employee revises it.\n\nThat process is normal.\n\nYou would not conclude that the employee was useless because the first draft needed direction.\n\nYou were working together.\n\nAI can be used in much the same way.\n\nThe difference is that it can revise the work almost immediately.\n\n### Better Questions Produce Better Work\n\nSometimes the most useful thing AI can do is ask me questions.\n\nIf I say:\n\n“Help me create a plan to follow up with prospects,”\n\nit could immediately generate a plan.\n\nBut I may get something much more useful if it first asks:\n\n* Where do the prospects come from?\n* What have they already received?\n* How long is your typical sales process?\n* What questions do they usually ask?\n* How personal should the follow-up be?\n* What action do you want them to take?\n* What kind of communication would feel too aggressive?\n\nThose questions reveal missing context.\n\nThey also help me think.\n\nThat is why one of my favorite instructions is:\n\n“Before you answer, ask me the questions you need to understand this better.”\n\nThat simple request can turn a generic response into a useful working conversation.\n\n### Correction Is Not Criticism\n\nSome people feel uncomfortable correcting AI.\n\nThey try to be polite.\n\nOr they assume that if the answer was poor, they must have asked the question incorrectly.\n\nYou can be direct.\n\n“This is too long.”\n\n“This doesn’t sound like me.”\n\n“You made an assumption that isn’t true.”\n\n“The timeline is wrong.”\n\n“You are using language my customers would not understand.”\n\n“This feels like a sales pitch.”\n\n“Go back to what I originally said.”\n\nClear correction improves the work.\n\nIt also protects your voice.\n\nAI does not have feelings to hurt when you reject a draft.\n\nYou are providing direction.\n\n### What to Say When an AI Answer Does Not Feel Right\n\nYou do not need technical language to challenge an AI answer. Talk to it in the same plain language you would use with a knowledgeable assistant whose work needs to be reviewed.\n\nHere are useful ways to continue the conversation:\n\n* **“What assumptions are you making?”**\n* **“What information might you be missing?”**\n* **“Explain why you reached that conclusion.”**\n* **“Give me another interpretation.”**\n* **“What would an experienced small-business owner question about this?”**\n* **“How confident are you in this answer?”**\n* **“Separate what you know from what you are assuming.”**\n* **“This does not fit my experience. Let’s reconsider it.”**\n\nYou can also ask:\n\n* “Which parts of this should I verify before acting?”\n* “What evidence would change your conclusion?”\n* “Show me the strongest argument against this recommendation.”\n* “Ask me the questions you need before giving me another answer.”\n\nThese are not tricks or magic prompt formulas. They are normal questions.\n\nThey turn a one-way answer into a working conversation.\n\nThey also slow us down long enough to think.\n\nThe smartest people I know keep asking questions. The people who think they know everything usually stop asking them.\n\nThat applies to the person using AI too. Our responsibility is not only to question the machine. We should be willing to question our own assumptions, admit what we do not know, and change direction when the evidence tells us we should.\n\n### Verify What Matters Before You Act\n\nNot every AI response needs a research project.\n\nIf AI gives you five possible names for a newsletter section, you can use your judgment and choose one.\n\nIf it gives you a legal requirement, medical statement, financial figure, product specification, quotation, statistic, customer record, or claim that could affect an important decision, verify it with the original or authoritative source.\n\nAsk AI to identify its sources when that is useful, but do not assume a source exists merely because the answer includes a link or citation. Open the source. Read the relevant part. Check the date. Make sure the source actually supports the claim.\n\nImportant decisions still belong to a person.\n\n### Don’t Let AI Replace Your Thinking\n\nThere is a difference between asking AI to help you think and asking it to think instead of you.\n\nIf I say, “Write something about trust,” AI can produce an article. It may even be a good article, but it may not contain anything I actually learned.\n\nA better beginning is:\n\n“I have learned that the best client relationships started when someone offered me enough trust to begin, and I worked to earn enough trust to continue. Help me explore what that means.”\n\nNow the work has a foundation. The idea came from experience, and AI helps me develop it. The goal is not to produce more words. The goal is to communicate something worth understanding.\n\n### Conversation Helps Preserve Voice\n\nMy voice is important to me, not because every sentence needs to sound exactly the same, but because the voice carries the values behind the words. I do not want to sound like a corporation, frighten business owners into buying something, or pretend I have every answer. I want people to feel like we are sitting across the table, talking honestly about their business.\n\nAI cannot protect that voice unless I remain part of the conversation.\n\nI have to notice when the work drifts, explain why something does not fit, and bring the conversation back to what I actually believe.\n\nVoice is not protected by one perfect prompt.\n\nIt is protected through continued participation.\n\n### Know When the Conversation Is Finished\n\nAI can keep revising almost forever.\n\nThere is always another version, another headline, another idea, or another way to say the same thing.\n\nAt some point, you must decide:\n\n“This says what I mean.”\n\n“This is good enough to use.”\n\nOr:\n\n“This is not working. I need to step away and think.”\n\nKnowing when to stop is part of judgment. The goal is not perfection. The goal is useful, honest work.\n\n### The Lesson\n\nA prompt is not a magic command. It is the beginning of a working conversation.\n\nYou provide the idea, purpose, experience, and context. AI responds. You evaluate, correct, clarify, add examples, ask questions, and continue until the work says what you mean and serves the person it was created for.\n\nThe quality of the result does not depend only on how cleverly you wrote the first prompt.\n\nIt depends on how thoughtfully you participated in the conversation that followed.\n\n### Continue Learning\n\nThis lesson works together with three other parts of the NTA Knowledge Library:\n\n* [AI Needs Context Before It Can Be Helpful](/knowledge/ai-foundations/ai-needs-context-before-it-can-be-helpful)\n* [AI Can Assist Judgment—It Cannot Own It](/knowledge/ai-foundations/ai-can-assist-judgment-it-cannot-own-it)\n* [AI Does Not Have to Be a Monster](/knowledge/ai-foundations/ai-does-not-have-to-be-a-monster)\n\nYou can also explore the complete [AI Foundations collection](/knowledge/ai-foundations) or learn how this teaching fits the [Practical AI for Small Business book](/practical-ai-for-small-business).\n\n***\n\n### Reflection Questions\n\nThink about how you currently communicate with AI:\n\n* Am I expecting the first response to be the finished result?\n* Do I correct AI when something feels inaccurate, generic, or unlike me?\n* What values or expectations do I need to explain more clearly?\n* Could I ask AI to question me before it begins the work?\n* Am I giving AI an idea from my experience—or asking it to fill empty space with words?\n* How will I recognize when the result is accurate, useful, and ready?\n* Am I using AI to strengthen my thinking or avoid doing the thinking?\n\nYou do not need to become a prompt engineer.\n\nYou need to remain an active participant in the work.\n";
const TAKEAWAY = "AI may have knowledge, but the business owner brings experience, judgment, context, and wisdom. Treat AI as a knowledgeable assistant: question it, correct it, and verify important facts before you act.";
const SEO_TITLE = "Why AI Sometimes Gives You the Wrong Answer | NTA | NTA Knowledge Library";
const CANONICAL = "https://newtechadvertising.com/knowledge/ai-foundations/a-prompt-is-the-beginning-of-a-conversation";
const LESSON_ID = 5;
const PREVIOUS_PATH = "/knowledge/ai-foundations/ai-can-assist-judgment-it-cannot-own-it";
const NEXT_PATH = "/knowledge/ai-foundations/automation-comes-after-understanding";
const RELATED_LESSONS = [
  {
    "title": "AI Needs Context Before It Can Be Helpful",
    "description": "AI may know a great deal about business in general, but it does not automatically understand your business. Useful results begin by providing the right context.",
    "path": "/knowledge/ai-foundations/ai-needs-context-before-it-can-be-helpful"
  },
  {
    "title": "AI Does Not Have to Be a Monster",
    "description": "A respectful way to help people move from fear and uncertainty about AI toward one small, safe, practical experience—without pressure or loss of control.",
    "path": "/knowledge/ai-foundations/ai-does-not-have-to-be-a-monster"
  }
];

export default function NativeLessonPage046() {
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

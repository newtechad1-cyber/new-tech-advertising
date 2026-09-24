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
const TITLE = "I See Artificial Intelligence Differently";
const LESSON_PATH = "/knowledge/ai-foundations/i-see-artificial-intelligence-differently";
const COLLECTION_PATH = "/knowledge/ai-foundations";
const COLLECTION_TITLE = "AI Foundations";
const LESSON_NUMBER = 11;
const READING_TIME = "10–12 min read";
const LEVEL = "Beginner";
const AUTHOR_LABEL = "Your Digital Growth Guide™";
const PREVIOUS_LABEL = "Previous Lesson: From Conversation to a Working Business System";
const NEXT_LABEL = "Next Lesson: AI Does Not Have to Be a Monster";
const PUBLISHED_DATE = "2026-07-15";
const MODIFIED_DATE = "2026-07-23";
const READER_RESPONSE = null;
const DESCRIPTION = "Why a useful approach to AI begins with people, purpose, trust, and the larger business system—not code, novelty, or another disconnected tool.";
const CONTENT = "\n### Most AI Conversations Begin With the Technology\n\nMost conversations about artificial intelligence begin with what it can do.\n\nIt can write.\n\nIt can create images.\n\nIt can analyze information.\n\nIt can automate work.\n\nIt can build software.\n\nIt can create applications faster than most people imagined possible only a few years ago.\n\nAll of that is remarkable.\n\nBut it is not where I begin.\n\nI begin with people.\n\nI begin with the business owner who is overwhelmed by too many disconnected tools.\n\nI begin with the employee who holds years of knowledge that has never been written down.\n\nI begin with the customer who does not want to be treated like a number.\n\nI begin with the family whose stories and lessons may disappear if no one takes the time to preserve them.\n\nI begin with the person who knows something important but has never been able to organize or express it clearly.\n\nThat is why I see artificial intelligence differently.\n\nThis is not another lesson about how to prompt, correct, or supervise AI. It is my point of view about what the technology should be for.\n\n### I Am More Interested in the Big Picture\n\nMany people in the AI world are naturally interested in the technology itself.\n\nThey want to understand the models, write code, connect systems, build agents, create applications, and test the limits of what the technology can accomplish.\n\nThat work matters. We need people who know how to build the tools.\n\nBut my mind usually goes somewhere else.\n\nI want to know:\n\n* What problem are we actually trying to solve?\n* Who is this supposed to help?\n* What is already working that should not be disturbed?\n* What knowledge needs to be preserved?\n* What will happen to the customer relationship?\n* What new responsibility does this create?\n* Does this make the work clearer, or merely more complicated?\n* Will this system serve people, or will people eventually be forced to serve the system?\n\nThose are the questions that interest me most.\n\nI am not primarily fascinated by code.\n\nI am fascinated by how all the pieces fit together.\n\n### The Five Tests I Use\n\nI do not judge an AI idea by how advanced it sounds. I use five practical tests:\n\n1. **Purpose:** Does it solve a problem people actually have?\n2. **Clarity:** Will the people using it understand what it does and what happens next?\n3. **Trust:** Does it communicate honestly and preserve accountability?\n4. **Relationship:** Does it help the business listen, remember, and respond—or merely produce more messages?\n5. **Burden:** Does it remove needless work, or create another system the owner must feed and manage?\n\nAn idea can be technically impressive and still fail all five tests. It can also be simple and pass them beautifully.\n\nFor example, an automatic follow-up that sends a generic sales sequence may create more activity while weakening trust. A smaller system that reminds the owner what was promised and prepares a personal draft may save less time, but create a much better relationship.\n\nThat is the difference between using technology because it is available and using it because it serves a worthwhile purpose.\n\n### Why Trust Matters More Now\n\nPeople are becoming increasingly unsure about what they see and hear.\n\nThey do not always know whether a message was written by a person.\n\nThey do not know whether an image is real.\n\nThey do not know whether the person contacting them understands their situation or merely placed their name into an automated sequence.\n\nAs artificial intelligence becomes more common, trust becomes more valuable—not less.\n\nBusinesses will not build that trust by pretending they do not use technology.\n\nThey will build it through honesty.\n\nThey will explain how technology is being used.\n\nThey will remain responsible for the results.\n\nThey will allow human judgment to overrule automation.\n\nThey will communicate like people rather than machines.\n\nThey will make it clear that the customer is still dealing with someone who listens, thinks, cares, and can be held accountable.\n\nThat is the standard I want for my own work.\n\n### I Have Seen Business Done the Wrong Way\n\nPart of my philosophy comes from experience.\n\nI have been sold products and services that were not right for me.\n\nI have seen businesses promise more than they could deliver.\n\nI have watched companies focus on closing the sale while ignoring whether the customer would actually benefit.\n\nI have seen owners become trapped in tools they did not understand and systems that did not fit their businesses.\n\nI have also made mistakes of my own.\n\nThose experiences shaped me.\n\nThey created a strong desire in me to find a better way to do business.\n\nI want to understand before I recommend.\n\nI want to ask questions before offering answers.\n\nI want to protect what is already working.\n\nI want to explain what something can and cannot do.\n\nI want the person I am helping to understand what we are building together.\n\nAnd I want technology to be used in a way that respects the people affected by it.\n\nThat does not make me better or wiser than anyone else.\n\nIt simply explains why I approach the work the way I do.\n\n### Artificial Intelligence Needs Enduring Principles\n\nTechnology changes quickly.\n\nThe principles that make work trustworthy do not.\n\nHonesty still matters.\n\nResponsibility still matters.\n\nListening still matters.\n\nUnderstanding the customer still matters.\n\nKeeping promises still matters.\n\nProtecting people’s information still matters.\n\nAdmitting what we do not know still matters.\n\nDoing what is right for the person—not merely what is profitable for the seller—still matters.\n\nNo matter how powerful artificial intelligence becomes, it will still need people who are willing to apply those principles.\n\nThat is where I believe my role belongs.\n\nI do not need to be the person who understands every line of code.\n\nI need to understand the larger purpose well enough to help ensure that the code, tools, systems, and processes are serving the right outcome.\n\n### AI Can Help Us Become More Human\n\nUsed carelessly, artificial intelligence can fill the world with words no one truly means. It can imitate relationships, remove responsibility, manipulate attention, and make efficiency seem more important than people.\n\nBut that is not the only possible future.\n\nArtificial intelligence can help a business owner preserve knowledge accumulated over decades.\n\nIt can help a family record stories before they disappear.\n\nIt can help someone untangle thoughts they have carried for years but never knew how to express.\n\nIt can help us see connections, ask better questions, and turn lived experience into something another person can understand and use.\n\nThe wisdom does not come from the machine.\n\nThe wisdom comes from life—from experience, failure, faith, relationships, questions, work, love, and time.\n\nThe technology can help us gather it, examine it, organize it, and communicate it more clearly.\n\nIt does not have to replace a human voice.\n\nUsed well, it can help a person hear and express that voice more clearly.\n\n### The Better Question\n\nMuch of the world is asking:\n\n> What can we build with artificial intelligence?\n\nThat is an important question.\n\nBut it is not the first question I would ask.\n\nI would ask:\n\n* What are we trying to make better?\n* What human problem are we solving?\n* What knowledge are we protecting?\n* What relationship are we strengthening?\n* What responsibility are we accepting?\n* What kind of business will this help us become?\n\nAnd ultimately:\n\n> What kind of people will we become through the way we choose to use this technology?\n\nThat is the difference in my approach.\n\nI am not interested in artificial intelligence merely because it is new.\n\nI am interested in what it can help us understand, preserve, improve, and pass forward.\n\nThe technology may be new.\n\nThe purpose behind using it should remain deeply human.\n\n***\n\n### Reflection Questions\n\n* When I consider an AI tool, do I begin with its features or with the human problem I need to solve?\n* What knowledge in my business could disappear if it is not preserved?\n* Where has technology created more complexity instead of less?\n* Which customer relationships should AI support but never replace?\n* What principles must remain true no matter how the technology changes?\n* How will I remain responsible for work created or assisted by AI?\n* What could AI help me understand or preserve—not merely produce faster?\n\n### Try This With AI\n\nBegin with:\n\n“I do not want to start with an AI tool. Help me understand the larger picture first. Ask me who I am trying to serve, what problem I am solving, what already works, what knowledge needs to be preserved, what relationships could be affected, and what decisions must remain human.”\n  ";
const TAKEAWAY = "AI should begin with the human problem, the knowledge worth preserving, and the relationship worth strengthening. The technology serves the purpose—not the other way around.";
const SEO_TITLE = "A Practical Way to Think About AI for Small Business | NTA Knowledge Library";
const CANONICAL = "https://newtechadvertising.com/knowledge/ai-foundations/i-see-artificial-intelligence-differently";
const LESSON_ID = 11;
const PREVIOUS_PATH = "/knowledge/ai-foundations/ai-makes-complicated-work-easier";
const NEXT_PATH = "/knowledge/ai-foundations/ai-does-not-have-to-be-a-monster";
const RELATED_LESSONS = [
  {
    "title": "AI Isn't Magic Either",
    "description": "Artificial intelligence is powerful, but it is not magic. Understanding what it can and cannot do is the first step toward using it wisely.",
    "path": "/knowledge/ai-foundations/ai-isnt-magic-either"
  },
  {
    "title": "AI Is My Team, Not My Replacement",
    "description": "How to properly frame the role of Artificial Intelligence in a local service business.",
    "path": "/knowledge/business-foundations/ai-is-my-team-not-my-replacement"
  }
];

export default function NativeLessonPage052() {
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

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
const TITLE = "Understanding Before Spending";
const LESSON_PATH = "/knowledge/business-foundations/understanding-before-spending";
const COLLECTION_PATH = "/knowledge/business-foundations";
const COLLECTION_TITLE = "Business Foundations";
const LESSON_NUMBER = 5;
const READING_TIME = "8–10 min read";
const LEVEL = "Beginner";
const AUTHOR_LABEL = "Your Digital Growth Guide™";
const PREVIOUS_LABEL = "Previous Lesson: Every System Produces Exactly What It Was Designed to Produce";
const NEXT_LABEL = "Next Lesson: AI Is My Team, Not My Replacement";
const PUBLISHED_DATE = "2026-07-15";
const MODIFIED_DATE = "2026-07-23";
const READER_RESPONSE = null;
const DESCRIPTION = "The importance of education and transparency before investing in growth.";
const CONTENT = "\n### One of the Most Expensive Feelings in Business\n\nThere was a time when I dreaded writing a check for advertising.\n\nNot because I didn't believe marketing mattered.\n\nBecause I didn't know if it would work.\n\nIf you've owned a business, you probably know that feeling.\n\nYou're sitting at your desk.\n\nThe bills are paid—barely.\n\nPayroll is coming.\n\nInventory needs replacing.\n\nThe roof needs fixing.\n\nYour kids need school clothes.\n\nThen someone walks in and says,\n\n\"You should spend more on marketing.\"\n\nMaybe they're right.\n\nMaybe they aren't.\n\nThe problem is, you don't know.\n\nAnd uncertainty is expensive.\n\nI've lived that uncertainty.\n\nThat's one of the reasons NTA exists.\n\n### Business Owners Deserve Better\n\nFor years I watched business owners being asked to make investments they didn't fully understand.\n\nSometimes it was a website.\n\nSometimes search engine optimization.\n\nSometimes social media.\n\nSometimes advertising.\n\nSometimes software.\n\nSometimes AI.\n\nThe recommendations changed.\n\nThe confusion stayed the same.\n\nI don't believe that's the way it should be.\n\nIf you're going to invest your hard-earned money, you deserve to understand what you're investing in.\n\nNot every technical detail.\n\nBut the purpose.\n\nThe strategy.\n\nThe expected outcome.\n\nThe reason behind the recommendation.\n\nUnderstanding doesn't eliminate risk.\n\nBut it gives you confidence that you're making thoughtful decisions instead of desperate ones.\n\n### This Changed My Business\n\nThere was a time when I thought my job was convincing people to buy advertising.\n\nI don't think that anymore.\n\nToday, I think my job is helping business owners understand enough that they can make good decisions.\n\nSometimes those decisions lead to working with me.\n\nSometimes they don't.\n\nI'm comfortable with that.\n\nBecause I'd rather earn a client's trust through understanding than pressure someone into buying something they don't really believe in.\n\nI've discovered that people who understand what they're building become better long-term partners.\n\n### The Difference Between a Purchase and an Investment\n\nA purchase is something you hope works.\n\nAn investment is something you understand.\n\nThat's a simple sentence, but it changed the way I think about business.\n\nWhen I understand why I'm spending money, I feel different.\n\nI'm no longer gambling.\n\nI'm participating.\n\nI'm building.\n\nThat's the experience I want every NTA client to have.\n\n### AI Makes This Even More Important\n\nArtificial intelligence can generate ideas in seconds.\n\nIt can build websites.\n\nWrite articles.\n\nCreate images.\n\nAnalyze data.\n\nAutomate tasks.\n\nThat's exciting.\n\nBut it also makes it easier than ever to spend money on things you don't fully understand.\n\nTechnology should reduce confusion.\n\nNot increase it.\n\nThat's why I spend so much time teaching.\n\nThe goal isn't to slow people down.\n\nThe goal is to help them move forward with confidence.\n\n### What I Hope Every Client Feels\n\nWhen someone finishes a conversation with me, I don't want them thinking,\n\n\"Rick sold me something.\"\n\nI want them thinking,\n\n\"Now I understand my business better than I did before we talked.\"\n\nWhether they become a client or not, that's success.\n\nBecause understanding has value all by itself.\n\nIn fact, I believe it's one of the most valuable things a business owner can gain.\n\nGood decisions usually follow good understanding.\n\n### The Lesson\n\nNever let someone rush you into spending money on something you don't understand.\n\nAsk questions.\n\nLearn the purpose.\n\nUnderstand the strategy.\n\nSee how it fits into the bigger picture.\n\nThen make your decision.\n\nThe best investments aren't made because someone was persuasive.\n\nThey're made because someone finally understood.\n\n***\n\n### Reflection Questions\n\nBefore you spend money on your next marketing idea, ask yourself:\n\n* Do I understand why this is being recommended?\n* What problem is this actually solving?\n* How will I know if it's working?\n* Where does this fit within the larger system of my business?\n* Am I making this decision because I understand it—or because I'm afraid of falling behind?\n\nThose questions have saved me from making poor decisions more than once. They may do the same for you.\n    ";
const TAKEAWAY = "Understanding comes before confidence. Confidence comes before investment.";
const SEO_TITLE = "What to Understand Before Spending on Small Business Marketing | NTA Knowledge Library";
const CANONICAL = "https://newtechadvertising.com/knowledge/business-foundations/understanding-before-spending";
const LESSON_ID = 5;
const PREVIOUS_PATH = "/knowledge/business-foundations/every-system-produces-exactly-what-it-was-designed-to-produce";
const NEXT_PATH = "/knowledge/business-foundations/ai-is-my-team-not-my-replacement";
const RELATED_LESSONS = [
  {
    "title": "Why Understanding Comes Before Advertising",
    "description": "When a business needs more customers, advertising feels like the logical first step. But spending money and creating growth are not the same thing.",
    "path": "/knowledge/truth-about-business-growth/why-understanding-comes-before-advertising"
  },
  {
    "title": "Start With the Work, Not the Tool",
    "description": "The best place to begin with AI is not by choosing a product. It is by understanding the work you are trying to accomplish.",
    "path": "/knowledge/ai-foundations/start-with-the-work-not-the-tool"
  }
];

export default function NativeLessonPage005() {
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

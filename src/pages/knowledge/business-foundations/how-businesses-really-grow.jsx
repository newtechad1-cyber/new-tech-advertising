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
const TITLE = "How Businesses Really Grow";
const LESSON_PATH = "/knowledge/business-foundations/how-businesses-really-grow";
const COLLECTION_PATH = "/knowledge/business-foundations";
const COLLECTION_TITLE = "Business Foundations";
const LESSON_NUMBER = 2;
const READING_TIME = "8–10 min read";
const LEVEL = "Beginner";
const AUTHOR_LABEL = "Your Digital Growth Guide™";
const PREVIOUS_LABEL = "Previous Lesson: Why NTA Exists";
const NEXT_LABEL = "Next Lesson: Marketing Isn't Magic";
const PUBLISHED_DATE = "2026-07-15";
const MODIFIED_DATE = "2026-07-23";
const READER_RESPONSE = null;
const DESCRIPTION = "Understand the difference between unpredictable spikes in activity and compounded digital momentum.";
const CONTENT = "\n### A Question I Wish Someone Had Asked Me Years Ago\n\nIf I asked you,\n\n\"What makes a business grow?\"\n\nWhat would you say?\n\nMost people answer with things like:\n\nBetter advertising\nMore customers\nA better website\nBetter SEO\nMore social media\nMore AI\nBetter salespeople\n\nThose things can certainly help.\n\nBut after spending most of my life in business, I've come to believe they're not the real answer.\n\nBusinesses don't grow because they have better advertising.\n\nThey grow because they build better systems.\n\n### It Took Me Years to See It\n\nWhen I started New Tech Advertising more than a decade ago, I thought my job was helping businesses advertise better.\n\nToday I see it differently.\n\nThe name never changed.\n\nBut my understanding did.\n\nI'm not really teaching advertising.\n\nI'm teaching business owners how growth works.\n\nAdvertising is simply one part of that system.\n\nThat realization changed everything for me.\n\n### Growth Is Never One Thing\n\nA business owner often asks,\n\n\"What should I do next?\"\n\nThe honest answer is almost never,\n\n\"Run more ads.\"\n\nBecause advertising only amplifies what's already there.\n\nIf your website creates confusion...\n\nAdvertising sends more people into confusion.\n\nIf customers don't trust your business...\n\nAdvertising simply introduces more people who won't trust you.\n\nIf you don't follow up with leads...\n\nAdvertising creates more missed opportunities.\n\nAdvertising isn't the engine.\n\nIt's the accelerator.\n\n### Every Healthy Business Builds Trust\n\nThink about the businesses you recommend to your friends.\n\nWhy do you recommend them?\n\nUsually it isn't because of a clever advertisement.\n\nIt's because they earned your trust.\n\nMaybe they answered the phone.\n\nMaybe they solved your problem.\n\nMaybe they treated you fairly.\n\nMaybe they followed through on what they promised.\n\nThose experiences create relationships.\n\nRelationships create referrals.\n\nReferrals create growth.\n\nAdvertising can help people discover you.\n\nTrust is what makes them stay.\n\n### Growth Is a System\n\nThis is why the NTA Operating System begins with understanding—not advertising.\n\nGrowth looks more like this:\n\nPeople discover you.\n\n↓\n\nThey understand what you do.\n\n↓\n\nThey begin to trust you.\n\n↓\n\nThey contact you.\n\n↓\n\nYou solve their problem.\n\n↓\n\nYou continue the relationship.\n\n↓\n\nThey tell someone else.\n\nEvery one of those steps matters.\n\nIf one breaks down, growth slows.\n\nThat's why I say businesses grow through systems, not isolated marketing tactics.\n\n### Where AI Fits\n\nMany people think AI is the system.\n\nIt isn't.\n\nAI is one of the tools inside the system.\n\nIt can help you write.\n\nResearch.\n\nOrganize.\n\nAnalyze.\n\nCreate.\n\nAutomate.\n\nBut AI can't decide what kind of business you want to become.\n\nIt can't build trust for you.\n\nIt can't care about your customers.\n\nThat's still your job.\n\nTechnology is powerful.\n\nCharacter is irreplaceable.\n\n### What I Teach Today\n\nLooking back, I don't think I was ever meant to become just another advertising salesman.\n\nI was trying to understand why some businesses naturally grow while others constantly struggle.\n\nThe answer wasn't hidden inside advertising.\n\nIt was hidden inside the systems that businesses build every day.\n\nThat's what I teach now.\n\nNot because I've mastered business.\n\nBut because I've spent a lifetime learning from both success and failure.\n\nIf my experience helps another business owner avoid years of frustration, then those lessons were worth learning.\n\n### The Lesson\n\nBusinesses don't grow because they find the perfect marketing trick.\n\nThey grow because they consistently build systems that create visibility, understanding, trust, relationships, and continuous improvement.\n\nMarketing supports those systems.\n\nIt doesn't replace them.\n\n***\n\n### Reflection Questions\n\nThink about how someone experiences your business from beginning to end.\n\n* How do people first discover my business?\n* What helps them understand what we do?\n* Where do they begin to trust us?\n* What happens after someone contacts us?\n* Where does the journey from discovery to relationship currently break down?\n* Am I asking advertising to become the engine—or using it to accelerate a healthy system?\n\nYou may not need more activity. You may need one part of the system to work more consistently.\n    ";
const TAKEAWAY = "Advertising can attract attention. Systems create growth.";
const SEO_TITLE = "How Small Businesses Really Grow: From Activity to Momentum | NTA Knowledge Library";
const CANONICAL = "https://newtechadvertising.com/knowledge/business-foundations/how-businesses-really-grow";
const LESSON_ID = 2;
const PREVIOUS_PATH = "/knowledge/business-foundations/why-nta-exists";
const NEXT_PATH = "/knowledge/business-foundations/marketing-isnt-magic";
const RELATED_LESSONS = [
  {
    "title": "Why Growth Is a System",
    "description": "Lasting growth rarely comes from one isolated solution. It comes from several parts of the business working together.",
    "path": "/knowledge/truth-about-business-growth/why-growth-is-a-system"
  },
  {
    "title": "Trust Begins Before the First Conversation",
    "description": "Business owners often believe trust begins when they finally speak with the customer. But by the time customers contact a business, many have already formed an opinion.",
    "path": "/knowledge/how-customers-decide-who-to-trust/trust-begins-before-the-first-conversation"
  }
];

export default function NativeLessonPage002() {
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

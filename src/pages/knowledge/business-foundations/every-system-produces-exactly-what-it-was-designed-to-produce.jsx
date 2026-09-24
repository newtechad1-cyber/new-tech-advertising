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
const TITLE = "Every System Produces Exactly What It Was Designed to Produce";
const LESSON_PATH = "/knowledge/business-foundations/every-system-produces-exactly-what-it-was-designed-to-produce";
const COLLECTION_PATH = "/knowledge/business-foundations";
const COLLECTION_TITLE = "Business Foundations";
const LESSON_NUMBER = 4;
const READING_TIME = "9–10 min read";
const LEVEL = "Beginner";
const AUTHOR_LABEL = "Your Digital Growth Guide™";
const PREVIOUS_LABEL = "Previous Lesson: Marketing Isn't Magic";
const NEXT_LABEL = "Next Lesson: Understanding Before Spending";
const PUBLISHED_DATE = "2026-07-15";
const MODIFIED_DATE = "2026-07-23";
const READER_RESPONSE = null;
const DESCRIPTION = "Why your current results are a direct reflection of your current operational structure.";
const CONTENT = "\n### One Sentence Changed the Way I See Business\n\nOver the years, I've studied marketing, advertising, websites, customer service, leadership, and now artificial intelligence.\n\nFor a long time, they all seemed like separate subjects.\n\nThen one day I realized they all had something in common.\n\nEvery one of them is a system.\n\nAnd every system, whether we realize it or not, produces exactly what it was designed to produce.\n\nThat one realization changed the way I look at almost everything.\n\n### We Often Blame the Wrong Thing\n\nA business owner tells me,\n\n\"My website isn't working.\"\n\nOr,\n\n\"Google doesn't like my business.\"\n\nOr,\n\n\"My advertising isn't producing results.\"\n\nSometimes that's true.\n\nBut more often than not, those things are simply revealing the results of a larger system.\n\nA website doesn't create trust.\n\nIt reflects it.\n\nAdvertising doesn't create a reputation.\n\nIt amplifies the reputation you already have.\n\nGoogle doesn't decide whether your business is trustworthy.\n\nIt looks for signals that suggest whether people already trust you.\n\nThe system is always telling us something.\n\nThe question is whether we're willing to listen.\n\n### Businesses Get the Results They Build\n\nThis can be a difficult lesson because it's easy to believe that outside forces are holding us back.\n\nSometimes they are.\n\nMarkets change.\n\nTechnology changes.\n\nCompetition changes.\n\nLife changes.\n\nBut healthy businesses continually adapt because their systems are designed to learn, improve, and respond.\n\nUnhealthy systems keep producing the same disappointing results while hoping for a different outcome.\n\nThe system isn't broken.\n\nIt's simply doing what it was built to do.\n\n### I Had to Learn This About Myself\n\nThis lesson isn't just about business.\n\nIt's about me.\n\nThere were seasons in my life when I blamed circumstances.\n\nI blamed the economy.\n\nI blamed clients.\n\nI blamed technology.\n\nSometimes those things were real.\n\nBut eventually I had to ask a harder question.\n\n\"What kind of system have I built?\"\n\nThat question changed everything.\n\nInstead of asking,\n\n\"Who's at fault?\"\n\nI began asking,\n\n\"What needs to change?\"\n\nThat's a much more hopeful question.\n\nBecause if a system was built one way, it can be rebuilt another.\n\n### This Is Why I Love AI\n\nPeople are often surprised when I say that AI has made me even more convinced that systems matter.\n\nArtificial intelligence is incredibly powerful.\n\nBut if you give it a confusing goal, you'll usually get a confusing result.\n\nIf you give it poor information, you'll often get poor answers.\n\nIf you ask thoughtful questions, organize your knowledge well, and provide clear direction, it becomes remarkably helpful.\n\nAI didn't teach me the importance of systems.\n\nIt confirmed it.\n\nGood systems help people.\n\nGood systems help businesses.\n\nGood systems even help AI produce better work.\n\n### The NTA Operating System\n\nWhen people ask why I call it the NTA Operating System, this is the reason.\n\nI don't believe businesses grow by collecting random marketing tactics.\n\nThey grow by building connected systems.\n\nVisibility.\n\nEducation.\n\nTrust.\n\nRelationships.\n\nMeasurement.\n\nImprovement.\n\nEach part supports the next.\n\nWhen one part becomes stronger, the entire system becomes healthier.\n\nThat's what we've been building at NTA.\n\nNot a collection of services.\n\nA system designed to help businesses grow with greater understanding and confidence.\n\n### Looking at Your Business Differently\n\nOne of the most rewarding moments I experience is when a business owner stops asking,\n\n\"What advertisement should I buy?\"\n\nand starts asking,\n\n\"What system is producing this result?\"\n\nThat's a completely different conversation.\n\nBecause now we're no longer chasing symptoms.\n\nWe're improving the system itself.\n\nOnce that happens, almost every decision becomes clearer.\n\n### The Lesson\n\nBusinesses rarely produce random results.\n\nThey produce the results their systems are designed to create.\n\nIf you don't like the outcome, don't begin by blaming the people or the tools.\n\nBegin by understanding the system.\n\nThen improve it one step at a time.\n\n***\n\n### Reflection Questions\n\nBefore moving to the next lesson, ask yourself:\n\n* What system in my business is producing results I don't like?\n* Am I trying to fix the symptom instead of improving the system?\n* What is one small improvement I could make this week?\n* Where am I relying on hope instead of having a repeatable process?\n\nYou don't have to answer all of them today. Sometimes the right question is more valuable than a quick answer.\n    ";
const TAKEAWAY = "Every system produces exactly what it was designed to produce. Better systems produce better businesses.";
const SEO_TITLE = "Why Small Business Results Reflect the System Behind Them | NTA Knowledge Library";
const CANONICAL = "https://newtechadvertising.com/knowledge/business-foundations/every-system-produces-exactly-what-it-was-designed-to-produce";
const LESSON_ID = 4;
const PREVIOUS_PATH = "/knowledge/business-foundations/marketing-isnt-magic";
const NEXT_PATH = "/knowledge/business-foundations/understanding-before-spending";
const RELATED_LESSONS = [
  {
    "title": "Every Business Is Already Perfectly Designed",
    "description": "When business results are frustrating, it can feel like a mystery. But results aren't accidents—they are the direct product of how your business currently operates.",
    "path": "/knowledge/truth-about-business-growth/every-business-is-already-perfectly-designed"
  },
  {
    "title": "Documenting a Process Makes Knowledge Repeatable",
    "description": "A process captures how the business moves from one point to another. But a useful process should do more than list steps. It should preserve the thinking behind those steps.",
    "path": "/knowledge/turning-what-a-business-knows-into-an-asset/documenting-a-process-makes-knowledge-repeatable"
  }
];

export default function NativeLessonPage004() {
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

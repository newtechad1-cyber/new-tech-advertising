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
const TITLE = "AI Is My Team, Not My Replacement";
const LESSON_PATH = "/knowledge/business-foundations/ai-is-my-team-not-my-replacement";
const COLLECTION_PATH = "/knowledge/business-foundations";
const COLLECTION_TITLE = "Business Foundations";
const LESSON_NUMBER = 6;
const READING_TIME = "9–10 min read";
const LEVEL = "Beginner";
const AUTHOR_LABEL = "Your Digital Growth Guide™";
const PREVIOUS_LABEL = "Previous Lesson: Understanding Before Spending";
const NEXT_LABEL = "Next Lesson: Why Trust Comes Before Marketing";
const PUBLISHED_DATE = "2026-07-15";
const MODIFIED_DATE = "2026-07-23";
const READER_RESPONSE = null;
const DESCRIPTION = "How to properly frame the role of Artificial Intelligence in a local service business.";
const CONTENT = "\n### When People Ask Me About AI\n\nOne of the questions I hear most often is,\n\n\"Aren't you worried AI is going to replace people?\"\n\nMy answer usually surprises them.\n\nNo.\n\nI'm excited because AI has finally given me the team I've been trying to build for most of my life.\n\nThat doesn't mean I need fewer people.\n\nIt means I can finally accomplish ideas that used to be trapped in my head because I didn't have the resources to build them.\n\n### For Years I Could See More Than I Could Build\n\nThis isn't a criticism of anyone I've worked with.\n\nI've been blessed to work with talented people over the years.\n\nDesigners.\n\nProgrammers.\n\nWriters.\n\nVideo producers.\n\nSalespeople.\n\nBusiness owners.\n\nEach one brought something valuable.\n\nBut there was always a limitation.\n\nIf the programmer was busy...\n\nThe project waited.\n\nIf I couldn't afford the designer...\n\nThe idea stayed in my notebook.\n\nIf I needed five different specialists...\n\nThe cost often became impossible for a small business.\n\nThe vision was there.\n\nThe team wasn't.\n\n### Then AI Changed the Equation\n\nToday I can sit down with an idea and begin building immediately.\n\nI can ask questions.\n\nExplore possibilities.\n\nWrite.\n\nRewrite.\n\nResearch.\n\nDesign.\n\nOrganize.\n\nTest.\n\nImprove.\n\nNot because I suddenly became an expert in everything.\n\nBecause I finally have capable assistants helping me.\n\nThat's how I think about AI.\n\nNot as a replacement for people.\n\nAs a team of specialists working alongside me.\n\n### Every AI Employee Has a Different Job\n\nIf you've followed my work very long, you've probably heard me talk about my AI employees.\n\nI mean that.\n\nOne AI helps me organize ideas.\n\nAnother helps me write.\n\nAnother helps me build software.\n\nAnother reviews code.\n\nAnother helps me think through difficult business problems.\n\nAnother helps me create images.\n\nThey're all incredibly knowledgeable.\n\nBut none of them owns the vision.\n\nThat's still my responsibility.\n\nJust like in any healthy business, every team member has a role.\n\nSomeone still has to lead.\n\n### AI Doesn't Replace Wisdom\n\nOne of the biggest misunderstandings about AI is that knowledge and wisdom are the same thing.\n\nThey aren't.\n\nAI has access to an incredible amount of knowledge.\n\nIt can explain almost anything.\n\nIt can analyze information faster than I ever could.\n\nBut wisdom comes from experience.\n\nFrom making mistakes.\n\nFrom disappointing people and learning how to do better.\n\nFrom earning trust.\n\nFrom rebuilding after failure.\n\nFrom listening.\n\nFrom caring about the outcome.\n\nAI helps me process information.\n\nLife taught me how to use it responsibly.\n\n### Why I Work With AI Instead of Competing Against It\n\nSome people see AI as competition.\n\nI see it as cooperation.\n\nThroughout history, every major tool changed the way people worked.\n\nThe printing press.\n\nElectricity.\n\nComputers.\n\nThe internet.\n\nNone of those eliminated the need for thoughtful people.\n\nThey simply allowed thoughtful people to accomplish more.\n\nI believe AI is doing the same thing.\n\nThe people who learn to work with it will be able to solve problems that once seemed impossible.\n\nThat's the opportunity I see.\n\n### What This Means for My Clients\n\nWhen you work with NTA, you're not hiring one person.\n\nYou're working with a growing team.\n\nI'm still the one asking questions.\n\nListening.\n\nLearning about your business.\n\nMaking recommendations.\n\nBut behind me is a collection of AI tools helping me research, analyze, organize, create, and improve the work.\n\nThat means I can often deliver the quality of a much larger organization while keeping the relationship personal.\n\nThat's something I couldn't honestly say ten years ago.\n\nToday, I can.\n\n### Why This Gives Me Hope\n\nAt nearly seventy years old, many people would expect me to be slowing down.\n\nInstead, I feel like I'm just getting started.\n\nNot because I suddenly have more energy than I did when I was thirty.\n\nBecause I finally have the tools to build the ideas I've carried around for decades.\n\nThat's why I get excited every morning.\n\nThat's why I keep learning.\n\nThat's why I'm building the NTA Knowledge Library.\n\nNot to prove how smart I am.\n\nTo leave behind something useful.\n\nSomething that helps people long after I'm gone.\n\nAI didn't give me that dream.\n\nIt gave me the ability to build it.\n\n### The Lesson\n\nArtificial intelligence is not my replacement.\n\nIt's my team.\n\nThe vision is still human.\n\nThe relationships are still human.\n\nThe responsibility is still human.\n\nAI simply allows me to build more, learn faster, and serve people better than I could have on my own.\n\nThat's the future I want to help other business owners discover.\n\n***\n\n### Reflection Questions\n\nThink about your own business.\n\n* What work are you doing today that AI could help you accomplish more efficiently?\n* What ideas have you postponed because you didn't have the right people or resources?\n* Are you looking at AI as a threat—or as a teammate?\n* If routine work took less of your time, where could you invest your experience and creativity instead?\n\nThose questions aren't really about technology. They're about possibility.\n    ";
const TAKEAWAY = "AI doesn't replace the builder. It gives the builder better tools and a stronger team.";
const SEO_TITLE = "How AI Can Support a Small Business Team Without Replacing People | NTA Knowledge Library";
const CANONICAL = "https://newtechadvertising.com/knowledge/business-foundations/ai-is-my-team-not-my-replacement";
const LESSON_ID = 6;
const PREVIOUS_PATH = "/knowledge/business-foundations/understanding-before-spending";
const NEXT_PATH = "/knowledge/business-foundations/why-trust-comes-before-marketing";
const RELATED_LESSONS = [
  {
    "title": "AI Isn't Magic Either",
    "description": "Artificial intelligence is powerful, but it is not magic. Understanding what it can and cannot do is the first step toward using it wisely.",
    "path": "/knowledge/ai-foundations/ai-isnt-magic-either"
  },
  {
    "title": "AI Can Assist Judgment—It Cannot Own It",
    "description": "AI can organize information, identify patterns, and suggest possible actions. But decisions involving people, values, risk, and responsibility still require human judgment.",
    "path": "/knowledge/ai-foundations/ai-can-assist-judgment-it-cannot-own-it"
  }
];

export default function NativeLessonPage006() {
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

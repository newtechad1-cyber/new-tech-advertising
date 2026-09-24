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
const TITLE = "Free Is Free";
const LESSON_PATH = "/knowledge/what-a-lifetime-in-business-taught-me/free-is-free";
const COLLECTION_PATH = "/knowledge/what-a-lifetime-in-business-taught-me";
const COLLECTION_TITLE = "What a Lifetime in Business Taught Me";
const LESSON_NUMBER = 4;
const READING_TIME = "9 min read";
const LEVEL = "All levels";
const AUTHOR_LABEL = "NTA Point of View";
const PREVIOUS_LABEL = "Previous Lesson: The Gold Is in the Niche. The Business Is in the Connections.";
const NEXT_LABEL = "Next Lesson: AI Didn't Give Me My Experience";
const PUBLISHED_DATE = null;
const MODIFIED_DATE = null;
const READER_RESPONSE = null;
const DESCRIPTION = "What building with limited resources taught me about free tools, value, technology and spending where it matters.";
const CONTENT = "I've always been fascinated by free.\n\nGoogle fascinated me.\n\nHow could they give me a search engine that could find almost anything on the Internet and not charge me to use it?\n\nThen more things started becoming free.\n\nEmail.\n\nStorage.\n\nSoftware.\n\nSocial media.\n\nPublishing tools.\n\nVideo.\n\nAdobe and other technology companies began offering free versions of products alongside paid versions.\n\nAnd I kept wondering:\n\nHow can they afford to give this stuff away?\n\nOf course, free usually has a business model behind it somewhere.\n\nMaybe there's advertising.\n\nMaybe there's a paid version.\n\nMaybe the free product brings enough people into the system that some of them eventually become paying customers.\n\nI understood that.\n\nBut I was interested in the other side of it too.\n\nWhat did free make possible for me?\n\nAnd later:\n\nWhat could it make possible for a small business?\n\n### I Learned to Build With What I Had\n\nI've spent a lot of my life trying to build things without having a lot of money to build them.\n\nSometimes that was by necessity.\n\nIf you've got plenty of money, you can solve a lot of problems by hiring people.\n\nNeed a website?\n\nHire somebody.\n\nNeed advertising?\n\nHire an agency.\n\nNeed graphic design?\n\nHire a designer.\n\nNeed software?\n\nBuy it.\n\nNeed somebody to write something?\n\nHire a writer.\n\nNeed research?\n\nPay somebody to do it.\n\nSmall-business owners don't always have those choices.\n\nI certainly didn't.\n\nSo I learned to ask a different question:\n\nWhat can I do with what I have?\n\nThat question has probably shaped New Tech Advertising as much as anything.\n\n### Free Doesn't Mean Worthless\n\nSomewhere along the way, I think we got the idea that if something doesn't cost very much, it must not be very valuable.\n\nI've learned that's not necessarily true.\n\nSome incredibly powerful technology is free.\n\nOther technology costs $10 or $20 or $50 a month and can do things that would have cost thousands of dollars not very many years ago.\n\nThat doesn't mean every free tool is good.\n\nAnd it doesn't mean the cheapest solution is always the best solution.\n\nI've wasted money trying to save money too.\n\nThere's a difference between being cheap and understanding value.\n\nInexpensive isn't the same thing as cheap.\n\nThat's an important distinction.\n\n### AI Changed the Economics Again\n\nThen artificial intelligence came along.\n\nAnd this is where things became really interesting to me.\n\nSuddenly I could do things that would traditionally have required several different people.\n\nI could research an idea.\n\nTalk through it.\n\nOrganize it.\n\nWrite about it.\n\nBuild a plan around it.\n\nAnalyze information.\n\nWork on a website.\n\nDevelop an image.\n\nCreate a video.\n\nStudy a business.\n\nWork through a problem.\n\nAnd I could do much of that without hiring another person for every individual task.\n\nThat doesn't mean people are no longer valuable.\n\nIt means the economics changed.\n\nA small business can now have access to capabilities that once belonged mostly to businesses with much larger budgets.\n\nThat's a big deal.\n\n### I've Been Building NTA on a Shoestring\n\nNew Tech Advertising itself has been an experiment in this.\n\nI've been building this company without a big pile of investment money.\n\nFor much of this journey, I've been living primarily on Social Security with income from a few clients and putting a few hundred dollars a month into the tools I need to keep building.\n\nThat's reality.\n\nAnd in some ways, I'm glad I've had to build it that way.\n\nBecause it forced me to ask:\n\nDo I really need this?\n\nWhat does this actually do?\n\nIs there already something I'm paying for that can do it?\n\nIs there a free version that is enough for what I need right now?\n\nCan AI help me do this myself?\n\nDoes this save enough time or create enough value to justify the monthly cost?\n\nAnd maybe the most important question:\n\nWhat happens if I stop paying for it?\n\nWhen you're building on a limited budget, recurring expenses matter.\n\nTen dollars here.\n\nTwenty dollars there.\n\nFifty dollars somewhere else.\n\nA hundred dollars for another system.\n\nPretty soon you're spending hundreds or thousands of dollars a month on technology before you've made a dollar from it.\n\nI've learned to pay attention to that.\n\n### You Don't Need Everything on Day One\n\nThis is one place where I think small businesses can get into trouble.\n\nWe see what a large company has and think we need a smaller version of everything they use.\n\nWe don't.\n\nAt least not yet.\n\nMaybe you don't need the expensive customer-management system.\n\nMaybe you don't need five different marketing platforms.\n\nMaybe you don't need complicated automation.\n\nMaybe you don't need a custom piece of software.\n\nMaybe you don't need to pay somebody thousands of dollars to build something before you even know whether your customers will use it.\n\nStart with the problem.\n\nBuild enough to solve it.\n\nUse it.\n\nLearn from it.\n\nThen improve it.\n\nThat's different from trying to build the finished company before the company has had a chance to teach you what it needs.\n\n### Free Gives You Room to Learn\n\nThis may be the part of free that I appreciate the most.\n\nFree gives you room to experiment.\n\nYou can try something.\n\nYou can learn how it works.\n\nYou can discover that you don't need it.\n\nYou can discover that you love it.\n\nYou can find out what features actually matter before you start paying for more features.\n\nThat's especially important with AI because everything is changing so quickly.\n\nI don't want a small-business owner spending thousands of dollars because somebody convinced them they needed the latest AI system.\n\nI would rather help them understand what problem they're trying to solve first.\n\nThen we can find the simplest way to solve it.\n\nSometimes that's free.\n\nSometimes it's inexpensive.\n\nSometimes the right answer costs real money.\n\nThat's okay too.\n\nThe goal isn't free. The goal is value.\n\n### Know What You're Paying For\n\nI've learned this lesson the hard way more than once.\n\nA tool catches my attention.\n\nIt looks like it can do something amazing.\n\nI sign up.\n\nThen another one comes along.\n\nBefore long I've got several tools doing pieces of the same thing.\n\nThat's when I have to go back and look at the system.\n\nWhat job does each tool have?\n\nDo I still need it?\n\nIs something else already doing the same job?\n\nIs it connected to anything?\n\nAm I actually using it?\n\nIs it saving time?\n\nIs it helping produce revenue?\n\nIs it helping me serve somebody better?\n\nIf I can't explain why I'm paying for something, that's a pretty good reason to look at it again.\n\n### Spend Money Where It Matters\n\nBeing careful with money doesn't mean never spending it.\n\nQuite the opposite.\n\nIf I can avoid spending $500 on something I don't need, that gives me $500 to spend somewhere that actually matters.\n\nMaybe that's better equipment.\n\nMaybe it's advertising.\n\nMaybe it's a person.\n\nMaybe it's training.\n\nMaybe it's a better piece of software because now I understand why I need it.\n\nThat's what building on a shoestring has taught me.\n\nDon't spend money just to look like a bigger company.\n\nSpend money to make the business better.\n\n### This Is Why I'm Interested in the Little Guy\n\nThere are companies that can spend tens of thousands of dollars solving a problem.\n\nGood for them.\n\nThat's not the business owner I think about most.\n\nI think about the person who has a good business and a limited budget.\n\nThe restaurant owner.\n\nThe heating contractor.\n\nThe plumber.\n\nThe small retailer.\n\nThe service business.\n\nThe person trying to make payroll, take care of customers, keep employees working and still have something left at the end of the month.\n\nA few hundred dollars matters to that person.\n\nI know because a few hundred dollars matters to me.\n\nThat's one reason I'm so interested in what AI is making possible.\n\nFor the first time, a very small business can begin building capabilities that used to require a much larger organization.\n\nNot because everything suddenly became free.\n\nBecause the cost of doing useful work has changed.\n\n### Free Is Free\n\nI still like free.\n\nIf a good tool will do the job and it costs nothing, I'll use it.\n\nFree is free.\n\nBut that's not really the lesson anymore.\n\nThe lesson is learning to understand what something is worth.\n\nUse free when free does the job.\n\nPay when paying creates real value.\n\nDon't buy technology because everybody else has it.\n\nDon't assume expensive means better.\n\nDon't assume free means worthless.\n\nAnd don't spend money solving a problem you don't actually have.\n\n### NTA Point of View\n\nSmall businesses don't need every tool.\n\nThey need the right capabilities connected to the right problems at the right time.\n\nStart with what you're trying to accomplish.\n\nUse what you already have.\n\nAdd what you actually need.\n\nLearn as you go.\n\nAnd when something free does the job?\n\nFree is free.";
const TAKEAWAY = "The goal isn't free. The goal is value.";
const SEO_TITLE = "Free Is Free | NTA Knowledge Library";
const CANONICAL = "https://newtechadvertising.com/knowledge/what-a-lifetime-in-business-taught-me/free-is-free";
const LESSON_ID = 904;
const PREVIOUS_PATH = "/knowledge/what-a-lifetime-in-business-taught-me/the-gold-is-in-the-niche-the-business-is-in-the-connections";
const NEXT_PATH = "/knowledge/what-a-lifetime-in-business-taught-me/ai-didnt-give-me-my-experience";
const RELATED_LESSONS = [
  {
    "title": "Understanding Before Spending",
    "description": "The importance of education and transparency before investing in growth.",
    "path": "/knowledge/business-foundations/understanding-before-spending"
  },
  {
    "title": "Start With the Work, Not the Tool",
    "description": "The best place to begin with AI is not by choosing a product. It is by understanding the work you are trying to accomplish.",
    "path": "/knowledge/ai-foundations/start-with-the-work-not-the-tool"
  }
];

export default function NativeLessonPage013() {
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

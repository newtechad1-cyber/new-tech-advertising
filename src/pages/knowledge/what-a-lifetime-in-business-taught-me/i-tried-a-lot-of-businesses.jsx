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
const TITLE = "I Tried a Lot of Businesses";
const LESSON_PATH = "/knowledge/what-a-lifetime-in-business-taught-me/i-tried-a-lot-of-businesses";
const COLLECTION_PATH = "/knowledge/what-a-lifetime-in-business-taught-me";
const COLLECTION_TITLE = "What a Lifetime in Business Taught Me";
const LESSON_NUMBER = 2;
const READING_TIME = "7 min read";
const LEVEL = "All levels";
const AUTHOR_LABEL = "NTA Point of View";
const PREVIOUS_LABEL = "Previous Lesson: I Learned Business by Watching People";
const NEXT_LABEL = "Next Lesson: The Gold Is in the Niche. The Business Is in the Connections.";
const PUBLISHED_DATE = null;
const MODIFIED_DATE = null;
const READER_RESPONSE = null;
const DESCRIPTION = "What successes, failures, jobs, opportunities and businesses taught me about how a business actually works.";
const CONTENT = "I've tried a lot of businesses in my life.\n\nSome of them worked for a while. Some got pretty far. Some never really got going.\n\nAnd some just didn't work.\n\nI don't say that with embarrassment anymore. That's part of how I learned business.\n\nI've sold advertising. I've worked retail. I've sold business to business. I've been involved with solar. I worked on building a wholesale cellular-accessories business. I've tried multilevel marketing. I sold phone cards. I sold cards that actually had a little piece of gold in them. I tried Amway. And there were plenty of other opportunities I looked at along the way.\n\nI've lost good jobs and tried going out on my own.\n\nMore than once.\n\nThe first attempts didn't go particularly well.\n\nBut I kept trying things, and I kept watching.\n\nLooking back now, I realize I was getting an education.\n\n### Every Business Taught Me Something\n\nWhen you've been around enough businesses, you begin noticing the same questions showing up in different forms.\n\nWhere do the customers come from?\n\nWhy would somebody buy this?\n\nHow much does it cost to get the customer?\n\nWhat's left after you make the sale?\n\nHow does the salesperson get paid?\n\nHow does the company get paid?\n\nWhat has to happen behind the scenes to deliver what was promised?\n\nHow much inventory has to sit there waiting to be sold?\n\nHow much money goes out before any money comes back?\n\nAnd one of the biggest questions:\n\nDoes this actually work as a business?\n\nSomething can be a good product without being a good business.\n\nSomething can be exciting without being profitable.\n\nSomething can sell and still not produce enough money to support everything required to keep selling it.\n\nI learned pieces of those lessons in different places.\n\n### Cash Flow Really Does Flow\n\nOne thing you learn when you're actually involved in businesses is that money doesn't sit still very long.\n\nThat's why they call it cash flow.\n\nIt flows in, and it flows out.\n\nSometimes remarkably fast.\n\nRetail teaches you that.\n\nRestaurants certainly teach you that.\n\nYou sell something, but that doesn't mean all that money belongs to you.\n\nThere's inventory to replace. Payroll. Rent. Utilities. Insurance. Advertising. Equipment. Repairs. Taxes. And another bill always seems to be waiting somewhere.\n\nThat's very different from looking at a sales number and thinking that's what the business made.\n\nI learned to look at what was happening underneath the sale.\n\n### I Learned From Things That Didn't Work\n\nI've had business ideas that didn't work.\n\nI've been involved in opportunities that looked better at the beginning than they did after I understood them.\n\nI've made mistakes.\n\nI've spent money I probably shouldn't have spent.\n\nI've believed things would work that didn't.\n\nI've also seen things that were beginning to work and then watched circumstances change.\n\nThat's business too.\n\nFailure doesn't automatically make somebody wise. You can fail and learn absolutely nothing.\n\nThe value comes from going back and asking:\n\nWhat happened?\n\nWhy didn't that work?\n\nWas the idea wrong?\n\nWas the timing wrong?\n\nWas there enough money?\n\nWas I trying to do something I wasn't equipped to do yet?\n\nDid customers actually want it?\n\nWas I depending on something or someone that wasn't dependable?\n\nDid I understand the numbers?\n\nDid I understand the people?\n\nThose questions stayed with me.\n\n### Then the Internet Came Along\n\nThe Internet changed how I learned about business.\n\nBefore the Internet, if I wanted to understand a particular kind of business, I might have to know somebody in it, work in it, buy a book about it, attend something, or actually try it myself.\n\nSuddenly I could research businesses from home.\n\nI could look at industries I had never worked in.\n\nI could study products.\n\nI could look at companies and business models.\n\nI could investigate opportunities without necessarily putting money into every one of them.\n\nThat fascinated me.\n\nI could learn about a business without having to start the business.\n\nAnd I did a lot of that.\n\nI've probably learned as much from businesses I never built as from some of the ones I did.\n\n### I Was Collecting Pieces\n\nI didn't know there was going to be a New Tech Advertising someday.\n\nI certainly wasn't following some master plan that eventually led here.\n\nMost of the time, I was trying to make a living.\n\nSometimes I was trying to build something.\n\nSometimes I was trying to recover from something that hadn't worked.\n\nSometimes I was simply curious.\n\nBut I kept collecting pieces.\n\nRetail taught me one thing.\n\nBusiness-to-business sales taught me another.\n\nAdvertising taught me another.\n\nWholesale taught me another.\n\nTrying to build a solar company taught me another.\n\nTechnology businesses taught me another.\n\nDifferent sales organizations and business opportunities gave me a look at different ways companies recruit, sell, compensate people and grow.\n\nThe Internet opened the door to studying thousands more.\n\nOver time, those pieces started fitting together.\n\n### Experience Doesn't Always Look Like Success\n\nI think we sometimes make a mistake when we talk about experience.\n\nWe look at someone's successes and call that experience.\n\nBut experience includes the things that didn't work.\n\nIt includes bad decisions.\n\nIt includes businesses that almost got going.\n\nIt includes jobs you lost.\n\nIt includes opportunities you thought were going somewhere that didn't.\n\nIt includes the times you had to start over.\n\nIf you're paying attention, all of that teaches you.\n\nI'm not suggesting anybody should deliberately go out and fail.\n\nFailure can hurt.\n\nI've lived enough of it to know that.\n\nBut I also wouldn't erase those experiences from my business education.\n\nThey changed how I look at things.\n\n### Eventually, the Pieces Started Coming Together\n\nAs I got older, something changed.\n\nI had accumulated enough experiences that I could start seeing connections between them.\n\nI wasn't just looking at advertising anymore.\n\nOr sales.\n\nOr websites.\n\nOr technology.\n\nOr customers.\n\nOr cash flow.\n\nI started seeing how one affects another.\n\nThat's a big part of how New Tech Advertising eventually developed.\n\nThen AI came along.\n\nAt first, I resisted it.\n\nI was already retired and I really didn't want to go back to work.\n\nBut I needed to work.\n\nSo I started exploring.\n\nAnd for the first time, I had technology that could help me take all these different pieces I'd accumulated over a lifetime and begin putting them together.\n\nThat's when a lot of things started making sense.\n\n### I've Been Studying Business My Whole Life\n\nI can see that now.\n\nI didn't always call it studying business.\n\nSometimes I called it a job.\n\nSometimes I called it an opportunity.\n\nSometimes it was a business idea.\n\nSometimes it was something I found on the Internet and spent hours learning about.\n\nAnd sometimes it was a failure I would rather not have experienced.\n\nBut I was studying.\n\nI was watching.\n\nI was learning.\n\nAnd I was adding another piece.\n\nI've been studying business most of my life. I just didn't always realize that's what I was doing.\n\n### NTA Point of View\n\nYou don't have to hide the parts of your business story that didn't work.\n\nStudy them.\n\nWhat did they teach you about customers?\n\nWhat did they teach you about money?\n\nWhat did they teach you about yourself?\n\nWhat did they teach you about the way a business actually operates?\n\nExperience isn't only what you succeeded at.\n\nExperience is what you learned because you were there.";
const TAKEAWAY = "Experience isn't only what you succeeded at. Experience is what you learned because you were there.";
const SEO_TITLE = "I Tried a Lot of Businesses | NTA Knowledge Library";
const CANONICAL = "https://newtechadvertising.com/knowledge/what-a-lifetime-in-business-taught-me/i-tried-a-lot-of-businesses";
const LESSON_ID = 902;
const PREVIOUS_PATH = "/knowledge/what-a-lifetime-in-business-taught-me/i-learned-business-by-watching-people";
const NEXT_PATH = "/knowledge/what-a-lifetime-in-business-taught-me/the-gold-is-in-the-niche-the-business-is-in-the-connections";
const RELATED_LESSONS = [
  {
    "title": "Every Business Is Already Perfectly Designed",
    "description": "When business results are frustrating, it can feel like a mystery. But results aren't accidents—they are the direct product of how your business currently operates.",
    "path": "/knowledge/truth-about-business-growth/every-business-is-already-perfectly-designed"
  },
  {
    "title": "How Businesses Really Grow",
    "description": "Understand the difference between unpredictable spikes in activity and compounded digital momentum.",
    "path": "/knowledge/business-foundations/how-businesses-really-grow"
  }
];

export default function NativeLessonPage011() {
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

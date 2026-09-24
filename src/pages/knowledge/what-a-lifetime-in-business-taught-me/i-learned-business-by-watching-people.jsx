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
const TITLE = "I Learned Business by Watching People";
const LESSON_PATH = "/knowledge/what-a-lifetime-in-business-taught-me/i-learned-business-by-watching-people";
const COLLECTION_PATH = "/knowledge/what-a-lifetime-in-business-taught-me";
const COLLECTION_TITLE = "What a Lifetime in Business Taught Me";
const LESSON_NUMBER = 1;
const READING_TIME = "5 min read";
const LEVEL = "All levels";
const AUTHOR_LABEL = "NTA Point of View";
const PREVIOUS_LABEL = "Series overview: What a Lifetime in Business Taught Me";
const NEXT_LABEL = "Next Lesson: I Tried a Lot of Businesses";
const PUBLISHED_DATE = null;
const MODIFIED_DATE = null;
const READER_RESPONSE = null;
const DESCRIPTION = "How decades of watching customers, owners, employees and myself taught me to listen before trying to sell or build.";
const CONTENT = "I've been studying business most of my life. I just didn't always know that's what I was doing.\n\nA lot of what I learned about business didn't come from a classroom. It didn't come from a business book. It came from working, selling, trying things, failing at things, and mostly from watching people.\n\nI've always been a people watcher.\n\nI watch what people say. I watch what they do. And I've learned to pay attention when those two things aren't quite the same.\n\nThat's taught me a lot about business.\n\n### Retail Taught Me About People\n\nI spent years in retail, and retail will teach you about the public pretty quickly.\n\nYou're dealing directly with people all day long. You learn what makes people happy. You learn what frustrates them. You learn how they make decisions. You learn how differently two people can react to exactly the same situation.\n\nRetail also taught me something else.\n\nI decided I didn't want to spend the rest of my life working with the public.\n\nAnd I didn't particularly want employees, either.\n\nThat may sound like an odd business lesson, but knowing what you don't want can be just as important as knowing what you do want.\n\nThat helped move me toward business-to-business sales.\n\nAnd B2B taught me something that has stayed with me ever since.\n\n### I Didn't Have to Sell First\n\nWhen I started selling to businesses, I discovered that I could teach people what they needed to know before they bought anything.\n\nThat fit me.\n\nInstead of starting with, \"How do I convince this person to buy what I'm selling?\" I could start with, \"What does this person need to understand?\"\n\nThat's a completely different conversation.\n\nA business owner has a problem. Maybe they don't fully understand the problem yet. Maybe they know something isn't working but don't know why. Maybe they don't know what's available to them.\n\nIf I understand something that could help them, I can explain it.\n\nThen they can decide what to do.\n\nLooking back, I can see how much of New Tech Advertising started right there.\n\nTeach before selling.\n\nI didn't invent that idea when I started NTA. I'd already been learning it for years.\n\n### People Will Teach You If You Pay Attention\n\nI've known business owners, salespeople, employees, customers, managers, entrepreneurs and people trying desperately to become entrepreneurs.\n\nI've also been many of those things myself.\n\nAnd people are interesting.\n\nWe don't always do what we say we're going to do.\n\nWe get excited about something and then don't follow through.\n\nWe resist changing something even when we know it probably needs to change.\n\nWe sometimes buy things we don't need and put off buying things we do need.\n\nWe worry about money.\n\nWe worry about making the wrong decision.\n\nWe don't want to look foolish.\n\nSometimes we don't even know exactly what we're afraid of. We just know we're uncomfortable.\n\nI've seen those things in other people.\n\nI've seen plenty of them in myself.\n\nThat's important.\n\nBecause understanding people isn't about standing outside the crowd and deciding you've figured everybody else out.\n\nI'm one of the people I'm watching.\n\n### Business Happens Between People\n\nTechnology changes.\n\nAdvertising changes.\n\nThe Internet changed business.\n\nSocial media changed it again.\n\nNow artificial intelligence is changing it.\n\nBut underneath all of those things are still people.\n\nA customer has to trust somebody.\n\nAn employee has to understand what they're supposed to do.\n\nA business owner has to make a decision.\n\nSomeone has to listen.\n\nSomeone has to explain.\n\nSomeone has to follow through.\n\nThat's one reason I'm careful about putting technology ahead of people.\n\nA piece of software can be impressive and still be completely wrong for the person expected to use it.\n\nI've seen that more clearly as I've worked with AI.\n\nThe best system isn't necessarily the one with the most features.\n\nIt's the one people will actually use.\n\n### Listen Before You Build\n\nThat has become increasingly important in the way I work today.\n\nBefore I can help a business owner build something, I need to understand the business.\n\nAnd before I understand the business, I need to listen to the people who actually live inside it.\n\nHow do they work?\n\nWhat frustrates them?\n\nWhat keeps getting forgotten?\n\nWhat do customers keep asking?\n\nWhat has the owner been trying to fix for years?\n\nWhat does the owner absolutely not want to change?\n\nSometimes what isn't being said is just as important as what is.\n\nI can't learn those things by walking in with a piece of software and telling everybody how they're going to work from now on.\n\nI have to listen first.\n\n### Maybe That's Been My Business Education\n\nI've tried a lot of things during my life.\n\nSome worked.\n\nPlenty didn't.\n\nI've worked in different kinds of businesses and studied many more.\n\nBut when I look back now, one of the most valuable things I've done is simply pay attention.\n\nRetail taught me about people.\n\nB2B taught me that I could educate before selling.\n\nTrying to build businesses taught me humility.\n\nCustomers taught me to listen.\n\nFailure taught me to look again.\n\nAnd all those years of watching people taught me something I still use every day:\n\nBefore you try to sell somebody something, understand the person sitting across from you.\n\nThat's still where I think good business begins.\n\n### NTA Point of View\n\nTechnology should adapt to people whenever possible—not force people to become something they're not.\n\nThat's why we start with questions, conversation and discovery.\n\nThe technology comes later.\n\nFirst, we listen.";
const TAKEAWAY = "Before you try to sell somebody something, understand the person sitting across from you.";
const SEO_TITLE = "I Learned Business by Watching People | NTA Knowledge Library";
const CANONICAL = "https://newtechadvertising.com/knowledge/what-a-lifetime-in-business-taught-me/i-learned-business-by-watching-people";
const LESSON_ID = 901;
const PREVIOUS_PATH = "/knowledge/what-a-lifetime-in-business-taught-me";
const NEXT_PATH = "/knowledge/what-a-lifetime-in-business-taught-me/i-tried-a-lot-of-businesses";
const RELATED_LESSONS = [
  {
    "title": "Understanding Before Spending",
    "description": "The importance of education and transparency before investing in growth.",
    "path": "/knowledge/business-foundations/understanding-before-spending"
  },
  {
    "title": "People Trust What They Can Understand",
    "description": "Customers do not have your experience. When they cannot quickly understand what a business does or how it can help, moving forward feels unsafe.",
    "path": "/knowledge/how-customers-decide-who-to-trust/people-trust-what-they-can-understand"
  }
];

export default function NativeLessonPage010() {
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

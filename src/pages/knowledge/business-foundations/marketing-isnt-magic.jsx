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
const TITLE = "Marketing Isn't Magic";
const LESSON_PATH = "/knowledge/business-foundations/marketing-isnt-magic";
const COLLECTION_PATH = "/knowledge/business-foundations";
const COLLECTION_TITLE = "Business Foundations";
const LESSON_NUMBER = 3;
const READING_TIME = "8–10 min read";
const LEVEL = "Beginner";
const AUTHOR_LABEL = "Your Digital Growth Guide™";
const PREVIOUS_LABEL = "Previous Lesson: How Businesses Really Grow";
const NEXT_LABEL = "Next Lesson: Every System Produces Exactly What It Was Designed to Produce";
const PUBLISHED_DATE = "2026-07-15";
const MODIFIED_DATE = "2026-07-23";
const READER_RESPONSE = null;
const DESCRIPTION = "Demystifying the process of acquiring and retaining customers in the digital age.";
const CONTENT = "\n### One of the Biggest Mistakes I Ever Made\n\nFor many years, I believed marketing was the answer.\n\nNot because anyone told me that directly.\n\nBecause that's what the world seemed to say.\n\n\"If business is slow, advertise.\"\n\n\"If sales are down, advertise.\"\n\n\"If people don't know you, advertise.\"\n\nAs a business owner, I spent money I couldn't really afford because I believed advertising was what successful businesses were supposed to do.\n\nSometimes it worked.\n\nSometimes it didn't.\n\nWhen it didn't, I blamed the advertisement.\n\nLooking back, I realize I was asking marketing to do a job it was never designed to do.\n\n### Marketing Is a Messenger\n\nImagine hiring the best salesperson in the world.\n\nThey're friendly.\n\nKnowledgeable.\n\nProfessional.\n\nThey get hundreds of people interested in your business.\n\nNow imagine those people arrive and...\n\nNo one answers the phone.\n\nYour website is confusing.\n\nCustomers aren't called back.\n\nReviews are poor.\n\nThe service isn't consistent.\n\nWas the salesperson the problem?\n\nOf course not.\n\nThey did exactly what they were hired to do.\n\nMarketing works the same way.\n\nIts job is to introduce people to your business.\n\nWhat happens next is determined by everything else you've built.\n\n### Advertising Doesn't Fix Broken Systems\n\nI've watched businesses spend thousands of dollars trying to fix problems that weren't marketing problems.\n\nSometimes the real issue was:\n\nNo follow-up.\nNo clear message.\nNo customer relationship system.\nNo online credibility.\nNo consistency.\nNo process for asking for reviews.\nNo understanding of what customers actually needed.\n\nMore advertising only brought more people into the same broken experience.\n\nThat's frustrating for the business owner.\n\nIt's disappointing for the customer.\n\nAnd it gives marketing a bad reputation it doesn't deserve.\n\n### Marketing Works Best When the Foundation Is Strong\n\nThink of marketing as opening the front door.\n\nIf the house behind that door is warm, organized, and welcoming, people feel comfortable.\n\nIf it's confusing or neglected, they leave.\n\nThe goal isn't simply to get more people through the door.\n\nThe goal is to build a business worth walking into.\n\nThat's why I spend so much time helping business owners understand their systems before we ever talk about spending more money.\n\n### This Is Why I Teach First\n\nPeople sometimes ask me,\n\n\"Why do you spend so much time explaining things?\"\n\nBecause I don't want you to buy something you don't understand.\n\nIf we discover that advertising is exactly what your business needs, wonderful.\n\nWe'll do it.\n\nIf we discover your biggest opportunity is improving customer follow-up, your website, your reviews, or your communication, then that's where we'll begin.\n\nThe right answer is not always more marketing.\n\nThe right answer is whatever helps your business grow.\n\n### AI Doesn't Change This Principle\n\nArtificial intelligence has made marketing faster.\n\nIt has made content easier to create.\n\nIt has made research more powerful.\n\nIt has made websites easier to build.\n\nBut it hasn't changed one basic truth.\n\nMarketing still cannot create trust by itself.\n\nTechnology can amplify your message.\n\nIt cannot replace your character.\n\nThat is why AI is part of the NTA Operating System—but it is never the Operating System itself.\n\n### What I Hope Business Owners Learn\n\nOne of the greatest compliments I can receive isn't,\n\n\"Rick built us a great website.\"\n\nOr,\n\n\"Rick helped us rank on Google.\"\n\nIt's when someone says,\n\n\"Now I finally understand why my business grows.\"\n\nBecause once you understand the principles, you're no longer dependent on chasing the next marketing trend.\n\nYou begin making decisions with confidence instead of hope.\n\nAnd that's a much better way to build a business.\n\n### The Lesson\n\nMarketing is not magic.\n\nIt is one important part of a healthy business system.\n\nWhen your message, relationships, service, and follow-up work together, marketing becomes far more effective because it is supporting something solid instead of trying to compensate for something missing.\n\n***\n\n### Reflection Questions\n\nBefore deciding that you need more marketing, ask yourself:\n\n* Am I asking marketing to solve a problem that exists somewhere else in the business?\n* What happens after a new prospect calls, emails, or visits the website?\n* Do we respond clearly and consistently?\n* Does our customer experience support the promises our marketing makes?\n* What part of the foundation should become stronger before we attract more attention?\n\nMarketing works best when it introduces people to a business that is ready to serve them well.\n    ";
const TAKEAWAY = "Marketing doesn't create great businesses. It helps people discover them.";
const SEO_TITLE = "Why Small Business Marketing Is Not Magic | NTA Knowledge Library";
const CANONICAL = "https://newtechadvertising.com/knowledge/business-foundations/marketing-isnt-magic";
const LESSON_ID = 3;
const PREVIOUS_PATH = "/knowledge/business-foundations/how-businesses-really-grow";
const NEXT_PATH = "/knowledge/business-foundations/every-system-produces-exactly-what-it-was-designed-to-produce";
const RELATED_LESSONS = [
  {
    "title": "Marketing Doesn’t Create Great Businesses",
    "description": "Marketing gets blamed for a lot of things. It also gets credit for things it cannot create. Discover why marketing works best as an amplifier for an already solid foundation.",
    "path": "/knowledge/truth-about-business-growth/marketing-doesnt-create-great-businesses"
  },
  {
    "title": "Your Website Is No Longer Just a Website",
    "description": "A modern business website should help people find, understand, trust, and connect with the business. It is becoming the central connection point between what your business knows and the people who need that knowledge.",
    "path": "/knowledge/what-is-digital-trust/your-website-is-no-longer-just-a-website"
  }
];

export default function NativeLessonPage003() {
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

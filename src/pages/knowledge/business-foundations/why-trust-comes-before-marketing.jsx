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
const TITLE = "Why Trust Comes Before Marketing";
const LESSON_PATH = "/knowledge/business-foundations/why-trust-comes-before-marketing";
const COLLECTION_PATH = "/knowledge/business-foundations";
const COLLECTION_TITLE = "Business Foundations";
const LESSON_NUMBER = 7;
const READING_TIME = "9–10 min read";
const LEVEL = "Beginner";
const AUTHOR_LABEL = "Your Digital Growth Guide™";
const PREVIOUS_LABEL = "Previous Lesson: AI Is My Team, Not My Replacement";
const NEXT_LABEL = "Next Lesson: What Building My Own Digital Growth Office Taught Me";
const PUBLISHED_DATE = "2026-07-15";
const MODIFIED_DATE = "2026-07-23";
const READER_RESPONSE = null;
const DESCRIPTION = "The fundamental shift in how consumers choose who to hire in the AI era.";
const CONTENT = "\n### The Best Clients I Ever Had\n\nWhen I look back over my career, something stands out.\n\nThe best clients weren't the ones with the biggest budgets.\n\nThey weren't always the fastest growing businesses.\n\nAnd they certainly weren't the ones who expected miracles.\n\nThey were the people who trusted me enough to let us learn together.\n\nThat trust didn't mean they never asked questions.\n\nIn fact, many of them asked a lot of questions.\n\nThey wanted to understand.\n\nI welcomed that.\n\nBecause I wasn't looking for people who would blindly believe me.\n\nI was looking for people willing to build something together.\n\n### Trust Is Earned, Not Assumed\n\nOne thing I've learned over the years is that trust isn't something you ask for.\n\nIt's something you earn.\n\nToo many businesses begin the relationship by saying,\n\n\"Trust us.\"\n\nI've never been comfortable with that.\n\nI don't expect someone to trust me because I have a website.\n\nOr because I know AI.\n\nOr because I've been doing this a long time.\n\nI expect trust to grow the same way healthy relationships grow.\n\nOne honest conversation at a time.\n\nOne fulfilled promise at a time.\n\nOne lesson at a time.\n\nOne project at a time.\n\n### I've Been on Both Sides\n\nI've trusted people who disappointed me.\n\nI've invested money that didn't produce the results I hoped for.\n\nI've believed promises that never became reality.\n\nThose experiences taught me to be careful.\n\nBut they didn't teach me to become cynical.\n\nInstead, they taught me something much more valuable.\n\nHealthy trust is mutual.\n\nIt grows because both people continue earning it.\n\nThat's the kind of relationship I want with every client.\n\n### Marketing Can't Create Trust\n\nMarketing can create awareness.\n\nIt can introduce people to your business.\n\nIt can tell your story.\n\nIt can communicate your values.\n\nBut it can't create trust by itself.\n\nTrust is built when your actions consistently match your message.\n\nThat's true for businesses.\n\nIt's true for friendships.\n\nIt's true for families.\n\nIt's true for every healthy relationship.\n\n### Why I Teach First\n\nPeople sometimes wonder why I spend so much time creating articles, videos, lessons, and conversations instead of immediately talking about services.\n\nThe answer is simple.\n\nTeaching allows people to know how I think before they decide whether they want to work with me.\n\nBy the time someone schedules a conversation with me, I hope they already understand my philosophy.\n\nNot because I've convinced them.\n\nBecause they've had the opportunity to evaluate it for themselves.\n\nThat's a much healthier beginning than trying to persuade someone in a one-hour sales meeting.\n\n### My Promise\n\nIf I could summarize my entire business philosophy in one sentence, it would be this:\n\n\"If you can offer me enough trust to begin, I will work to earn enough trust to continue.\"\n\nThat's the promise behind every recommendation I make.\n\nEvery lesson I write.\n\nEvery website I build.\n\nEvery conversation I have.\n\nTrust is never finished.\n\nIt's continually strengthened—or weakened—by what we do next.\n\n### Why This Matters More in the Age of AI\n\nArtificial intelligence makes it easier than ever to create content.\n\nTo build websites.\n\nTo send emails.\n\nTo automate communication.\n\nTo generate marketing.\n\nBut none of those things automatically make people trust you.\n\nIn fact, they may make trust even more important.\n\nThe easier it becomes to create information, the more valuable authenticity becomes.\n\nThat's why I believe the future belongs to businesses that combine technology with genuine relationships.\n\nAI may change how we work.\n\nIt should never replace why people choose to work together.\n\n### The Lesson\n\nLong-term business growth is built on relationships.\n\nRelationships are built on trust.\n\nTrust is built by consistently doing what you said you would do.\n\nEverything else supports that foundation.\n\n***\n\n### Reflection Questions\n\nBefore moving into the next collection, ask yourself:\n\n* Do my customers understand why they should trust my business?\n* Does my marketing reflect who we really are?\n* Am I asking people to trust me before I've earned it?\n* What could I do this week that would strengthen trust with my customers?\n* If I were my own customer, would I feel confident doing business with me?\n\nSometimes those questions are more valuable than the answers.\n\n### Continue Learning\n\nThese foundational lessons are designed to change the way you think about business.\n\nThe next lesson shows how those principles apply to a real Digital Growth Office. After that, *The Right Decision Should Make Sense* explains why education, experience, and practical guidance are part of the value NTA provides.\n\nOnce you have completed those lessons, you can move into the next collection and explore how artificial intelligence fits into the picture—not as a replacement for people, but as a powerful set of tools that can help thoughtful business owners accomplish more than ever before.\n    ";
const TAKEAWAY = "Marketing may start a conversation. Trust is what allows the conversation to continue.";
const SEO_TITLE = "Why Customer Trust Comes Before Small Business Marketing | NTA Knowledge Library";
const CANONICAL = "https://newtechadvertising.com/knowledge/business-foundations/why-trust-comes-before-marketing";
const LESSON_ID = 7;
const PREVIOUS_PATH = "/knowledge/business-foundations/ai-is-my-team-not-my-replacement";
const NEXT_PATH = "/knowledge/business-foundations/what-building-my-own-digital-growth-office-taught-me";
const RELATED_LESSONS = [
  {
    "title": "Trust Begins Before the First Conversation",
    "description": "Business owners often believe trust begins when they finally speak with the customer. But by the time customers contact a business, many have already formed an opinion.",
    "path": "/knowledge/how-customers-decide-who-to-trust/trust-begins-before-the-first-conversation"
  },
  {
    "title": "Customers Trust Evidence More Than Claims",
    "description": "Businesses make a lot of claims. But customers have heard the same claims from nearly every business. Evidence is what helps them believe you.",
    "path": "/knowledge/how-customers-decide-who-to-trust/customers-trust-evidence-more-than-claims"
  }
];

export default function NativeLessonPage007() {
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

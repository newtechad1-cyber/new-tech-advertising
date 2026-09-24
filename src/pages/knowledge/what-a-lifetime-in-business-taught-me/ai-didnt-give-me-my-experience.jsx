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
const TITLE = "AI Didn't Give Me My Experience";
const LESSON_PATH = "/knowledge/what-a-lifetime-in-business-taught-me/ai-didnt-give-me-my-experience";
const COLLECTION_PATH = "/knowledge/what-a-lifetime-in-business-taught-me";
const COLLECTION_TITLE = "What a Lifetime in Business Taught Me";
const LESSON_NUMBER = 5;
const READING_TIME = "10 min read";
const LEVEL = "All levels";
const AUTHOR_LABEL = "NTA Point of View";
const PREVIOUS_LABEL = "Previous Lesson: Free Is Free";
const NEXT_LABEL = "Next Lesson: I Was Afraid AI Would Take My Voice. It Helped Me Find It.";
const PUBLISHED_DATE = null;
const MODIFIED_DATE = null;
const READER_RESPONSE = null;
const DESCRIPTION = "How AI helped me connect a lifetime of experience without replacing the judgment and knowledge that came first.";
const CONTENT = "When artificial intelligence started becoming something everybody was talking about, I wasn't sitting around waiting for it.\n\nActually, I resisted it.\n\nI was already retired.\n\nI really didn't want to go back to work.\n\nBut I needed to work.\n\nSo I started exploring AI.\n\nI didn't know where it was going to lead. I certainly didn't have New Tech Advertising figured out.\n\nI just started using it.\n\nAnd something happened that I didn't expect.\n\nAI started helping me connect things I'd been learning my entire life.\n\nThat's when I began to understand something important:\n\nAI didn't give me my experience. It gave me an affordable way to put a lifetime of experience to work.\n\n### The Experience Was Already There\n\nBy the time AI came along, I'd already spent decades working.\n\nI'd worked retail.\n\nI'd sold business to business.\n\nI'd sold advertising.\n\nI'd been involved in wholesale.\n\nI'd tried building different businesses.\n\nI'd worked with customers.\n\nI'd worked with employees and salespeople.\n\nI'd watched businesses succeed.\n\nI'd watched businesses struggle.\n\nI'd had successes of my own.\n\nAnd I'd had plenty of failures.\n\nI'd also spent years studying businesses simply because I was interested in how they worked.\n\nAI didn't teach me those things.\n\nLife did.\n\nWork did.\n\nCustomers did.\n\nBusiness owners did.\n\nMistakes did.\n\nPeople did.\n\nAI gave me a different way to use what I'd learned.\n\n### At First, I Thought AI Was About Answers\n\nThat's how a lot of us were introduced to it.\n\nAsk AI a question.\n\nGet an answer.\n\nThat was interesting.\n\nThen I discovered it could write.\n\nIt could research.\n\nIt could help create images.\n\nIt could work with websites.\n\nIt could analyze information.\n\nIt could help with marketing.\n\nIt could help solve technical problems.\n\nEvery few weeks it seemed like there was something else it could do.\n\nBut eventually I discovered something much more useful to me.\n\nI could talk to it.\n\nNot just ask a question and get an answer.\n\nI could have a conversation.\n\nI could explain what I was thinking.\n\nI could give it background.\n\nI could tell it about something I'd tried 20 years ago.\n\nI could disagree with what it gave me.\n\nI could say, \"No, that's not what I mean.\"\n\nThen I could explain it again.\n\nAnd somewhere in that back-and-forth, I would often understand my own thinking better.\n\nThat's when AI became much more than an answer machine for me.\n\n### It Helped Me See Connections\n\nI had accumulated a lot of pieces over the years.\n\nMarketing.\n\nSales.\n\nRetail.\n\nWholesale.\n\nCustomer service.\n\nAdvertising.\n\nTechnology.\n\nWebsites.\n\nCash flow.\n\nEmployees.\n\nBusiness owners.\n\nHuman behavior.\n\nSome of those things had lived in separate compartments in my mind.\n\nAI helped me put them on the same table.\n\nI could talk about a website problem and suddenly see that it was really a communication problem.\n\nI could talk about marketing and realize the real issue was follow-up.\n\nI could look at a customer question and see an article, a video, a sales conversation and a training opportunity hiding inside the same question.\n\nI could talk through something I had learned decades ago and realize it applied to a problem I was working on today.\n\nAI didn't create those connections for me out of nothing.\n\nIt helped me see them.\n\n### Experience Changes the Questions You Ask\n\nThis is something I think we're going to understand better as AI becomes more common.\n\nTwo people can use exactly the same AI and get very different value from it.\n\nThe difference isn't necessarily the AI.\n\nIt's what the person brings to the conversation.\n\nIf you've spent 30 years working in plumbing, you know things about plumbing that AI doesn't learn by showing up at a jobsite.\n\nIf you've run a restaurant for 25 years, you know things about customers, food costs, employees, suppliers and Saturday-night chaos that aren't contained in a clever prompt.\n\nIf you've spent your life selling, you've learned things about people.\n\nIf you've spent years repairing equipment, you've learned to notice things somebody else won't notice.\n\nExperience changes what you see.\n\nAnd what you see changes the questions you ask.\n\nThat's where I think AI becomes particularly powerful.\n\nIt can work with what you know.\n\n### The Knowledge Inside a Business Matters\n\nThis changed the way I started looking at businesses too.\n\nEvery business has knowledge inside it.\n\nThe owner knows things.\n\nThe employees know things.\n\nThe person answering the phone knows things.\n\nThe technician who's been going into customers' homes for 15 years knows things.\n\nThe waitress who talks with regular customers every week knows things.\n\nThe salesperson knows what questions people ask before they buy.\n\nThe customer knows things too.\n\nBut a lot of that knowledge disappears.\n\nA conversation happens and it's gone.\n\nSomeone solves a problem and nobody records how they solved it.\n\nAn employee answers the same customer question for the hundredth time, but nobody thinks to turn that answer into something the next hundred customers could use.\n\nA business can know an enormous amount without having any real system for remembering what it knows.\n\nAI made me start thinking differently about that.\n\n### What If the Business Could Remember?\n\nThat became a fascinating question for me.\n\nWhat if we could capture what the owner knows?\n\nWhat if we could capture useful things employees learn?\n\nWhat if customer questions didn't disappear after somebody answered them?\n\nWhat if a good sales conversation could teach us something about the website?\n\nWhat if something learned in the field could become training?\n\nWhat if one good idea could become an article, a video, an email, a social post or an answer for the next customer who asks the same question?\n\nWhat if the business could keep learning from itself?\n\nThat's a much bigger idea than asking AI to write a Facebook post.\n\nThat's where I began seeing the possibility of a Digital Growth Office.\n\n### AI Still Needs Judgment\n\nI don't believe AI should make every decision.\n\nI've seen it be wrong.\n\nI've seen it misunderstand what I meant.\n\nI've seen it give me something that sounded good but wasn't right.\n\nSometimes I've had to correct it several times.\n\nThat's part of working with it.\n\nThe fact that AI can produce something quickly doesn't mean the result is good.\n\nSomeone still has to look at it.\n\nSomeone still has to ask whether it makes sense.\n\nSomeone still has to know the business.\n\nSomeone still has to say:\n\nThat's not us.\n\nOr:\n\nThat's exactly what I was trying to say.\n\nThat's judgment.\n\nAnd judgment comes from somewhere.\n\nA lot of mine came from years of doing things the hard way.\n\n### You Don't Have to Become an AI Expert\n\nThis is another thing I've learned.\n\nA small-business owner doesn't need to become an artificial-intelligence expert.\n\nYou already have a business to run.\n\nWhat matters is learning enough to understand what AI can help you do.\n\nThen start with what you already know.\n\nTell it about your business.\n\nExplain how you work.\n\nTalk about your customers.\n\nAsk questions.\n\nChallenge the answers.\n\nCorrect it when it's wrong.\n\nGive it more context.\n\nSee what it helps you notice.\n\nThe goal isn't to become more like AI.\n\nThe goal is to make AI more useful to you.\n\n### Start With What You Already Know\n\nWe talk a lot about learning AI.\n\nAnd yes, there's plenty to learn.\n\nBut I think we sometimes start in the wrong place.\n\nWe start with the technology.\n\nMaybe we should start with the person.\n\nWhat have you spent your life learning?\n\nWhat do you understand that someone new to your business wouldn't understand?\n\nWhat have your customers taught you?\n\nWhat mistakes have you made?\n\nWhat questions have you answered a thousand times?\n\nWhat do you notice that other people miss?\n\nWhat do your employees know?\n\nWhat knowledge is walking around inside your business every day and disappearing because nobody is capturing it?\n\nThat's where I'd start.\n\nBecause the most valuable thing in the conversation may not be the artificial intelligence.\n\nIt may be you.\n\n### AI Didn't Give Me My Experience\n\nAI has changed the way I work.\n\nIt's changed the way I learn.\n\nIt's changed the way I build.\n\nIt's even changed the way I think through things.\n\nBut it didn't give me the experiences that made those conversations valuable.\n\nThose came first.\n\nAlmost 70 years of living.\n\nDecades of working.\n\nBusinesses I tried.\n\nPeople I met.\n\nThings that worked.\n\nThings that failed.\n\nQuestions I asked.\n\nMistakes I made.\n\nAnd a lifetime of watching.\n\nAI gave me a new way to bring all of that together.\n\n### NTA Point of View\n\nDon't start by asking what AI knows.\n\nStart with what you know.\n\nYour experience matters.\n\nYour employees' experience matters.\n\nYour customers' questions matter.\n\nYour mistakes matter.\n\nYour conversations matter.\n\nArtificial intelligence can help capture, organize, connect and use that knowledge.\n\nBut the knowledge has to come from somewhere.\n\nAI didn't give me my experience. It helped me finally put that experience to work.";
const TAKEAWAY = "AI didn't give me my experience. It helped me finally put that experience to work.";
const SEO_TITLE = "AI Didn't Give Me My Experience | NTA Knowledge Library";
const CANONICAL = "https://newtechadvertising.com/knowledge/what-a-lifetime-in-business-taught-me/ai-didnt-give-me-my-experience";
const LESSON_ID = 905;
const PREVIOUS_PATH = "/knowledge/what-a-lifetime-in-business-taught-me/free-is-free";
const NEXT_PATH = "/knowledge/what-a-lifetime-in-business-taught-me/i-was-afraid-ai-would-take-my-voice-it-helped-me-find-it";
const RELATED_LESSONS = [
  {
    "title": "Your Business Knows More Than It Has Documented",
    "description": "When business owners think about the assets of their business, they usually think about things they can see. But many businesses overlook one of their most valuable assets: everything the business has learned.",
    "path": "/knowledge/turning-what-a-business-knows-into-an-asset/your-business-knows-more-than-it-has-documented"
  },
  {
    "title": "AI Can Assist Judgment—It Cannot Own It",
    "description": "AI can organize information, identify patterns, and suggest possible actions. But decisions involving people, values, risk, and responsibility still require human judgment.",
    "path": "/knowledge/ai-foundations/ai-can-assist-judgment-it-cannot-own-it"
  }
];

export default function NativeLessonPage014() {
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

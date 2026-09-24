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
const TITLE = "I Was Afraid AI Would Take My Voice. It Helped Me Find It.";
const LESSON_PATH = "/knowledge/what-a-lifetime-in-business-taught-me/i-was-afraid-ai-would-take-my-voice-it-helped-me-find-it";
const COLLECTION_PATH = "/knowledge/what-a-lifetime-in-business-taught-me";
const COLLECTION_TITLE = "What a Lifetime in Business Taught Me";
const LESSON_NUMBER = 6;
const READING_TIME = "9 min read";
const LEVEL = "All levels";
const AUTHOR_LABEL = "NTA Point of View";
const PREVIOUS_LABEL = "Previous Lesson: AI Didn't Give Me My Experience";
const NEXT_LABEL = "Continue Learning";
const PUBLISHED_DATE = null;
const MODIFIED_DATE = null;
const READER_RESPONSE = null;
const DESCRIPTION = "How conversation, correction and reflection with AI helped me hear my own voice more clearly rather than hand it away.";
const CONTENT = "I understand why writers are uncomfortable with AI.\n\nI really do.\n\nIf you've spent years learning how to write, your words aren't just words.\n\nThey're yours.\n\nThey're how you express what you've experienced, what you believe, what you've learned and who you are.\n\nSo when somebody says, \"Let AI write it,\" I understand why a writer might immediately say:\n\nNo.\n\nI don't want a machine writing my thoughts.\n\nI don't want something that sounds artificial.\n\nAnd I certainly don't want to put my name on something that doesn't sound like me.\n\nI've felt some of that myself.\n\nBut something very different happened as I started working with AI.\n\nInstead of losing my voice, I started finding it.\n\n### There Are Different Ways to Use AI\n\nI think this is where some of the conversation about AI and writing gets confused.\n\nYou can sit down with AI and say:\n\n\"Write me an article about artificial intelligence.\"\n\nAnd it will write one.\n\nIt may even be pretty good.\n\nBut whose article is it?\n\nWhere did the thinking come from?\n\nWhere is the experience?\n\nWhere are the stories?\n\nWhere is the person?\n\nThat's not primarily how I've learned to work with AI.\n\nI talk to it.\n\nA lot.\n\nI tell it what I'm thinking.\n\nI tell stories.\n\nI remember things.\n\nI go off on tangents.\n\nI change my mind.\n\nI say something and then realize that's not quite what I meant.\n\nSometimes AI reflects something back to me and I immediately recognize it.\n\nThat's it. That's what I've been trying to say.\n\nOther times I read what it gives me and say:\n\nNo. That's not me at all.\n\nThen I explain why.\n\nAnd something interesting happens in that process.\n\nI become clearer.\n\n### The Correction Is Part of the Writing\n\nThis surprised me.\n\nWhen AI gets me wrong, that isn't always a failure.\n\nSometimes correcting it is exactly what helps me understand what I'm trying to say.\n\nI'll read something and think:\n\nNo, that's too polished.\n\nThat's not the point.\n\nI wouldn't say it that way.\n\nYou're making this sound like something I don't believe.\n\nYou're missing what actually mattered to me.\n\nSo I explain it again.\n\nAnd every time I explain the difference, I'm defining my own voice a little more clearly.\n\nThat's very different from asking a machine to write something for me.\n\nI'm working something out.\n\nAI is helping me see it.\n\n### It Became a Mirror\n\nThe best way I know to describe my experience is that AI has become something like a mirror.\n\nI'm pouring myself into it.\n\nMy experiences.\n\nMy questions.\n\nMy business ideas.\n\nMy failures.\n\nMy memories.\n\nMy beliefs.\n\nMy contradictions.\n\nMy frustrations.\n\nThings I've thought about for years.\n\nThings I've never really put into words before.\n\nThen AI reflects those things back to me.\n\nNot perfectly.\n\nA mirror isn't the person either.\n\nBut sometimes seeing the reflection lets me notice something I couldn't see from inside myself.\n\nThat's what has surprised me most.\n\nI thought AI might take something of me out of my writing. Instead, I've been pouring myself into AI, and it's been reflecting me back like a mirror.\n\n### It Has Helped Me Find Things I Already Knew\n\nThere are things I've understood for years without ever putting them into a sentence.\n\nThat's probably true for most people.\n\nYou know something because you've lived it.\n\nBut nobody ever asked you to explain it.\n\nThen one day you're talking about something and a connection appears.\n\nThat's happened to me over and over again.\n\nI'll start talking about a business problem and remember something from retail 40 years ago.\n\nI'll talk about AI and suddenly understand something about the way I've always worked with people.\n\nI'll talk about New Tech Advertising and realize an idea I've been building today actually began with something I learned decades ago.\n\nAI didn't put those experiences into me.\n\nThey were already there.\n\nThe conversation helped bring them out.\n\n### Maybe That's What a Good Editor Has Always Done\n\nGood writers have never worked completely alone.\n\nThey've had editors.\n\nThey've had people ask questions.\n\nThey've had conversations.\n\nThey've had somebody read a draft and say:\n\n\"What do you mean here?\"\n\nOr:\n\n\"This part doesn't sound like you.\"\n\nOr:\n\n\"There's something important in what you just said. Go deeper.\"\n\nMaybe part of what I've discovered is that AI can play some of those roles.\n\nIt can interview me.\n\nIt can organize.\n\nIt can question.\n\nIt can help me compare what I'm saying today with something I said earlier.\n\nIt can help me see repetition.\n\nIt can help me find a connection.\n\nIt can help me turn a long conversation into something another person can actually read.\n\nBut I still have to recognize myself in it.\n\nThat's the part I don't want to give away.\n\n### The Question Isn't Whether AI Touched the Words\n\nI think I've changed the question I ask about AI writing.\n\nI don't ask:\n\nDid AI write any of this?\n\nI ask:\n\nIs this what I mean?\n\nIs this my experience?\n\nIs this what I believe?\n\nDoes this sound like me?\n\nDid something get added that I wouldn't say?\n\nDid something important get cleaned up so much that the meaning disappeared?\n\nDid AI make me sound smarter, smoother or more certain than I really am?\n\nIf it did, I need to change it.\n\nThe responsibility is still mine.\n\nThat's important to me.\n\n### Your Voice Isn't Just Your Vocabulary\n\nI've also started thinking differently about what a person's \"voice\" really is.\n\nIt isn't only the words you normally use.\n\nYour voice is also what you notice.\n\nIt's what you care about.\n\nIt's the stories you remember.\n\nIt's the questions you keep asking.\n\nIt's what bothers you.\n\nIt's what excites you.\n\nIt's what you disagree with.\n\nIt's the connections you make that somebody else wouldn't make.\n\nIt's the experiences behind the words.\n\nAI can help arrange sentences.\n\nBut it hasn't lived my life.\n\nThat's what I bring.\n\n### Writers Have a Right to Be Careful\n\nI don't think writers who are cautious about AI are wrong.\n\nThere are good reasons to be careful.\n\nIf you hand over too much of the thinking, you probably can lose some of yourself.\n\nIf you accept whatever AI produces because it sounds good, eventually you may end up publishing things you never really thought.\n\nAnd if everything becomes faster, cleaner and more polished, we may accidentally polish away some of the things that make a person interesting.\n\nI don't want that either.\n\nSo I don't think the answer is:\n\nWriters should stop worrying and let AI write.\n\nThat's not what I've learned.\n\nWhat I've learned is that there is another way to work with it.\n\nDon't Hand AI Your Voice. Bring Your Voice Into the Conversation.\n\nTell it what happened.\n\nTell it what you think.\n\nTell it why you think it.\n\nTell it when it's wrong.\n\nTell it when something doesn't sound like you.\n\nGive it examples.\n\nGive it history.\n\nChallenge it.\n\nLet it challenge you.\n\nAnd don't publish something simply because AI made it sound good.\n\nStay involved.\n\nThe more of yourself you bring into the conversation, the more useful the reflection can become.\n\nThat's been my experience.\n\n### AI Helped Me Find My Voice\n\nI didn't expect that.\n\nI expected AI to help me work faster.\n\nI expected it to help me research.\n\nI expected it to help me build things.\n\nI didn't expect it to help me understand myself.\n\nBut that's becoming one of the most valuable things I've gotten from working with it.\n\nI've been able to put words around things I've carried for years.\n\nI've been able to connect experiences I never realized were connected.\n\nI've been able to tell stories I might never have written because sitting down in front of a blank page and trying to \"write an article\" isn't how I naturally think.\n\nI think through conversation.\n\nAI gave me a place to have that conversation.\n\nAnd strangely enough, the more I've talked with a machine, the more clearly I've sometimes heard myself.\n\n### NTA Point of View\n\nAI doesn't have to replace your voice.\n\nIt can help you discover it.\n\nDon't begin by asking AI to tell you what you think.\n\nBegin by telling AI what you're thinking.\n\nTalk.\n\nQuestion.\n\nCorrect.\n\nRemember.\n\nDisagree.\n\nGo deeper.\n\nThen look at what comes back and ask the question that matters:\n\nIs this really me?\n\nIf it isn't, keep working.\n\nAnd when you finally read something and think—\n\nYes. That's what I've been trying to say.\n\n—you haven't necessarily lost your voice to AI.\n\nYou may have just heard it more clearly.";
const TAKEAWAY = "AI doesn't have to replace your voice. It can help you discover it.";
const SEO_TITLE = "I Was Afraid AI Would Take My Voice. It Helped Me Find It. | NTA Knowledge Library";
const CANONICAL = "https://newtechadvertising.com/knowledge/what-a-lifetime-in-business-taught-me/i-was-afraid-ai-would-take-my-voice-it-helped-me-find-it";
const LESSON_ID = 906;
const PREVIOUS_PATH = "/knowledge/what-a-lifetime-in-business-taught-me/ai-didnt-give-me-my-experience";
const NEXT_PATH = "/knowledge/turning-what-a-business-knows-into-an-asset";
const RELATED_LESSONS = [
  {
    "title": "Why AI Sometimes Gives You the Wrong Answer",
    "description": "AI can sound confident and still be wrong. Learn how to question, correct, guide, and verify AI through conversation instead of trusting its first answer.",
    "path": "/knowledge/ai-foundations/a-prompt-is-the-beginning-of-a-conversation"
  },
  {
    "title": "Knowledge Becomes an Asset When It Can Keep Working Without You",
    "description": "Knowledge becomes an asset when it can be found, trusted, used, shared, improved, and put to work repeatedly without depending on the owner to personally deliver it every time.",
    "path": "/knowledge/turning-what-a-business-knows-into-an-asset/knowledge-becomes-an-asset-when-it-can-keep-working-without-you"
  }
];

export default function NativeLessonPage015() {
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
        <section className="border-t border-slate-800 px-6 py-12"><div className="mx-auto max-w-3xl"><h2 className="mb-4 text-2xl font-black text-white">Continue the idea</h2><p className="mb-6 text-slate-400">A lifetime of experience becomes more useful when a business can keep learning from it.</p><Link to="/knowledge/turning-what-a-business-knows-into-an-asset" className="font-bold text-blue-400">Explore business knowledge <ArrowRight className="inline h-4 w-4" /></Link></div></section>
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

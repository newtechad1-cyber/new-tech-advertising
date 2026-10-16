import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Compass, Users, BookOpen } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import BookStructuredData from '@/components/books/BookStructuredData';
import { getBookByPath } from '@/data/bookSeo.js';
import PublicationSignupForm from '@/components/publishing/PublicationSignupForm';

const CHAPTERS = [
  { n: 1, title: 'Why "AI Curious" Instead of "AI Expert"', blurb: 'Curiosity comes first. You do not need to become a technician to start using AI well.' },
  { n: 2, title: 'What AI Actually Is (Without the Jargon)', blurb: 'A plain description of what artificial intelligence is doing when you use it.' },
  { n: 3, title: 'What AI Can and Cannot Do Today', blurb: 'Honest limits, so you know where to trust it and where to stay careful.' },
  { n: 4, title: 'How to Talk to AI So It Actually Helps', blurb: 'The way you ask shapes the answer you get. A simple habit that changes everything.' },
  { n: 5, title: 'Where AI Fits in an Ordinary Day', blurb: 'Practical examples of everyday tasks AI can support without taking over.' },
  { n: 6, title: 'Asking Better Questions, Getting Better Answers', blurb: 'How to give AI the context it needs instead of hoping it guesses right.' },
  { n: 7, title: 'Spotting When AI Is Wrong but Sounds Sure', blurb: 'Why AI can sound confident and still be mistaken, and how to check.' },
  { n: 8, title: 'Letting AI Handle the Busywork', blurb: 'Which repetitive tasks are safe to hand off and which still need you.' },
  { n: 9, title: 'Keeping Your Judgment in the Driver\u2019s Seat', blurb: 'AI can assist decisions. It should not own them. How to stay in charge.' },
  { n: 10, title: 'Privacy, Trust, and What You Share', blurb: 'What to think about before you put personal or business information into AI.' },
  { n: 11, title: 'Don\u2019t Buy Tools Before You Understand the Work', blurb: 'Why understanding the task first keeps you from spending on the wrong thing.' },
  { n: 12, title: 'Using AI to Understand Your Own World Better', blurb: 'AI as a mirror that helps you see your work, customers, and ideas more clearly.' },
  { n: 13, title: 'Small Experiments Before Big Commitments', blurb: 'A low-risk way to try AI on real tasks before you rely on it.' },
  { n: 14, title: 'Staying Curious: A Simple Way to Keep Learning', blurb: 'How to keep growing with AI one honest question at a time.' },
];

export default function AICurious() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <SEOHead
        title="AI Curious? - A First Look at AI for Everyday People | New Tech Advertising"
        description="AI Curious? is a welcoming first look at artificial intelligence for everyday people, no technical background required. Read online or download the free guide from New Tech Advertising."
      />
      <BookStructuredData book={getBookByPath('/ai-curious')} />
      <MarketingNav />

      <main>
        {/* 1. Hero */}
        <section className="relative overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.18),transparent_42%)]" />
          <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-8 lg:py-24 pt-32 sm:pt-32 lg:pt-32">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-16">
              <div className="w-full lg:w-1/2 xl:w-[55%]">
                <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-blue-400">AI for everyday people</p>
                <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">AI Curious?</h1>
                <p className="mt-5 text-2xl font-medium leading-relaxed text-blue-100">
                  You don&rsquo;t need to learn how AI works before you can learn how AI can work for you.
                </p>
                <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300">
                  AI Curious? is a welcoming first look at artificial intelligence written for everyday people, not
                  technicians. No jargon, no hype, and no pressure to become an expert. Just plain answers to the
                  questions curious people actually ask, and a calm starting point for anyone who wants to understand
                  AI before deciding what to do with it.
                </p>
                <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                  <a href="#book-request" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white hover:bg-blue-500 transition-colors">
                    Get AI Curious? <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link to="/books" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-7 py-4 font-bold text-white hover:bg-slate-800 transition-colors">
                    View all NTA books <BookOpen className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="w-full lg:w-1/2 xl:w-[45%] flex justify-center lg:justify-end">
                <img
                  src="https://media.base44.com/images/public/691f41a18de4a7f498c8f884/a9d6a747f_ai_curious_inspirational_landscape_cover.png"
                  alt="AI Curious? book cover by Rick Hesse"
                  className="w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[440px] h-auto object-contain rounded-xl shadow-2xl"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. About This Book */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">About this book</p>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">A calm place to start when everyone is telling you to catch up.</h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Most books about AI assume you already care about the technology. AI Curious? starts earlier. It assumes
              only that you are curious. Rick Hesse wrote it for the people who keep hearing about AI and quietly
              wonder whether they are missing something important, without wanting to be sold a tool or pressured into
              a course.
            </p>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              The book explains what AI is doing when you use it, where it genuinely helps, where it still needs your
              judgment, and how to try it on small real tasks before committing to anything bigger. It keeps the
              human in charge and the technology in a supporting role, the same way New Tech Advertising approaches
              every piece of work it builds.
            </p>
          </div>
        </section>

        {/* 3. 14-chapter structure */}
        <section className="border-t border-slate-800 bg-slate-900/40 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-white md:text-4xl">The 14 Chapters</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                Short, readable chapters that build one idea at a time. Read them in order or jump to the question
                you are most curious about.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {CHAPTERS.map(ch => (
                <div key={ch.n} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600/15 text-sm font-bold text-blue-300">
                      {ch.n}
                    </span>
                    <h3 className="text-base font-bold leading-snug text-white">{ch.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{ch.blurb}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Who this book is for */}
        <section className="border-t border-slate-800 px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <Users className="mx-auto h-12 w-12 text-blue-300" />
            <h2 className="mt-6 text-3xl font-bold text-white md:text-4xl">For anyone who is curious, not anyone who wants to be an expert.</h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              AI Curious? is for everyday people, small-business owners, parents, retirees, students, and anyone who
              wants to understand artificial intelligence without a class, a coding bootcamp, or a sales conversation.
              If you have ever read about AI and felt like you were being talked at instead of talked with, this book
              is written for you.
            </p>
          </div>
        </section>

        {/* 5. The NTA point of view / canonical home */}
        <section className="border-t border-slate-800 bg-slate-900/40 px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Compass className="h-10 w-10 text-blue-400" />
              <h2 className="mt-6 text-3xl font-bold text-white md:text-4xl">The canonical home for AI Curious?</h2>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                New Tech Advertising is the canonical online home for AI Curious? Here you can read the complete book
                online or download the PDF for free. The book is part of the NTA Publishing Platform and connects
                directly to the NTA Knowledge Library, the NTA Journal, and the practical systems NTA builds for the
                people it serves.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/knowledge/ai-foundations" className="inline-flex items-center gap-2 font-bold text-blue-400 hover:text-blue-300">Explore AI Foundations <ArrowRight className="h-4 w-4" /></Link>
                <Link to="/books" className="inline-flex items-center gap-2 font-bold text-blue-400 hover:text-blue-300">All NTA books <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
            <div className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-10 text-center">
              <h3 className="text-2xl font-bold text-blue-300 lg:text-3xl">
                People Always. AI Where It Genuinely Helps.
              </h3>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                Curiosity is not a weakness. It is the most honest place to begin.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Download / read online */}
        <section id="book-request" className="border-t border-slate-800 px-6 py-20">
          <div className="mx-auto max-w-4xl rounded-3xl border border-blue-400/20 bg-blue-500/5 p-9 text-center md:p-14">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">Free download</p>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">Read AI Curious? online or download the PDF</h2>
            <p className="mx-auto mt-5 mb-8 max-w-2xl text-lg leading-8 text-slate-300">
              Enter your details below for instant access. Your request will be saved in the NTA subscriber system, and
              you will be able to read the book online or download the PDF immediately.
            </p>
            <PublicationSignupForm
              publicationTitle="AI Curious?"
              publicationTag="ai-curious"
              source="ai_curious_free_download"
              accent="blue"
              showBusinessName={false}
              extraTags={['free-book-download']}
              consentContext="Requested free download of AI Curious? and agreed to receive related NTA publication updates."
              consentCheckboxText="I want to read AI Curious? and receive related NTA publication updates. I can unsubscribe at any time."
              successMessage="Thanks. Your request has been saved. You can read AI Curious? online or download the PDF below."
              downloadUrl="https://drive.usercontent.google.com/download?id=1yDbAw76zJlNM0uLpfKnt6T_7YaQi7d_7&export=download"
              viewerUrl="https://drive.google.com/file/d/1yDbAw76zJlNM0uLpfKnt6T_7YaQi7d_7/view?usp=sharing"
              downloadButtonLabel="Download AI Curious? PDF"
              readOnlineLabel="Read AI Curious? online"
              submitLabel="Get the free book"
            />
          </div>
        </section>

        {/* 7. Next-step / footer links */}
        <section className="border-t border-slate-800 bg-slate-950 px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-lg leading-8 text-slate-400">
              AI Curious? is part of the NTA Publishing Platform, created to help everyday people and small-business
              owners understand technology on their own terms, without hype or pressure.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <Link to="/books" className="font-bold text-blue-400 hover:text-blue-300">Books</Link>
              <span className="text-slate-700">•</span>
              <Link to="/practical-ai-for-small-business" className="font-bold text-blue-400 hover:text-blue-300">Practical AI for Small Business</Link>
              <span className="text-slate-700">•</span>
              <Link to="/knowledge/ai-foundations" className="font-bold text-blue-400 hover:text-blue-300">AI Foundations</Link>
              <span className="text-slate-700">•</span>
              <Link to="/" className="font-bold text-blue-400 hover:text-blue-300">Home</Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Users, Compass } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import BookStructuredData from '@/components/books/BookStructuredData';
import { getBookByPath } from '@/data/bookSeo.js';
import PublicationSignupForm from '@/components/publishing/PublicationSignupForm';

const PRACTICAL_AI_GUIDE_FAQS = [
  {
    question: 'Where should a small-business owner start with AI?',
    answer: 'Start with a real business need, not a list of tools. Look at where time, knowledge, communication, follow-up, or repeated work is being lost, then test one practical use of AI while keeping human judgment in control.'
  },
  {
    question: 'Do I need to understand AI technically before I can use it?',
    answer: 'No. A small-business owner needs enough understanding to ask useful questions, provide business context, review the work, and decide where AI belongs. The goal is practical use, not becoming an AI engineer.'
  },
  {
    question: 'How do I avoid wasting money on AI tools?',
    answer: 'Understand the business problem first, decide what result you need, and only then choose a tool. If the process is unclear, adding automation or another subscription usually adds complexity instead of value.'
  }
];

export default function PracticalAI() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <SEOHead
        title="Practical AI for Small Business | New Tech Advertising"
        description="Learn practical AI for small business through NTA's connected authority system: clear answers, real business experience, human judgment, lessons, tools, and working examples."
        faqs={PRACTICAL_AI_GUIDE_FAQS}
        learningData={{
          name: 'Practical AI for Small Business',
          description: 'A plainspoken practical-AI guide for small-business owners who want useful understanding without hype, jargon, or replacing human judgment.',
          educationalLevel: 'Beginner',
          learningResourceType: 'Guide and book'
        }}
      />
      <BookStructuredData book={getBookByPath('/practical-ai-for-small-business')} />
      <MarketingNav />

      <main>
        {/* 1. Hero section */}
        <section className="relative overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.2),transparent_42%)]" />
          <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-8 lg:py-24 pt-32 sm:pt-32 lg:pt-32">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-16">
              
              <div className="w-full lg:w-1/2 xl:w-[55%]">
                <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-indigo-400">Business education first. AI second.</p>
                <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">Practical AI for Small Business</h1>
                <p className="mt-5 text-2xl font-medium leading-relaxed text-indigo-100">
                  A plainspoken guide for business owners who want to understand AI without the hype, jargon, or confusion.
                </p>
                <h2 className="mt-7 text-2xl font-bold text-white">Where should a small-business owner start with AI?</h2>
                <p className="speakable mt-3 max-w-3xl text-lg leading-8 text-slate-300">
                  Start with a real business need, not a list of tools. Look at where time, knowledge, communication, follow-up, or repeated work is being lost, then test one practical use of AI while keeping human judgment in control.
                </p>
                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400">
                  This page is the central NTA hub for practical AI for small business. The free guide is one part of a larger body of lessons, questions, videos, examples, and working systems built from Rick Hesse's experience using AI in real business work.
                </p>
                <p className="mt-5 text-lg font-semibold text-indigo-300">
                  People Always. AI Where It Genuinely Helps.
                </p>
                <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                  <a href="#guide-request" className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-4 font-bold text-white hover:bg-indigo-500 transition-colors">
                    Get the Practical AI Guide <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="w-full lg:w-1/2 xl:w-[45%] flex justify-center lg:justify-end">
                <img 
                  src="https://media.base44.com/images/public/691f41a18de4a7f498c8f884/919f0b245_Practical_AI_for_Small_BusinessBookFrontCover.png" 
                  alt="Practical AI for Small Business book cover by Rick Hesse" 
                  className="w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[360px] xl:max-w-[400px] h-auto object-contain rounded-xl shadow-2xl"
                  loading="eager"
                />
              </div>

            </div>
          </div>
        </section>

        <section className="border-b border-slate-800 bg-slate-900/50 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-4xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-300">The NTA Authority System</p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">Authority is built by connecting what we know, teach, show, and verify.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                NTA is not trying to become known for repeating AI news or promoting the newest tool. The goal is to build a trustworthy body of practical knowledge around the questions small-business owners are actually asking, then connect that knowledge across the website so people, search engines, and AI answer systems can understand what NTA genuinely knows.
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <Link to="/practical-ai-for-small-business" className="rounded-2xl border border-indigo-400/20 bg-indigo-500/5 p-6 hover:border-indigo-300/50">
                <h3 className="text-xl font-bold text-white">Practical AI</h3>
                <p className="mt-3 leading-7 text-slate-400">Plainspoken teaching about where AI helps a real business and where human judgment still belongs.</p>
              </Link>
              <Link to="/ai-seo" className="rounded-2xl border border-emerald-400/20 bg-emerald-500/5 p-6 hover:border-emerald-300/50">
                <h3 className="text-xl font-bold text-white">AI Search Visibility</h3>
                <p className="mt-3 leading-7 text-slate-400">Helping Google and AI answer systems understand, retrieve, and cite useful business information.</p>
              </Link>
              <Link to="/operating-system" className="rounded-2xl border border-sky-400/20 bg-sky-500/5 p-6 hover:border-sky-300/50">
                <h3 className="text-xl font-bold text-white">Digital Growth Office</h3>
                <p className="mt-3 leading-7 text-slate-400">Connecting business knowledge, customer relationships, projects, content, approvals, and practical AI into one working system.</p>
              </Link>
              <Link to="/knowledge" className="rounded-2xl border border-amber-400/20 bg-amber-500/5 p-6 hover:border-amber-300/50">
                <h3 className="text-xl font-bold text-white">Knowledge Library</h3>
                <p className="mt-3 leading-7 text-slate-400">The reviewed lessons, questions, and ideas that turn lived experience into reusable business knowledge.</p>
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Why this guide exists */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">AI Is Not the Starting Point</h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Most small business owners are being told they need AI, but they are not being shown how it fits into the way a real business actually works. This guide was created to clear up the confusion. It explains AI in practical business language and helps owners see where AI can support their work without replacing the human relationships their business depends on.
            </p>
          </div>
        </section>

        {/* 3. What the guide helps business owners understand */}
        <section className="border-t border-slate-800 bg-slate-900/40 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-white md:text-4xl">What the guide helps business owners understand</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                "What AI is and what it is not",
                "Why AI should support business strategy, not replace it",
                "Where AI can save time in everyday business operations",
                "How AI can help with communication, follow-up, content, and customer education",
                "Why human judgment, trust, and relationships still matter most",
                "How to avoid wasting money on tools before building the right system"
              ].map((item, i) => (
                <div key={i} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                  <p className="mt-5 text-lg leading-7 text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. The NTA point of view */}
        <section className="border-t border-slate-800 px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Compass className="h-10 w-10 text-indigo-400" />
              <h2 className="mt-6 text-3xl font-bold text-white md:text-4xl">Business First. Technology Second.</h2>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                At New Tech Advertising, we believe technology should make business clearer, not more confusing. Practical AI is not about chasing every new tool. It is about helping owners build better systems, communicate more clearly, serve customers better, and protect the human trust that makes a business valuable.
              </p>
            </div>
            <div className="rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-10 text-center">
              <h3 className="text-2xl font-bold text-indigo-300 lg:text-3xl">
                People Always. AI Where It Genuinely Helps.
              </h3>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-800 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-300">Keep learning from the same source</p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">Practical AI should connect to deeper answers, not end on one page.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">The strongest authority comes from a connected body of useful material. These are the next places to continue depending on what you are trying to understand or accomplish.</p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <Link to="/knowledge/ai-foundations" className="rounded-2xl border border-slate-800 bg-slate-900/60 p-7 hover:border-indigo-400/40"><h3 className="text-xl font-bold text-white">AI Foundations</h3><p className="mt-3 leading-7 text-slate-400">Start with the lessons that explain AI, conversation, tools, systems, automation, GEO, and how the pieces fit together.</p></Link>
              <Link to="/knowledge/questions" className="rounded-2xl border border-slate-800 bg-slate-900/60 p-7 hover:border-indigo-400/40"><h3 className="text-xl font-bold text-white">Small-Business Questions</h3><p className="mt-3 leading-7 text-slate-400">Begin with the question you already have and move from a short answer into the deeper NTA teaching behind it.</p></Link>
              <Link to="/growth-show" className="rounded-2xl border border-slate-800 bg-slate-900/60 p-7 hover:border-indigo-400/40"><h3 className="text-xl font-bold text-white">NTA Growth Show</h3><p className="mt-3 leading-7 text-slate-400">Watch or listen to Rick work through practical AI and business ideas in a more conversational format.</p></Link>
              <Link to="/growth-guide" className="rounded-2xl border border-slate-800 bg-slate-900/60 p-7 hover:border-indigo-400/40"><h3 className="text-xl font-bold text-white">Your Digital Growth Guide™</h3><p className="mt-3 leading-7 text-slate-400">Talk through your own business situation instead of trying to figure out which tool, service, or page you are supposed to choose.</p></Link>
            </div>
          </div>
        </section>

        {/* 5. Who this guide is for */}
        <section className="border-t border-slate-800 bg-slate-900/40 px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <Users className="mx-auto h-12 w-12 text-indigo-300" />
            <h2 className="mt-6 text-3xl font-bold text-white md:text-4xl">Built for Real Small Business Owners</h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              This guide is for owners, entrepreneurs, startups, local businesses, and service companies who know AI matters but do not want to get lost in technical language or online hype. It is for people who want practical understanding, not another confusing sales pitch.
            </p>
          </div>
        </section>

        <section className="border-t border-slate-800 px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 text-center"><p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-300">Questions business owners ask</p><h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">Practical AI FAQs</h2></div>
            <div className="grid gap-5 md:grid-cols-3">
              {PRACTICAL_AI_GUIDE_FAQS.map((faq) => <article key={faq.question} className="rounded-2xl border border-slate-800 bg-slate-900/65 p-6"><h3 className="text-lg font-bold text-white">{faq.question}</h3><p className="mt-3 leading-7 text-slate-400">{faq.answer}</p></article>)}
            </div>
          </div>
        </section>

        {/* 6. Form section */}
        <section id="guide-request" className="border-t border-slate-800 px-6 py-20">
          <div className="mx-auto max-w-4xl rounded-3xl border border-indigo-400/20 bg-indigo-500/5 p-9 text-center md:p-14">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-300">Free Download</p>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">Get the Practical AI for Small Business Guide</h2>
            <p className="mx-auto mt-5 mb-8 max-w-2xl text-lg leading-8 text-slate-300">
              Enter your details below for instant access to the revised guide. Your request will be saved in the NTA subscriber system, and you will be able to download the PDF immediately.
            </p>
            <PublicationSignupForm
              publicationTitle="Practical AI for Small Business"
              publicationTag="practical-ai-for-small-business"
              source="practical_ai_free_download"
              accent="indigo"
              showBusinessName={true}
              extraTags={['free-book-download']}
              consentContext="Requested free download of Practical AI for Small Business and agreed to receive related NTA publication updates."
              consentCheckboxText="I want to download Practical AI for Small Business and receive related NTA publication updates. I can unsubscribe at any time."
              successMessage="Thanks. Your request has been saved. You can download Practical AI for Small Business below."
              downloadUrl="https://drive.usercontent.google.com/download?id=11nq430-bcstci_fuOP8Fm9g2xTk2n0yl&export=download"
              viewerUrl="https://drive.google.com/file/d/11nq430-bcstci_fuOP8Fm9g2xTk2n0yl/view?usp=sharing"
              downloadButtonLabel="Download Practical AI for Small Business"
            />
          </div>
        </section>

        {/* 7. Footer/next-step section */}
        <section className="border-t border-slate-800 bg-slate-950 px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-lg leading-8 text-slate-400">
              This guide is part of the NTA Publishing Platform, created to help small business owners build stronger foundations, clearer systems, and more trustworthy digital growth.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <Link to="/books" className="font-bold text-indigo-400 hover:text-indigo-300">Books</Link>
              <span className="text-slate-700">•</span>
              <Link to="/nta-journal" className="font-bold text-indigo-400 hover:text-indigo-300">Journal</Link>
              <span className="text-slate-700">•</span>
              <Link to="/" className="font-bold text-indigo-400 hover:text-indigo-300">Home</Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

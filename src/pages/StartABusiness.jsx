import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, BrainCircuit, CheckCircle2, Compass, Lightbulb, Users } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

const FOUNDATION_QUESTIONS = [
  'Who are you trying to help?',
  'What real problem are you prepared to solve?',
  'Why would someone trust you to solve it?',
  'What is the simplest useful offer you can make?',
  'How will people find, understand, and choose the business?',
  'What must happen after someone says yes?',
];

export default function StartABusiness() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <SEOHead
        title="How to Start a Small Business with a Strong Foundation | NTA"
        description="Practical guidance for aspiring entrepreneurs who want to turn an idea, skill, or app into a real small business—without wasting money on disconnected tools."
        faqs={[
          {
            question: 'What should I do first when I want to start a business?',
            answer: 'Start by identifying the person you want to help, the real problem you can solve, and the simplest useful offer. A name, logo, website, app, or AI tool cannot replace that business foundation.',
          },
          {
            question: 'Can AI help me start a small business?',
            answer: 'AI can help you research, organize ideas, compare choices, draft plans, and build useful systems. It should support your judgment and business purpose rather than become the business strategy by itself.',
          },
          {
            question: 'Do I need to build an app before I test my business idea?',
            answer: 'Usually not. First determine whether real people have the problem, understand the proposed solution, and are willing to take a meaningful next step. Then build the smallest system or app needed to serve them well.',
          },
        ]}
      />
      <MarketingNav />

      <main>
        <section className="relative overflow-hidden border-b border-slate-800 px-6 pb-20 pt-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.18),transparent_40%)]" />
          <div className="relative mx-auto max-w-5xl text-center">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-blue-400">A practical starting point for entrepreneurs</p>
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">Want to Start a Business? Build the Foundation Before You Buy the Tools.</h1>
            <p className="mx-auto mt-7 max-w-4xl text-xl leading-relaxed text-slate-300">
              Maybe you have a business idea, a skill people value, an app you want to build, or simply a need to create income of your own. The first step is not buying software or asking AI to build everything. It is understanding what the business must do for real people.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <a href="#starting-foundation" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white transition-colors hover:bg-blue-500">
                See the Starting Foundation <ArrowRight className="h-4 w-4" />
              </a>
              <Link to="/better-business-book" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-7 py-4 font-bold text-white transition-colors hover:bg-slate-800">
                Get The Better Business Book <BookOpen className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300"><Lightbulb className="h-6 w-6" /></div>
            <h2 className="text-3xl font-bold text-white md:text-4xl">An idea is the beginning—not yet the business.</h2>
            <div className="mt-7 space-y-5 text-lg leading-8 text-slate-300">
              <p>A good idea can create energy. It can also make us rush. We start thinking about the name, logo, website, app, social media, automation, or all the ways AI could help us build it.</p>
              <p>Those pieces may eventually matter. But a business begins when a real person has a real problem, understands the help being offered, trusts the person offering it, and is willing to exchange something of value.</p>
              <p>That is why New Tech Advertising teaches business principles first and technology second. The better you understand the business, the more useful every later tool becomes.</p>
            </div>
          </div>
        </section>

        <section id="starting-foundation" className="border-y border-slate-800 bg-slate-900/40 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <Compass className="mx-auto h-11 w-11 text-blue-400" />
              <h2 className="mt-5 text-3xl font-bold text-white md:text-4xl">Start with six business questions.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-400">You do not need every answer before you begin. You do need enough clarity to test the idea without spending blindly.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {FOUNDATION_QUESTIONS.map((question, index) => (
                <article key={question} className="rounded-2xl border border-slate-800 bg-slate-950 p-7">
                  <div className="mb-5 flex items-center justify-between">
                    <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                    <span className="text-3xl font-black text-slate-800">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold leading-7 text-white">{question}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
            <article className="rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-9">
              <BrainCircuit className="h-10 w-10 text-indigo-300" />
              <h2 className="mt-6 text-3xl font-bold text-white">Can AI help you start a business?</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">Yes—when you use it as a thinking and building partner. AI can help organize experience, research questions, compare options, draft explanations, document a process, or build a simple prototype. It cannot decide whether people truly need what you are creating, earn their trust for you, or take responsibility for the promises the business makes.</p>
              <Link to="/practical-ai-for-small-business" className="mt-7 inline-flex items-center gap-2 font-bold text-indigo-300 hover:text-indigo-200">Explore Practical AI for Small Business <ArrowRight className="h-4 w-4" /></Link>
            </article>

            <article className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-9">
              <Users className="h-10 w-10 text-blue-300" />
              <h2 className="mt-6 text-3xl font-bold text-white">Should you build the app first?</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">Usually, build the understanding first. Talk with the people you hope to serve. Learn how they handle the problem today. Find the smallest improvement they would genuinely use. An app becomes valuable when it supports a proven need and a clear human experience—not merely because modern AI can generate the code.</p>
              <Link to="/growth-conversation" className="mt-7 inline-flex items-center gap-2 font-bold text-blue-300 hover:text-blue-200">Talk through the idea <ArrowRight className="h-4 w-4" /></Link>
            </article>
          </div>
        </section>

        <section className="border-y border-slate-800 bg-slate-900/40 px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-white md:text-5xl">There is no honest shortcut—but there is a clearer path.</h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">If your goal is to make money, begin by creating something useful enough that another person is willing to pay for it. That requires understanding, testing, trust, and follow-through. NTA can help you learn the principles, organize the idea, and identify what to build next.</p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/growth-guide" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white transition-colors hover:bg-blue-500">Use the Digital Growth Guide <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/books" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-7 py-4 font-bold text-white transition-colors hover:bg-slate-900">Explore the free books <BookOpen className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, CheckCircle2, Compass, ShieldCheck, Users } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

const lessons = [
  {
    icon: Compass,
    title: 'Begin With the Business Problem',
    text: 'Choose AI only after you understand the work, the people involved, what already works, and the result you are trying to create.',
  },
  {
    icon: BrainCircuit,
    title: 'Use AI as a Practical Tool',
    text: 'Learn how AI can help organize information, clarify ideas, preserve knowledge, simplify work, and support better decisions.',
  },
  {
    icon: ShieldCheck,
    title: 'Keep Human Judgment in Charge',
    text: 'Understand where verification, responsibility, privacy, approval, and real human relationships must remain part of the process.',
  },
];

const readerOutcomes = [
  'Understand what modern AI can and cannot do without learning technical jargon.',
  'Recognize useful starting points inside an ordinary small business.',
  'Avoid buying tools before identifying the real problem they are supposed to solve.',
  'Use AI to strengthen human knowledge, judgment, communication, and customer relationships.',
  'Create practical boundaries for privacy, accuracy, approval, and accountability.',
  'Move from confusion and pressure to one useful experiment at a time.',
];

export default function PracticalAI() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <SEOHead
        title="Practical AI for Small Business | New Tech Advertising"
        description="Practical AI is Rick Hesse's plainspoken, nontechnical guide to using artificial intelligence as a useful small-business tool while keeping people, judgment, trust, and responsibility in charge."
      />
      <MarketingNav />

      <main>
        <section className="relative overflow-hidden border-b border-slate-800 px-6 pb-20 pt-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.2),transparent_42%)]" />
          <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div className="mx-auto w-full max-w-sm rounded-[2rem] border border-indigo-400/25 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-8 shadow-2xl shadow-indigo-950/50">
              <div className="flex min-h-[470px] flex-col justify-between rounded-2xl border border-white/10 p-8">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-indigo-300">New Tech Advertising</p>
                  <h1 className="mt-12 text-5xl font-black leading-[0.98] text-white">Practical<br />AI</h1>
                  <p className="mt-7 text-lg leading-7 text-indigo-100">A clear, human guide to using artificial intelligence in a real business.</p>
                </div>
                <div>
                  <div className="mb-5 h-px bg-indigo-300/30" />
                  <p className="font-semibold text-white">Rick Hesse</p>
                  <p className="mt-1 text-sm text-slate-400">Your Digital Growth Guide™</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-indigo-300">The second NTA book</p>
              <h2 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-6xl">AI is not the strategy. It is a tool.</h2>
              <p className="mt-7 max-w-3xl text-xl leading-8 text-slate-300">
                Practical AI is written for owners who are tired of hype, technical language, constant pressure, and expensive tools that arrive without a clear business purpose.
              </p>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">
                This book explains artificial intelligence through real business situations. It starts with the owner, the customer, the work, and the knowledge worth protecting—then shows where AI may help without pretending it should control everything.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a href="#availability" className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-4 font-bold text-white hover:bg-indigo-500">
                  Get publication updates <ArrowRight className="h-5 w-5" />
                </a>
                <Link to="/knowledge/ai-foundations" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-7 py-4 font-bold text-white hover:bg-slate-800">
                  Explore AI Foundations
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-300">What the book teaches</p>
              <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">Business principles first. Technology second.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-400">The goal is not to turn a business owner into a programmer. The goal is to help the owner make clearer, safer, and more useful decisions about AI.</p>
            </div>
            <div className="grid gap-7 md:grid-cols-3">
              {lessons.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300"><Icon className="h-6 w-6" /></div>
                  <h3 className="mt-6 text-xl font-bold text-white">{title}</h3>
                  <p className="mt-4 leading-7 text-slate-400">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-800 bg-slate-900/40 px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <Users className="h-9 w-9 text-indigo-300" />
              <h2 className="mt-5 text-3xl font-bold text-white md:text-4xl">Written for ordinary business owners</h2>
              <p className="mt-6 text-lg leading-8 text-slate-300">You do not need to understand models, coding, or every new AI product. You need enough understanding to ask better questions, protect what matters, and choose one useful application at a time.</p>
              <p className="mt-5 text-lg leading-8 text-slate-400">Rick draws from decades of owning businesses, working with owners, learning from mistakes, and helping people make complicated ideas practical. The technology is new. The business responsibilities are not.</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8">
              <h3 className="text-2xl font-bold text-white">After reading Practical AI, you should be able to:</h3>
              <ul className="mt-7 space-y-4">
                {readerOutcomes.map(outcome => (
                  <li key={outcome} className="flex gap-3 leading-7 text-slate-300">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-400" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Part of one connected NTA education system</h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">Practical AI continues the business foundation established in The Better Business Book. It also organizes and expands the practical AI lessons already being taught through the NTA Knowledge Library.</p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/better-business-book" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-7 py-3 font-bold text-white hover:bg-slate-800">Explore The Better Business Book</Link>
              <Link to="/books" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-7 py-3 font-bold text-white hover:bg-slate-800">View all NTA publications</Link>
            </div>
          </div>
        </section>

        <section id="availability" className="border-t border-slate-800 bg-indigo-950/25 px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-300">Publication updates</p>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">Practical AI is being prepared for release.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">The existing NTA subscriber and contact system will be connected here in a focused follow-up PR so readers can request the book and receive it by email when delivery is ready.</p>
            <Link to="/growth-conversation" className="mt-8 inline-flex items-center gap-2 font-bold text-indigo-300 hover:text-indigo-200">Talk with NTA about practical AI now <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

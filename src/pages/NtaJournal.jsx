import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Compass, Newspaper, Sparkles } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

const journalThemes = [
  {
    title: 'Better business thinking',
    description: 'Practical lessons about foundations, customer trust, relationships, decisions, and sustainable growth.',
    icon: Compass,
  },
  {
    title: 'Useful AI without the hype',
    description: 'Plainspoken guidance for deciding where AI can help, where it cannot, and where human judgment still matters.',
    icon: Sparkles,
  },
  {
    title: 'Ideas owners can use',
    description: 'Short articles designed to help owners think clearly, ask better questions, and take the next sensible step.',
    icon: BookOpen,
  },
];

export default function NtaJournal() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <SEOHead
        title="The NTA Journal | Practical Business and AI Guidance"
        description="The NTA Journal offers practical, plainspoken lessons about better business, digital trust, customer relationships, and useful AI for small-business owners."
      />
      <MarketingNav />

      <main>
        <section className="relative overflow-hidden border-b border-slate-800 px-6 pb-20 pt-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_40%)]" />
          <div className="relative mx-auto max-w-5xl text-center">
            <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
              <Newspaper className="h-8 w-8" />
            </div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-blue-400">The NTA Journal</p>
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">Practical guidance for owners building through change.</h1>
            <p className="mx-auto mt-7 max-w-3xl text-xl leading-relaxed text-slate-300">
              The NTA Journal connects timeless business principles with the changing digital world. It is written for owners who want useful ideas, clear explanations, and honest guidance without hype or technical clutter.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/knowledge" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-bold text-white hover:bg-blue-500">
                Explore current lessons <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/books" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-7 py-3 font-bold text-slate-200 hover:border-slate-600 hover:bg-slate-800">
                Visit the publishing hub
              </Link>
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">What the Journal covers</p>
              <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">Business first. Technology second. People always.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                Every Journal article begins with a real business question. Technology may be part of the answer, but it is never allowed to replace sound judgment, customer understanding, or the human relationships that make a business work.
              </p>
            </div>

            <div className="mt-12 grid gap-7 md:grid-cols-3">
              {journalThemes.map(({ title, description, icon: Icon }) => (
                <article key={title} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-white">{title}</h3>
                  <p className="mt-4 leading-7 text-slate-400">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-800 bg-slate-900/40 px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">Part of one connected system</p>
              <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">The Journal is where NTA keeps teaching.</h2>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                The books organize the larger ideas. The Knowledge Library preserves the complete lessons. The Growth Guide helps owners apply those ideas to their own businesses. The Journal keeps the conversation current by connecting all three to the questions owners are facing now.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/better-business-book" className="inline-flex items-center gap-2 font-semibold text-blue-400 hover:text-blue-300">
                  The Better Business Book <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/practical-ai" className="inline-flex items-center gap-2 font-semibold text-blue-400 hover:text-blue-300">
                  Practical AI <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <aside className="rounded-3xl border border-slate-700 bg-slate-950 p-8 shadow-2xl shadow-blue-950/20">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-400">Publishing updates</p>
              <h3 className="mt-4 text-2xl font-bold text-white">Receive new Journal articles and publication news.</h3>
              <p className="mt-4 leading-7 text-slate-400">
                This space is reserved for the existing NTA subscriber and contact system. A focused follow-up PR will connect the signup, preferences, and email-delivery workflow without creating a separate disconnected list.
              </p>
              <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-5 text-sm leading-6 text-slate-500">
                Subscriber integration intentionally pending.
              </div>
            </aside>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-4xl rounded-3xl border border-blue-400/20 bg-blue-500/10 px-8 py-12 text-center">
            <h2 className="text-3xl font-bold text-white">Start with the question your business is facing.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              The NTA Growth Conversation helps turn broad ideas into a practical next step based on your business, your customers, and what you are trying to build.
            </p>
            <Link to="/growth-conversation" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-bold text-white hover:bg-blue-500">
              Start a Growth Conversation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

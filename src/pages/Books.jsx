import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, BrainCircuit, Newspaper } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

const publications = [
  {
    title: 'The Better Business Book',
    subtitle: 'Practical business principles for building something that lasts.',
    description: 'A plainspoken guide to foundations, trust, customer relationships, systems, and the real work of growing a healthy small business.',
    href: '/better-business-book',
    label: 'Explore the book',
    icon: BookOpen,
    status: 'Coming soon',
  },
  {
    title: 'Practical AI',
    subtitle: 'A clear, nontechnical guide to using AI in a real business.',
    description: 'Learn where AI is useful, where human judgment still matters, and how to avoid turning another powerful tool into another source of confusion.',
    href: '/practical-ai',
    label: 'Explore Practical AI',
    icon: BrainCircuit,
    status: 'Coming soon',
  },
  {
    title: 'The NTA Journal',
    subtitle: 'Ongoing lessons for business owners navigating change.',
    description: 'Short, practical articles connecting business fundamentals, digital trust, customer relationships, and useful AI.',
    href: '/nta-journal',
    label: 'Visit the Journal',
    icon: Newspaper,
    status: 'Publishing platform',
  },
];

export default function Books() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <SEOHead
        title="Books and Journal | New Tech Advertising"
        description="Explore NTA books and the NTA Journal: practical business education, digital trust, customer relationships, and useful AI for small-business owners."
      />
      <MarketingNav />

      <main>
        <section className="relative overflow-hidden border-b border-slate-800 px-6 pb-20 pt-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.16),transparent_38%)]" />
          <div className="relative mx-auto max-w-5xl text-center">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-blue-400">The NTA Publishing Platform</p>
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">Practical ideas for building a better business.</h1>
            <p className="mx-auto mt-7 max-w-3xl text-xl leading-relaxed text-slate-300">
              NTA books and the NTA Journal turn decades of business experience into clear lessons small-business owners can understand, use, and return to as their businesses grow.
            </p>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-7 lg:grid-cols-3">
            {publications.map(({ title, subtitle, description, href, label, icon: Icon, status }) => (
              <article key={title} className="flex h-full flex-col rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-400">{status}</span>
                </div>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <p className="mt-3 font-medium text-blue-200">{subtitle}</p>
                <p className="mt-5 flex-1 leading-7 text-slate-400">{description}</p>
                <Link to={href} className="mt-8 inline-flex items-center gap-2 font-semibold text-blue-400 hover:text-blue-300">
                  {label} <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-800 bg-slate-900/40 px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Built from the NTA Knowledge Library</h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              These publications are not disconnected products. They organize and extend the same practical lessons found in the Knowledge Library, Growth Guide, and NTA operating philosophy.
            </p>
            <Link to="/knowledge" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-bold text-white hover:bg-blue-500">
              Explore the Knowledge Library <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

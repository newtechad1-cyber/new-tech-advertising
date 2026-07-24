import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, Library, Users } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import PublicationSignupForm from '@/components/publishing/PublicationSignupForm';

const themes = [
  'Build the foundation before chasing growth tactics',
  'Understand how customers decide who to trust',
  'Turn trust into stronger, longer relationships',
  'Create systems that preserve what the business knows',
  'Use technology without losing human judgment',
  'Grow in a way the owner and team can sustain',
];

export default function BetterBusinessBook() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <SEOHead
        title="The Better Business Book | New Tech Advertising"
        description="A practical, plainspoken business guide from Rick Hesse about foundations, trust, customer relationships, systems, and sustainable growth."
      />
      <MarketingNav />

      <main>
        <section className="relative overflow-hidden border-b border-slate-800 px-6 pb-20 pt-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_38%)]" />
          <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div>
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-blue-400">An NTA Business Guide</p>
              <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">The Better Business Book</h1>
              <p className="mt-5 text-2xl font-medium leading-relaxed text-blue-100">What decades of business experience taught me about building something that works.</p>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300">
                This is not a book about shortcuts, hype, or the newest marketing trick. It is a practical guide to the principles beneath a healthy business: a strong foundation, customer trust, lasting relationships, useful systems, and steady improvement.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a href="#book-updates" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white hover:bg-blue-500">
                  Request the book <ArrowRight className="h-4 w-4" />
                </a>
                <Link to="/knowledge/business-foundations" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-7 py-4 font-bold text-white hover:bg-slate-800">
                  Read Business Foundations <Library className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="mx-auto w-full max-w-md rounded-[2rem] border border-blue-500/25 bg-gradient-to-br from-blue-950 to-slate-900 p-10 shadow-2xl shadow-blue-950/40">
              <BookOpen className="h-12 w-12 text-blue-300" />
              <p className="mt-16 text-sm font-bold uppercase tracking-[0.24em] text-blue-300">Rick Hesse</p>
              <h2 className="mt-4 text-4xl font-black leading-tight text-white">The Better<br />Business Book</h2>
              <p className="mt-6 border-t border-blue-400/20 pt-6 text-lg leading-7 text-blue-100">Practical principles for building a business people can understand, trust, and sustain.</p>
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">Who this book is for</p>
              <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">For owners who want clarity, not another sales pitch.</h2>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                The Better Business Book is written for small-business owners, entrepreneurs, and people preparing to start something of their own. It explains business principles first and technology second, using real situations instead of jargon.
              </p>
              <div className="mt-8 flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <Users className="mt-1 h-6 w-6 flex-shrink-0 text-blue-300" />
                <p className="leading-7 text-slate-300">The goal is not to make the reader dependent on an expert. The goal is to help the reader see the business more clearly and make better decisions.</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 md:p-10">
              <h2 className="text-2xl font-bold text-white">What the book will help you understand</h2>
              <div className="mt-7 space-y-5">
                {themes.map(theme => (
                  <div key={theme} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
                    <p className="leading-7 text-slate-300">{theme}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-800 bg-slate-900/40 px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">The source behind the book</p>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">A complete business education system—not a disconnected manuscript.</h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              The book grows from the NTA Knowledge Library and connects directly to the Growth Guide, the NTA Journal, and the practical systems NTA is building for small-business owners. Readers will be able to move from a principle in the book to deeper lessons, guided questions, and practical next steps.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/knowledge" className="inline-flex items-center gap-2 font-bold text-blue-400 hover:text-blue-300">Knowledge Library <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/growth-conversation" className="inline-flex items-center gap-2 font-bold text-blue-400 hover:text-blue-300">Growth Conversation <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>

        <section id="book-updates" className="px-6 py-20">
          <div className="mx-auto max-w-4xl rounded-3xl border border-blue-500/20 bg-blue-500/5 p-9 text-center md:p-14">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">Book request</p>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">Receive The Better Business Book by email.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Add your name and email below. Your request will be saved in the existing NTA subscriber system, and the book will be sent when the email-delivery workflow is activated.
            </p>
            <PublicationSignupForm
              publicationTitle="The Better Business Book"
              publicationTag="better-business-book"
              source="better_business_book_page"
              accent="blue"
            />
            <Link to="/books" className="mt-8 inline-flex items-center gap-2 font-bold text-blue-300 hover:text-blue-200">
              View all NTA publications <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

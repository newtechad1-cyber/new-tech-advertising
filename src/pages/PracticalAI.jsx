import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, BookOpen, Users, Compass } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import PublicationSignupForm from '@/components/publishing/PublicationSignupForm';

export default function PracticalAI() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <SEOHead
        title="Practical AI for Small Business | New Tech Advertising"
        description="A plainspoken guide for business owners who want to understand AI without the hype, jargon, or confusion."
      />
      <MarketingNav />

      <main>
        {/* 1. Hero section */}
        <section className="relative overflow-hidden border-b border-slate-800 px-6 pb-20 pt-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.2),transparent_42%)]" />
          <div className="relative mx-auto grid max-w-6xl grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-indigo-400">Business education first. AI second.</p>
              <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">Practical AI for Small Business</h1>
              <p className="mt-5 text-2xl font-medium leading-relaxed text-indigo-100">
                A plainspoken guide for business owners who want to understand AI without the hype, jargon, or confusion.
              </p>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300">
                AI can help a small business, but only when it serves a real business purpose. This guide starts with business first — customers, trust, communication, follow-up, systems, and decision-making — then shows where AI can genuinely support the work.
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

            <div className="flex justify-center lg:justify-end">
              <img 
                src="https://media.base44.com/images/public/691f41a18de4a7f498c8f884/919f0b245_Practical_AI_for_Small_BusinessBookFrontCover.png" 
                alt="Practical AI for Small Business book cover by Rick Hesse" 
                className="w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[380px] xl:max-w-[420px] h-auto object-contain rounded-xl shadow-2xl shadow-indigo-950/40"
                loading="lazy"
              />
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

        {/* 6. Form section */}
        <section id="guide-request" className="border-t border-slate-800 px-6 py-20">
          <div className="mx-auto max-w-4xl rounded-3xl border border-indigo-400/20 bg-indigo-500/5 p-9 text-center md:p-14">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-300">Guide Request</p>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">Get the Practical AI for Small Business Guide</h2>
            <p className="mx-auto mt-5 mb-8 max-w-2xl text-lg leading-8 text-slate-300">
              Enter your details below to receive the guide. Delivery will be handled through the NTA publishing system.
            </p>
            <PublicationSignupForm
              publicationTitle="Practical AI for Small Business"
              publicationTag="practical-ai-for-small-business"
              source="practical_ai_landing_page"
              accent="indigo"
              showBusinessName={true}
              successMessage="Thanks. Your request for the Practical AI for Small Business guide has been received. Delivery will be handled through the NTA publishing system."
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
              <Link to="/journal" className="font-bold text-indigo-400 hover:text-indigo-300">Journal</Link>
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
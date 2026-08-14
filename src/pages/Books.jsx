import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

export default function Books() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <SEOHead
        title="Free Business Books for Small-Business Owners | New Tech Advertising"
        description="Download free practical business books from New Tech Advertising covering small-business growth, trust, systems, relationships, and practical AI."
      />
      <MarketingNav />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-slate-800 px-6 pb-20 pt-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.16),transparent_38%)]" />
          <div className="relative mx-auto max-w-5xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">Free Practical Business Books for Small-Business Owners</h1>
            <p className="mx-auto mt-7 max-w-3xl text-xl leading-relaxed text-slate-300">
              Plainspoken guides to help business owners understand growth, trust, systems, relationships, and practical AI without hype or confusion.
            </p>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-400">
              These books are part of the NTA Knowledge Library and are written for owners who want clearer business thinking before buying another disconnected tool, campaign, platform, or AI system.
            </p>
          </div>
        </section>

        {/* Main Positioning Section */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Business First. Technology Second. People Always.</h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              The Better Business Book explains the foundation of a stronger business: understanding, trust, systems, customer relationships, business knowledge, and connected growth.
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              Practical AI for Small Business builds on that foundation by showing where artificial intelligence can genuinely help when it is used as a tool, not as the strategy and not as a replacement for human judgment.
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-300 font-semibold text-white">
              These books belong together because AI works best when it supports a business that understands what it is trying to improve.
            </p>
          </div>
        </section>

        {/* Book Cards Section */}
        <section className="px-6 py-10">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
            
            {/* Card 1 */}
            <article className="flex flex-col rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-white">The Better Business Book</h3>
              <p className="mt-3 text-lg font-medium text-blue-300">
                How Small Businesses Grow Through Understanding, Trust, Systems, and Relationships
              </p>
              <p className="mt-5 flex-1 leading-7 text-slate-400">
                A practical guide for owners who want to build stronger businesses by understanding how growth really happens. This book explains why good businesses still struggle, how trust is earned, why systems matter, and how relationships create durable growth.
              </p>
              <Link to="/better-business-book" className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition-all hover:bg-blue-500">
                Get The Better Business Book <ArrowRight className="h-4 w-4" />
              </Link>
            </article>

            {/* Card 2 */}
            <article className="flex flex-col rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-white">Practical AI for Small Business</h3>
              <p className="mt-3 text-lg font-medium text-indigo-300">
                How to Use Artificial Intelligence as a Tool Without Losing the Human Side of Business
              </p>
              <p className="mt-5 flex-1 leading-7 text-slate-400">
                A plain-English guide for owners who want to understand AI without hype, jargon, or overwhelm. This book explains what AI can help with, what it cannot replace, and how to use it responsibly inside a real business.
              </p>
              <Link to="/practical-ai" className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition-all hover:bg-indigo-500">
                Get Practical AI for Small Business <ArrowRight className="h-4 w-4" />
              </Link>
            </article>

          </div>
        </section>

        {/* Why These Books Are Free Section */}
        <section className="border-t border-slate-800 bg-slate-900/30 px-6 py-20 mt-10">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Why These Books Are Free</h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              New Tech Advertising exists to help business owners understand before they spend. These books are offered free because many owners are being sold websites, campaigns, software, automation, and AI tools before anyone helps them understand the business problem those tools are supposed to solve.
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              The goal is simple: give owners practical education they can use to make better decisions.
            </p>
          </div>
        </section>

        {/* Knowledge Library Section */}
        <section className="border-t border-slate-800 bg-slate-950 px-6 py-20">
          <div className="mx-auto max-w-4xl text-center flex flex-col items-center">
            <BookOpen className="h-12 w-12 text-slate-500 mb-6" />
            <h2 className="text-3xl font-bold text-white md:text-4xl">Part of the NTA Knowledge Library</h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              These books are connected to the larger NTA Knowledge Library, a practical learning system covering business foundations, growth, trust, relationships, business knowledge, AI foundations, and digital trust.
            </p>
            <Link to="/knowledge" className="mt-8 inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-7 py-3 font-bold text-white transition-all hover:bg-slate-800 hover:text-white">
              Explore the Knowledge Library <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="border-t border-slate-800 bg-slate-900/50 px-6 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-white md:text-5xl">Start with the book that fits where you are right now.</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              If you want to understand how a stronger business grows, start with The Better Business Book.
            </p>
            <p className="mx-auto mt-2 max-w-2xl text-lg leading-8 text-slate-300">
              If you are trying to make sense of AI and how it fits into a real business, start with Practical AI for Small Business.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/better-business-book" className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white shadow-lg transition-all hover:bg-blue-500">
                Get The Better Business Book
              </Link>
              <Link to="/practical-ai" className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-4 font-bold text-white shadow-lg transition-all hover:bg-indigo-500">
                Get Practical AI for Small Business
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
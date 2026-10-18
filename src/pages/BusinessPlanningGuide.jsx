import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, ExternalLink, MessageCircle } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

const GPT_URL = 'https://chatgpt.com/g/g-6ad3e2f05bfc81918a82ff3dbe385d0a-nta-business-growth-guide';

export default function BusinessPlanningGuide() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <SEOHead title="Free AI Business Planning Guide | 50 Years of Business Experience | NTA" description="Built on Rick Hesse’s nearly 50 years in retail, wholesale, B2B and online business. Explore your idea and build a practical business plan through a free guided AI conversation." />
      <MarketingNav />
      <main>
        <section className="border-b border-slate-800 px-6 pb-20 pt-32">
          <div className="mx-auto max-w-4xl">
            <p className="mb-5 text-sm font-bold uppercase tracking-widest text-blue-400">Free business education from New Tech Advertising</p>
            <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">50 Years of Business Experience. Now You Can Learn From It Through AI.</h1>
            <p className="mt-6 text-2xl font-semibold text-blue-200">Not just a business plan generator. A guide to understanding the business you want to build.</p>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-300">Thinking about starting a business, making a change, or strengthening one you already own? The free NTA Business Growth Guide helps you work through the real questions behind business decisions—one conversation at a time. It draws on the practical lessons and teaching approach of Rick Hesse, developed through nearly five decades of firsthand business experience.</p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a href={GPT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white hover:bg-blue-500">Start My Free Business Plan <ExternalLink className="h-5 w-5" /></a>
              <Link to="/knowledge/business-foundations" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-7 py-4 font-semibold text-white hover:bg-slate-900">Read Business Foundations <ArrowRight className="h-5 w-5" /></Link>
            </div>
            <p className="mt-4 text-sm text-slate-400">The guide opens in ChatGPT. A ChatGPT account may be required. Your conversation takes place in ChatGPT, not on the NTA website.</p>
          </div>
        </section>
        <section className="border-b border-slate-800 px-6 py-16">
          <div className="mx-auto grid max-w-5xl items-start gap-10 md:grid-cols-[1.1fr_.9fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-400">The experience behind the guide</p>
              <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">Built from a lifetime of doing business—not just talking about it.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">I’m Rick Hesse. Over nearly 50 years, I’ve worked in retail, wholesale, business-to-business sales, and online business. I’ve learned from customers, made decisions with real consequences, and seen how important it is to understand a business before trying to grow it.</p>
              <p className="mt-4 text-lg leading-8 text-slate-300">I built this guide to share those lessons in a way more people can use. You bring your idea, questions, and circumstances. AI helps turn my business teachings into a conversation you can work through at your own pace.</p>
              <Link to="/our-story" className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-300 hover:text-blue-200">Learn more about Rick’s experience <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="rounded-2xl border border-blue-500/30 bg-slate-900 p-7 md:p-8">
              <h3 className="text-2xl font-bold text-white">What makes this different?</h3>
              <p className="mt-4 leading-7 text-slate-300">Many AI business tools focus on producing an answer or a finished document. This guide is designed to help you understand the decisions behind the plan.</p>
              <p className="mt-4 leading-7 text-slate-300">It listens first, asks one useful question at a time, explains practical options, and helps you distinguish what you know from what you still need to find out.</p>
              <p className="mt-4 leading-7 text-slate-300">It uses AI and information too. The difference is the real-world business perspective and teaching method shaping the conversation—not a claim that technology can replace personal judgment.</p>
            </div>
          </div>
        </section>
        <section className="px-6 py-16">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {[
              ['Explore your idea', 'Talk through what you want to build, whom it serves, and why customers might choose it.'],
              ['Understand the numbers', 'Work through costs, pricing, sales assumptions, cash flow, and questions still needing answers.'],
              ['Build a useful plan', 'Turn the conversation into a practical draft with assumptions, open questions, and next steps.']
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-7">
                <CheckCircle2 className="mb-5 h-7 w-7 text-emerald-400" />
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <p className="mt-3 leading-7 text-slate-300">{description}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="border-t border-slate-800 bg-slate-900/40 px-6 py-16">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-700 p-8">
              <BookOpen className="mb-4 h-7 w-7 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Want to learn before you plan?</h2>
              <p className="mt-3 leading-7 text-slate-300">Explore Rick Hesse's Better Business Building Book and the NTA Knowledge Library.</p>
              <Link to="/better-business-book" className="mt-5 inline-flex items-center gap-2 font-semibold text-blue-300 hover:text-blue-200">Explore the book <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="rounded-2xl border border-slate-700 p-8">
              <MessageCircle className="mb-4 h-7 w-7 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Already running a business?</h2>
              <p className="mt-3 leading-7 text-slate-300">For advertising, visibility, customer experience, and practical digital growth support, use Your Digital Growth Guide™ on NTA's website.</p>
              <Link to="/growth-guide" className="mt-5 inline-flex items-center gap-2 font-semibold text-blue-300 hover:text-blue-200">Explore Your Digital Growth Guide™ <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

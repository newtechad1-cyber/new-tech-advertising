import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, ExternalLink, MessageCircle } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { startupQuestions } from '@/pages/StartingBusinessQuestion';

const GPT_URL = 'https://chatgpt.com/g/g-6ad3e2f05bfc81918a82ff3dbe385d0a-nta-business-growth-guide';


const planningQuestions = [
  [
    "How do I write a business plan if I've never written one before?",
    "Start with your business idea, the customers you want to serve, what you'll offer, how you'll operate, and what the numbers might look like. You don't need to finish everything at once. A useful plan can grow as you answer questions and verify assumptions."
  ],
  [
    "Can AI help me create a business plan?",
    "Yes. AI can help organize your thinking, ask useful questions, explore options, and draft a plan. It cannot independently verify every assumption or guarantee your business will succeed. Your knowledge and judgment remain essential."
  ],
  [
    "What should a simple business plan include?",
    "A practical plan explains the business idea, customers, products or services, competition, operations, startup costs, revenue assumptions, cash flow, risks, and next steps. The amount of detail depends on what decisions the plan needs to support."
  ],
  [
    "How much revenue does my business need to replace my paycheck?",
    "Begin with your household income needs, then account for business expenses, taxes, benefits, debt payments, and cash reserves. Revenue is not take-home pay. A business may need substantially more sales than your current salary to support the same lifestyle."
  ],
  [
    "How do I know whether my business plan is realistic?",
    "Look for evidence behind your assumptions. Can you reach enough paying customers? Are prices and costs reasonable? Is the workload manageable? Can the business withstand slower months? A realistic plan identifies what still needs testing."
  ],
  [
    "What makes the NTA Business Growth Guide different from other AI business planning tools?",
    "The guide is shaped by Rick Hesse's nearly 50 years of experience in retail, wholesale, B2B, and online business. Rather than simply generating a document, it uses a question-first teaching method to help you understand your choices, recognize risks, and build a practical plan around your circumstances."
  ],
  [
    "Can an AI business guide really teach me about running a business?",
    "AI can make experienced business teachings more accessible through conversation. The NTA guide draws on practical lessons and structured methods developed from Rick's business experience. It helps you think through decisions, but doesn't replace real-world research, professional advice, or your judgment."
  ],
  [
    "Is the NTA Business Growth Guide free to use?",
    "The guide is offered by New Tech Advertising as a free educational resource. It opens through ChatGPT, where account requirements and usage limits may apply. You can explore ideas and develop a business-plan draft without committing to NTA services."
  ],
  [
    "Can I save the business plan I create with the guide?",
    "Yes. You can ask the guide to organize your conversation into a written business plan that you can copy, save, review, and continue developing. The plan should distinguish established facts from assumptions and unanswered questions."
  ]
];

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
        <section className="border-t border-slate-800 px-6 py-16" id="business-planning-questions">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-400">Questions people ask</p>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">Business planning questions, answered in plain language</h2>
            <p className="mt-4 leading-7 text-slate-300">Explore the answers here, then use the free guide to work through what they mean for your own business.</p>
            <div className="mt-8 space-y-3">
              {planningQuestions.map(([question, answer]) => <details key={question} className="group rounded-xl border border-slate-700 bg-slate-900/60 p-5">
                <summary className="cursor-pointer text-lg font-semibold text-white marker:text-blue-400">{question}</summary>
                <p className="mt-4 leading-7 text-slate-300">{answer}</p>
              </details>)}
            </div>
            <h2 className="mt-14 text-2xl font-bold text-white">Thinking about starting a business?</h2>
            <p className="mt-3 leading-7 text-slate-300">Start with the question that matters most to you. Each article offers practical considerations and a question to take into your own planning conversation.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {startupQuestions.map(item => <Link key={item.slug} to={'/business-planning-guide/questions/' + item.slug} className="flex items-center justify-between gap-4 rounded-xl border border-slate-700 bg-slate-900 p-5 text-blue-200 hover:border-blue-400 hover:text-white"><span className="font-semibold">{item.title}</span><ArrowRight className="h-5 w-5 flex-shrink-0" /></Link>)}
            </div>
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

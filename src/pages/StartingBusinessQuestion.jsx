import { Link, useParams } from 'react-router-dom';
import { ArrowRight, BookOpen, ExternalLink } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

export const startupQuestions = [
  {
    slug: 'is-my-business-idea-worth-pursuing',
    title: 'How do I know if my business idea is worth pursuing?',
    summary: 'A promising idea solves a problem people care enough about to pay for. Before spending money, identify your likely customers, what they need, who serves them now, and how you could test demand on a small scale.',
    sections: [
      ['Start with the customer, not the idea', 'What problem would your business solve? Who has that problem often enough to pay for a solution? Describe a specific customer and the situation that would cause them to choose you. An idea becomes more useful when you can explain the customer need in plain language.'],
      ['Look at what people already do', 'Existing competitors are not automatically bad news: they may show that customers already spend money in this category. Find out what customers value, what frustrates them, and what would make your offer meaningfully different. Avoid assuming that everyone will switch simply because your product is new.'],
      ['Test before you invest heavily', 'Talk with potential customers, seek specific feedback, and, where lawful and practical, try a small paid pilot. Track actual interest and willingness to pay, not just compliments. Decide in advance what evidence would encourage you to proceed and what would make you reconsider.']
    ],
    reflection: 'Who are the first five people who might actually pay for this, and what would they be paying to solve?'
  },
  {
    slug: 'start-a-business-while-working-full-time',
    title: 'Can I start a business while keeping my full-time job?',
    summary: 'Often, yes, depending on licensing requirements, your employment agreement, available time, and the kind of business. Starting gradually may let you test demand and understand expenses before risking your family’s primary income.',
    sections: [
      ['Protect the income you already have', 'Start by writing down your household’s essential monthly expenses and the income you must preserve. Consider benefits, insurance, debt payments, and emergency savings. The question is not only whether the new business can earn money, but when its cash flow might reliably support your household.'],
      ['Check the practical boundaries', 'Review any employment restrictions, conflicts of interest, licensing rules, insurance requirements, and local regulations. Do not use an employer’s customers, equipment, or confidential information without permission. Decide what hours you can responsibly commit without compromising your current work or family life.'],
      ['Build evidence before making the leap', 'Use your preparation period to research costs, speak with potential customers, build a simple plan, and test manageable opportunities. Establish clear milestones before leaving your job: demand, available cash, required equipment, and a realistic transition budget.']
    ],
    reflection: 'What would need to be true financially before you could safely reduce or leave your current employment?'
  },
  {
    slug: 'how-much-money-to-start-small-business',
    title: 'How much money do I need to start a small business?',
    summary: 'There is no single startup amount. Estimate equipment, licensing, insurance, supplies, marketing, operating expenses, and working capital. Separate what you need before opening from what you can add after customers begin paying.',
    sections: [
      ['Separate one-time costs from monthly costs', 'One-time costs might include licenses, equipment, deposits, initial supplies, and setup. Ongoing costs might include insurance, software, fuel, rent, accounting, and marketing. Make two lists instead of mixing everything into one startup number.'],
      ['Include the cash needed to operate', 'A business can have sales and still run short of cash if customers pay later than bills come due. Estimate how much cash you need to operate through a slow start, delayed payments, and unexpected expenses. Keep household emergency funds distinct from business spending.'],
      ['Build a lean and a full version', 'Ask what you truly need to serve your first customer safely and legally. Then list improvements you can defer until the business proves demand. Price assumptions should come from quotes and research, not invented averages.']
    ],
    reflection: 'Which expenses are essential before your first sale, and which can wait until customers are paying?'
  },
  {
    slug: 'borrow-money-or-start-small',
    title: 'Should I borrow money to start a business or start small?',
    summary: 'That depends on household finances, the business model, available savings, and whether customers have demonstrated demand. Borrowing can accelerate a viable business, but creates payment obligations before revenue is dependable.',
    sections: [
      ['Understand what the loan would actually accomplish', 'Borrowing for equipment required to complete profitable work is different from borrowing to cover an untested idea’s recurring losses. Identify the purchase, its useful life, and how it could help produce revenue. Compare that with a smaller version of the business.'],
      ['Test the downside, not only the best case', 'Estimate monthly payments and what happens if sales arrive later than expected. Consider existing personal debt, family expenses, and emergency reserves. Avoid using optimistic revenue forecasts as though they are guaranteed cash.'],
      ['Look for staged alternatives', 'Could you rent equipment, buy used, start part-time, pre-sell a service, or delay optional spending? Sometimes a modest pilot teaches you more than a large initial investment. A lender or qualified financial adviser can help review the terms and risks of specific financing.']
    ],
    reflection: 'If sales were half of what you hope for during the first six months, could you still make the payments?'
  },
  {
    slug: 'start-business-without-running-one-before',
    title: 'How do I start a business with little experience running one?',
    summary: 'Begin with what you know, identify the business responsibilities you haven’t handled before, and learn them one decision at a time. Experience doing the work is valuable, but pricing, bookkeeping, customer relationships, and cash flow require attention too.',
    sections: [
      ['Recognize the difference between the work and the business', 'Being skilled at plumbing, cooking, design, or another trade is a strong starting point. Running the business also means quoting work, collecting payments, managing costs, keeping records, and finding customers. Name the areas you know well and those you need to learn.'],
      ['Learn through a simple operating plan', 'Write down how a customer finds you, requests work, receives a quote, approves it, gets the service, and pays. Then map what information you need at each step. Clear processes matter more than complicated software in the beginning.'],
      ['Ask questions and build a support circle', 'Talk with experienced owners, an accountant, relevant licensing authorities, and mentors. You do not need to know everything before starting, but you do need to know where the important risks are and whom to ask.']
    ],
    reflection: 'Which part of running the business—not doing the work itself—feels least familiar right now?'
  }
];

export default function StartingBusinessQuestion({ initialSlug = null }) {
  const { slug: routeSlug } = useParams();
  const slug = routeSlug || initialSlug;
  const article = startupQuestions.find(item => item.slug === slug);
  if (!article) return <div className="min-h-screen bg-slate-950 text-white"><MarketingNav /><main className="mx-auto max-w-3xl px-6 pt-36"><h1 className="text-3xl font-bold">Question not found</h1><Link to="/business-planning-guide" className="mt-6 inline-block text-blue-300">Return to the Business Planning Guide</Link></main><SiteFooter /></div>;
  return <div className="min-h-screen bg-slate-950 text-slate-200">
    <SEOHead title={article.title + ' | NTA Business Foundations'} description={article.summary} />
    <MarketingNav />
    <main className="mx-auto max-w-4xl px-6 pb-20 pt-32">
      <Link to="/business-planning-guide" className="text-sm font-semibold text-blue-300 hover:text-blue-200">Business Planning Guide</Link>
      <p className="mt-8 text-sm font-bold uppercase tracking-widest text-blue-400">Business Foundations · Practical questions</p>
      <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl">{article.title}</h1>
      <p className="mt-6 text-xl leading-8 text-slate-300">{article.summary}</p>
      <div className="mt-12 space-y-10">{article.sections.map(([heading, body]) => <section key={heading}><h2 className="text-2xl font-bold text-white">{heading}</h2><p className="mt-4 text-lg leading-8 text-slate-300">{body}</p></section>)}</div>
      <section className="mt-12 rounded-2xl border border-blue-500/30 bg-slate-900 p-8">
        <h2 className="text-2xl font-bold text-white">A question worth asking yourself</h2>
        <p className="mt-3 text-lg leading-8 text-slate-200">{article.reflection}</p>
        <p className="mt-5 leading-7 text-slate-300">You don't need to solve everything today. The free NTA Business Growth Guide helps you work through your own circumstances, one question at a time, using lessons shaped by Rick Hesse's nearly 50 years in business.</p>
        <Link to="/business-planning-guide" className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-300 hover:text-blue-200">Continue with the free planning guide <ArrowRight className="h-4 w-4" /></Link>
      </section>
      <section className="mt-12 border-t border-slate-800 pt-8"><h2 className="text-xl font-bold text-white">More questions about starting a business</h2><div className="mt-5 space-y-3">{startupQuestions.filter(item => item.slug !== slug).map(item => <p key={item.slug}><Link to={'/business-planning-guide/questions/' + item.slug} className="text-blue-300 hover:text-blue-200">{item.title}</Link></p>)}</div><Link to="/knowledge/business-foundations" className="mt-6 inline-flex items-center gap-2 text-slate-300 hover:text-white"><BookOpen className="h-4 w-4" /> Explore Business Foundations lessons</Link></section>
    </main>
    <SiteFooter />
  </div>;
}

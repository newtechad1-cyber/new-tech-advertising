import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, BookOpen, Brain, Building2, CheckCircle2, Compass, Lightbulb, MessageSquareText, MonitorSmartphone, Search, Users } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

const cycle = ['Listen', 'Capture', 'Understand', 'Decide', 'Act', 'Measure', 'Learn', 'Improve'];

const questions = [
  'Can customers quickly understand what we do and who we help?',
  'Does the site answer what people need to know before they visit, buy, or contact us?',
  'Is it easy to use on a phone and easy to find the next step?',
  'Does it reflect what our team and customers are teaching us?',
  'Does it connect with product information, customer service, advertising and the systems we already use?',
  'Are we improving the site as the business changes, or treating it as a one-time project?',
];

const possibilities = [
  { icon: MonitorSmartphone, title: 'Improve what you already have', text: 'Sometimes the right answer is better structure, clearer language, stronger mobile usability or a few focused pages—not a new website.' },
  { icon: Search, title: 'Make useful knowledge easier to find', text: 'Customer questions, team knowledge and real business experience can become helpful pages for people and search engines.' },
  { icon: Users, title: 'Connect the website to the business', text: 'Connect the customer experience with the information and work behind it: product knowledge, store visits, purchases, order updates, useful follow-up and existing systems.' },
  { icon: Compass, title: 'Rebuild when rebuilding makes sense', text: 'If the existing site is holding the business back, a rebuild can be part of the Roadmap—but the business need comes first.' },
];

const RETAIL_PATHS = [
  {
    title: 'A sewing-machine or specialty shop',
    question: 'How do we help someone choose the right product and understand the value of buying from us?',
    text: 'Your website can extend the helpful conversation at the counter through product explanations, demonstrations, and answers. Classes, service, supplies, and after-purchase help belong in that path when your shop offers them.',
    outcome: 'Look at useful visits, purchases, and continuing customer relationships—not only form submissions.',
  },
  {
    title: 'A variety or neighborhood store',
    question: 'Do people know what we carry, what is new, and why they should stop in again?',
    text: 'Connect advertising, seasonal merchandise, useful product ideas, and current store information. A manageable selection of products may serve customers better than a full catalog the team cannot keep current.',
    outcome: 'Look at store purchases, repeat visits, and which merchandise is selling.',
  },
  {
    title: 'An ecommerce business',
    question: 'Can customers find the right item, buy with confidence, and receive what we promised?',
    text: 'Product information and availability need to connect with checkout, order handling, delivery, returns, and customer support. We first review the existing selling platform and daily work rather than assume you need another system.',
    outcome: 'Look at completed orders, what remains after costs, reliable delivery, and repeat purchases.',
  },
  {
    title: 'A store that also sells online',
    question: 'Can a customer move between our website and our store without starting over?',
    text: 'Someone may research online and buy in the store, or discover a product in person and reorder online. Confirm how product information, availability, pickup or shipping, and customer help will stay connected.',
    outcome: 'Look at the whole customer relationship across online and in-store activity.',
  },
];

export default function AiWebsites() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash === '#retail-and-online-stores') {
      document.getElementById('retail-and-online-stores')?.scrollIntoView({ block: 'start' });
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <SEOHead
        title="Do I Need a Better Business Website? | New Tech Advertising"
        description="Understand what your website should do for your shop, online store, restaurant, or service business. Connect customer needs, advertising, and everyday work."
      />
      <MarketingNav />

      <main>
        <section className="relative overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.20),_transparent_42%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-semibold text-blue-300">
              <MessageSquareText className="h-4 w-4" /> A practical website conversation
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">
              “I need a better website.” <span className="text-blue-400">Maybe. Let’s understand what needs to be better first.</span>
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl">
              Your website matters. But it is one part of your business—not the whole Growth Roadmap. Before recommending a rebuild, NTA looks at what you already have, what customers need, what your team knows, and what you are actually trying to improve.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/start" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white transition hover:bg-blue-500">
                Start a Free Growth Conversation <ArrowRight className="h-5 w-5" />
              </Link>
              <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('nta:open-growth-guide', { detail: { source: 'ai_websites' } }))} className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-7 py-4 font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900">
                Ask Your Digital Growth Guide™
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 text-slate-900">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Start with the question</p>
                <h2 className="mt-3 text-3xl font-black md:text-4xl">What should a useful business website actually do?</h2>
                <p className="mt-5 text-lg leading-relaxed text-slate-600">A useful website helps people understand the business, answers real questions, builds confidence, and gives someone a sensible next step. It should also help the business learn—not just sit online unchanged.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {questions.map((question) => (
                  <div key={question} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <CheckCircle2 className="mb-3 h-5 w-5 text-blue-600" />
                    <p className="font-semibold leading-relaxed">{question}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="retail-and-online-stores" aria-labelledby="retail-heading" className="scroll-mt-20 border-t border-slate-800 bg-slate-950 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">Retail and online stores</p>
              <h2 id="retail-heading" className="mt-3 text-3xl font-black text-white md:text-4xl">Your website should fit the way your customers shop.</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-300">A physical retailer, an online seller, a restaurant, and a service company do not need identical websites. Start with how people discover, choose, buy, and return to your business. Then decide what the website and the work behind it need to do.</p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {RETAIL_PATHS.map(({ title, question, text, outcome }) => (
                <article key={title} className="rounded-2xl border border-slate-700 bg-slate-900 p-6 md:p-8">
                  <h3 className="text-xl font-bold text-white">{title}</h3>
                  <p className="mt-4 font-semibold leading-relaxed text-cyan-200">{question}</p>
                  <p className="mt-4 leading-relaxed text-slate-300">{text}</p>
                  <p className="mt-5 border-t border-slate-700 pt-4 text-sm leading-relaxed text-slate-300"><strong className="text-white">A useful measure:</strong> {outcome}</p>
                </article>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-cyan-800/50 bg-cyan-950/20 p-6 md:p-8">
              <h3 className="text-xl font-bold text-white">A useful retail website does not have to be a full online store.</h3>
              <p className="mt-3 max-w-4xl leading-relaxed text-slate-300">It may need to help customers discover what you carry, answer questions, or plan a visit. Online purchasing belongs in the plan only when it fits your products, margins, staff capacity, and existing systems. These are starting points for discovery, not a feature package every retailer needs.</p>
              <Link to="/start?source=retail-and-online-stores" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300">Talk about your store <ArrowRight className="h-5 w-5" aria-hidden="true" /></Link>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-800 bg-slate-900 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">The NTA point of view</p>
              <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">The website is part of a connected business.</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-300">Someone may arrive here because they think they need a website. That is a good place to begin. The answer may be a new website, improvements to the current one, better Google visibility, clearer customer communication, stronger follow-up, better use of existing knowledge—or a combination.</p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {possibilities.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                  <Icon className="h-7 w-7 text-blue-400" />
                  <h3 className="mt-4 text-xl font-bold text-white">{title}</h3>
                  <p className="mt-2 leading-relaxed text-slate-400">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20 text-slate-900">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 p-7">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h2 className="mt-5 text-2xl font-black">Digital Growth Office™</h2>
              <p className="mt-3 leading-relaxed text-slate-600">A practical place for the owner, team and NTA to capture questions, ideas, customer knowledge and ongoing work so improvement does not depend on starting over.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 p-7">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h2 className="mt-5 text-2xl font-black">Knowledge Library</h2>
              <p className="mt-3 leading-relaxed text-slate-600">Owner knowledge, employee experience, customer questions, documents and conversations gradually become a reusable business asset. Some of that knowledge may become useful website content.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 p-7">
              <Compass className="h-8 w-8 text-blue-600" />
              <h2 className="mt-5 text-2xl font-black">Digital Growth Roadmap™</h2>
              <p className="mt-3 leading-relaxed text-slate-600">The Roadmap helps identify what deserves attention now, what can wait, and how website work fits with the rest of the business.</p>
            </div>
          </div>
        </section>

        <section className="bg-blue-950/30 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <Lightbulb className="mx-auto h-8 w-8 text-blue-400" />
              <h2 className="mt-4 text-3xl font-black text-white md:text-4xl">Growth is a learning cycle, not a one-time website project.</h2>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              {cycle.map((step, index) => (
                <div key={step} className="rounded-xl border border-blue-500/20 bg-slate-950 px-3 py-5 text-center">
                  <div className="text-xs font-bold text-blue-400">{String(index + 1).padStart(2, '0')}</div>
                  <div className="mt-1 font-bold text-white">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-800 bg-slate-900 py-20">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <Brain className="mx-auto h-9 w-9 text-blue-400" />
            <h2 className="mt-5 text-3xl font-black text-white">Where AI fits</h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">AI can help capture, remember, organize, summarize, retrieve, identify patterns and prepare useful follow-up. It can help turn what your business already knows into something easier to use.</p>
            <p className="mx-auto mt-5 max-w-3xl text-xl font-bold text-blue-300">People provide the knowledge. AI helps the business remember, organize and use it. People make the decisions.</p>
          </div>
        </section>

        <section className="bg-white py-20 text-slate-900">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <h2 className="text-3xl font-black md:text-4xl">You do not need to know whether you need a new website before we talk.</h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">Bring the question you have now. We will start there, look at the larger business, and help you understand the next practical step. NTA is based in Mason City, Iowa, and can work with businesses regardless of location.</p>
            <Link to="/start" className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white transition hover:bg-blue-500">
              Start a Free Growth Conversation <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

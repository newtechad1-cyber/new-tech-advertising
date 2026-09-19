import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Brain, Building2, CheckCircle2, Compass, Lightbulb, MessageSquareText, MonitorSmartphone, Search, Users } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

const cycle = ['Listen', 'Capture', 'Understand', 'Decide', 'Act', 'Measure', 'Learn', 'Improve'];

const questions = [
  'Can customers quickly understand what we do and who we help?',
  'Does the site answer the questions people actually ask before they call?',
  'Is it easy to use on a phone and easy to find the next step?',
  'Does it reflect what our team and customers are teaching us?',
  'Does it connect with Google, follow-up, reviews, social media and the rest of the business?',
  'Are we improving the site as the business changes, or treating it as a one-time project?',
];

const possibilities = [
  { icon: MonitorSmartphone, title: 'Improve what you already have', text: 'Sometimes the right answer is better structure, clearer language, stronger mobile usability or a few focused pages—not a new website.' },
  { icon: Search, title: 'Make useful knowledge easier to find', text: 'Customer questions, team knowledge and real business experience can become helpful pages for people and search engines.' },
  { icon: Users, title: 'Connect the website to the business', text: 'The website may need to work more closely with Google, reviews, customer follow-up, social content, video or internal systems.' },
  { icon: Compass, title: 'Rebuild when rebuilding makes sense', text: 'If the existing site is holding the business back, a rebuild can be part of the Roadmap—but the business need comes first.' },
];

export default function AiWebsites() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <SEOHead
        title="Do I Need a Better Business Website? | New Tech Advertising"
        description="A practical way to evaluate your business website, understand what it should accomplish, and decide whether to improve, rebuild, or connect it to a larger Digital Growth Roadmap."
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

import { ArrowRight, BookOpen, CircleHelp, Link2, MessageCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackJourneyEvent } from '@/lib/journeyAnalytics';

const BUSINESS_PATHS = [
  {
    title: 'Learn',
    description: 'Understand practical AI and business growth in plain language before deciding what to change.',
    to: '/knowledge',
    icon: BookOpen,
    step: 'learn'
  },
  {
    title: 'Get Found',
    description: 'See how your business can become easier for Google and AI answer systems to understand and find.',
    to: '/ai-seo',
    icon: Search,
    step: 'get_found'
  },
  {
    title: 'Get Things Connected',
    description: 'Bring business knowledge, customers, follow-up, projects, approvals, tracking, and practical AI into one working system.',
    to: '/operating-system',
    icon: Link2,
    step: 'get_connected'
  }
];

export default function HeroSection() {
  const openGrowthGuide = (source = 'homepage_hero') => {
    trackJourneyEvent('question_growth_guide_opened', {
      route: '/',
      step: 'dont_know_what_to_fix_first',
      source
    });
    window.dispatchEvent(new CustomEvent('nta:open-growth-guide', {
      detail: { source, question: 'I do not know what to fix first.' }
    }));
  };

  const trackQuestionPath = (step) => {
    trackJourneyEvent('question_path_opened', {
      route: '/',
      step,
      source: 'homepage_question_paths'
    });
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 pb-20 pt-20 text-white lg:pb-28 lg:pt-28">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -left-24 top-20 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-[34rem] w-[34rem] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Practical AI and business guidance for small business</p>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">What are you trying to figure out in your business?</h1>
          <div className="mx-auto mt-7 max-w-3xl space-y-4 text-lg leading-relaxed text-slate-300 md:text-xl">
            <p className="speakable font-semibold text-white">Start with the question, frustration, or opportunity already on your mind. You do not need to know which tool, service, or technology to ask for first.</p>
            <p>New Tech Advertising helps small-business owners understand practical AI, improve visibility, connect useful business knowledge, and turn the right ideas into working improvements.</p>
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button type="button" onClick={() => openGrowthGuide('homepage_primary')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white transition-colors hover:bg-blue-500"><MessageCircle className="h-5 w-5" /> What would you like to talk through?</button>
            <Link to="/growth-conversation" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-900/60 px-7 py-4 font-bold text-white transition-colors hover:border-slate-400 hover:bg-slate-800">Talk with Rick <ArrowRight className="h-5 w-5" /></Link>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-2xl text-center md:mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Or choose a simple direction.</h2>
          <p className="mt-3 text-base leading-relaxed text-slate-300 md:text-lg">You can learn first, work on being found, or start connecting the business. The deeper NTA system stays behind these simple entrances.</p>
        </div>

        <div className="mx-auto mt-6 grid max-w-5xl gap-4 md:mt-8 md:grid-cols-2">
          {BUSINESS_PATHS.map(({ title, description, to, icon: Icon, step }) => (
            <Link
              key={step}
              to={to}
              onClick={() => trackQuestionPath(step)}
              className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-left transition-colors hover:border-blue-500/60 hover:bg-slate-900"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-blue-300" />
              </div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
            </Link>
          ))}

          <button
            type="button"
            onClick={() => openGrowthGuide('homepage_question_paths')}
            className="group rounded-2xl border border-cyan-400/25 bg-gradient-to-br from-blue-950/65 to-slate-900 p-6 text-left transition-colors hover:border-cyan-300/60"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-200">
                <CircleHelp className="h-5 w-5" />
              </div>
              <ArrowRight className="h-5 w-5 text-cyan-300 transition-transform group-hover:translate-x-1" />
            </div>
            <h3 className="text-xl font-bold text-white">I don&apos;t know what to fix first</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">Tell Your Digital Growth Guide™ what is going on. Start with the question you have, even if you are not sure how to name it.</p>
          </button>
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-slate-500">Understanding comes before technology. You can explore without pressure, and you do not have to understand any NTA system before getting a useful answer.</p>
      </div>
    </section>
  );
}
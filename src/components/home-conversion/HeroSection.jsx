import { ArrowRight, BookOpen, CircleHelp, Clock, Globe, MessageCircle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackJourneyEvent } from '@/lib/journeyAnalytics';

const BUSINESS_PATHS = [
  {
    title: 'I need more customers',
    description: 'Help people discover what you offer, choose with confidence, and come back—to shop, dine, order online, or use your services.',
    to: '/knowledge/questions/how-can-ai-help-me-get-more-customers',
    icon: Users,
    step: 'more_customers'
  },
  {
    title: 'I want to save time',
    description: 'See where AI can help prepare, organize, and reduce repeated setup without taking over the work.',
    to: '/knowledge/questions/how-can-ai-save-me-time-in-my-business',
    icon: Clock,
    step: 'save_time'
  },
  {
    title: "My website isn't working",
    description: 'Start with what your website needs to do: help people shop, plan a meal, order, find answers, or begin a service conversation.',
    to: '/ai-websites',
    icon: Globe,
    step: 'website_not_working'
  },
  {
    title: "I'm trying to understand AI",
    description: 'Get a plainspoken explanation of where AI fits in a real small business and where it does not.',
    to: '/knowledge/questions/how-can-a-small-business-use-ai',
    icon: BookOpen,
    step: 'understand_ai'
  },
  {
    title: 'I want customers to stay connected',
    description: 'Make useful follow-up, customer help, and reasons to return part of the relationship—not just the first purchase or visit.',
    to: '/knowledge/questions/how-can-ai-help-with-customer-follow-up',
    icon: MessageCircle,
    step: 'customer_follow_up'
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
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Better advertising starts with the customer
          </p>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Advertise Better.
          </h1>
          <div className="mx-auto mt-7 max-w-3xl space-y-4 text-lg leading-relaxed text-slate-300 md:text-xl">
            <p className="font-semibold text-white">
              Start with your customer. Not the advertising product.
            </p>
            <p>
              New Tech Advertising helps small-business owners connect <strong className="text-white">their advertising, customer experience, and everyday operations—so people can find them, understand what they offer, buy with confidence, and come back.</strong>
            </p>
            <p>
              You do not need to know which tool or service to ask for. Tell us what is happening in your business. We listen to you and your team, look at how customers find, choose, and buy from you, and agree on the next useful improvement. Your <strong className="text-white">Digital Growth Roadmap™</strong> keeps that work connected to the whole business. Advertising, websites, AI, and other tools serve the work—not the other way around.
            </p>
            <p className="font-semibold text-blue-200">
              Better advertising starts with better understanding.
            </p>
            <p className="text-base text-slate-300">
              A <Link to="/ai-websites#retail-and-online-stores" className="font-semibold text-cyan-200 underline underline-offset-4 hover:text-white">small shop or online store</Link>, a <Link to="/restaurants" className="font-semibold text-cyan-200 underline underline-offset-4 hover:text-white">restaurant</Link>, and a service business need different customer paths. We start with how your customers shop, dine, order, or ask for help.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              <h2 className="text-xl font-bold text-white">{title}</h2>
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
            <h2 className="text-xl font-bold text-white">I don&apos;t know what to fix first</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">Tell Your Digital Growth Guide™ what is going on. Start with the question you have, even if you are not sure how to name it.</p>
          </button>
        </div>

        <div className="mx-auto mt-10 max-w-5xl rounded-3xl border border-slate-700/80 bg-slate-900/75 p-6 shadow-2xl shadow-cyan-950/15 backdrop-blur-sm md:flex md:items-center md:justify-between md:gap-8 md:p-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">A simple place to start</p>
            <h2 className="mt-3 text-2xl font-bold text-white">Start with what is happening in your business.</h2>
            <p className="mt-3 leading-relaxed text-slate-300">You do not need to know the right question yet. Describe a familiar frustration or something you would like to improve. Your Digital Growth Guide™ can help you explore it, or you can talk with a real person at NTA.</p>
          </div>
          <div className="mt-6 flex shrink-0 flex-col gap-3 sm:flex-row md:mt-0 md:flex-col">
            <button type="button" onClick={() => openGrowthGuide()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-colors hover:bg-blue-500">
              <MessageCircle className="h-5 w-5" /> Ask Your Digital Growth Guide™
            </button>
            <Link to="/knowledge/questions" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-950/50 px-6 py-3.5 font-bold text-slate-100 transition-colors hover:border-slate-400 hover:bg-slate-800">
              Browse all questions <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <p className="mx-auto mt-7 max-w-3xl text-center text-sm leading-relaxed text-slate-500">
          Prefer to learn before changing anything? The Free AI Guy remains part of the free NTA learning experience, but you do not have to understand any branded system before getting a useful answer.
        </p>
      </div>
    </section>
  );
}
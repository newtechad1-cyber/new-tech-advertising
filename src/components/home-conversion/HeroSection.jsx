import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Check, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const FREE_AI_GUY_VIDEO_URL = 'https://static.metricool.com/planner/202608/6613716-file-8942274907299959414.mp4';

const entrySteps = [
  {
    number: '01',
    title: 'Free AI Education',
    description: 'Learn what AI can actually do for a real business—without hype, pressure, or technical language.',
    icon: BookOpen,
  },
  {
    number: '02',
    title: 'Meet the Free AI Guy',
    description: 'Ask a question, talk through a problem, and find a useful next step in a natural conversation.',
    icon: MessageCircle,
  },
  {
    number: '03',
    title: 'Talk to My Office™',
    description: 'When you want NTA involved, the conversation can move from learning into practical business help.',
    icon: Check,
  }
];

export default function HeroSection() {
  const openGrowthGuide = () => {
    window.dispatchEvent(new CustomEvent('nta:open-growth-guide', {
      detail: { source: 'homepage_hero' }
    }));
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 pb-20 pt-20 text-white lg:pb-28 lg:pt-28">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -left-24 top-20 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-[34rem] w-[34rem] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400"
          >
            Free AI Education · From New Tech Advertising
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-7 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
          >
            Understand AI. Use it in the real world.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl space-y-5 text-lg leading-relaxed text-slate-300 md:text-xl"
          >
            <p>
              Work with AI without changing how you work. Practical AI education helps you understand what AI can do, where it fits, and how to use it in a real business.
            </p>
            <p>
              Start with a free lesson. When you want to talk it through, meet the Free AI Guy inside the experience. When a human conversation would help, Talk to My Office™.
            </p>
          </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
            >
              <Button asChild size="lg" className="bg-blue-600 px-7 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:bg-blue-500">
                <Link to="/knowledge/ai-foundations">
                  Start with Free AI Education
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button type="button" onClick={openGrowthGuide} size="lg" variant="outline" className="border-slate-600 bg-slate-950/40 px-7 text-white hover:bg-slate-800 hover:text-white">
                <MessageCircle className="mr-2 h-5 w-5" />
                Ask the Free AI Guy
              </Button>
            </motion.div>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-500">
              The education is free. Tools, implementation, and ongoing services may have a cost—but you will always know what you are choosing and why.
            </p>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="relative overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm sm:p-8"
            id="free-ai-guy-video"
            aria-label="Meet the Free AI Guy"
          >
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="relative flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Inside Free AI Education</p>
                <h2 className="mt-3 text-3xl font-bold text-white">Meet the Free AI Guy.</h2>
                <p className="mt-4 max-w-sm text-base leading-relaxed text-slate-300">
                  A friendly guide for practical questions—not a gimmick, and not a replacement for your judgment.
                </p>
              </div>
              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200">Guide</span>
            </div>

            <div className="relative my-7 overflow-hidden rounded-2xl border border-slate-700 bg-black shadow-xl">
              <video
                src={FREE_AI_GUY_VIDEO_URL}
                controls
                playsInline
                preload="metadata"
                className="aspect-video w-full"
                aria-label="Meet the Free AI Guy — Practical AI Education"
              />
            </div>

            <div className="relative space-y-3 border-t border-slate-700/80 pt-5">
              {['Ask a practical question', 'Talk through a business problem', 'Find the next useful step'].map(item => (
                <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                  <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <button type="button" onClick={openGrowthGuide} className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-200">
              Talk to My Office™
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.aside>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 border-t border-slate-800/80 pt-8"
        >
          <div className="mb-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">A simple way in</p>
            <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">Learn first. Talk when you are ready.</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {entrySteps.map(({ number, title, description, icon: Icon }) => (
              <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900/45 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <Icon className="h-5 w-5 text-blue-400" />
                  <span className="text-xs font-bold tracking-[0.2em] text-slate-600">{number}</span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}


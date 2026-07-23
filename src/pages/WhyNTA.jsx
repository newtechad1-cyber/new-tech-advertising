import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Compass, Heart, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/shared/SEOHead';

const principles = [
  {
    icon: Shield,
    title: 'Trust Before Technology',
    text: 'People deserve to understand what is being recommended, how technology will be used, and who remains responsible for the result.'
  },
  {
    icon: Brain,
    title: 'The Big Picture First',
    text: 'I begin with the business, the people, the work, and the desired outcome before choosing tools, platforms, automation, or AI.'
  },
  {
    icon: Users,
    title: 'Systems Should Serve People',
    text: 'Technology should make a business clearer, more capable, and more human—not force owners, employees, or customers to serve the system.'
  }
];

export default function WhyNTA() {
  const fadeIn = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55 } }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-24">
      <SEOHead
        title="Why I Do This Work | New Tech Advertising"
        description="Meet Rick Hesse and understand the human-centered philosophy connecting New Tech Advertising, practical AI, trust, and lifelong learning."
      />

      <section className="relative border-b border-slate-800/70 px-6 pb-20 pt-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.16),transparent_38%)]" />
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="relative mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
            <Compass className="h-4 w-4" /> The person behind the work
          </div>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white md:text-6xl">Why I Do This Work</h1>
          <p className="mt-7 max-w-3xl text-xl leading-relaxed text-slate-300">
            New Tech Advertising is more than a collection of marketing and AI services. It is the practical expression of a lifetime spent studying how businesses grow, how people build trust, why systems fail, and how complicated ideas can become useful.
          </p>
        </motion.div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl space-y-8 text-lg leading-8 text-slate-300">
          <p>I have spent much of my life trying to understand how things work.</p>
          <p>Why do some businesses grow while others struggle? Why do hardworking owners become buried beneath disconnected tools? Why do useful technologies so often create more confusion instead of making life simpler?</p>
          <p>Those questions led me to build New Tech Advertising.</p>
          <p>I want to help small-business owners see the larger picture—not simply buy another website, platform, automation, or AI subscription. Before recommending technology, I want to understand the business, protect what already works, preserve what the owner and employees know, and determine what will genuinely improve the experience for the people involved.</p>
          <blockquote className="my-12 border-l-4 border-blue-500 bg-slate-900/70 px-7 py-6 text-2xl font-medium italic leading-relaxed text-blue-100">
            Technology changes. Human principles endure. My work is helping people use new technology without abandoning those enduring principles.
          </blockquote>
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900/40 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-7 md:grid-cols-3">
            {principles.map(({ icon: Icon, title, text }) => (
              <motion.article key={title} variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-3xl border border-slate-800 bg-slate-950 p-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300"><Icon className="h-6 w-6" /></div>
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <p className="mt-3 leading-7 text-slate-400">{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[1.1fr_.9fr] md:items-start">
          <div className="space-y-7 text-lg leading-8 text-slate-300">
            <h2 className="text-3xl font-bold text-white md:text-4xl">I See Artificial Intelligence Differently</h2>
            <p>Many people in the AI world begin with code, tools, models, applications, and what can be built next. That work matters, but my mind usually goes somewhere else.</p>
            <p>I begin with the human problem. Who are we trying to help? What knowledge might disappear? What relationship could be strengthened or harmed? What already works and must be protected? What decisions must remain human?</p>
            <p>I do not believe AI is the source of wisdom. Wisdom comes from life—from experience, failure, work, relationships, faith, questions, love, and time. AI can help us gather that wisdom, organize it, connect it, and make it useful.</p>
            <Button asChild className="mt-3 bg-blue-600 hover:bg-blue-500">
              <Link to="/knowledge/ai-foundations/i-see-artificial-intelligence-differently">Read the AI Foundations lesson <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          <aside className="rounded-3xl border border-amber-400/20 bg-amber-400/5 p-8">
            <Heart className="h-8 w-8 text-amber-300" />
            <h2 className="mt-5 text-2xl font-bold text-white">The other expression of the same life</h2>
            <p className="mt-4 leading-7 text-slate-300">Talking About Jesus may appear unrelated to my business work, but both grew from the same desire: helping people move from confusion to understanding, from fear to clarity, and from being treated as a transaction to being treated as a person.</p>
            <a href="https://talkingaboutjesus.net/why-i-do-this-work" className="mt-6 inline-flex items-center font-semibold text-amber-200 hover:text-amber-100">Visit Talking About Jesus <ArrowRight className="ml-2 h-4 w-4" /></a>
          </aside>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-900 p-9 md:p-14">
          <h2 className="text-3xl font-bold text-white">Why this matters if we work together</h2>
          <div className="mt-7 space-y-5 text-lg leading-8 text-slate-300">
            <p>You do not need to share every belief I hold to work with me. But you deserve to know the person and principles behind the work.</p>
            <p>I want to understand before I recommend. I want to preserve what is already good. I want to be honest about what technology can and cannot do. I want the people I serve to understand what we are building together.</p>
            <p>That does not make me better or wiser than anyone else. It simply explains why I approach business this way—and why trust is the foundation of everything I build.</p>
          </div>
          <Button asChild size="lg" className="mt-9 bg-blue-600 hover:bg-blue-500">
            <Link to="/book-call">Start an honest conversation <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

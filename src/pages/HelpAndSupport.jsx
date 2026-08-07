import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  HelpCircle,
  MessageCircle,
  Phone,
  Sparkles,
} from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

const START_OPTIONS = [
  {
    icon: BookOpen,
    label: 'Learn about AI',
    title: 'Start with Free AI Education',
    text: 'Take a practical lesson and see how AI can fit into a real business without hype or technical language.',
    action: 'Start a free lesson',
    to: '/knowledge/ai-foundations',
    color: 'blue',
  },
  {
    icon: MessageCircle,
    label: 'Ask a question',
    title: 'Meet the Free AI Guy',
    text: 'Talk through a business question, an idea, or something you are trying to figure out.',
    action: 'Ask the Free AI Guy',
    guide: true,
    color: 'cyan',
  },
  {
    icon: ClipboardCheck,
    label: 'See what needs attention',
    title: 'Take the Free Business Gap Audit',
    text: 'Get a useful first-pass look at the visible gaps that may be holding your business back.',
    action: 'Start the free audit',
    to: '/free-audit',
    color: 'emerald',
  },
];

const FAQS = [
  {
    question: 'What is Free AI Education?',
    answer: 'Free AI Education is NTA’s public teaching experience for business owners who want to understand AI in practical terms. The lessons are free, conversational, and focused on what AI can actually help you do.',
  },
  {
    question: 'Who is the Free AI Guy?',
    answer: 'The Free AI Guy is the friendly guide inside NTA’s free education experience. He can help you ask questions, talk through a business problem, and find a useful next step. Rick and New Tech Advertising remain the real people and company behind the experience.',
  },
  {
    question: 'What is Talk to My Office™?',
    answer: 'Talk to My Office™ is NTA’s voice-first way of working with AI. You can speak naturally, type, or share a file or photo. The system helps understand what you need and organizes the next step before anything important happens.',
  },
  {
    question: 'Is the help on this page free?',
    answer: 'Free AI Education, the Free AI Guy, and the first-pass Business Gap Audit are available as free starting points. If you later want NTA to provide implementation, deeper diagnosis, or ongoing services, those options are explained clearly before you choose them.',
  },
  {
    question: 'Do I need to be technical to use this?',
    answer: 'No. The goal is to help you work with AI without changing how you work. Start with a question in ordinary language and let the conversation help you decide what makes sense.',
  },
];

function openGrowthGuide(source = 'help_support') {
  window.dispatchEvent(new CustomEvent('nta:open-growth-guide', { detail: { source } }));
}

export default function HelpAndSupport() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SEOHead
        title="Help & Support | New Tech Advertising"
        description="Find your next step with New Tech Advertising: Free AI Education, the Free AI Guy, Talk to My Office™, the free Business Gap Audit, and direct help."
      />
      <MarketingNav />

      <main>
        <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-20 sm:py-28">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="relative mx-auto max-w-5xl text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
              <HelpCircle className="h-7 w-7 text-cyan-300" />
            </div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">A simple place to begin</p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Help & Support</h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-300 sm:text-xl">
              Whether you are learning about AI, trying to solve a business problem, or deciding what to do next, start here. You do not have to know the right words before you begin.
            </p>
          </div>
        </section>

        <section className="border-b border-slate-800 bg-slate-950 px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Choose your next step</p>
              <h2 className="text-3xl font-bold sm:text-4xl">Start wherever you are comfortable.</h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-400">
                NTA is built around education and useful conversations. Each option gives you more clarity without forcing you into the next one.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {START_OPTIONS.map(({ icon: Icon, label, title, text, action, to, guide, color }) => (
                <article key={title} className="flex flex-col rounded-3xl border border-slate-800 bg-slate-900/70 p-7 shadow-xl shadow-black/10">
                  <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-${color}-500/10 text-${color}-300`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className={`text-sm font-semibold uppercase tracking-wider text-${color}-300`}>{label}</p>
                  <h3 className="mt-3 text-2xl font-bold">{title}</h3>
                  <p className="mt-4 flex-1 leading-relaxed text-slate-400">{text}</p>
                  {guide ? (
                    <button type="button" onClick={() => openGrowthGuide('help_support_card')} className={`mt-7 inline-flex items-center gap-2 font-semibold text-${color}-300 hover:text-white`}>
                      {action} <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <Link to={to} className={`mt-7 inline-flex items-center gap-2 font-semibold text-${color}-300 hover:text-white`}>
                      {action} <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-800 bg-slate-900/40 px-6 py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">What you can expect</p>
              <h2 className="text-3xl font-bold sm:text-4xl">Useful guidance, in plain language.</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-400">
                The point is not to give you more software to learn. It is to help you understand your situation, see your options, and take the next useful step.
              </p>
              <button type="button" onClick={() => openGrowthGuide('help_support_expectations')} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500">
                Talk to My Office™ <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'Ask questions in ordinary language.',
                'Learn what AI can and cannot do.',
                'Talk through a real business problem.',
                'Find the right next step before making a decision.',
                'Use the free audit to identify visible gaps.',
                'Bring in human help when it would be useful.',
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Frequently asked</p>
              <h2 className="text-3xl font-bold sm:text-4xl">A few answers before you begin.</h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, index) => (
                <div key={faq.question} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-white hover:bg-slate-800/70"
                    aria-expanded={expandedFaq === index}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFaq === index && (
                    <div className="border-t border-slate-800 px-6 py-5 leading-relaxed text-slate-400">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-800 bg-gradient-to-r from-blue-950 to-cyan-950 px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <Sparkles className="mx-auto mb-5 h-8 w-8 text-cyan-300" />
            <h2 className="text-3xl font-bold">Still not sure where to start?</h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-300">
              That is exactly what the Free AI Guy and Talk to My Office™ are for. Start with what is on your mind, and let the conversation help organize it.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button type="button" onClick={() => openGrowthGuide('help_support_bottom')} className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-300">
                Meet the Free AI Guy <MessageCircle className="h-5 w-5" />
              </button>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-xl border border-slate-600 px-6 py-3 font-semibold text-white hover:bg-slate-800">
                Contact NTA <Phone className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

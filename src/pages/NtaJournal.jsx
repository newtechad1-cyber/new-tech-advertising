import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, Mail, Newspaper, Sparkles } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import PublicationSignupForm from '@/components/publishing/PublicationSignupForm';

const journalThemes = [
  {
    title: 'Better business thinking',
    description: 'Practical lessons about foundations, customer trust, relationships, decisions, and sustainable growth.',
    icon: BookOpen,
  },
  {
    title: 'Useful AI without the hype',
    description: 'Plainspoken guidance for deciding where AI can help, where it cannot, and where human judgment still matters.',
    icon: Sparkles,
  },
  {
    title: 'One useful idea each week',
    description: 'A focused edition you can read, think about, and apply without adding more noise to your week.',
    icon: CalendarDays,
  },
];

const readerPromises = [
  'Practical guidance written for small-business owners and entrepreneurs.',
  'Business principles first, with technology explained in plain language.',
  'Honest lessons from building NTA, including what worked and what did not.',
  'A clear action or question you can apply to your own business.',
  'No hype, technical clutter, or endless tool promotion.',
];

export default function NtaJournal() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <SEOHead
        title="Subscribe to The NTA Journal | Practical Business and AI Guidance"
        description="Get The NTA Journal each Monday: practical, plainspoken lessons about business growth, digital trust, customer relationships, and useful AI for small-business owners."
      />
      <MarketingNav />

      <main>
        <section className="relative overflow-hidden border-b border-slate-800 px-6 pb-20 pt-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.2),transparent_42%)]" />
          <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="mb-7 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
                <Newspaper className="h-8 w-8" />
              </div>
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-indigo-400">The NTA Journal</p>
              <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
                Practical business and AI guidance, delivered once a week.
              </h1>
              <p className="mt-7 max-w-3xl text-xl leading-relaxed text-slate-300">
                The NTA Journal is a free Monday publication for owners who want useful ideas, clear explanations, and honest guidance without hype or technical clutter.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#subscribe"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 font-bold text-white hover:bg-indigo-500"
                >
                  Subscribe free <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  to="/journal/issue-1-the-system-behind-the-work"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-7 py-3 font-bold text-slate-200 hover:border-slate-600 hover:bg-slate-800"
                >
                  Read Edition 1
                </Link>
              </div>
            </div>

            <aside id="subscribe" className="scroll-mt-28 rounded-3xl border border-indigo-400/20 bg-slate-900/90 p-7 shadow-2xl shadow-indigo-950/30 md:p-9">
              <Mail className="h-9 w-9 text-indigo-400" />
              <h2 className="mt-5 text-3xl font-bold text-white">Join the NTA Journal</h2>
              <p className="mt-4 leading-7 text-slate-400">
                New editions are planned for Monday mornings. Your email is used for the Journal and related NTA publication updates, and you can unsubscribe at any time.
              </p>
              <PublicationSignupForm
                publicationTitle="The NTA Journal"
                publicationTag="nta-journal"
                source="nta_journal_subscribe_page"
                accent="indigo"
                submitLabel="Subscribe to The NTA Journal"
                createDeliveryRequest={false}
                successMessage="You are subscribed. Future editions of The NTA Journal will be sent to this address."
                consentContext="Subscribed to The NTA Journal from the dedicated Journal subscription page."
                consentCheckboxText="I want to receive The NTA Journal and related NTA publication updates by email. I can unsubscribe at any time."
              />
              <p className="mt-5 text-center text-xs leading-5 text-slate-500">
                This is the Journal signup—not a request for a Gap Audit or sales appointment.
              </p>
            </aside>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-400">What you will receive</p>
              <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">Business first. Technology second. People always.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                Every edition begins with a real business question. Technology may be part of the answer, but it never replaces sound judgment, customer understanding, or the relationships that make a business work.
              </p>
            </div>

            <div className="mt-12 grid gap-7 md:grid-cols-3">
              {journalThemes.map(({ title, description, icon: Icon }) => (
                <article key={title} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-white">{title}</h3>
                  <p className="mt-4 leading-7 text-slate-400">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-800 bg-slate-900/40 px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <article className="rounded-3xl border border-indigo-400/20 bg-slate-950 p-8 shadow-xl md:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-400">Edition 1 · July 28, 2026</p>
              <h2 className="mt-4 text-3xl font-bold text-white">The System Behind the Work</h2>
              <p className="mt-5 leading-8 text-slate-300">
                The first edition explains why dependable customer follow-up matters more than adding another tool, how NTA is becoming a connected business system, and where practical AI genuinely belongs.
              </p>
              <Link
                to="/journal/issue-1-the-system-behind-the-work"
                className="mt-7 inline-flex items-center gap-2 font-bold text-indigo-400 hover:text-indigo-300"
              >
                Read the complete first edition <ArrowRight className="h-4 w-4" />
              </Link>
            </article>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-400">A promise to readers</p>
              <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">Useful enough to keep. Clear enough to use.</h2>
              <div className="mt-8 space-y-4">
                {readerPromises.map(promise => (
                  <div key={promise} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-400" />
                    <p className="leading-7 text-slate-300">{promise}</p>
                  </div>
                ))}
              </div>
              <Link
                to="/journal"
                className="mt-8 inline-flex items-center gap-2 rounded-xl border border-slate-700 px-6 py-3 font-bold text-slate-200 hover:border-slate-600 hover:bg-slate-900"
              >
                Browse the Journal archive <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-4xl rounded-3xl border border-indigo-400/20 bg-indigo-500/10 px-8 py-12 text-center">
            <h2 className="text-3xl font-bold text-white">Start with one practical edition.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Read Edition 1 first. If this is the kind of honest, useful business guidance you want each week, subscribe and continue the conversation with NTA.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/journal/issue-1-the-system-behind-the-work"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 font-bold text-white hover:bg-indigo-500"
              >
                Read Edition 1 <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#subscribe"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-300/30 px-7 py-3 font-bold text-indigo-100 hover:bg-indigo-400/10"
              >
                Subscribe free
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

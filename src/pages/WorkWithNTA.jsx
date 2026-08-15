import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Compass,
  Layers3,
  MessageCircle,
  Phone,
  Route,
  SearchCheck,
  Users,
} from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

const BOOKING_URL = 'https://calendar.app.google/p6ieYanvwhixXxZ67';
const PHONE = '6414208816';
const PHONE_DISPLAY = '641-420-8816';

const EXPECTATIONS = [
  {
    icon: Compass,
    title: 'We understand the business first',
    text: 'We start with the owner, the customers, the current situation, the goals, and the places where time or opportunity is getting lost.',
  },
  {
    icon: Route,
    title: 'We build the right order of operations',
    text: 'You get a practical view of what deserves attention now, what can wait, and how the pieces support the larger business.',
  },
  {
    icon: Layers3,
    title: 'We connect the work',
    text: 'Website, visibility, content, lead follow-up, customer relationships, business knowledge, reporting, and practical AI can work as one system.',
  },
  {
    icon: Users,
    title: 'You stay informed and in control',
    text: 'Rick explains the reasoning, keeps the work understandable, and makes sure important decisions, scope, and costs are clear before paid work begins.',
  },
];

const JOURNEY = [
  {
    number: '01',
    title: 'Discover',
    text: 'Start with a free first-pass audit or a conversation about what is happening in the business.',
    link: '/free-audit',
    linkLabel: 'Start with the Free Audit',
  },
  {
    number: '02',
    title: 'Discuss',
    text: 'Talk through the findings, your priorities, and whether NTA is the right fit for the next step.',
    external: true,
    link: BOOKING_URL,
    linkLabel: 'Schedule a Discovery Meeting',
  },
  {
    number: '03',
    title: 'Plan',
    text: 'Turn the conversation into a practical Growth Roadmap that respects the business, budget, and readiness.',
    link: '/growth-roadmap-generator',
    linkLabel: 'Explore the Growth Roadmap',
  },
  {
    number: '04',
    title: 'Build and improve',
    text: 'Strengthen the foundation, connect the useful pieces, and keep improving the system as the business grows.',
    link: '/operating-system',
    linkLabel: 'See the Digital Growth Office',
  },
];

const AREAS = [
  {
    icon: SearchCheck,
    title: 'Foundation and visibility',
    text: 'Websites, local search, content, accessibility, listings, and the information customers need to find and trust you.',
  },
  {
    icon: MessageCircle,
    title: 'Leads and relationships',
    text: 'Lead capture, sales conversations, follow-up, reviews, referrals, customer education, and retention.',
  },
  {
    icon: Layers3,
    title: 'Operations and knowledge',
    text: 'Processes, files, tasks, reporting, team responsibilities, scheduling, and the knowledge already inside the business.',
  },
  {
    icon: Compass,
    title: 'Practical AI and automation',
    text: 'Useful assistance that supports the work you already do without forcing you to change how you work.',
  },
];

const FAQS = [
  {
    question: 'What does NTA do for a business?',
    answer: 'NTA helps business owners understand where growth is getting stuck, decide what deserves attention first, and build the connected foundation, visibility, relationships, content, and practical AI support the business is ready for.',
  },
  {
    question: 'What happens after I contact NTA?',
    answer: 'We begin by understanding the business and confirming what we heard. From there, we may recommend an immediate priority, a Growth Roadmap, or a deeper diagnostic when more evidence would help. We explain the scope and price before paid work begins.',
  },
  {
    question: 'Do I have to buy a package?',
    answer: 'No. NTA does not force every business into the same package. The work starts with the business need, the current stage, and the most useful next step.',
  },
  {
    question: 'What is the Digital Growth Office?',
    answer: 'The Digital Growth Office is the connected working environment where the strategy, website, content, customer information, tasks, reporting, knowledge, and practical AI support can work together.',
  },
];

function JourneyLink({ item }) {
  const className = 'inline-flex items-center gap-2 text-sm font-semibold text-blue-300 hover:text-blue-200 transition-colors';

  if (item.external) {
    return (
      <a href={item.link} target="_blank" rel="noopener noreferrer" className={className}>
        {item.linkLabel}
        <ArrowRight className="h-4 w-4" />
      </a>
    );
  }

  return (
    <Link to={item.link} className={className}>
      {item.linkLabel}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export default function WorkWithNTA() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SEOHead
        title="Work With New Tech Advertising | Digital Growth Office"
        description="See what happens when you work with New Tech Advertising: understand the business, identify the next priority, build the right growth system, and improve it over time."
        faqs={FAQS}
      />
      <MarketingNav />

      <main>
        <section className="relative overflow-hidden border-b border-slate-800/70 bg-gradient-to-br from-slate-950 via-blue-950/60 to-slate-950 px-6 pb-24 pt-24 md:pb-32 md:pt-32">
          <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-[30rem] w-[30rem] rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative mx-auto max-w-6xl">
            <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_.9fr]">
              <div className="max-w-3xl">
                <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                  What happens when you work with NTA
                </p>
                <h1 className="mb-7 text-4xl font-black leading-tight tracking-tight md:text-6xl">
                  You did not build your business just to collect more tools.
                </h1>
                <p className="mb-6 max-w-2xl text-xl leading-relaxed text-slate-200 md:text-2xl">
                  You built it to help people, do good work, and grow. NTA helps you understand what is getting in the way and build the right growth system in the right order.
                </p>
                <p className="max-w-2xl text-lg leading-relaxed text-slate-400">
                  Work with AI without changing how you work. You get a practical guide, a connected Digital Growth Office™, and a clearer path from where the business is now to where it needs to go next.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    to="/free-audit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 text-base font-bold text-white shadow-[0_0_24px_rgba(37,99,235,0.3)] transition-colors hover:bg-blue-500"
                  >
                    Start with the Free Business Gap Audit
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-900/60 px-7 py-4 text-base font-semibold text-white transition-colors hover:border-slate-400 hover:bg-slate-800"
                  >
                    <Calendar className="h-5 w-5" />
                    Schedule a Discovery Meeting
                  </a>
                </div>

                <p className="mt-5 text-sm text-slate-500">
                  No pressure. No predetermined package. We start by understanding the business.
                </p>
              </div>

              <div className="rounded-3xl border border-blue-400/20 bg-slate-900/80 p-7 shadow-2xl shadow-blue-950/30 backdrop-blur-sm md:p-9">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">The NTA promise</p>
                <h2 className="mt-4 text-3xl font-bold text-white">Clarity before activity.</h2>
                <p className="mt-5 text-base leading-relaxed text-slate-300">
                  Before we recommend a website, campaign, CRM, automation, or AI tool, we work to understand the owner, the customers, the business, and the actual obstacle to growth.
                </p>
                <ul className="mt-7 space-y-4">
                  {[
                    'A clear explanation of what we see',
                    'A practical order for the work',
                    'A connected place to manage the system',
                    'A human relationship with Rick and NTA',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-200">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-800/70 bg-slate-950 px-6 py-20 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Study the approach</p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-5xl">The website is part of the working relationship.</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-300">
                NTA is not asking you to trust a polished promise. The books, lessons, conversations, case studies, and tools let you study how we think, how we explain the work, and what we can build around a real business before you decide to work with us.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Link to="/better-business-book" className="group rounded-2xl border border-slate-700/80 bg-slate-900/70 p-6 transition hover:-translate-y-1 hover:border-cyan-400/60">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">New to business?</p>
                <h3 className="mt-3 text-xl font-semibold text-white">Better Business Book</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">Start with practical business foundations and the questions that shape good decisions.</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">Start reading <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </Link>
              <Link to="/practical-ai" className="group rounded-2xl border border-slate-700/80 bg-slate-900/70 p-6 transition hover:-translate-y-1 hover:border-blue-400/60">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-300">Ready for AI?</p>
                <h3 className="mt-3 text-xl font-semibold text-white">Practical AI Guide</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">Understand where AI fits in the real work before choosing tools or changing how you operate.</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">Explore the guide <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </Link>
              <Link to="/knowledge" className="group rounded-2xl border border-slate-700/80 bg-slate-900/70 p-6 transition hover:-translate-y-1 hover:border-violet-400/60">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-300">Want depth?</p>
                <h3 className="mt-3 text-xl font-semibold text-white">Knowledge Library</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">Study the ideas, examples, and lessons that make the NTA approach understandable.</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">Keep learning <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </Link>
              <Link to="/case-studies" className="group rounded-2xl border border-slate-700/80 bg-slate-900/70 p-6 transition hover:-translate-y-1 hover:border-emerald-400/60">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">Want to see the work?</p>
                <h3 className="mt-3 text-xl font-semibold text-white">Case Studies</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">See how the system takes shape around actual businesses and real working situations.</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">See the work <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-800/70 bg-blue-950/20 px-6 py-20 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">What makes the approach different</p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-5xl">Prompting is a technique. Connected work is the point.</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-300">
                A prompt can help with one task. NTA looks at the larger system—the business, the customers, the website, the knowledge, the follow-up, the team, and the tools—and connects those pieces so AI supports the way the business already works.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-blue-900/60 bg-slate-950/60 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">Start with the business</p>
                <h3 className="mt-3 text-xl font-semibold text-white">Understand how the work really happens.</h3>
                <p className="mt-3 leading-relaxed text-slate-300">We begin with the owner, customers, strengths, problems, and goals—not with a tool looking for a job.</p>
              </div>
              <div className="rounded-2xl border border-blue-900/60 bg-slate-950/60 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-300">Connect the pieces</p>
                <h3 className="mt-3 text-xl font-semibold text-white">Make the website part of the system.</h3>
                <p className="mt-3 leading-relaxed text-slate-300">Website, education, customer relationships, business knowledge, operations, and practical AI can reinforce one another.</p>
              </div>
              <div className="rounded-2xl border border-blue-900/60 bg-slate-950/60 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-300">Keep it usable</p>
                <h3 className="mt-3 text-xl font-semibold text-white">Work with AI without becoming a technician.</h3>
                <p className="mt-3 leading-relaxed text-slate-300">You get clear explanations and useful next steps that fit the way you and your team already work.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-800/70 bg-slate-900/35 px-6 py-20 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">What you can expect</p>
              <h2 className="mt-3 text-3xl font-bold md:text-5xl">A working relationship, not a disconnected package.</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-400">
                NTA is a Digital Growth Office for business owners who want practical guidance, useful systems, and work that makes sense.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {EXPECTATIONS.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-800/70 bg-slate-950 px-6 py-20 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">The path forward</p>
              <h2 className="mt-3 text-3xl font-bold md:text-5xl">From first conversation to connected growth.</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-400">
                The next step depends on what the business actually needs. The path is clear without pretending every business starts in the same place.
              </p>
            </div>

            <div className="space-y-4">
              {JOURNEY.map(item => (
                <article key={item.number} className="flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:flex-row md:items-center md:p-7">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600/15 text-lg font-black text-blue-300">
                    {item.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-slate-400">{item.text}</p>
                  </div>
                  <JourneyLink item={item} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-800/70 bg-slate-900/35 px-6 py-20 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Where NTA helps</p>
              <h2 className="mt-3 text-3xl font-bold md:text-5xl">The system grows around the business.</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-400">
                We can begin with one priority and expand only when the next piece is useful.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {AREAS.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-7">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-400">{text}</p>
                </article>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-blue-400/20 bg-blue-950/20 p-6 text-center md:p-8">
              <p className="text-lg font-semibold text-blue-100">
                Based in Mason City, Iowa, NTA works with businesses throughout North Iowa, southern Minnesota, and nationally.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-800/70 bg-slate-950 px-6 py-20 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-6 md:grid-cols-3">
              <Link to="/case-studies" className="rounded-2xl border border-slate-800 bg-slate-900/70 p-7 transition-colors hover:border-slate-600">
                <h3 className="text-xl font-bold text-white">See the work</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">Review real NTA case studies and see how the system takes shape around an actual business.</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-300">View case studies <ArrowRight className="h-4 w-4" /></span>
              </Link>
              <Link to="/operating-system" className="rounded-2xl border border-slate-800 bg-slate-900/70 p-7 transition-colors hover:border-slate-600">
                <h3 className="text-xl font-bold text-white">See the method</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">See how the NTA Operating System™ and Digital Growth Office™ work together.</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-300">Explore the system <ArrowRight className="h-4 w-4" /></span>
              </Link>
              <Link to="/contact" className="rounded-2xl border border-slate-800 bg-slate-900/70 p-7 transition-colors hover:border-slate-600">
                <h3 className="text-xl font-bold text-white">Ask a question</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">If you are not ready to book a time, call, text, or send a message in your own words.</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-300">Contact NTA <ArrowRight className="h-4 w-4" /></span>
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-blue-950 via-slate-950 to-slate-950 px-6 py-24 text-center">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Ready when you are</p>
            <h2 className="mt-4 text-3xl font-bold md:text-5xl">Let’s talk about what your business needs next.</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-300">
              Start with the free audit, schedule a Discovery Meeting, or call Rick directly. The first step is a useful conversation—not a hard sell.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/free-audit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white transition-colors hover:bg-blue-500">
                Start the Free Audit
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-900/60 px-7 py-4 font-semibold text-white transition-colors hover:border-slate-400 hover:bg-slate-800">
                <Calendar className="h-5 w-5" />
                Schedule a Discovery Meeting
              </a>
            </div>
            <p className="mt-5 text-sm text-slate-400">
              Or call/text <a href={`tel:${PHONE}`} className="font-semibold text-blue-300 hover:text-blue-200">{PHONE_DISPLAY}</a>
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

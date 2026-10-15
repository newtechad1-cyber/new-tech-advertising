import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowDown, PlayCircle, Video, Package, Tag, HelpCircle,
  CheckCircle2, ClipboardList, FileText, Layers, CalendarClock, Repeat,
  BarChart3, RefreshCw, MessageSquare, Building2,
} from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

const SEO_TITLE = 'Video Advertising Management for Small Businesses | New Tech Advertising';
const SEO_DESCRIPTION =
  'New Tech Advertising manages video-first digital advertising for small businesses — planning, scripting, creating, publishing, scheduling, and measuring content built around what your business actually needs to promote.';

const VIDEO_FLOW = [
  { label: 'Your information', icon: ClipboardList },
  { label: 'NTA script', icon: FileText },
  { label: 'Branded video', icon: Video },
  { label: 'Publish', icon: PlayCircle },
  { label: 'Reuse', icon: Repeat },
  { label: 'Measure', icon: BarChart3 },
];

const VIDEO_TYPES = [
  {
    icon: Package,
    title: 'Product & Service Videos',
    lead: 'Show customers what you sell and why it matters.',
    examples: ['Individual products', 'Services', 'New arrivals', 'Featured items', 'Product benefits'],
  },
  {
    icon: Tag,
    title: 'Promotional Videos',
    lead: 'Give current offers more visibility.',
    examples: ['Sales', 'Seasonal offers', 'Clearance', 'Financing', 'Events', 'Limited promotions'],
  },
  {
    icon: HelpCircle,
    title: 'Helpful Customer Videos',
    lead: 'Answer real questions and build trust before the sale.',
    examples: [
      'Buying advice',
      'Common customer questions',
      'How something works',
      'What customers should know before buying',
      'Educational tips',
    ],
  },
];

const MANAGED_ITEMS = [
  { icon: ClipboardList, label: 'Advertising and content planning' },
  { icon: FileText, label: 'Video scripting' },
  { icon: Video, label: 'Templated video production' },
  { icon: Layers, label: 'Supporting graphics' },
  { icon: MessageSquare, label: 'Captions and post copy' },
  { icon: CalendarClock, label: 'Scheduling and publishing' },
  { icon: RefreshCw, label: 'Repurposing good content across appropriate channels' },
  { icon: BarChart3, label: 'Performance tracking' },
];

const PUBLISH_CHANNELS = ['Facebook', 'Instagram', 'Google Business Profile', 'YouTube'];

const DISCOVERY_QUESTIONS = [
  'What do you need to promote?',
  'How often does that change?',
  'Which products or services matter most?',
  'What are you doing now?',
  "What's working?",
  "What's missing?",
];

const WORKFLOW_STEPS = [
  {
    title: 'You provide the moving pieces',
    body: 'Product or service details, prices when appropriate, promotion information, photos or video, current priorities, and timely approvals.',
  },
  {
    title: 'NTA creates the message',
    body: 'We develop the script, caption, and advertising angle around the information supplied.',
  },
  {
    title: 'We produce and publish',
    body: 'The content is created using an established branded format and adapted for the appropriate channels.',
  },
  {
    title: 'We learn and improve',
    body: 'We review performance and use what we learn to improve future advertising.',
  },
];

function FlowStep({ icon: Icon, label, isLast }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-sm font-semibold text-white">{label}</span>
      </div>
      {!isLast && (
        <>
          <ArrowRight className="hidden h-5 w-5 shrink-0 text-blue-500/60 md:block" aria-hidden="true" />
          <ArrowDown className="h-5 w-5 shrink-0 text-blue-500/60 md:hidden" aria-hidden="true" />
        </>
      )}
    </div>
  );
}

export default function VideoAdvertisingManagement() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <SEOHead title={SEO_TITLE} description={SEO_DESCRIPTION} />

      <MarketingNav />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),_transparent_45%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-semibold text-blue-300">
              <Video className="h-4 w-4" /> Video-First Advertising Management
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">
              Video-First Digital Advertising Management
            </h1>
            <p className="mt-5 max-w-3xl text-xl font-semibold text-blue-300 md:text-2xl">
              Consistent content. More video. Less work for your staff.
            </p>
            <div className="mt-7 max-w-3xl space-y-4 text-lg leading-relaxed text-slate-300">
              <p>
                New Tech Advertising helps small businesses manage the ongoing work of digital
                advertising — planning, scripting, creating, publishing, scheduling, and measuring
                the content — with video at the center.
              </p>
              <p>
                We do not start by selling you an arbitrary number of posts. We start by
                understanding what your business actually needs to promote.
              </p>
            </div>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                to="/growth-conversation"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white shadow-[0_0_24px_rgba(37,99,235,0.35)] transition hover:bg-blue-500"
              >
                Let&rsquo;s Talk About What You Need <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-1 text-sm font-semibold text-slate-300 transition hover:text-white"
              >
                See How the Process Works <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Video becomes a system, not a project */}
        <section className="border-b border-slate-800 bg-slate-900/50 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              A repeatable system
            </p>
            <h2 className="mt-3 max-w-4xl text-3xl font-black text-white md:text-4xl">
              Video becomes a system, not a project.
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">
              Most businesses do not need to reinvent their advertising every time they have
              something new to promote. NTA helps build repeatable branded video formats so the
              process becomes faster, easier, and more consistent.
            </p>

            <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center">
                {VIDEO_FLOW.map((step, i) => (
                  <FlowStep key={step.label} icon={step.icon} label={step.label} isLast={i === VIDEO_FLOW.length - 1} />
                ))}
              </div>
            </div>

            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-slate-300">
              Once the format is established, product details, service information, promotions,
              photos, or short clips can be turned into useful branded video content without
              starting from scratch each time.
            </p>
          </div>
        </section>

        {/* Three types of video */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              Three types of video
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black text-white md:text-4xl">
              Useful video built around what your business sells.
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {VIDEO_TYPES.map(({ icon: Icon, title, lead, examples }) => (
                <div key={title} className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-white">{title}</h3>
                  <p className="mt-2 text-slate-300">{lead}</p>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Examples
                  </p>
                  <ul className="mt-3 space-y-2">
                    {examples.map((ex) => (
                      <li key={ex} className="flex items-start gap-2 text-slate-300">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How NTA supports your advertising */}
        <section className="border-y border-slate-800 bg-slate-900/50 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              How NTA supports your advertising
            </p>
            <h2 className="mt-3 max-w-4xl text-3xl font-black text-white md:text-4xl">
              We support the advertising work your team may not have the time to consistently carry.
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">
              Your team already has enough to do. NTA supports the ongoing advertising work that is
              easy to put off when the day-to-day business gets busy.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MANAGED_ITEMS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-slate-200">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Publishing channels
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {PUBLISH_CHANNELS.map((ch) => (
                  <span
                    key={ch}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200"
                  >
                    <PlayCircle className="h-4 w-4 text-blue-400" /> {ch}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-slate-400">
                Channel mix depends on what is appropriate for the individual business. We do not
                force every business onto every platform.
              </p>
            </div>
          </div>
        </section>

        {/* We don't start with a posting quota */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              Before the plan
            </p>
            <h2 className="mt-3 max-w-4xl text-3xl font-black text-white md:text-4xl">
              We don&rsquo;t start by selling you a posting quota.
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">
              Before deciding how many videos, posts, or promotions make sense, we first learn how
              your business actually works.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {DISCOVERY_QUESTIONS.map((q) => (
                <div key={q} className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                    ?
                  </span>
                  <p className="text-lg font-semibold text-white">{q}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-blue-500/30 bg-blue-950/30 p-8 text-center">
              <p className="text-xl font-bold text-blue-300 md:text-2xl">
                From there, we build the advertising plan around the business — not the other way
                around.
              </p>
            </div>
          </div>
        </section>

        {/* How the video workflow can operate */}
        <section id="how-it-works" className="scroll-mt-28 border-y border-slate-800 bg-slate-900/50 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              How it works
            </p>
            <h2 className="mt-3 max-w-4xl text-3xl font-black text-white md:text-4xl">
              A repeatable process makes more video practical.
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {WORKFLOW_STEPS.map((step, i) => (
                <div key={step.title} className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-6">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{step.title}</h3>
                    <p className="mt-2 leading-relaxed text-slate-300">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing positioning */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              Pricing
            </p>
            <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
              Built around your business, not a fixed package.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-300">
              Managed advertising programs typically begin around $1,500 per month, depending on
              production needs and advertising volume.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-300">
              The exact monthly mix is determined after we understand how much your business
              realistically needs to promote and what kind of content will be most useful.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-400">
              Paid advertising and media spend is separate from the management fee.
            </p>
            <div className="mt-8">
              <Link
                to="/growth-conversation"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white shadow-[0_0_24px_rgba(37,99,235,0.35)] transition hover:bg-blue-500"
              >
                Let&rsquo;s Build the Right Advertising Mix <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Need more than advertising? */}
        <section className="border-y border-slate-800 bg-slate-900/50 py-20">
          <div className="mx-auto max-w-4xl px-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              The bigger picture
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black text-white md:text-4xl">
              Advertising may be the starting point — not the whole picture.
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate-300">
              <p>
                Sometimes advertising is exactly what a business needs.
              </p>
              <p>
                Other times, the conversation reveals larger opportunities involving the website,
                customer experience, lead handling, sales tracking, automation, or other connected
                parts of the business.
              </p>
              <p>
                If we see those opportunities, we&rsquo;ll explain them clearly. You do not have to
                buy everything to get started.
              </p>
            </div>
            <div className="mt-8">
              <Link
                to="/operating-system"
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-300 transition hover:text-blue-200"
              >
                Learn About the Digital Growth Office <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 text-center">
          <div className="mx-auto max-w-3xl px-6">
            <Building2 className="mx-auto h-10 w-10 text-blue-400" />
            <h2 className="mt-5 text-3xl font-black text-white md:text-5xl">
              What does your business actually need to promote?
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-300">
              That&rsquo;s where the conversation starts.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-400">
              Let us understand what you&rsquo;re selling, what you&rsquo;re trying to move, and
              where your current advertising is falling short. Then we&rsquo;ll show you what a
              practical video-first advertising plan could look like.
            </p>
            <div className="mt-9">
              <Link
                to="/growth-conversation"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-[0_0_24px_rgba(37,99,235,0.35)] transition hover:bg-blue-500"
              >
                Start the Conversation <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
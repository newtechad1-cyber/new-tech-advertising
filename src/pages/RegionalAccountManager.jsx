import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Handshake,
  MapPin,
  MessageCircle,
  Play,
  ShieldCheck,
  UsersRound,
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';
import { trackJourneyEvent } from '@/lib/journeyAnalytics';

const TERRITORY = 'North Iowa & Southern Minnesota';
const RECRUITING_PLAYLIST_ID = 'PLbPNsoazKwmw';
const RECRUITING_PLAYLIST_URL = `https://www.youtube.com/playlist?list=${RECRUITING_PLAYLIST_ID}`;
const RECRUITING_OVERVIEW_ID = 'Ka4nUG4wiGI';

const RECRUITING_VIDEOS = [
  {
    id: RECRUITING_OVERVIEW_ID,
    title: 'Regional Account Manager Opportunity',
    description: 'Start here for the overall opportunity and the kind of relationship NTA is building.',
  },
  {
    id: 'fNfR6irzzcE',
    title: 'A Flexible Opportunity That Fits Real Life',
    description: 'How the opportunity can fit alongside a real life and community.',
  },
  {
    id: 'oB-5tXy2phs',
    title: 'Great Selling Starts With Listening',
    description: 'Why useful conversations begin by understanding the business owner.',
  },
  {
    id: 'AZuVbZFSFl4',
    title: 'You Don’t Need to Be an AI Expert',
    description: 'Why NTA’s system carries the technical depth behind the conversation.',
  },
  {
    id: 'fsWQtvrFf5E',
    title: 'Commission Paid Within Two Business Days',
    description: 'A direct explanation of the upfront commission timing.',
  },
  {
    id: 'N0lexmbF7TI',
    title: 'Build Relationships Without Driving All Day',
    description: 'How local relationship-building can be thoughtful and practical.',
  },
  {
    id: 'fcNw60WEa4A',
    title: 'Know Someone in Rochester?',
    description: 'Why Rochester is an important early focus for this opportunity.',
  },
  {
    id: 'S_0cPb4TJz4',
    title: 'Media Sales Reps: You Already Know How to Start the Conversation',
    description: 'For people who already understand local-business conversations.',
  },
];

const REGIONAL_ACCOUNT_MANAGER_FAQS = [
  {
    question: 'Is this a traditional sales job?',
    answer: 'No. This is a relationship-driven account-management and business-development opportunity. The work begins with meeting business owners, listening well, and helping the right NTA conversation begin.',
  },
  {
    question: 'Do I need expertise in AI, websites, advertising, or marketing?',
    answer: 'No. NTA provides the website, Knowledge Library, videos, Your Digital Growth Guide™, and Digital Growth Office behind the relationship. You can keep learning and use those same resources with business owners.',
  },
  {
    question: 'Where is the opportunity focused?',
    answer: 'NTA is rooted in Mason City, Iowa. The territory includes North Iowa and Southern Minnesota, with Rochester, Minnesota, as an important early focus. People who know Mason City, Clear Lake, Rochester, and the surrounding business communities are welcome to start a conversation.',
  },
  {
    question: 'How does compensation work?',
    answer: 'This is performance-based work. When a new NTA client gets started and NTA receives the setup fee, the agreed upfront commission is paid within two business days. The complete arrangement is discussed privately before either side makes a commitment.',
  },
  {
    question: 'Can I explore the opportunity before I apply?',
    answer: 'Yes. Watch the eight-video recruiting series, explore the NTA website and Knowledge Library, then begin a private first conversation when it feels appropriate.',
  },
];

const roleActions = [
  'Meet business owners and start useful conversations.',
  'Listen for what a business is trying to accomplish and what may be getting in the way.',
  'Ask good questions instead of rushing toward a product or pitch.',
  'Help an owner find the right NTA resource, lesson, video, guide, or next conversation.',
  'Use the NTA website and Knowledge Library as part of the conversation when a question comes up.',
  'Keep thoughtful follow-up moving after a conversation begins.',
  'Develop appropriate relationships with community partners in your territory when that helps local businesses.',
];

const resources = [
  {
    icon: BookOpen,
    title: 'Knowledge Library',
    text: 'Learn from articles, lessons, and books built around real business questions.',
    href: '/knowledge',
    label: 'Explore the Knowledge Library',
  },
  {
    icon: MessageCircle,
    title: 'Your Digital Growth Guide™',
    text: 'Explore questions naturally and help a business owner find a useful next step.',
    href: '/growth-guide',
    label: 'Meet Your Digital Growth Guide™',
  },
  {
    icon: UsersRound,
    title: 'The NTA Growth Show',
    text: 'Watch business, marketing, and practical-AI conversations as you keep learning.',
    href: '/growth-show',
    label: 'Watch the Growth Show',
  },
  {
    icon: Compass,
    title: 'The Digital Growth Office',
    text: 'Bring the right NTA people, systems, and support into the relationship when the time is right.',
    href: '/operating-system',
    label: 'See how the system works',
  },
];

const rightFor = [
  'You like meeting people and taking a genuine interest in their businesses.',
  'You know North Iowa, Southern Minnesota, or the communities and business owners around them.',
  'You are comfortable starting a conversation and following up thoughtfully.',
  'You want to keep learning without pretending to have every answer on day one.',
  'You can represent NTA with good judgment, patience, and respect for the person across the table.',
];

function SectionHeading({ eyebrow, title, children, light = false }) {
  return (
    <div className={`mx-auto max-w-3xl text-center ${light ? 'text-white' : 'text-slate-900'}`}>
      {eyebrow && (
        <p className={`text-sm font-semibold uppercase tracking-[0.18em] ${light ? 'text-cyan-300' : 'text-blue-700'}`}>
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">{title}</h2>
      {children && <div className={`mt-5 text-lg leading-relaxed ${light ? 'text-slate-300' : 'text-slate-600'}`}>{children}</div>}
    </div>
  );
}

export default function RegionalAccountManager() {
  const formRef = useRef(null);
  const [formStartedAt] = useState(() => Date.now());
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    city: '',
    current_role: '',
    business_relationships: '',
    interest_reason: '',
    website: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailDelivery, setEmailDelivery] = useState(null);
  const [error, setError] = useState('');

  const campaign = useMemo(() => {
    if (typeof window === 'undefined') {
      return { source: 'website', medium: '', name: '', path: '/regional-account-manager' };
    }

    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get('utm_source') || params.get('source') || 'website',
      medium: params.get('utm_medium') || params.get('medium') || '',
      name: params.get('utm_campaign') || params.get('campaign') || '',
      path: `${window.location.pathname}${window.location.search}`,
    };
  }, []);

  useEffect(() => {
    trackJourneyEvent('page_view', {
      route: '/regional-account-manager',
      territory: TERRITORY,
      campaign_source: campaign.source,
      campaign_medium: campaign.medium,
      campaign_name: campaign.name,
    });
  }, [campaign]);

  const scrollToForm = (source) => {
    trackJourneyEvent('regional_account_manager_cta_clicked', {
      route: '/regional-account-manager',
      source,
      territory: TERRITORY,
      campaign_source: campaign.source,
    });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await base44.functions.invoke('ntaUnifiedIntake', {
        submission_type: 'contact',
        offer_type: 'consultation',
        mapping_confidence: 'hardcoded',
        mapping_notes: 'Regional Account Manager opportunity inquiry.',
        source_system: 'website',
        source_page: campaign.path,
        source_campaign: 'regional_account_manager',
        name: form.full_name,
        business_name: 'Regional Account Manager Opportunity',
        email: form.email,
        phone: form.phone,
        city: form.city,
        notes: [
          'Regional Account Manager opportunity inquiry.',
          `Territory: ${TERRITORY}`,
          form.current_role ? `Current role/background: ${form.current_role}` : '',
          form.business_relationships ? `Business and community relationships: ${form.business_relationships}` : '',
          form.interest_reason ? `Why this opportunity: ${form.interest_reason}` : '',
          campaign.source ? `Campaign source: ${campaign.source}` : '',
          campaign.medium ? `Campaign medium: ${campaign.medium}` : '',
          campaign.name ? `Campaign: ${campaign.name}` : '',
        ].filter(Boolean).join('\n'),
        detected_route: campaign.path,
        detected_component: 'RegionalAccountManager',
        priority: 'high',
        is_high_intent: true,
        skip_webhook: true,
        anti_spam: {
          honeypot: form.website,
          form_started_at: formStartedAt,
        },
      });
      const data = response?.data ?? response;

      if (data?.error) {
        throw new Error(data.error);
      }

      const emailStatus = String(data?.email_status || 'unknown');
      const emailRequestStatus = emailStatus === 'sent'
        ? 'accepted'
        : ['failed', 'not_configured'].includes(emailStatus)
          ? 'failed'
          : 'unknown';
      setEmailDelivery({
        internal: emailRequestStatus,
        applicant: emailRequestStatus,
      });

      trackJourneyEvent('regional_account_manager_form_submitted', {
        route: '/regional-account-manager',
        territory: TERRITORY,
        campaign_source: campaign.source,
      });
      setSubmitted(true);
    } catch (submitError) {
      console.error('Regional Account Manager inquiry error:', submitError);
      setError(submitError?.message || 'Something went wrong. Please try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Regional Account Manager Opportunity | Rochester, MN & North Iowa | NTA"
        description="Explore a relationship-driven Regional Account Manager opportunity serving Mason City and North Iowa, Rochester, Minnesota, and Southern Minnesota. NTA provides knowledge, videos, tools, and support."
        faqs={REGIONAL_ACCOUNT_MANAGER_FAQS}
      />
      <MarketingNav />

      <main>
        <section className="relative overflow-hidden bg-slate-950 px-5 py-16 text-white sm:px-6 md:py-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 top-12 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
            <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
          </div>

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Regional Account Manager Opportunity
              </p>
              <p className="mt-4 flex items-center gap-2 text-base font-medium text-slate-300">
                <MapPin className="h-5 w-5 text-cyan-300" />
                North Iowa &amp; Southern Minnesota
              </p>
              <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Regional Account Manager opportunity—built around relationships, not memorizing every answer.
              </h1>
              <div className="mt-7 max-w-2xl space-y-5 text-lg leading-relaxed text-slate-300">
                <p>
                  New Tech Advertising is looking for a relationship-driven Regional Account Manager to help build business relationships from Mason City, Iowa, and North Iowa through Rochester, Minnesota, and Southern Minnesota.
                </p>
                <p>
                  This is a relationship-driven opportunity for someone who enjoys people, useful conversations, and helping business owners make sense of what comes next.
                </p>
                <p>
                  You do not need to memorize everything NTA does. You bring the relationship and the conversation. NTA gives you the knowledge, tools, and support behind it.
                </p>
              </div>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => scrollToForm('hero')}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 text-lg font-bold text-white shadow-[0_0_24px_rgba(37,99,235,0.32)] transition-colors hover:bg-blue-500 sm:w-auto"
                >
                  Start the Conversation <ArrowRight className="h-5 w-5" />
                </button>
                <Link
                  to="/work-with-nta"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-900/60 px-7 py-4 text-lg font-semibold text-white transition-colors hover:border-slate-400 hover:bg-slate-800 sm:w-auto"
                >
                  See How NTA Works <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <aside className="rounded-3xl border border-slate-700 bg-slate-900/80 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm sm:p-7 md:p-9">
              <div className="flex items-center gap-3">
                <Handshake className="h-9 w-9 text-cyan-300" />
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Watch the overview</p>
              </div>
              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-700 bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${RECRUITING_OVERVIEW_ID}?rel=0`}
                  title="Regional Account Manager Opportunity overview"
                  className="aspect-video w-full"
                  loading="eager"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <p className="mt-6 text-xl font-bold leading-snug text-white">
                You focus on the person across the table. The NTA system can help with the rest.
              </p>
              <a
                href={RECRUITING_PLAYLIST_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackJourneyEvent('regional_account_manager_video_playlist_clicked', { route: '/regional-account-manager', source: 'hero_overview' })}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-200"
              >
                Watch the full eight-video series on YouTube <ArrowRight className="h-4 w-4" />
              </a>
            </aside>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50 px-5 py-16 sm:px-6 md:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="The recruiting video series" title="Eight short videos. One clear picture of the opportunity.">
              <p>
                Start with the overview above, choose a question below, or open the complete YouTube playlist when you are ready to watch the full series.
              </p>
            </SectionHeading>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {RECRUITING_VIDEOS.map((video) => (
                <a
                  key={video.id}
                  href={`https://www.youtube.com/watch?v=${video.id}&list=${RECRUITING_PLAYLIST_ID}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackJourneyEvent('regional_account_manager_video_clicked', { route: '/regional-account-manager', video_id: video.id, source: 'video_series' })}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
                >
                  <div className="relative aspect-video overflow-hidden bg-slate-900">
                    <img
                      src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-slate-950/20">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-blue-700 shadow-lg">
                        <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden="true" />
                      </span>
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold leading-snug text-slate-900">{video.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{video.description}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition-colors group-hover:text-blue-600">
                      Watch on YouTube <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
            <div className="mt-10 text-center">
              <a
                href={RECRUITING_PLAYLIST_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackJourneyEvent('regional_account_manager_video_playlist_clicked', { route: '/regional-account-manager', source: 'video_series' })}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 font-bold text-white transition-colors hover:bg-slate-800 sm:w-auto"
              >
                Open the complete YouTube playlist <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">What this opportunity really is</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                A good conversation can be the beginning of something useful.
              </h2>
            </div>
            <div className="space-y-5 text-lg leading-relaxed text-slate-700">
              <p>
                This is not a traditional corporate sales job, and it is not a role where you have to become an expert in websites, AI, advertising, SEO, social media, video, or business systems.
              </p>
              <p>
                Your role is to build trust, understand the business owner, and help the right NTA conversation begin. When an owner has a question, you can use the same NTA resources they can see.
              </p>
              <blockquote className="rounded-2xl border-l-4 border-blue-600 bg-blue-50 px-6 py-5 text-xl font-semibold leading-relaxed text-slate-800">
                “That’s a good question. Let’s look at it together.”
              </blockquote>
              <p>
                The NTA website is part of the sales and training system. It can do much of the explaining and teaching while you focus on the relationship.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-blue-100 bg-blue-50/70 px-6 py-20 md:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Your territory" title="North Iowa & Southern Minnesota">
              <p>
                NTA is rooted in Mason City, Iowa, and North Iowa—including Clear Lake and surrounding communities—remains a core territory. Southern Minnesota is part of the opportunity too, with Rochester, Minnesota, as an important early focus—not the only market.
              </p>
            </SectionHeading>
            <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-blue-100 bg-white p-7 shadow-sm md:p-9">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Build a local presence the right way.</h3>
                  <p className="mt-3 leading-relaxed text-slate-600">
                    There is room to meet owners, join business conversations, and develop appropriate relationships with local organizations throughout North Iowa and Southern Minnesota. Territory details will be discussed together as the opportunity develops.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20 md:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="The work" title="What you’ll actually do">
              <p>Simple, human work—supported by a connected system behind you.</p>
            </SectionHeading>
            <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-2">
              {roleActions.map((item) => (
                <div key={item} className="flex gap-4 rounded-2xl border border-slate-200 p-5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                  <p className="leading-relaxed text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 px-6 py-20 text-white md:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Built to support you" title="You won’t be left to figure this out." light>
              <p>
                You can keep learning as you go—and use the same resources with a business owner while a question is still fresh.
              </p>
            </SectionHeading>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {resources.map(({ icon: Icon, title, text, href, label }) => (
                <Link
                  key={title}
                  to={href}
                  className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition-colors hover:border-blue-500/70 hover:bg-slate-900"
                >
                  <Icon className="h-7 w-7 text-cyan-300" />
                  <h3 className="mt-5 text-xl font-bold text-white">{title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-300">{text}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition-colors group-hover:text-cyan-200">
                    {label} <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
            <p className="mx-auto mt-9 max-w-3xl text-center text-lg leading-relaxed text-slate-300">
              You do not need every answer in your head. You need the confidence to ask a useful question, listen carefully, and bring the right NTA resource into the conversation.
            </p>
          </div>
        </section>

        <section className="bg-white px-6 py-20 md:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Behind the relationship" title="What NTA brings to the relationship">
              <p>You are not being asked to deliver all of NTA by yourself.</p>
            </SectionHeading>
            <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ['The Digital Growth Office', 'A connected way to bring the right growth work together around a real business.'],
                ['Clear learning resources', 'Articles, lessons, books, videos, and practical teaching that make complex subjects easier to discuss.'],
                ['Guides and tools', 'Resources that help a business owner explore a question and identify a useful next step.'],
                ['People and support', 'The right NTA support can join the conversation when deeper knowledge or implementation is needed.'],
                ['A website that keeps teaching', 'Send an owner to NTA and the educational system can keep the conversation moving between meetings.'],
                ['A long-term approach', 'Focus on what the business actually needs instead of forcing every conversation into the same package.'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-emerald-100 bg-emerald-50/60 px-6 py-20 md:py-24">
          <div className="mx-auto max-w-4xl">
            <SectionHeading eyebrow="A straightforward conversation" title="How compensation works">
              <p>
                This is performance-based work. The complete compensation arrangement is explained clearly before anyone makes a commitment.
              </p>
            </SectionHeading>
            <div className="mt-10 rounded-3xl border border-emerald-100 bg-white p-7 shadow-sm md:p-9">
              <div className="flex gap-4">
                <ShieldCheck className="mt-1 h-7 w-7 shrink-0 text-emerald-600" />
                <div className="space-y-4 leading-relaxed text-slate-700">
                  <p>
                    When you help a new NTA client get started and NTA receives the setup fee, your agreed upfront commission is paid within two business days.
                  </p>
                  <p>
                    There is no draw. Ongoing compensation is established in the agreement for the work and relationships you build.
                  </p>
                  <p className="text-sm text-slate-500">
                    This is not an income guarantee. The complete arrangement, responsibilities, and agreement details are discussed privately before either side makes a commitment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20 md:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="The right fit" title="Who this might be right for">
              <p>Experience matters, but so do curiosity, judgment, and how you treat people.</p>
            </SectionHeading>
            <div className="mx-auto mt-12 grid max-w-5xl gap-10 lg:grid-cols-[1fr_.9fr]">
              <div className="space-y-4">
                {rightFor.map((item) => (
                  <div key={item} className="flex gap-4">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                    <p className="text-lg leading-relaxed text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
              <aside className="rounded-3xl border border-amber-200 bg-amber-50 p-7">
                <h3 className="text-xl font-bold text-amber-950">Bring your relationships ethically.</h3>
                <p className="mt-4 leading-relaxed text-amber-900">
                  People who already have strong relationships with business owners may have a head start. If you are currently employed elsewhere, honor your employment agreements, outside-work restrictions, confidentiality requirements, and conflicts of interest. Keep a current employer’s client relationships and confidential information separate.
                </p>
              </aside>
            </div>
          </div>
        </section>

        <section className="bg-blue-700 px-6 py-20 text-white md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">A longer view</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Build more than a client list.</h2>
            <p className="mt-6 text-lg leading-relaxed text-blue-50">
              The goal is to become a trusted connector in your community: someone who knows how to begin a useful conversation, understands when to bring in help, and stays interested in whether the business owner is moving forward.
            </p>
            <p className="mt-5 text-lg leading-relaxed text-blue-100">
              That kind of work can build relationships that last longer than a single campaign or transaction.
            </p>
          </div>
        </section>

        <section className="bg-slate-50 px-6 py-20 md:py-24">
          <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Why NTA is building this</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Meet Rick</h2>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-slate-700">
              <p>
                “I have spent years talking with business owners. Most of them do not need another person throwing a sales pitch at them. They need someone who will listen, help them understand their choices, and connect the right pieces when they are ready.”
              </p>
              <p>
                “That is why I am building NTA this way. The knowledge should be on the website, in the library, in the videos, in the books, and in the tools—not locked inside one salesperson’s head.”
              </p>
              <p>
                “A Regional Account Manager should be able to focus on the person across the table. The system behind them can help with the rest.”
              </p>
              <p className="font-semibold text-slate-900">— Rick Hesse, New Tech Advertising</p>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50 px-5 py-16 sm:px-6 md:py-24">
          <div className="mx-auto max-w-4xl">
            <SectionHeading eyebrow="Questions candidates ask" title="A few straightforward answers before you reach out.">
              <p>The details matter. These answers can help you decide whether a private first conversation makes sense.</p>
            </SectionHeading>
            <div className="mt-10 space-y-3">
              {REGIONAL_ACCOUNT_MANAGER_FAQS.map((faq) => (
                <details key={faq.question} className="rounded-2xl border border-slate-200 bg-white px-5 py-1 shadow-sm">
                  <summary className="cursor-pointer py-4 pr-8 text-lg font-bold text-slate-900 marker:text-blue-700">
                    {faq.question}
                  </summary>
                  <p className="pb-5 leading-relaxed text-slate-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="start-conversation" ref={formRef} className="scroll-mt-24 bg-slate-950 px-5 py-16 text-white sm:px-6 md:py-24">
          <div className="mx-auto max-w-3xl">
            <SectionHeading eyebrow="Start the conversation" title="You do not need a perfect résumé to begin." light>
              <p>
                Tell us a little about yourself and the community you know. This is simply a private first conversation—not a commitment.
              </p>
            </SectionHeading>

            {submitted ? (
              <div className="mt-10 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-300" />
                <h3 className="mt-5 text-2xl font-bold text-white">Conversation started.</h3>
                <p className="mx-auto mt-3 max-w-xl leading-relaxed text-slate-300">
                  Thank you for reaching out. Rick or the NTA team will review your note and follow up about a private conversation.
                </p>
                {emailDelivery?.applicant === 'accepted' && (
                  <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
                    We also asked our email service to send a confirmation to {form.email}. If you do not see it shortly, check Spam or Junk before reaching out.
                  </p>
                )}
                {emailDelivery?.applicant === 'failed' && (
                  <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-amber-200">
                    We received your inquiry, but the confirmation email could not be requested. Your information is safely in the NTA recruiting inbox.
                  </p>
                )}
                {(!emailDelivery || emailDelivery?.applicant === 'unknown') && (
                  <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
                    Your inquiry is safely in the NTA recruiting inbox. A confirmation email is also being checked.
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-10 rounded-3xl border border-slate-700 bg-slate-900/75 p-6 shadow-2xl md:p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="ram-full-name" className="mb-2 block text-sm font-semibold text-slate-100">Full name *</label>
                    <input id="ram-full-name" name="full_name" value={form.full_name} onChange={handleChange} required autoComplete="name" placeholder="Jane Smith" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30" />
                  </div>
                  <div>
                    <label htmlFor="ram-email" className="mb-2 block text-sm font-semibold text-slate-100">Email *</label>
                    <input id="ram-email" name="email" value={form.email} onChange={handleChange} required type="email" autoComplete="email" placeholder="jane@example.com" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30" />
                  </div>
                  <div>
                    <label htmlFor="ram-phone" className="mb-2 block text-sm font-semibold text-slate-100">Phone <span className="font-normal text-slate-400">(optional)</span></label>
                    <input id="ram-phone" name="phone" value={form.phone} onChange={handleChange} type="tel" autoComplete="tel" placeholder="(507) 000-0000" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30" />
                  </div>
                  <div>
                    <label htmlFor="ram-city" className="mb-2 block text-sm font-semibold text-slate-100">City or community you know best *</label>
                    <input id="ram-city" name="city" value={form.city} onChange={handleChange} required placeholder="Mason City, IA or Rochester, MN" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30" />
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="ram-role" className="mb-2 block text-sm font-semibold text-slate-100">Current role or background</label>
                  <input id="ram-role" name="current_role" value={form.current_role} onChange={handleChange} placeholder="For example: account manager, business owner, community leader..." className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30" />
                </div>

                <div className="mt-5">
                  <label htmlFor="ram-relationships" className="mb-2 block text-sm font-semibold text-slate-100">Tell us about the businesses and communities you know</label>
                  <textarea id="ram-relationships" name="business_relationships" value={form.business_relationships} onChange={handleChange} rows={4} placeholder="What types of businesses or community groups are you connected with? How have you built those relationships?" className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30" />
                </div>

                <div className="mt-5">
                  <label htmlFor="ram-interest" className="mb-2 block text-sm font-semibold text-slate-100">What interests you about this opportunity?</label>
                  <textarea id="ram-interest" name="interest_reason" value={form.interest_reason} onChange={handleChange} rows={4} placeholder="A few sentences are enough." className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30" />
                </div>

                <div className="sr-only" aria-hidden="true">
                  <label htmlFor="ram-website">Website</label>
                  <input id="ram-website" name="website" value={form.website} onChange={handleChange} tabIndex="-1" autoComplete="off" />
                </div>

                {error && <p className="mt-5 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p>}

                <button type="submit" disabled={submitting} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 text-lg font-bold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60">
                  {submitting ? 'Sending…' : <>Start the Conversation <ArrowRight className="h-5 w-5" /></>}
                </button>
                <p className="mt-4 text-center text-sm leading-relaxed text-slate-400">
                  Your information is used to respond to this opportunity inquiry. Please do not share confidential information from a current or former employer.
                </p>
              </form>
            )}

            <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900/50 p-6">
              <h3 className="text-lg font-bold text-white">Are you representing an organization?</h3>
              <p className="mt-2 leading-relaxed text-slate-300">
                If you represent a chamber, library, economic development organization, business association, educational organization, or another community group, the Community Partners pathway may be the better fit.
              </p>
              <Link to="/community-partner" className="mt-4 inline-flex items-center gap-2 font-semibold text-cyan-300 transition-colors hover:text-cyan-200">
                Explore Community Partners <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

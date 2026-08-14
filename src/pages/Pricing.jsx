import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  Globe2,
  MapPin,
  MessageSquareText,
  MonitorSmartphone,
  Route,
} from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

const serviceRanges = [
  {
    icon: MapPin,
    title: 'Focused Monthly Support',
    range: '$300–$700/month',
    description: 'A manageable starting point built around one clear priority instead of an oversized package.',
    includes: [
      'Local visibility and Google Business Profile work',
      'A focused content or social media plan',
      'Website care and practical improvements',
      'Review, reputation, or follow-up support',
      'A clear monthly scope and approval process',
    ],
  },
  {
    icon: MessageSquareText,
    title: 'Connected Growth',
    range: '$700–$1,500/month',
    description: 'For a business ready to connect several channels and build useful digital assets month after month.',
    includes: [
      'Monthly planning and shared approvals',
      'Content, social media, graphics, and short-form video',
      'Local search and AI-readiness improvements',
      'Landing pages or Knowledge Library development',
      'Performance review and next-step recommendations',
    ],
  },
  {
    icon: Globe2,
    title: 'Digital Growth Office',
    range: '$1,500–$2,500+/month',
    description: 'A broader working relationship in which NTA helps coordinate the business’s connected digital growth system.',
    includes: [
      'Website and landing-page management',
      'Content, video, social media, visibility, and follow-up',
      'Knowledge Library and approved source-of-truth development',
      'Your Digital Growth Guide™ and direct access to Rick',
      'Priority planning, reporting, and strategic support',
    ],
  },
  {
    icon: MonitorSmartphone,
    title: 'Setup & Onboarding',
    range: '$750–$1,500+ one time',
    description: 'Most businesses need meaningful foundation work before the monthly relationship can run well. This one-time fee covers the initial setup, connections, and practical building work required to get started properly.',
    includes: [
      'Website setup, focused rebuild work, or a new digital foundation when needed',
      'Accounts, access, tracking, listings, and essential platform connections',
      'Brand materials, content organization, and back-office setup',
      'Initial priorities, responsibilities, and approval process',
      'A written scope based on what is already in place and what must be built',
    ],
  },
];

const process = [
  {
    title: 'Start with the business',
    text: 'We talk about what you are trying to accomplish, what is already working, and where things feel disconnected.',
  },
  {
    title: 'Choose the useful pieces',
    text: 'You do not have to buy every service. We identify the smallest practical place to begin and build from there.',
  },
  {
    title: 'Set the scope and range',
    text: 'The final price reflects the amount of work, the number of locations and channels, the condition of the existing materials, and the level of ongoing involvement.',
  },
];

export default function Pricing() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SEOHead
        title="Small Business Marketing Price Ranges | New Tech Advertising"
        description="Explore practical starting price ranges for websites, local visibility, content, social media, video, and a connected Digital Growth Office from NTA."
        canonical="/find-your-plan"
      />

      <MarketingNav />

      <main>
        <section className="relative overflow-hidden bg-slate-950 px-6 pb-20 pt-32 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/70 via-slate-950 to-slate-900" />
          <div className="relative mx-auto max-w-5xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-blue-300">A practical place to begin</p>
            <h1 className="max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
              Price ranges shaped around the work your business actually needs
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl">
              NTA does not sell rigid packages or ask you to fit your business into a software plan. Most ongoing work can begin around $300, then grow only when the need and value are clear.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/growth-conversation"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-500"
              >
                Talk to My Office™ <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="tel:6414208816"
                className="inline-flex items-center rounded-xl border border-slate-600 px-6 py-3 font-semibold text-white transition-colors hover:border-slate-400"
              >
                Call 641-420-8816
              </a>
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl rounded-3xl border border-blue-100 bg-blue-50 p-7 md:p-9">
            <h2 className="text-2xl font-extrabold text-slate-900">Why these are ranges—not fixed packages</h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-700">
              Two small businesses can ask for the same service and require very different work. One may already have strong photographs, clear messaging, accurate listings, and an involved owner. Another may need those foundations built first. The range creates room to recommend what is fair after we understand the business and how we will work together.
            </p>
          </div>
        </section>

        <section className="bg-slate-50 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-700">Typical working ranges</p>
              <h2 className="text-3xl font-extrabold md:text-4xl">Begin with one priority—or connect the whole system</h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                These ranges use a phased approach: complete the setup the business needs, begin with a focused monthly priority, and connect more pieces when they become useful. Your written recommendation will explain the one-time setup and ongoing work clearly.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {serviceRanges.map(({ icon: Icon, title, range, description, includes }) => (
                <article key={title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-extrabold">{title}</h3>
                      <p className="mt-1 text-lg font-bold text-blue-700">{range}</p>
                    </div>
                  </div>
                  <p className="mt-5 leading-relaxed text-slate-600">{description}</p>
                  <ul className="mt-6 space-y-3">
                    {includes.map(item => (
                      <li key={item} className="flex gap-3 text-slate-700">
                        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-slate-500">
              Advertising media, specialty software, travel, printing, and unusually large production needs are separate when required. Website work is normally planned as part of the setup and ongoing relationship—not treated as the only thing a business keeps paying for. Nothing is added without discussion and approval.
            </p>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-700">How pricing is decided</p>
                <h2 className="text-3xl font-extrabold md:text-4xl">Discovery comes before the recommendation.</h2>
                <p className="mt-5 text-lg leading-relaxed text-slate-600">
                  The point is not to push you toward the largest option. It is to understand the problem, identify a workable first step, and be clear about what NTA will be responsible for.
                </p>
              </div>
              <div className="space-y-4">
                {process.map((item, index) => (
                  <div key={item.title} className="flex gap-4 rounded-2xl border border-slate-200 p-6">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-700 font-bold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <p className="mt-2 leading-relaxed text-slate-600">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-blue-700 px-6 py-20 text-white">
          <div className="mx-auto max-w-4xl text-center">
            <Route className="mx-auto mb-5 h-10 w-10 text-blue-200" />
            <h2 className="text-3xl font-extrabold md:text-4xl">You do not need to know which service to ask for.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-blue-100">
              Tell us what is happening in your business. We will help you sort through the options and decide whether a focused $300 starting point or a broader connected plan makes more sense.
            </p>
            <Link
              to="/growth-conversation"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-bold text-blue-800 transition-colors hover:bg-blue-50"
            >
              Talk to My Office™ <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
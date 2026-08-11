import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  Globe2,
  MapPin,
  MessageSquareText,
  MonitorSmartphone,
  Route,
  Video,
} from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

const serviceRanges = [
  {
    icon: MapPin,
    title: 'Local Visibility & Search',
    range: '$300–$750/month',
    description: 'For businesses that need to be easier to find and easier to understand in the communities they serve.',
    includes: [
      'Google Business Profile guidance and updates',
      'Local search and service-area improvements',
      'Business information consistency',
      'Review and reputation support',
      'Practical visibility reporting',
    ],
  },
  {
    icon: MessageSquareText,
    title: 'Content & Social Media',
    range: '$300–$900/month',
    description: 'For businesses that need a steady, useful presence without asking the owner to become the marketing department.',
    includes: [
      'Content planning around the real business',
      'Writing, creative development, and publishing support',
      'Social media and Google Business Profile content',
      'Approval before public posting',
      'A consistent voice across channels',
    ],
  },
  {
    icon: Video,
    title: 'Video & Business Storytelling',
    range: '$300–$1,200+',
    description: 'For a focused video, a short series, or an ongoing storytelling plan using real people, knowledge, and approved assets.',
    includes: [
      'Planning, scripts, and storyboards',
      'Website, social, educational, or promotional video',
      'AI-assisted production when it serves the story',
      'Captions, calls to action, and channel-ready versions',
      'Final review and approval before publication',
    ],
  },
  {
    icon: MonitorSmartphone,
    title: 'Website & Digital Foundation',
    range: '$1,500–$6,000+ project',
    description: 'For a new website, a rebuild, or a stronger digital foundation that helps customers understand what makes the business worth choosing.',
    includes: [
      'Discovery, structure, writing, and design',
      'Mobile-friendly website development',
      'Search, accessibility, analytics, and trust foundations',
      'Clear customer paths and calls to action',
      'Launch support and practical follow-up',
    ],
  },
  {
    icon: Globe2,
    title: 'Connected Digital Growth Office',
    range: '$750–$2,500+/month',
    description: 'For businesses that need several pieces working together instead of a collection of disconnected marketing projects.',
    includes: [
      'A practical Growth Roadmap',
      'Website, visibility, content, social, video, and follow-up',
      'Your Digital Growth Guide™ and direct access to Rick',
      'Connected client communication and approvals',
      'Ongoing priorities shaped around the business',
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
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-700">Typical investment ranges</p>
              <h2 className="text-3xl font-extrabold md:text-4xl">Begin with one need—or connect several</h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                These ranges are planning guides. Your written recommendation will explain the agreed work and price before anything begins.
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
              Advertising media, specialty software, travel, printing, and unusually large production needs are quoted separately when required. Nothing is added without discussion and approval.
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
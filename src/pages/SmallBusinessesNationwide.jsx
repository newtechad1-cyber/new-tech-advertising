import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, MapPin, MessageSquare, MonitorSmartphone, Route, Users } from 'lucide-react';
import MarketingNav from '@/components/nav/MarketingNav';
import SiteFooter from '@/components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

const capabilities = [
  {
    icon: Route,
    title: 'A practical Growth Roadmap',
    description: 'We begin by understanding your business, your market, and what is getting in the way. Then we organize the next steps around what matters most.',
  },
  {
    icon: MonitorSmartphone,
    title: 'A connected digital presence',
    description: 'Your website, search visibility, content, social media, video, and follow-up should support one another instead of operating as disconnected projects.',
  },
  {
    icon: MessageSquare,
    title: 'Natural communication',
    description: 'Speak, type, upload, review, and approve work in the way that is comfortable for you. AI helps organize the work while people remain responsible for the decisions.',
  },
  {
    icon: Users,
    title: 'Experience with a human behind it',
    description: 'Your Digital Growth Guide™ helps you get oriented, and Rick remains available when a direct business conversation would be more useful.',
  },
];

const steps = [
  'Tell us about your business in a conversation, by voice or in writing.',
  'We identify the real need before recommending services or technology.',
  'You receive a clear path that fits your priorities, capacity, and market.',
  'We build and manage the agreed pieces with your review and approval.',
];

export default function SmallBusinessesNationwide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SEOHead
        title="Digital Growth Help for Small Businesses Nationwide | NTA"
        description="New Tech Advertising helps small businesses nationwide understand and build connected websites, content, visibility, and digital growth systems."
      />

      <MarketingNav />

      <main>
        <section className="relative overflow-hidden bg-slate-950 px-6 pb-20 pt-32 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 via-slate-950 to-slate-900" />
          <div className="relative mx-auto max-w-5xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm font-semibold text-blue-200">
              <MapPin className="h-4 w-4" />
              Built in North Iowa. Available nationwide.
            </div>
            <h1 className="max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
              A Digital Growth Office for Small Businesses Nationwide
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl">
              Your business does not have to be in North Iowa or southern Minnesota to work with NTA. If we can understand your business, your customers, and your market, we can help you build a clearer, more connected path for growth.
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

        <section className="px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-700">Local understanding, national reach</p>
              <h2 className="text-3xl font-extrabold leading-tight md:text-4xl">
                Good digital guidance should begin with your business—not your ZIP code.
              </h2>
            </div>
            <div className="space-y-5 text-lg leading-relaxed text-slate-600">
              <p>
                NTA is based in North Iowa and works throughout North Iowa and southern Minnesota, including the growing Rochester market. That is our home market, but it is not a boundary.
              </p>
              <p>
                Most of the work inside a Digital Growth Office can be done through conversation, shared information, online review, and clear approvals. Local search work is built around your location and customers—not ours.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-700">How NTA can help</p>
              <h2 className="text-3xl font-extrabold md:text-4xl">One connected system, shaped around your business</h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                You do not need to arrive knowing which service to buy. Discovery comes first.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {capabilities.map(({ icon: Icon, title, description }) => (
                <article key={title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-600">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-700">How remote work stays personal</p>
              <h2 className="text-3xl font-extrabold md:text-4xl">Work with AI without changing how you work.</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                The technology should make it easier to communicate, not force you to learn another complicated system. You can explain what is happening naturally; NTA uses AI to help organize the information, prepare the work, and keep the pieces connected.
              </p>
            </div>
            <ol className="space-y-4">
              {steps.map((step, index) => (
                <li key={step} className="flex gap-4 rounded-2xl border border-slate-200 p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="pt-1 leading-relaxed text-slate-700">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-blue-700 px-6 py-20 text-white">
          <div className="mx-auto max-w-4xl text-center">
            <CheckCircle className="mx-auto mb-5 h-10 w-10 text-blue-200" />
            <h2 className="text-3xl font-extrabold md:text-4xl">Start with a conversation, not a sales pitch.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-blue-100">
              Tell us what you are trying to accomplish, what is not working, or what has you confused. We will help you make sense of it before deciding what should come next.
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

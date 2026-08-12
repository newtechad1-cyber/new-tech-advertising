import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Building2, MapPin, Wrench } from 'lucide-react';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import SEOHead from '@/components/shared/SEOHead';

const caseStudies = [
  {
    title: 'Johnson Heating & AC — 14 Years of Consistent Growth',
    description: 'How a long-term relationship grew from traditional advertising into a connected website, local visibility, content, and business-support system.',
    href: '/case-studies/johnson-heating',
    label: 'Long-Term Client Relationship',
    location: 'Mason City, Iowa',
    icon: Wrench,
    accent: 'purple',
  },
  {
    title: 'Monson Plumbing, Heating & Excavating — Building a Digital Presence',
    description: 'How NTA helped an established, multi-generation local business bring its real-world reputation online with a professional website and connected visibility.',
    href: '/case-studies/monson-plumbing',
    label: 'Website & Local Visibility',
    location: 'Mason City, Iowa',
    icon: Building2,
    accent: 'cyan',
  },
  {
    title: 'How NTA Became a Digital Growth Office',
    description: 'How Rick Hesse organized more than 45 years of business, advertising, sales, and client-service experience into a connected system for education, discovery, and practical growth.',
    href: '/case-studies/how-nta-became-a-digital-growth-office',
    label: 'NTA Building-and-Discovery Case Study',
    location: 'North Iowa & Southern Minnesota',
    icon: BookOpen,
    accent: 'violet',
  },
];

const accents = {
  purple: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
  cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
  orange: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
  violet: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
};

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SEOHead
        title="Case Studies | New Tech Advertising"
        description="Real NTA client work and building-and-discovery case studies showing how websites, visibility, content, and practical business systems work together."
      />
      <MarketingNav />

      <main>
        <section className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 px-4 py-20 text-center">
          <div className="mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-600/15 px-4 py-1.5 text-sm font-medium text-violet-300">
              <BookOpen className="h-4 w-4" /> Real Work. Honest Lessons.
            </span>
            <h1 className="mt-6 text-4xl font-extrabold sm:text-5xl">NTA Case Studies</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
              These stories show what NTA has built with real businesses—and what Rick has learned while building NTA's own Digital Growth Office. The goal is not to make oversized promises. It is to show the work, explain the thinking, and share what another business owner can learn from it.
            </p>
          </div>
        </section>

        <section className="px-4 py-14 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
            {caseStudies.map(study => {
              const Icon = study.icon;
              return (
                <Link
                  key={study.href}
                  to={study.href}
                  className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10 sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${accents[study.accent]}`}>
                      {study.label}
                    </span>
                    <Icon className="h-6 w-6 shrink-0 text-slate-500 transition group-hover:text-violet-300" />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold leading-snug text-white transition group-hover:text-violet-200">
                    {study.title}
                  </h2>
                  <p className="mt-3 flex-1 leading-relaxed text-slate-400">{study.description}</p>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-sm text-slate-500">
                      <MapPin className="h-4 w-4" /> {study.location}
                    </span>
                    <span className="flex items-center gap-2 font-semibold text-violet-300">
                      Read Case Study <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="border-t border-slate-800 bg-slate-900 px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">Your business will have its own story.</h2>
            <p className="mt-4 leading-relaxed text-slate-300">
              NTA starts by understanding the business, the owner, and what is already working. From there, we can decide what deserves attention first.
            </p>
            <Link
              to="/growth-guide"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-7 py-3.5 font-bold text-white transition hover:bg-violet-500"
            >
              Talk to My Office™ <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

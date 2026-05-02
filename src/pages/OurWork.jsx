import React from 'react';
import MarketingNav from '../components/nav/MarketingNav';
import SiteFooter from '../components/marketing/SiteFooter';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CLIENTS = [
  {
    name: 'Johnson Heating',
    work: 'Website structure, SEO pages, and seasonal campaigns.',
    focus: 'Making it easier for homeowners to find services and reach out.',
  },
  {
    name: 'Monson Plumbing & Heating + Excavating',
    work: 'Service positioning, local campaigns, and landing pages.',
    focus: 'Clear messaging and simple offers.',
  },
  {
    name: "Papa Everett's Pizza",
    work: 'Website updates, menu visibility, and local search presence.',
    focus: 'Helping customers quickly find info and take action.',
  },
  {
    name: 'Club Fitness – Fort Dodge',
    work: 'Website structure and messaging improvements.',
    focus: 'Clarity and making it easier for people to understand services.',
  },
];

const AUDITS = [
  {
    name: 'R Loving Care',
    desc: 'Website and messaging review focused on clarity and trust.',
  },
  {
    name: 'Echo Equipment',
    desc: 'SEO and structure review with practical improvement recommendations.',
  },
];

const WHAT_MATTERS = [
  'Being found locally',
  'Clear messaging',
  'Simple next steps',
];

export default function OurWork() {
  return (
    <div className="bg-white min-h-screen">
      <MarketingNav />

      {/* Header */}
      <section className="bg-slate-950 text-white pt-20 pb-16 px-4">
        <div className="max-w-5xl mx-auto max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-black mb-4">Our Work</h1>
          <p className="text-slate-400 text-lg">Real businesses. Real work. No inflated claims.</p>
        </div>
      </section>

      {/* Client Projects */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6">
            {CLIENTS.map(client => (
              <div key={client.name} className="border border-slate-200 rounded-2xl p-7">
                <h2 className="text-xl font-black text-slate-900 mb-3">{client.name}</h2>
                <p className="text-slate-600 mb-3 leading-relaxed">{client.work}</p>
                <p className="text-sm text-slate-500">
                  <span className="font-semibold text-slate-700">Focused on:</span> {client.focus}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prospects & Audits */}
      <section className="py-16 px-4 bg-slate-50 border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Prospects & Audits</h2>
          <p className="text-slate-500 text-sm mb-8">Website and gap reviews done for local businesses.</p>
          <div className="grid sm:grid-cols-2 gap-5">
            {AUDITS.map(item => (
              <div key={item.name} className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="font-black text-slate-900 mb-2">{item.name}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Matters */}
      <section className="py-20 px-4 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-xl">
            <h2 className="text-3xl font-black text-slate-900 mb-5">What Matters</h2>
            <ul className="space-y-2 mb-8">
              {WHAT_MATTERS.map(item => (
                <li key={item} className="flex items-start gap-2 text-slate-700">
                  <span className="text-blue-500 font-bold mt-0.5">·</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-slate-600">That's what every project focuses on.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-slate-950 text-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-3">
          <Link
            to="/gap-audit"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-4 rounded-xl text-base transition-colors"
          >
            Get My Free Gap Audit <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="tel:+16414208816"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold px-7 py-4 rounded-xl text-base transition-colors"
          >
            Call or Text: 641-420-8816
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const EXAMPLES = [
  {
    client: 'Johnson Heating & A/C',
    location: 'Mason City, IA',
    industry: 'HVAC',
    color: 'border-orange-300 bg-orange-50',
    tag: 'bg-orange-100 text-orange-700',
    what: 'Seasonal Facebook campaign + local landing page',
    result: 'Drove inbound service calls during spring tune-up season using a targeted Facebook campaign paired with a conversion-focused landing page.',
    href: '/our-work',
  },
  {
    client: 'Monson Excavating',
    location: 'North Iowa',
    industry: 'Excavating',
    color: 'border-yellow-300 bg-yellow-50',
    tag: 'bg-yellow-100 text-yellow-700',
    what: 'Dump Day campaign + ongoing social content',
    result: 'Built a campaign around their annual Dump Day event and layered in regular social content to keep their name front of mind in the local market.',
    href: '/our-work',
  },
  {
    client: 'R Loving Care',
    location: 'Iowa',
    industry: 'Care Services',
    color: 'border-pink-300 bg-pink-50',
    tag: 'bg-pink-100 text-pink-700',
    what: 'Gap audit + website rebuild',
    result: 'Identified key visibility and trust gaps on their existing site, rebuilt it with a local SEO structure designed to attract families searching for care services.',
    href: '/gap-audit/example-hvac-mason-city',
    isAudit: true,
  },
  {
    client: 'Echo Equipment',
    location: 'North Iowa',
    industry: 'Equipment Sales & Service',
    color: 'border-blue-300 bg-blue-50',
    tag: 'bg-blue-100 text-blue-700',
    what: 'Gap audit — 4 quick-win lead opportunities identified',
    result: 'A quick audit revealed 4 clear areas where the business was missing local traffic and leads — all fixable without a full redesign.',
    href: '/gap-audit/example-hvac-mason-city',
    isAudit: true,
  },
];

export default function HomeClientExamples() {
  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-3">Real Client Work</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">What This Looks Like in Practice</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            These are local businesses we've worked with directly — real campaigns, real results, real markets.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {EXAMPLES.map(ex => (
            <div key={ex.client} className={`rounded-2xl border-2 p-7 flex flex-col ${ex.color}`}>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-lg font-bold text-slate-900">{ex.client}</p>
                  <p className="text-sm text-slate-500">{ex.location}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${ex.tag}`}>{ex.industry}</span>
              </div>
              <p className="text-sm font-semibold text-slate-700 mb-2">📌 {ex.what}</p>
              <p className="text-slate-600 text-sm leading-relaxed flex-1">{ex.result}</p>
              <Link
                to={ex.href}
                className="mt-5 inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-semibold transition"
              >
                {ex.isAudit ? 'See Sample Audit' : 'View Our Work'} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/our-work"
            className="inline-flex items-center gap-2 border-2 border-slate-300 hover:border-blue-400 text-slate-700 hover:text-blue-700 font-semibold px-7 py-3 rounded-xl text-sm transition"
          >
            See All Work & Case Studies <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
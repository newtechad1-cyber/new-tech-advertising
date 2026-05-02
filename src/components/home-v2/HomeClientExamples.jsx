import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const EXAMPLES = [
  {
    client: 'Johnson Heating & AC',
    type: 'Seasonal Campaign',
    industry: 'HVAC',
    color: 'bg-orange-600',
    result: 'Spring tune-up campaign generated 23 service calls in 6 weeks.',
    what: 'Built a spring AC tune-up landing page, ran Facebook ads, created 5 SEO pages targeting "AC tune-up Mason City" and surrounding towns, plus a 60-second promo video.',
    tags: ['Seasonal Campaign', 'Facebook Ads', 'SEO Pages', 'Video'],
  },
  {
    client: 'Monson Dump Day / Excavating',
    type: 'Event + Year-Round Campaign',
    industry: 'Excavating & Hauling',
    color: 'bg-yellow-600',
    result: 'Dump Day event drove 40+ customers and 12 new excavating project leads.',
    what: 'Created a Dump Day event landing page, social posts, and email blast. Paired it with year-round SEO pages for excavating, land grading, and septic services across Cerro Gordo County.',
    tags: ['Event Campaign', 'Social Posts', 'SEO Pages', 'Email'],
  },
  {
    client: 'R Loving Care',
    type: 'Gap Audit',
    industry: 'Home Care',
    color: 'bg-rose-600',
    result: 'Audit revealed zero Google visibility — SEO rebuild boosted local rankings in 90 days.',
    what: 'Full gap audit found a slow site, no Google Business Profile optimization, and no service-specific pages. We rebuilt the site, added city + service pages, and set up a follow-up system for inquiry forms.',
    tags: ['Gap Audit', 'Website Rebuild', 'SEO', 'Follow-Up'],
  },
  {
    client: 'Echo Equipment',
    type: 'Gap Audit',
    industry: 'Equipment Sales & Service',
    color: 'bg-slate-700',
    result: 'Audit identified 6 major visibility gaps — 3 fixed in the first month.',
    what: 'Found that Echo\'s site had no local keyword targeting, no mobile optimization, and no social presence. Delivered a prioritized action plan and began content builds for their top service categories.',
    tags: ['Gap Audit', 'Local SEO', 'Content Strategy'],
  },
];

export default function HomeClientExamples() {
  const [active, setActive] = useState(0);
  const ex = EXAMPLES[active];

  return (
    <section className="bg-slate-50 py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-3">Real Work. Real Results.</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">North Iowa Businesses We've Helped</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">These aren't generic case studies. These are local businesses in your area.</p>
        </div>

        {/* Client selector tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {EXAMPLES.map((e, i) => (
            <button
              key={e.client}
              onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                active === i
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
              }`}
            >
              {e.client}
            </button>
          ))}
        </div>

        {/* Example card */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className={`${ex.color} px-6 py-4 flex items-center justify-between`}>
            <div>
              <p className="text-white font-black text-xl">{ex.client}</p>
              <p className="text-white/75 text-sm">{ex.type} · {ex.industry}</p>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-end">
              {ex.tags.map(t => (
                <span key={t} className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">{t}</span>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8 grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">What We Did</p>
              <p className="text-slate-700 leading-relaxed text-sm">{ex.what}</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 flex flex-col justify-center">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Result</p>
              <p className="text-slate-800 font-semibold leading-relaxed">{ex.result}</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a href="/gap-audit" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline text-sm">
            Want results like this? Get your free gap audit <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';

export default function HomeHeroV2() {
  return (
    <section className="bg-slate-900 text-white pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left: Copy */}
          <div className="flex-1">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-400 border border-blue-700 px-3 py-1 rounded-full mb-5">
              Local Lead Systems · North Iowa
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
              We Build Lead Systems for Local Service Businesses
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-4">
              Not just a website. A complete system — SEO pages, seasonal campaigns, social content, video, and follow-up — that consistently brings in leads for HVAC, plumbing, excavating, lawn care, and other service businesses.
            </p>
            <p className="text-slate-400 text-sm mb-8">
              Based in North Iowa. Built for the towns and businesses we actually know.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/rebuild-intake?source=hero"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-4 rounded-xl text-base transition shadow-lg"
              >
                Get a Free Gap Audit <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/our-work"
                className="inline-flex items-center justify-center gap-2 border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold px-7 py-4 rounded-xl text-base transition"
              >
                See Real Examples
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-2 text-slate-500 text-sm">
              <Phone className="w-4 h-4" />
              <span>Or call/text Rick directly: </span>
              <a href="tel:+16413579932" className="text-blue-400 hover:text-blue-300 font-semibold">(641) 357-9932</a>
            </div>
          </div>

          {/* Right: Social proof snapshot */}
          <div className="lg:w-80 w-full space-y-3">
            {[
              { label: 'Johnson Heating & A/C', tag: 'HVAC · Mason City', result: 'Seasonal campaign + landing page driving inbound calls' },
              { label: 'Monson Excavating', tag: 'Excavating · North Iowa', result: 'Dump Day campaign + social content generating leads' },
              { label: 'R Loving Care', tag: 'Care Services · Iowa', result: 'Gap audit + website rebuild growing local visibility' },
              { label: 'Echo Equipment', tag: 'Equipment · North Iowa', result: 'Audit identified 4 quick-win lead opportunities' },
            ].map(c => (
              <div key={c.label} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                <p className="text-white text-sm font-semibold">{c.label}</p>
                <p className="text-xs text-blue-400 mb-1">{c.tag}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{c.result}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
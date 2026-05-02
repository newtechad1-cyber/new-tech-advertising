import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const points = ["What's working", "What's not", "What you can fix first"];

export default function GapAuditCenteredCTA() {
  return (
    <>
      {/* Mid-page CTA */}
      <section className="bg-slate-950 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Not Sure What's Working?
            </h2>
            <p className="text-slate-300 text-lg mb-6 leading-relaxed">
              I'll take a look at your site and break it down:
            </p>
            <ul className="space-y-3 mb-8">
              {points.map(p => (
                <li key={p} className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/gap-audit"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-4 rounded-xl transition-colors text-base"
              >
                Get My Free Gap Audit <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+16414208816"
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-bold px-6 py-4 rounded-xl transition-colors text-base"
              >
                Call or Text: 641-420-8816
              </a>
            </div>
          </div>

          <div className="hidden lg:block rounded-2xl overflow-hidden shadow-xl aspect-video">
            <img
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80"
              alt="Website review"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Simple values strip */}
      <section className="bg-slate-900 text-white py-14 px-6 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">Simple. Practical. Built to Work.</h2>
          <p className="text-slate-400 mb-8 text-base">
            No inflated claims. No overcomplicated strategies.<br />
            Just a system that helps your business show up, make sense, and get contacted.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/gap-audit"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-4 rounded-xl transition-colors"
            >
              Get My Free Gap Audit <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+16414208816"
              className="inline-flex items-center justify-center gap-2 border border-slate-600 hover:border-slate-400 text-white font-bold px-7 py-4 rounded-xl transition-colors"
            >
              Call or Text: 641-420-8816
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
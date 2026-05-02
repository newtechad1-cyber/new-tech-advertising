import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';

export default function HomeFinalCTAV2() {
  return (
    <>
      {/* Bottom strong CTA */}
      <section className="bg-slate-950 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl">
            <p className="text-slate-400 text-sm uppercase tracking-widest font-semibold mb-3">Ready to get started?</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-8">
              Call or Text: 641-420-8816
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
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
                <Phone className="w-4 h-4" /> Call or Text
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Our Work section */}
      <section className="bg-white py-20 px-4 border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Real Work, Real Businesses</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              See examples of the work I've done with local businesses across different industries.
            </p>
            <Link
              to="/our-work"
              className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:border-slate-400 bg-white text-slate-800 font-bold px-7 py-4 rounded-xl text-base transition-colors"
            >
              View Our Work <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
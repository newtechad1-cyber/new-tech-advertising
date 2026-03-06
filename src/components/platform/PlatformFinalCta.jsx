import React from 'react';
import { ArrowRight, Phone } from 'lucide-react';

const TRIAL_URL = 'https://app.newtechadvertising.com/start-trial';
const STRATEGY_URL = 'https://app.newtechadvertising.com/book-call';

export default function PlatformFinalCta() {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-20 lg:py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/15 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-3xl mx-auto text-center">
        <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-5">
          Try the AI Marketing Platform Free
        </h2>
        <p className="text-lg text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">
          Create marketing content, schedule posts, and see how easy marketing can be with the NTA platform.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={TRIAL_URL}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5"
          >
            Start Your 7-Day Free Trial <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href={STRATEGY_URL}
            className="inline-flex items-center gap-2 border border-slate-500 hover:border-white text-slate-300 hover:text-white font-semibold px-6 py-4 rounded-xl text-base transition-all duration-200"
          >
            <Phone className="w-4 h-4" /> Book Strategy Call
          </a>
        </div>
        <p className="text-slate-500 text-sm mt-6">No credit card required • 7 days free • Cancel anytime</p>
      </div>
    </section>
  );
}
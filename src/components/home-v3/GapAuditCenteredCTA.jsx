import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function GapAuditCenteredCTA() {
  return (
    <section className="bg-slate-950 text-white py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-black mb-4">
          Not Sure What's Working?
        </h2>
        <p className="text-slate-300 text-lg mb-8">
          I'll take a look at your website and show you what's missing.
        </p>
        <Link
          to="/gap-audit"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-colors text-base"
        >
          Get a Free Gap Audit <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="text-slate-500 mt-5 text-sm">
          Or call/text: <a href="tel:+16414208816" className="text-slate-400 hover:text-white transition-colors">641-420-8816</a>
        </p>
      </div>
    </section>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, ArrowRight } from 'lucide-react';

export default function HomeFinalCTAV2() {
  return (
    <section className="bg-slate-950 py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
          Ready to Stop Losing Leads<br className="hidden sm:block" /> to Competitors?
        </h2>
        <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          Get a free Gap Audit and we'll show you exactly what's costing you customers — and exactly how to fix it.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            to="/gap-audit"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-4 rounded-xl text-base transition-colors"
          >
            Get a Free Gap Audit <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="tel:+16413579932"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors"
          >
            <Phone className="w-4 h-4" /> Call (641) 357-9932
          </a>
        </div>

        <p className="text-slate-600 text-sm">
          Based in Mason City, Iowa · Serving North Iowa & Southern Minnesota
        </p>
      </div>
    </section>
  );
}
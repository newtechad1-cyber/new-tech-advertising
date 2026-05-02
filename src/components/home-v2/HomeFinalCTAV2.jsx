import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';

export default function HomeFinalCTAV2() {
  return (
    <section className="py-24 px-6 bg-slate-900 text-white">
      <div className="max-w-3xl mx-auto text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block mb-4">Ready to Get Started?</span>
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-5 leading-tight">
          Let's Build Your Lead System
        </h2>
        <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Start with a free gap audit. We'll look at your current setup and show you what we'd do first — no obligation, no pressure.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/rebuild-intake?source=footer-cta"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-base transition shadow-xl"
          >
            Get a Free Gap Audit <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/book-call"
            className="inline-flex items-center justify-center gap-2 border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold px-8 py-4 rounded-xl text-base transition"
          >
            Book a Call
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 text-sm">
          <Phone className="w-4 h-4" />
          <span>Call or text Rick: </span>
          <a href="tel:+16413579932" className="text-blue-400 hover:text-blue-300 font-semibold">(641) 357-9932</a>
        </div>

        <div className="mt-10 pt-10 border-t border-slate-800 grid sm:grid-cols-3 gap-4 text-center text-sm text-slate-500">
          <div>
            <p className="text-white font-semibold text-base">HVAC · Plumbing · Excavating</p>
            <p>Local service campaigns</p>
          </div>
          <div>
            <p className="text-white font-semibold text-base">Lawn · Home · Care</p>
            <p>Lead system builds</p>
          </div>
          <div>
            <p className="text-white font-semibold text-base">Equipment · Contractors</p>
            <p>Website rebuilds + SEO</p>
          </div>
        </div>
      </div>
    </section>
  );
}
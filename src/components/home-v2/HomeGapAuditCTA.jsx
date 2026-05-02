import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Phone } from 'lucide-react';

export default function HomeGapAuditCTA() {
  return (
    <section className="bg-slate-50 py-20 px-4 border-t border-slate-100">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Not Sure What's Missing?</h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-6">
            Send your website and I'll take a look.
          </p>
          <ul className="space-y-2 mb-8">
            {["What's working", "What's not", "What to fix first"].map(item => (
              <li key={item} className="flex items-center gap-2.5 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/gap-audit"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-4 rounded-xl text-base transition-colors"
            >
              Get My Free Gap Audit <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+16414208816"
              className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:border-slate-400 bg-white text-slate-800 font-bold px-7 py-4 rounded-xl text-base transition-colors"
            >
              <Phone className="w-4 h-4" /> Call or Text: 641-420-8816
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
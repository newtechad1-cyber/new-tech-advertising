import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export default function HomeGapAuditCTA() {
  return (
    <section className="bg-slate-50 py-20 px-4 border-t border-slate-100">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Not Sure What's Missing?</h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-6">
            If you're not sure what's working—or what's not—I can take a look at your site and show you.
          </p>
          <ul className="space-y-2 mb-8">
            {["What's working", "What's not", "What you can improve first"].map(item => (
              <li key={item} className="flex items-center gap-2.5 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-slate-500 text-sm mb-8">No pressure. Just a clear breakdown.</p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              to="/gap-audit"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-4 rounded-xl text-base transition-colors"
            >
              Get My Free Gap Audit
            </Link>
            <span className="text-slate-500 text-sm">
              Or text me directly: <a href="sms:+16414208816" className="font-semibold text-slate-700 hover:text-blue-600 transition-colors">641-420-8816</a>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
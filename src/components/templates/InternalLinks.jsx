import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function InternalLinks({ heading = "Related Resources", links = [] }) {
  if (!links.length) return null;
  return (
    <section className="bg-slate-900 border-t border-slate-800 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-white font-bold text-lg mb-6">{heading}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link, i) => (
            <Link
              key={i}
              to={link.href}
              className="flex items-start gap-3 bg-slate-950 border border-slate-800 hover:border-slate-600 rounded-xl p-4 transition-all group"
            >
              <div className="flex-1">
                {link.label && <p className="text-xs text-violet-400 font-semibold uppercase tracking-wide mb-1">{link.label}</p>}
                <p className="text-white text-sm font-semibold group-hover:text-violet-300 transition-colors">{link.title}</p>
                {link.desc && <p className="text-slate-500 text-xs mt-1">{link.desc}</p>}
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 flex-shrink-0 mt-0.5 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
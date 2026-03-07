import React from 'react';

export default function PillarSection({ badge, heading, subheading, children, dark = false }) {
  return (
    <section className={`py-16 px-4 border-t border-slate-800 ${dark ? 'bg-slate-950' : 'bg-slate-900'}`}>
      <div className="max-w-5xl mx-auto">
        {(badge || heading) && (
          <div className="text-center mb-12">
            {badge && (
              <span className="text-violet-400 text-xs font-bold uppercase tracking-widest">{badge}</span>
            )}
            {heading && (
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 mb-3">{heading}</h2>
            )}
            {subheading && (
              <p className="text-slate-400 text-base max-w-2xl mx-auto">{subheading}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
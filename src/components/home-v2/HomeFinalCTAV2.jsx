import React from 'react';

export default function HomeFinalCTAV2() {
  return (
    <section className="bg-white py-20 px-4 border-t border-slate-100">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-5">
            Simple. Practical. Built to Work.
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-6">
            This isn't about chasing trends or overcomplicating things.
          </p>
          <p className="text-slate-600 text-base mb-4">
            It's about making sure your business:
          </p>
          <ul className="space-y-2 mb-8">
            {['Shows up', 'Makes sense', 'Gets contacted'].map(item => (
              <li key={item} className="flex items-start gap-2 text-slate-700 text-base">
                <span className="text-blue-500 font-bold mt-0.5">·</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-slate-700 text-base font-semibold">
            If that's not happening right now, we should fix it.
          </p>
        </div>
      </div>
    </section>
  );
}
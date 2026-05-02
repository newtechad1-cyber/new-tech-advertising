import React from 'react';
import TextMeButton from '../shared/TextMeButton';

export default function HomeFinalCTAV2() {
  return (
    <section className="bg-white py-20 px-4 border-t border-slate-100">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-5">
            Simple. Practical. Built to Work.
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-4">
            No inflated claims. No overcomplicated strategies.
          </p>
          <p className="text-slate-600 mb-3">Just a system that helps your business:</p>
          <ul className="space-y-2 mb-8">
            {['Show up', 'Make sense', 'Get contacted'].map(item => (
              <li key={item} className="flex items-start gap-2 text-slate-700 text-base">
                <span className="text-blue-500 font-bold mt-0.5">·</span>
                {item}
              </li>
            ))}
          </ul>
          <TextMeButton />
        </div>
      </div>
    </section>
  );
}
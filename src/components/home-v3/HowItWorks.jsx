import React from 'react';

const steps = [
  { num: '1', text: 'Review what you already have' },
  { num: '2', text: 'Identify gaps in visibility, messaging, and structure' },
  { num: '3', text: 'Recommend practical improvements' },
  { num: '4', text: 'Build from there only if it makes sense' },
];

export default function HowItWorks() {
  return (
    <section className="bg-slate-50 py-20 px-6 border-t border-slate-100">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT: Steps */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-8">
            How I Work
          </h2>
          <div className="space-y-4 mb-6">
            {steps.map(step => (
              <div key={step.num} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm flex-shrink-0">
                  {step.num}
                </div>
                <p className="text-slate-800 text-base font-medium">{step.text}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-sm">Most of the time, it's not about doing more. It's about fixing the right things.</p>
        </div>

        {/* RIGHT: Image */}
        <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3] bg-slate-200">
          <img
            src="https://media.base44.com/images/public/691f41a18de4a7f498c8f884/07c407115_howaihaschangedmarketing.png"
            alt="How AI has changed marketing"
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </section>
  );
}
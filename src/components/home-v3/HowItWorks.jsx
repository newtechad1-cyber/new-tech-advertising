import React from 'react';

const steps = [
  { num: '1', text: 'I look at your website' },
  { num: '2', text: 'I find what\'s missing' },
  { num: '3', text: 'I show you what to fix' },
  { num: '4', text: 'We build from there if it makes sense' },
];

export default function HowItWorks() {
  return (
    <section className="bg-slate-50 py-20 px-6 border-t border-slate-100">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT: Text */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-8">
            How It Works
          </h2>
          <div className="space-y-4">
            {steps.map(step => (
              <div key={step.num} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm flex-shrink-0">
                  {step.num}
                </div>
                <p className="text-slate-800 text-base font-medium">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Image */}
        <div className="rounded-2xl overflow-hidden shadow-lg bg-slate-100 aspect-[4/3]">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
            alt="Simple process illustration"
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </section>
  );
}
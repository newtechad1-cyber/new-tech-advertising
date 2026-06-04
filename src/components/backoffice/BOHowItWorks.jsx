import React from 'react';

export default function BOHowItWorks() {
  const steps = [
    {
      num: "1",
      title: "Tell Us How You Work",
      desc: "We sit down and learn your actual workflow — how you dispatch, invoice, track inventory, and manage customers today."
    },
    {
      num: "2",
      title: "We Build It",
      desc: "We create a custom app with only the screens you need. Real data, real workflow — not a generic template."
    },
    {
      num: "3",
      title: "You Run Your Business",
      desc: "Log in, start using it. We handle updates, changes, and support. If you need a new screen or feature, just ask."
    }
  ];

  return (
    <section className="py-24 px-6 bg-slate-950 border-b border-slate-900 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <p className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-4">
            HOW IT WORKS
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Up and Running in 3 Steps
          </h2>
          <p className="text-xl text-slate-400 leading-relaxed">
            No 6-month implementation. No training courses. No consultants.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-0.5 bg-slate-800 z-0"></div>

          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-3xl font-black text-white mb-6 shadow-[0_0_20px_rgba(16,185,129,0.3)] border-4 border-slate-950 shrink-0">
                {step.num}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
              <p className="text-slate-400 text-base leading-relaxed max-w-sm">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
import React from 'react';

const steps = [
  {
    num: 1,
    title: "Tell Us About Your Restaurant",
    desc: "A quick call about your menu, your workflow, and what's not working. We'll show you exactly what we can build."
  },
  {
    num: 2,
    title: "We Build Your System",
    desc: "Ordering page, menu management, visibility setup — built around how YOUR restaurant actually runs."
  },
  {
    num: 3,
    title: "Start Taking Orders",
    desc: "Go live with your own branded ordering. Customers order from you, not DoorDash. You keep every dollar."
  }
];

export default function RestHowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#0B1120] py-20 px-6 border-t border-slate-900">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-amber-500 text-sm font-bold uppercase tracking-widest mb-3">
          HOW IT WORKS
        </p>
        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
          From Conversation to Customers in Days
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-16">
          No enterprise contracts. No 3-month rollout. No IT department needed.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-px bg-slate-800" />
          
          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500 text-[#0B1120] flex items-center justify-center font-black text-xl mb-6 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                {step.num}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
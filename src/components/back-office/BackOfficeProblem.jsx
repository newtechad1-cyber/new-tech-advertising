import React from 'react';

export default function BackOfficeProblem() {
  const cards = [
    {
      icon: "💸",
      title: "Paying for Software You Hate",
      description: "QuickBooks, ServiceTitan, Housecall Pro — $50 to $400+/month for tools that do way more (and way less) than what you actually need."
    },
    {
      icon: "📋",
      title: "Dispatch by Whiteboard",
      description: "Jobs tracked on paper, in texts, or in your head. Techs don't know what's next. Things fall through the cracks every week."
    },
    {
      icon: "⏰",
      title: "Hours on Invoicing & Books",
      description: "End-of-day data entry, chasing invoices, manually reconciling expenses. The admin work eats into the time you should be growing."
    }
  ];

  return (
    <section className="py-24 px-6 bg-slate-950 border-b border-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <p className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-3">
            THE PROBLEM
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Service Businesses Shouldn't Need 5 Tools To Run
          </h2>
          <p className="text-slate-400 text-lg md:text-xl">
            Most HVAC, plumbing, and contractor businesses are duct-taping together tools that weren't built for them.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:bg-slate-900 transition-colors shadow-lg flex flex-col items-center text-center">
              <div className="text-4xl mb-6 bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center border border-slate-700 shadow-inner">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{card.title}</h3>
              <p className="text-slate-400 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
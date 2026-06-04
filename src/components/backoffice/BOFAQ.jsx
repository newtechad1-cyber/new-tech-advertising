import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: "How is this different from QuickBooks or ServiceTitan?",
    a: "Those are massive platforms built for everyone. We build custom software tailored to YOUR specific workflow. You only get the screens and features you actually use — nothing extra, nothing confusing."
  },
  {
    q: "What if I need changes after it's built?",
    a: "That's the beauty of custom — we can add screens, change layouts, or add new features anytime. It's your app, built around your business as it grows."
  },
  {
    q: "Do my techs need to be tech-savvy?",
    a: "Not at all. The Field View is designed to be dead simple — it shows today's jobs, customer info, and a button to update status. If they can use a smartphone, they can use this."
  },
  {
    q: "How long does it take to build?",
    a: "Most businesses are up and running within days. Not months, not weeks — days. We build fast because we focus on what you actually need."
  },
  {
    q: "What does it cost?",
    a: "Way less than what you're paying for QuickBooks + dispatch software + invoicing tools combined. We'll give you an honest quote after understanding your needs. Most clients save money on day one."
  },
  {
    q: "Can I try it first?",
    a: "Yes! We have a live demo with sample data you can click through right now. See exactly how it looks and works before committing to anything."
  }
];

function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div className="border border-slate-800 bg-slate-900/50 rounded-2xl overflow-hidden transition-all duration-200">
      <button
        onClick={onClick}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
      >
        <span className="text-lg font-bold text-white pr-4">{question}</span>
        <ChevronDown 
          className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      <div 
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-5 text-slate-400 leading-relaxed">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BOFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section className="py-24 px-6 bg-slate-950 border-b border-slate-900">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-4">
            COMMON QUESTIONS
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <FAQItem 
              key={idx}
              question={faq.q}
              answer={faq.a}
              isOpen={openIndex === idx}
              onClick={() => handleToggle(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
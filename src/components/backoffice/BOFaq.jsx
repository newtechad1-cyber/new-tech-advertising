import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

export default function BOFaq() {
  return (
    <section className="py-24 px-6 bg-slate-950 border-b border-slate-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-3">
            COMMON QUESTIONS
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border border-slate-800 bg-slate-900/50 rounded-xl px-6 data-[state=open]:bg-slate-900 transition-colors">
              <AccordionTrigger className="text-left text-lg font-bold text-white hover:text-emerald-400 hover:no-underline py-6">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 text-lg leading-relaxed pb-6">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
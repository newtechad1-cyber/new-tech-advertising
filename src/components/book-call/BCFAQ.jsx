import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function BCFAQ() {
  const [expanded, setExpanded] = useState(null);

  const faqs = [
    {
      q: 'How long is the call?',
      a: '30 minutes. We keep it focused and actionable. No fluff, no generic pitch.'
    },
    {
      q: 'Is there any cost?',
      a: 'Absolutely not. This is a free strategy consultation. No credit card required, no follow-up charges.'
    },
    {
      q: 'What if I\'m not sure if we\'re a good fit?',
      a: 'Perfect. That\'s exactly what this call is for. We\'ll be honest about whether NTA is right for your business. No pressure either way.'
    },
    {
      q: 'Can I get a recording of the call?',
      a: 'Yes. We\'ll send you notes and a recording afterward so you can review everything on your schedule.'
    },
    {
      q: 'What if I have questions before the call?',
      a: 'Email us at rick@newtechadvertising.com or call 641-420-8816. We\'re here to help.'
    },
    {
      q: 'Do you work with businesses like mine?',
      a: 'We work with HVAC, plumbing, roofing, restaurants, fitness, real estate, dental, legal, and many other local services. If you\'re a small-to-mid-sized business trying to grow, we likely can help.'
    },
  ];

  return (
    <section className="bg-slate-50 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">Questions?</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
              >
                <h3 className="text-left font-semibold text-slate-900">{faq.q}</h3>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${
                    expanded === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expanded === i && (
                <div className="px-5 pb-5 border-t border-slate-100">
                  <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
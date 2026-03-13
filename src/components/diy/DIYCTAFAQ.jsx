import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'Do I need marketing experience to use DIY?',
    a: 'No. The AI handles all the marketing expertise. You just answer a few questions and the system generates strategy, content, and campaigns for you.',
  },
  {
    q: 'How quickly will I see results?',
    a: 'Most customers see their first leads within 2-3 weeks. It depends on your industry and how consistently you use the tools.',
  },
  {
    q: 'Can I upgrade to a higher plan later?',
    a: 'Absolutely. Many customers start with DIY, get results, and then upgrade to Guided Growth (with strategy help) or Done-For-You (with full execution).',
  },
  {
    q: 'What if I want to cancel?',
    a: 'Cancel anytime with one click. No contracts, no penalties. Your data stays yours.',
  },
  {
    q: 'Do you accept all payment methods?',
    a: 'Yes. We accept all major credit cards through Stripe. Billing is secure and your payment info is never stored on our servers.',
  },
  {
    q: 'Is there a free trial?',
    a: 'No free trial, but the $99/month is significantly less than most marketing tools combined. Most customers see ROI in the first month.',
  },
  {
    q: 'What if I need help using the platform?',
    a: 'Email support is included. We also have a knowledge base with video tutorials and setup guides. Pro support is available for $49/month.',
  },
  {
    q: 'Can I use DIY for multiple locations or brands?',
    a: 'One DIY plan = one business. If you have multiple locations, you can set them up within one account or purchase additional plans.',
  },
];

export default function DIYCTAFAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="py-20 px-6 bg-slate-900/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Questions Answered</h2>
          <p className="text-xl text-slate-400">Everything you need to know about DIY Growth System</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                className="w-full flex items-center justify-between p-6 hover:bg-slate-800 transition-colors text-left"
              >
                <h3 className="text-white font-semibold pr-4">{faq.q}</h3>
                <ChevronDown
                  className={`w-5 h-5 text-violet-400 flex-shrink-0 transition-transform ${
                    openIdx === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIdx === idx && (
                <div className="px-6 pb-6 text-slate-300 border-t border-slate-700 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-400 mb-4">Still have questions?</p>
          <a
            href="mailto:support@newtechadvertising.com"
            className="inline-block text-violet-400 hover:text-violet-300 font-semibold"
          >
            Email us at support@newtechadvertising.com
          </a>
        </div>
      </div>
    </section>
  );
}
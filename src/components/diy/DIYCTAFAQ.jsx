import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'Is this software or a marketing program?',
    a: 'It\'s a complete marketing growth system with tools, structure, and guidance.',
  },
  {
    q: 'Do I need marketing experience?',
    a: 'No. The platform shows you what to do each week.',
  },
  {
    q: 'How much time will this take?',
    a: 'Most users spend 1–3 hours per week.',
  },
  {
    q: 'Can I upgrade later?',
    a: 'Yes. You can move into guided or done-for-you plans anytime.',
  },
  {
    q: 'Is there a contract?',
    a: 'No. Monthly subscription you can cancel anytime.',
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
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'What makes this different from a regular marketing agency?',
    a: "Most agencies sell you one thing — a website, or social media, or ads. We build the whole system: audit, website, SEO pages, campaigns, content, and follow-up. Everything is designed to work together so you're not paying for pieces that don't connect.",
  },
  {
    q: 'How much does it cost?',
    a: "It depends on what your business actually needs. Some clients start with a gap audit and website rebuild. Others want the full system. We build proposals based on your situation, not a preset menu. The audit itself is free.",
  },
  {
    q: 'Do I need to be tech-savvy to work with you?',
    a: "Not at all. Most of our clients are busy running their businesses — they don't have time to learn marketing tools. We handle the technical side. You just approve content and take the calls.",
  },
  {
    q: 'How long does it take to see results?',
    a: "A new website with proper SEO can start showing results in 30–90 days. Campaigns can drive calls much faster — sometimes within the first week. We'll be upfront about realistic timelines for your specific situation.",
  },
  {
    q: 'Do you work with businesses outside North Iowa?',
    a: "We're based in North Iowa and most of our clients are in the region, but the systems we build work anywhere. If you're a local service business that wants more leads, we can help.",
  },
  {
    q: "What if I already have a website?",
    a: "That's fine. A lot of clients come to us with an existing site that just isn't converting. We start with a gap audit to see what's working and what isn't before recommending anything.",
  },
];

export default function HomeFAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Common Questions</h2>
          <p className="text-slate-500 text-base">Straight answers, no marketing speak.</p>
        </div>
        <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
              >
                <span className="font-semibold text-slate-800 text-sm">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
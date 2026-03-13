import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: "How long until I see results?",
    a: "Most clients see ranking improvements and increased online visibility within 60–90 days. Content and social results begin in the first 30 days. Streaming TV impact is typically visible in local brand recognition by month 2.",
  },
  {
    q: "Is this really fully managed?",
    a: "Yes — 100%. Your only job is a quick monthly review of content before it posts (usually 30 minutes or less). We handle writing, design, scheduling, posting, SEO, video production, and reporting.",
  },
  {
    q: "How does this compare to hiring in-house?",
    a: "An in-house content creator alone costs $50–70k/year in salary — before tools, benefits, or management time. NTA delivers a full-team capability at a fraction of the cost: strategist, writer, designer, video team, and SEO specialist.",
  },
  {
    q: "What if I'm not happy with the content?",
    a: "You approve everything before it goes live. If something doesn't feel right, you request a revision and we fix it within 24 hours. We also do quarterly strategy reviews to make sure the direction keeps evolving.",
  },
  {
    q: "Do I own my website and content?",
    a: "Yes — all content and your website are 100% yours. If you ever leave NTA, you take everything with you. We believe in earning your loyalty through results, not locking you in.",
  },
  {
    q: "Why is the streaming TV piece different?",
    a: "Most agencies don't offer streaming TV at all. NTA produces real 30-second commercials and places them on platforms like Hulu, Peacock, and YouTube TV — the same channels your competitors can't get to. It creates an authority perception that transforms how your market sees you.",
  },
  {
    q: "What's the ROI justification?",
    a: "Look at it this way: if your average job value is $3,000 and NTA delivers 3 additional clients per month, that's $9,000 in new monthly revenue. At a $1,997/month investment, you're generating 4.5x ROI — every single month. One new client covers most of the cost.",
  },
];

export default function DRFAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-800/60">
      <div className="text-center mb-10">
        <h2 className="text-white text-3xl font-black mb-3">Questions & Answers</h2>
        <p className="text-slate-400 text-base">Everything you might be wondering — answered honestly.</p>
      </div>

      <div className="space-y-3 max-w-3xl mx-auto">
        {FAQS.map((faq, i) => (
          <div key={i} className={`border rounded-2xl overflow-hidden transition-all ${openIndex === i ? 'border-blue-500/40 bg-blue-950/10' : 'border-slate-700/50 bg-slate-800/30'}`}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left"
            >
              <span className="text-white font-semibold text-sm pr-4">{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
            </button>
            {openIndex === i && (
              <div className="px-6 pb-5">
                <p className="text-slate-300 text-sm leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
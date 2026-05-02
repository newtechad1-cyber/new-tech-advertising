import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  {
    q: 'What exactly is a "local lead system"?',
    a: 'It\'s everything working together to get you more calls and customers from your local area. That means a fast website, SEO pages that rank on Google, seasonal campaigns, social media posts, and a system that follows up with every new lead automatically. Not just one piece — the whole thing.',
  },
  {
    q: 'I already have a website. Do I need a rebuild?',
    a: 'Not always. That\'s part of what the free Gap Audit answers. Some websites just need SEO work or faster hosting. Others need a full rebuild to stop losing visitors. We\'ll tell you exactly what\'s worth fixing and what\'s not.',
  },
  {
    q: 'How long does it take to see results?',
    a: 'You can see leads from paid campaigns within days. SEO pages typically take 60–90 days to rank. A full lead system working together can take 3–6 months to hit its stride — but most clients see meaningful improvement in the first 30–60 days.',
  },
  {
    q: 'Do you work with businesses outside of Mason City?',
    a: 'Yes. We serve businesses throughout North Iowa and Southern Minnesota — Clear Lake, Osage, Forest City, Albert Lea, Austin, and surrounding areas. If you\'re within about 100 miles of Mason City, we\'ve probably worked nearby.',
  },
  {
    q: 'What does it cost?',
    a: 'It depends on what you need. A full lead system starts around $500–800/month. Individual services like SEO pages or social content are priced separately. The Gap Audit is always free — and it helps us give you an accurate quote.',
  },
  {
    q: 'What makes NTA different from other marketing agencies?',
    a: 'We\'re local, we\'re practical, and we focus on what actually drives leads for service businesses in this market. No corporate fluff. We build systems that work for plumbers, HVAC guys, excavators, and retailers in small towns — not Fortune 500 companies.',
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-900 text-sm pr-4">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 border-t border-slate-100">
          <p className="text-slate-600 text-sm leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function HomeFAQ() {
  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">Common Questions</h2>
          <p className="text-slate-500 text-lg">Straight answers. No marketing speak.</p>
        </div>
        <div className="space-y-2">
          {FAQS.map(f => <FAQItem key={f.q} {...f} />)}
        </div>
      </div>
    </section>
  );
}
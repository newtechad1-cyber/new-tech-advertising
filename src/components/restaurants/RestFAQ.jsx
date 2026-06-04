import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: "Can this really replace DoorDash for my restaurant?",
    a: "For pickup and local delivery — absolutely. Your customers order directly from your website. You get the order notification, you keep 100% of the revenue, and you own the customer relationship. Many restaurants keep DoorDash for discovery but push regulars to their own ordering page where there are no fees."
  },
  {
    q: "What if I already have a website?",
    a: "We can add the ordering system to your existing site, or build you a new AI-optimized site that actually shows up in search results. Either way, we work with what you have."
  },
  {
    q: "Do customers have to download an app?",
    a: "No. It's a web page — they click a link or scan a QR code and order right from their phone's browser. No app store, no account creation required."
  },
  {
    q: "How do I get order notifications?",
    a: "However you want — email, text, a tablet in the kitchen, or even a kitchen display screen. We set it up based on your workflow."
  },
  {
    q: "What does it cost?",
    a: "A fraction of what you're paying in DoorDash commissions. We'll give you a straight answer after a quick call. Most restaurants save money immediately because they stop giving away 20-30% per order."
  },
  {
    q: "I'm not tech-savvy. Can I manage this?",
    a: "If you can post to Facebook, you can manage your menu. We build everything to be dead simple. And we're local — you can call Rick directly if you ever need help."
  }
];

export default function RestFAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section className="bg-[#0B1120] py-20 px-6 border-t border-slate-900">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-12 text-center">
          Common Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <button 
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-bold text-white text-lg pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
              </button>
              {openIdx === i && (
                <div className="px-6 pb-5 text-slate-400 leading-relaxed border-t border-slate-800/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const bullets = [
  'Website rebuilds that make sense',
  'SEO pages that get found locally',
  'Campaigns that get attention',
  'Simple systems that turn interest into calls',
];

export default function WhatIHelpWith() {
  return (
    <section className="bg-white py-20 px-6 border-t border-slate-100">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT: Image */}
        <div className="rounded-2xl overflow-hidden shadow-lg bg-slate-100 aspect-[4/3]">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
            alt="Local business website dashboard"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT: Text */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6">
            What I Help With
          </h2>
          <ul className="space-y-3 mb-8">
            {bullets.map(item => (
              <li key={item} className="flex items-start gap-3 text-slate-700 text-base">
                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <a
            href="sms:+16414208816?body=Hi, I'd like to talk about my website."
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-4 rounded-xl transition-colors text-sm"
          >
            Text Me About Your Website → 641-420-8816
          </a>
        </div>

      </div>
    </section>
  );
}
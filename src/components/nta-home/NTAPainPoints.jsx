import React from 'react';
import { X, Check } from 'lucide-react';

const PAINS = [
  { pain: 'You pay an agency $3K/month and can\'t see what they actually do', fix: 'Full transparency dashboard showing every published asset and result' },
  { pain: 'Your website hasn\'t changed in 2 years and ranks for nothing', fix: 'Authority site rebuilt on NTA framework — updated with AI content weekly' },
  { pain: 'Competitors show up everywhere online — you\'re invisible', fix: 'Streaming TV + search + social presence built and managed automatically' },
  { pain: 'You can\'t tell if marketing is generating actual revenue', fix: 'ROI tracking that connects visibility to leads to closed jobs' },
  { pain: 'Social media dies off after 2 weeks because no one keeps up', fix: 'AI publishes 5+ pieces of content weekly with zero effort from you' },
];

export default function NTAPainPoints() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-4">The Real Problem</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
            Why Traditional Marketing Keeps Failing Local Businesses
          </h2>
          <p className="text-lg text-slate-500">
            Most agencies sell effort. We build systems. Here's the difference that changes everything.
          </p>
        </div>

        <div className="grid gap-4 max-w-4xl mx-auto">
          {PAINS.map((item, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 p-6 bg-slate-50">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X className="w-3.5 h-3.5 text-red-500" />
                </div>
                <p className="text-slate-700 font-medium leading-relaxed">{item.pain}</p>
              </div>
              <div className="flex items-start gap-4 p-6 bg-white">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-green-600" />
                </div>
                <p className="text-slate-700 font-medium leading-relaxed">{item.fix}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
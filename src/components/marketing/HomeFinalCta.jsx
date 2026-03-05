import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const TRIAL_URL = 'https://app.newtechadvertising.com/start-trial';

const TRUST = [
  'No credit card required',
  'Cancel anytime',
  '7-day free trial',
  'Setup in under 10 minutes',
];

const TESTIMONIALS = [
  { quote: "I created a month of social media posts in one afternoon.", name: "Wendy R.", role: "HVAC Business Owner" },
  { quote: "Finally a platform that speaks plain English, not marketing jargon.", name: "Tony J.", role: "Local Retailer" },
  { quote: "I can schedule a whole week of content in under 30 minutes.", name: "Jay M.", role: "Service Business Owner" },
];

export default function HomeFinalCta() {
  return (
    <>
      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-10">What Business Owners Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <p className="text-slate-700 italic mb-4 text-sm leading-relaxed">"{t.quote}"</p>
                <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                <p className="text-slate-500 text-xs">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-blue-600/15 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
            Your first month of content is waiting.
          </h2>
          <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
            Start your free trial today. Create videos, images, and posts for your business — no agency, no freelancer, no technical skills required.
          </p>
          <a
            href={TRIAL_URL}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5"
          >
            Start Free Trial <ArrowRight className="w-5 h-5" />
          </a>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6">
            {TRUST.map(t => (
              <div key={t} className="flex items-center gap-1.5 text-slate-400 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400 shrink-0" /> {t}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
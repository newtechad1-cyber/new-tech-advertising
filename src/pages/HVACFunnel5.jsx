import React from 'react';
import { CheckCircle, Shield, Star, Clock, ArrowRight } from 'lucide-react';

import HVACLeadForm from '../components/hvac-funnel/HVACLeadForm';

const INCLUDES = [
  'AI avatar brand video (60-sec, professional quality)',
  'Authority website audit + quick fixes',
  'Google Business Profile optimization',
  'SEO city/service landing page (1 location)',
  'Social media setup (Facebook + LinkedIn)',
  '4-week content calendar with posts',
  'Reputation system to generate reviews',
  'Monthly performance report',
  'Dedicated account manager',
  'Everything done-for-you — zero work on your end',
];

const URGENCY = [
  { icon: Clock, text: 'We only take 3 new HVAC clients per month to ensure quality' },
  { icon: Shield, text: 'No long-term contracts — cancel anytime after 30 days' },
  { icon: Star, text: 'Free demo system built for your business before you pay' },
];

export default function HVACFunnel5() {
  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      {/* Nav */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs">NTA</div>
          <span className="font-bold text-slate-800 text-sm">HVAC Growth System</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="flex gap-1">{[1,2,3,4,5].map(i => <div key={i} className="w-6 h-1.5 rounded-full bg-blue-500" />)}</div>
          Final Step
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-10 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full">
            🔥 Limited Availability — Only 3 Spots/Month
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
            Request Your <span className="text-blue-600">Free HVAC Demo System</span> — Built for Your Business, Before You Pay a Dime
          </h1>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            We'll build out a custom demo version of the system for your company so you can see exactly what it looks like before making any commitment.
          </p>
        </div>

        {/* Video */}
        <div className="w-full max-w-3xl mx-auto my-8">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700" style={{ aspectRatio: '16/9' }}>
            <iframe
              width="100%"
              height="100%"
              src="https://app.heygen.com/embeds/914a6ec20cde4360be552f7e490c1af6"
              title="HeyGen video player"
              frameBorder="0"
              allow="encrypted-media; fullscreen;"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>

        {/* What's included */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-black text-slate-900">Your Free Demo Includes:</h2>
          <div className="space-y-2">
            {INCLUDES.map(item => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Urgency/trust strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {URGENCY.map(({ icon: Icon, text }) => (
            <div key={text} className="bg-slate-900 rounded-xl p-4 flex gap-3 items-start">
              <Icon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-slate-300 text-sm leading-snug">{text}</p>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-3 justify-center">
          {['⭐ 5-Star Rated', '🔒 Secure & Private', '✅ No Contract', '📞 Personal Onboarding', '🏆 HVAC Specialist'].map(b => (
            <span key={b} className="bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">{b}</span>
          ))}
        </div>

        {/* FORM */}
        <div id="lead-form">
          <HVACLeadForm />
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 pb-4 space-y-1">
          <p>New Tech Advertising · Mason City, IA · newtech.ad</p>
          <p>Your information is 100% secure and will never be shared or sold.</p>
        </div>
      </div>
    </div>
  );
}
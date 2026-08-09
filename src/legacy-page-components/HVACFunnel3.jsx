import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Globe, Star, BarChart2, Bot, ArrowRight, CheckCircle } from 'lucide-react';
import HVACVideoBlock from '../components/hvac-funnel/HVACVideoBlock';
import HVACStickyBar from '../components/hvac-funnel/HVACStickyBar';

const SYSTEM = [
  { icon: Video, num: '01', title: 'AI Video Engine', desc: 'We create professional talking-head videos that explain your services, build trust, and answer customer questions — without you ever stepping in front of a camera.', color: 'bg-blue-600' },
  { icon: Globe, num: '02', title: 'Authority Website', desc: 'A fast, modern website with location pages, SEO content, and clear calls-to-action — built to rank on Google and convert visitors into calls.', color: 'bg-violet-600' },
  { icon: Star, num: '03', title: 'Review & Reputation System', desc: 'Automated follow-ups that turn happy customers into 5-star Google reviews — consistently, without you having to ask every time.', color: 'bg-amber-500' },
  { icon: BarChart2, num: '04', title: 'Monthly Content Engine', desc: 'We post fresh content to your Google Business Profile, Facebook, and LinkedIn every week — so you stay visible while you\'re on the job.', color: 'bg-emerald-600' },
  { icon: Bot, num: '05', title: 'AI Lead Capture', desc: 'Smart forms and follow-up sequences that capture leads 24/7 and keep them warm until they\'re ready to book.', color: 'bg-rose-600' },
];

const INCLUDES = [
  'AI avatar video (60-second brand video)',
  'Optimized Google Business Profile',
  'SEO landing pages for your city',
  'Weekly social media posts',
  'Reputation management system',
  'Monthly performance report',
  'Dedicated account manager',
  'No long-term contract required',
];

export default function HVACFunnel3() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Nav */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs">NTA</div>
          <span className="font-bold text-slate-800 text-sm">HVAC Growth System</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="flex gap-1">{[1,2,3,4,5].map(i => <div key={i} className={`w-6 h-1.5 rounded-full ${i <= 3 ? 'bg-blue-500' : 'bg-slate-200'}`} />)}</div>
          Step 3 of 5
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-10 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full">
            <CheckCircle className="w-3.5 h-3.5" /> The NTA HVAC Growth System
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
            One System That Handles <span className="text-blue-600">Your Entire Online Presence</span> — So You Can Focus on the Work
          </h1>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            We built a complete done-for-you marketing system specifically for HVAC companies that want more calls without doing the marketing themselves.
          </p>
        </div>

        {/* Video */}
        <div className="w-full max-w-3xl mx-auto my-8">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700" style={{ aspectRatio: '16/9' }}>
            <iframe
              width="100%"
              height="100%"
              src="https://app.heygen.com/embeds/9f1bd913f20647ba837d294586ccf394"
              title="HeyGen video player"
              frameBorder="0"
              allow="encrypted-media; fullscreen;"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>

        {/* System pillars */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-900 text-center">The 5-Part System</h2>
          {SYSTEM.map(({ icon: Icon, num, title, desc, color }) => (
            <div key={num} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0 ${color}`}>{num}</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-slate-500" />
                  <p className="font-bold text-slate-900">{title}</p>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* What's included */}
        <div className="bg-slate-900 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-black text-xl text-center">Everything Included</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {INCLUDES.map(item => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-3 pb-4">
          <Link to="/hvac-funnel/4"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-4 rounded-2xl text-lg shadow-xl shadow-blue-600/30 transition-all">
            See a Real Example → <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-slate-400 text-xs">Next: Before & After Demo</p>
        </div>
      </div>

      <HVACStickyBar href="/hvac-funnel/4" label="See the Demo →" />
    </div>
  );
}
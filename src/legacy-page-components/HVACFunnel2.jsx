import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Globe, Video, Search, ArrowRight, TrendingUp } from 'lucide-react';
import HVACVideoBlock from '../components/hvac-funnel/HVACVideoBlock';
import HVACStickyBar from '../components/hvac-funnel/HVACStickyBar';

const SHIFTS = [
  { icon: Globe, title: 'Search Is the New Yellow Pages', before: 'People called who they knew', after: 'They Google "HVAC near me" — right now, on their phone', color: 'text-blue-600 bg-blue-50' },
  { icon: Video, title: 'Video Builds Trust Instantly', before: 'Trust took months of referrals', after: 'One 60-second video online = credibility before they ever call', color: 'text-violet-600 bg-violet-50' },
  { icon: Search, title: 'AI Changed Local SEO', before: 'A basic website was enough', after: 'Google now rewards businesses with fresh content and video', color: 'text-emerald-600 bg-emerald-50' },
  { icon: Zap, title: 'Speed Wins the Lead', before: 'Call back within a day was fine', after: 'If your site doesn\'t answer instantly, they move to the next result', color: 'text-amber-600 bg-amber-50' },
];

export default function HVACFunnel2() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Nav */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs">NTA</div>
          <span className="font-bold text-slate-800 text-sm">HVAC Growth System</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="flex gap-1">{[1,2,3,4,5].map(i => <div key={i} className={`w-6 h-1.5 rounded-full ${i <= 2 ? 'bg-blue-500' : 'bg-slate-200'}`} />)}</div>
          Step 2 of 5
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-10 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">
            <TrendingUp className="w-3.5 h-3.5" /> The Market Has Shifted
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
            Everything About How Customers <span className="text-blue-600">Find and Choose</span> an HVAC Company Has Changed
          </h1>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            The businesses winning right now aren't bigger or better — they just figured out the new rules faster.
          </p>
        </div>

        {/* Video */}
        <div className="w-full max-w-3xl mx-auto my-8">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700" style={{ aspectRatio: '16/9' }}>
            <iframe
              width="100%"
              height="100%"
              src="https://app.heygen.com/embeds/e9a1b977f9fb41a8a9b890c299014f48"
              title="HeyGen video player"
              frameBorder="0"
              allow="encrypted-media; fullscreen;"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>

        {/* Before / After shifts */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-900 text-center">The Before & After</h2>
          {SHIFTS.map(({ icon: Icon, title, before, after, color }) => (
            <div key={title} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="font-bold text-slate-900 text-sm">{title}</p>
              </div>
              <div className="grid grid-cols-2 divide-x divide-slate-100">
                <div className="p-4">
                  <p className="text-xs font-black text-red-500 uppercase mb-1">❌ Before</p>
                  <p className="text-sm text-slate-500">{before}</p>
                </div>
                <div className="p-4 bg-emerald-50/60">
                  <p className="text-xs font-black text-emerald-600 uppercase mb-1">✅ Now</p>
                  <p className="text-sm text-slate-700 font-medium">{after}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="bg-blue-600 text-white rounded-2xl p-6 text-center space-y-2">
          <p className="text-xl font-black leading-snug">"The HVAC companies that adapted to digital in 2022–2024 are now <span className="text-yellow-300">2-3x busier</span> than those that didn't."</p>
          <p className="text-blue-200 text-sm">— Pattern seen across 100+ local service businesses</p>
        </div>

        {/* CTA */}
        <div className="text-center space-y-3 pb-4">
          <Link to="/hvac-funnel/3"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-4 rounded-2xl text-lg shadow-xl shadow-blue-600/30 transition-all">
            See The New Way → <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-slate-400 text-xs">Next: The System That Replaces Everything You've Been Doing</p>
        </div>
      </div>

      <HVACStickyBar href="/hvac-funnel/3" label="The New Way →" />
    </div>
  );
}
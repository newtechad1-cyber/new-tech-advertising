import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, TrendingDown, Phone, Clock, DollarSign, ArrowRight } from 'lucide-react';
import HVACVideoBlock from '../components/hvac-funnel/HVACVideoBlock';
import HVACStickyBar from '../components/hvac-funnel/HVACStickyBar';

const PROBLEMS = [
  { icon: Phone, title: 'Phones Not Ringing', desc: 'You rely on referrals and word of mouth. It works — until it doesn\'t. When the slow season hits, there\'s nothing to fall back on.' },
  { icon: TrendingDown, title: 'Losing Leads to Competitors', desc: 'Bigger HVAC companies with slick websites and Google ads are grabbing the same leads you used to get for free.' },
  { icon: Clock, title: 'No Time to Market Yourself', desc: 'You\'re running service calls all day. Marketing always goes to the bottom of the list — and the phone keeps getting quieter.' },
  { icon: DollarSign, title: 'Paying for Ads That Don\'t Work', desc: 'You\'ve tried Google Ads, HomeAdvisor, or Facebook — and burned cash on leads that went nowhere. It felt like a waste.' },
];

export default function HVACFunnel1() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Nav */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs">NTA</div>
          <span className="font-bold text-slate-800 text-sm">HVAC Growth System</span>
        </div>
        <div className="text-xs text-slate-500 hidden sm:block">Step 1 of 5</div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-10 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5" /> The Old Way Is Failing HVAC Businesses
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
            Why Most HVAC Companies Are <span className="text-red-600">Stuck, Slow, and Struggling</span> to Get Consistent Leads
          </h1>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            If you're still waiting on referrals and hoping the phone rings, you're playing a game that's already changed — and it's costing you real money.
          </p>
        </div>

        {/* Video */}
        <div className="w-full max-w-3xl mx-auto my-8">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700" style={{ aspectRatio: '16/9' }}>
            <iframe
              width="100%"
              height="100%"
              src="https://app.heygen.com/embeds/4e2d15359e5d4313a7e7c414d3290261"
              title="HeyGen video player"
              frameBorder="0"
              allow="encrypted-media; fullscreen;"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>

        {/* Problems */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-900 text-center">Sound Familiar?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROBLEMS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4.5 h-4.5 text-red-600" />
                  </div>
                  <p className="font-bold text-slate-900 text-sm">{title}</p>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stat callout */}
        <div className="bg-slate-900 rounded-2xl p-6 text-center text-white space-y-2">
          <p className="text-4xl font-black text-red-400">78%</p>
          <p className="text-lg font-bold">of local HVAC companies have no consistent digital marketing strategy</p>
          <p className="text-slate-400 text-sm">That means your competitors aren't doing it either — which makes this the perfect time to move first.</p>
        </div>

        {/* CTA */}
        <div className="text-center space-y-3 pb-4">
          <Link to="/hvac-funnel/2"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-4 rounded-2xl text-lg shadow-xl shadow-blue-600/30 transition-all">
            See What Changed → <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-slate-400 text-xs">Next: The Market Shift That Changed Everything</p>
        </div>
      </div>

      <HVACStickyBar href="/hvac-funnel/2" label="What Changed? →" />
    </div>
  );
}
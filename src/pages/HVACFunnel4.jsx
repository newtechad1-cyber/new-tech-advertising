import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, CheckCircle, X } from 'lucide-react';
import HVACVideoBlock from '../components/hvac-funnel/HVACVideoBlock';
import HVACStickyBar from '../components/hvac-funnel/HVACStickyBar';

const BEFORE = [
  'Homepage with no clear call-to-action',
  'No Google Business Profile optimization',
  'Zero video content',
  'No social media posting in 6+ months',
  'Getting 1–2 organic leads per week',
  'Avg. 3.2 stars on Google (4 reviews)',
];

const AFTER = [
  'Authority homepage with video and trust badges',
  'Top-3 Google Maps rank in service area',
  '4 AI videos live on website and social',
  'Weekly posts on Facebook, GBP, LinkedIn',
  'Getting 8–12 organic leads per week',
  'Avg. 4.8 stars (34 reviews in 90 days)',
];

const REVIEWS = [
  { name: 'Mike D.', company: 'Comfort Air HVAC', stars: 5, text: 'Within 60 days we went from 2 calls a week to about 10. The video they made for us has been shared on Facebook multiple times.' },
  { name: 'Sarah K.', company: 'K&J Heating & Cooling', stars: 5, text: 'I was skeptical but the results speak for themselves. We\'re now showing up on the first page of Google in our town.' },
  { name: 'Carlos R.', company: 'Precision HVAC', stars: 5, text: 'The AI video was way better than I expected. My customers actually comment on it. NTA knows what they\'re doing.' },
];

export default function HVACFunnel4() {
  const [activeTab, setActiveTab] = useState('before');

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Nav */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs">NTA</div>
          <span className="font-bold text-slate-800 text-sm">HVAC Growth System</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="flex gap-1">{[1,2,3,4,5].map(i => <div key={i} className={`w-6 h-1.5 rounded-full ${i <= 4 ? 'bg-blue-500' : 'bg-slate-200'}`} />)}</div>
          Step 4 of 5
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-10 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-xs font-bold px-3 py-1.5 rounded-full">
            🎯 Real Before & After Example
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
            See What This Looks Like for a <span className="text-blue-600">Real HVAC Company</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            Below is a composite example based on real results from HVAC clients we've worked with across the Midwest.
          </p>
        </div>

        {/* Demo video */}
        <HVACVideoBlock title="Mason City HVAC — Before & After Walkthrough" subtitle="See exactly how the system was implemented and what changed" />

        {/* Before / After toggle */}
        <div>
          <div className="flex bg-slate-200 rounded-xl p-1 mb-4 max-w-xs mx-auto">
            <button onClick={() => setActiveTab('before')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'before' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'}`}>❌ Before</button>
            <button onClick={() => setActiveTab('after')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'after' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>✅ After</button>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            {(activeTab === 'before' ? BEFORE : AFTER).map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {activeTab === 'before'
                  ? <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                  : <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
                <span className={`text-sm font-medium ${activeTab === 'after' ? 'text-slate-800' : 'text-slate-500'}`}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Results callout */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { num: '5x', label: 'More Leads', sub: 'in 90 days' },
            { num: '4.8★', label: 'Google Rating', sub: 'from 3.2' },
            { num: '8–12', label: 'Calls/Week', sub: 'vs. 1–2 before' },
          ].map(({ num, label, sub }) => (
            <div key={label} className="bg-blue-600 text-white rounded-2xl p-4 text-center">
              <p className="text-2xl font-black">{num}</p>
              <p className="text-xs font-bold mt-0.5">{label}</p>
              <p className="text-blue-200 text-xs">{sub}</p>
            </div>
          ))}
        </div>

        {/* Reviews */}
        <div className="space-y-3">
          <h2 className="text-xl font-black text-slate-900 text-center">What HVAC Owners Say</h2>
          {REVIEWS.map(({ name, company, stars, text }) => (
            <div key={name} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-1 mb-2">{Array(stars).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}</div>
              <p className="text-slate-700 text-sm leading-relaxed italic">"{text}"</p>
              <div className="mt-3">
                <p className="font-bold text-slate-900 text-sm">{name}</p>
                <p className="text-slate-500 text-xs">{company}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center space-y-3 pb-4">
          <Link to="/hvac-funnel/5"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-4 rounded-2xl text-lg shadow-xl shadow-blue-600/30 transition-all">
            Get This for My Business → <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-slate-400 text-xs">Next: See What It Costs & What's Included</p>
        </div>
      </div>

      <HVACStickyBar href="/hvac-funnel/5" label="See the Offer →" />
    </div>
  );
}
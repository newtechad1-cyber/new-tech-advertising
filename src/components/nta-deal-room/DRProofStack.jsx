import React, { useState } from 'react';
import { Globe, Tv, Video, TrendingUp, Star, ChevronRight } from 'lucide-react';

const PROOF_TABS = [
  { id: 'websites', label: 'Website Transformations', icon: Globe },
  { id: 'streaming', label: 'Streaming TV Examples', icon: Tv },
  { id: 'video', label: 'Video Campaigns', icon: Video },
  { id: 'rankings', label: 'Ranking Results', icon: TrendingUp },
];

function WebsiteProof() {
  const examples = [
    { before: { name: 'OldSite.com', issues: ['No mobile layout', 'No content', '2 pages', 'No reviews'] }, after: { name: 'AuthoritySite.com', wins: ['60+ pages', 'Monthly blog', '5-star badges', 'Video hero'] } },
    { before: { name: 'BasicBiz.net', issues: ['Broken images', 'No SEO tags', 'No CTA', '2009 design'] }, after: { name: 'LocalAuthority.com', wins: ['Schema markup', 'Lead forms', 'Fast load', 'CRO layout'] } },
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      {examples.map((ex, i) => (
        <div key={i} className="space-y-3">
          <div className="bg-red-950/30 border border-red-800/40 rounded-2xl p-4">
            <p className="text-red-400 text-xs font-bold mb-2">BEFORE</p>
            <div className="h-28 bg-slate-900/60 rounded-lg mb-3 flex items-center justify-center">
              <Globe className="w-8 h-8 text-slate-700" />
            </div>
            {ex.before.issues.map((iss, j) => (
              <div key={j} className="flex items-center gap-2 text-xs text-red-400 mb-1">
                <span className="text-red-600">✗</span>{iss}
              </div>
            ))}
          </div>
          <div className="bg-green-950/30 border border-green-800/40 rounded-2xl p-4">
            <p className="text-green-400 text-xs font-bold mb-2">AFTER NTA</p>
            <div className="h-28 bg-gradient-to-br from-blue-900/40 to-slate-900 rounded-lg mb-3 flex flex-col items-center justify-center gap-2">
              <Globe className="w-8 h-8 text-blue-400" />
              <div className="flex gap-0.5">{[...Array(5)].map((_, k) => <Star key={k} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}</div>
            </div>
            {ex.after.wins.map((w, j) => (
              <div key={j} className="flex items-center gap-2 text-xs text-green-400 mb-1">
                <span>✓</span>{w}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function StreamingProof() {
  const channels = ['Hulu', 'Peacock', 'YouTube TV', 'Sling', 'Pluto TV', 'Tubi', 'Paramount+', 'Disney+'];
  return (
    <div className="space-y-5">
      <div className="bg-slate-800/60 border border-slate-700/40 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Tv className="w-6 h-6 text-blue-400" />
          <div>
            <p className="text-white font-bold">Your 30-Second TV Commercial</p>
            <p className="text-slate-400 text-xs">Professional production. Broadcast quality. Runs across all major streaming platforms.</p>
          </div>
        </div>
        <div className="h-40 bg-gradient-to-br from-blue-950/60 to-slate-900 rounded-xl flex items-center justify-center border border-blue-800/30">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-blue-600/30 border-2 border-blue-500/60 flex items-center justify-center mx-auto mb-2">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-12 border-l-blue-400 ml-1" style={{borderLeftWidth:'14px'}} />
            </div>
            <p className="text-slate-400 text-xs">Sample Commercial Preview</p>
          </div>
        </div>
      </div>
      <div>
        <p className="text-slate-400 text-xs mb-3">Distributed Across These Platforms:</p>
        <div className="flex flex-wrap gap-2">
          {channels.map(ch => (
            <span key={ch} className="px-3 py-1.5 bg-slate-800 border border-slate-700/50 text-slate-300 text-xs font-semibold rounded-lg">{ch}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function RankingProof() {
  const results = [
    { biz: 'Austin HVAC Pro', kw: '"AC repair Austin"', from: 'Not ranking', to: '#1', time: '4 months' },
    { biz: 'Phoenix Plumbers', kw: '"plumber Phoenix"', from: '#34', to: '#2', time: '3 months' },
    { biz: 'Dallas Roofers', kw: '"roof replacement Dallas"', from: 'Not ranking', to: '#3', time: '6 months' },
  ];
  return (
    <div className="space-y-3">
      {results.map((r, i) => (
        <div key={i} className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-white text-sm font-bold">{r.biz}</p>
            <p className="text-slate-500 text-xs">{r.kw}</p>
          </div>
          <div className="text-center px-3">
            <p className="text-red-400 text-sm font-bold">{r.from}</p>
            <p className="text-slate-600 text-xs">before</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <div className="text-center px-3">
            <p className="text-green-400 text-xl font-black">{r.to}</p>
            <p className="text-slate-500 text-xs">after {r.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DRProofStack() {
  const [activeTab, setActiveTab] = useState('websites');

  return (
    <section className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-800/60">
      <div className="text-center mb-10">
        <h2 className="text-white text-3xl font-black mb-3">Proof It Works</h2>
        <p className="text-slate-400 text-base">Real results from businesses just like yours.</p>
      </div>

      <div className="flex border-b border-slate-700/60 mb-6">
        {PROOF_TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === t.id ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}>
              <Icon className="w-3.5 h-3.5" />{t.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'websites' && <WebsiteProof />}
      {activeTab === 'streaming' && <StreamingProof />}
      {activeTab === 'video' && (
        <div className="grid grid-cols-2 gap-4">
          {['Brand Authority Video', 'Service Showcase', 'Client Testimonial', 'Seasonal Promo'].map(v => (
            <div key={v} className="bg-slate-800/60 border border-slate-700/40 rounded-2xl h-36 flex items-center justify-center">
              <div className="text-center">
                <Video className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500 text-xs">{v}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'rankings' && <RankingProof />}
    </section>
  );
}
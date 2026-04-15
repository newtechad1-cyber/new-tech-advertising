import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const TRIAL_URL = 'https://app.newtechadvertising.com/start-trial';

const tabs = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    content: (
      <div className="bg-slate-900 rounded-xl p-5 min-h-[320px]">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[['Posts This Month', '24', 'blue'], ['Avg Engagement', '3.8%', 'green'], ['Videos Created', '6', 'purple']].map(([l,v,c]) => (
            <div key={l} className="bg-slate-800 rounded-lg p-3 border border-slate-700">
              <p className="text-slate-400 text-xs mb-1">{l}</p>
              <p className={`text-2xl font-bold text-${c}-400`}>{v}</p>
            </div>
          ))}
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-slate-300 text-xs font-semibold mb-3">Platform Performance</p>
          <div className="space-y-2">
            {[['Facebook', 72], ['Instagram', 58], ['LinkedIn', 44]].map(([p, w]) => (
              <div key={p} className="flex items-center gap-3">
                <span className="text-slate-400 text-xs w-20">{p}</span>
                <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${w}%` }} />
                </div>
                <span className="text-slate-400 text-xs">{w}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'content',
    label: 'Content Generator',
    content: (
      <div className="bg-slate-900 rounded-xl p-5 min-h-[320px]">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-3">
          <p className="text-slate-400 text-xs mb-2 font-semibold">Content Brief</p>
          <div className="bg-slate-700 rounded-md px-3 py-2 text-slate-300 text-sm mb-2">Spring promotion for HVAC tune-up special</div>
          <button className="text-xs bg-blue-600 text-white px-4 py-1.5 rounded-lg font-semibold hover:bg-blue-500 transition-colors">Generate Content ✨</button>
        </div>
        <div className="space-y-2">
          {['Facebook Caption', 'Instagram Caption', 'Google Business Post'].map(type => (
            <div key={type} className="bg-slate-800 border border-slate-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-blue-400 text-xs font-bold">{type}</p>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Ready</span>
              </div>
              <div className="space-y-1">
                <div className="h-2 bg-slate-600 rounded w-full" />
                <div className="h-2 bg-slate-600 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'scheduler',
    label: 'Scheduler',
    content: (
      <div className="bg-slate-900 rounded-xl p-5 min-h-[320px]">
        <div className="grid grid-cols-7 text-center text-xs text-slate-500 mb-2 px-1">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <span key={d}>{d}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({length:35}).map((_, i) => {
            const day = i - 2;
            const scheduled = [3,6,10,13,17,20,24,27].includes(day);
            return (
              <div key={i} className={`rounded-lg p-1.5 text-center ${day < 1 || day > 31 ? 'opacity-0' : scheduled ? 'bg-blue-600/20 border border-blue-500/50' : 'bg-slate-800 border border-slate-700'}`}>
                <p className={`text-xs font-medium ${scheduled ? 'text-blue-300' : 'text-slate-400'}`}>{day >= 1 && day <= 31 ? day : ''}</p>
                {scheduled && <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mx-auto mt-0.5" />}
              </div>
            );
          })}
        </div>
        <div className="mt-3 space-y-1.5">
          {['Today 10:00 AM — Facebook', 'Today 2:00 PM — Instagram', 'Tomorrow 9:00 AM — LinkedIn'].map(p => (
            <div key={p} className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0" />
              {p}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'analytics',
    label: 'Analytics',
    content: (
      <div className="bg-slate-900 rounded-xl p-5 min-h-[320px]">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[['Total Reach', '24,180', '+22%'], ['Engagement Rate', '4.1%', '+0.8%'], ['Link Clicks', '312', '+45'], ['New Followers', '87', '+23']].map(([l,v,s]) => (
            <div key={l} className="bg-slate-800 rounded-lg border border-slate-700 p-3">
              <p className="text-slate-400 text-xs mb-0.5">{l}</p>
              <p className="text-white font-bold text-xl">{v}</p>
              <p className="text-green-400 text-xs font-semibold">{s}</p>
            </div>
          ))}
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
          <p className="text-slate-400 text-xs mb-2">Weekly Engagement</p>
          <div className="flex items-end gap-1.5 h-16">
            {[40, 65, 52, 80, 58, 90, 72].map((h, i) => (
              <div key={i} className="flex-1 bg-blue-500 rounded-sm" style={{ height: `${h}%`, opacity: 0.7 + i * 0.04 }} />
            ))}
          </div>
          <div className="flex justify-between text-slate-500 text-xs mt-1">
            {['M','T','W','T','F','S','S'].map((d,i) => <span key={i}>{d}</span>)}
          </div>
        </div>
      </div>
    ),
  },
];

export default function PlatformScreenshots() {
  const [active, setActive] = useState('dashboard');
  const current = tabs.find(t => t.id === active);

  return (
    <section id="platform-preview" className="bg-white py-20 lg:py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            Platform Preview
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">
            See the Platform in Action
          </h2>
          <p className="text-slate-600">Explore the dashboard, content tools, scheduler, and analytics.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${active === t.id ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Preview */}
        <div className="relative bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl mb-8">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-700 bg-slate-900">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <div className="flex-1 mx-4 bg-slate-700 rounded-md h-5 max-w-xs" />
          </div>
          <div className="p-4">
            {current.content}
          </div>
        </div>

        <div className="text-center">
          <a
            href={TRIAL_URL}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 shadow-lg shadow-blue-600/20 hover:-translate-y-0.5"
          >
            Explore the Platform <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
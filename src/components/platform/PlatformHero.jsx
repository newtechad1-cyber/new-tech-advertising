import React from 'react';
import { ArrowRight, CheckCircle, Play, Zap } from 'lucide-react';

const TRIAL_URL = 'https://app.newtechadvertising.com/start-trial';
const DEMO_URL = '#platform-preview';

export default function PlatformHero() {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 lg:pt-28 lg:pb-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-8">
          <Zap className="w-3.5 h-3.5" />
          AI Marketing Platform for Small Businesses
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight mb-6 max-w-4xl mx-auto">
          AI Marketing Built for{' '}
          <span className="text-blue-400">Small Businesses</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg lg:text-xl text-slate-300 mb-4 max-w-2xl mx-auto leading-relaxed">
          Create content, schedule posts, produce videos, and manage campaigns from one platform.
        </p>
        <p className="text-base text-slate-400 mb-10 max-w-xl mx-auto">
          Run your marketing yourself — or let us run it for you.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <a
            href={DEMO_URL}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5"
          >
            <Play className="w-4 h-4 fill-current" /> Watch Platform Demo
          </a>
          <a
            href={STRATEGY_URL}
            className="inline-flex items-center gap-2 border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold px-6 py-4 rounded-xl text-base transition-all duration-200"
          >
            Get Growth Strategy <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Trust line */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-14">
          {['No contracts', 'Cancel anytime', 'Built for local businesses'].map(item => (
            <div key={item} className="flex items-center gap-1.5 text-slate-400 text-sm">
              <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
              {item}
            </div>
          ))}
        </div>

        {/* Dashboard preview frame */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-700 bg-slate-900/60">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <div className="flex-1 mx-4 bg-slate-700 rounded-md h-5 max-w-xs" />
            </div>

            {/* Mock dashboard */}
            <div className="grid grid-cols-4 gap-0 bg-slate-900 min-h-[340px]">
              {/* Sidebar */}
              <div className="col-span-1 bg-slate-800 border-r border-slate-700 p-4 space-y-2">
                {['Dashboard', 'Content', 'Schedule', 'Videos', 'Analytics', 'Campaigns'].map((item, i) => (
                  <div key={item} className={`text-xs font-medium px-3 py-2 rounded-lg ${i === 0 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
                    {item}
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="col-span-3 p-5">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Posts Scheduled', value: '24', color: 'text-blue-400' },
                    { label: 'Content Drafts', value: '8', color: 'text-purple-400' },
                    { label: 'Videos Created', value: '3', color: 'text-green-400' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-slate-800 border border-slate-700 rounded-lg p-3">
                      <p className="text-slate-400 text-xs mb-1">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 space-y-2">
                    <p className="text-slate-400 text-xs font-medium">Upcoming Posts</p>
                    {['Facebook — Today 10am', 'Instagram — Today 2pm', 'LinkedIn — Tomorrow'].map(p => (
                      <div key={p} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <p className="text-slate-300 text-xs">{p}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
                    <p className="text-slate-400 text-xs font-medium mb-2">Content Performance</p>
                    <div className="space-y-1.5">
                      {[70, 45, 85, 55].map((w, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="h-1.5 bg-blue-600/30 rounded-full flex-1">
                            <div className="h-1.5 bg-blue-400 rounded-full" style={{ width: `${w}%` }} />
                          </div>
                          <span className="text-slate-500 text-xs">{w}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <div className="absolute -bottom-4 -left-4 bg-white rounded-xl px-4 py-3 shadow-xl border border-slate-100 hidden sm:flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs">Post Published</p>
              <p className="text-slate-500 text-xs">Facebook • 2 min ago</p>
            </div>
          </div>

          <div className="absolute -top-4 -right-4 bg-white rounded-xl px-4 py-3 shadow-xl border border-slate-100 hidden sm:flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs">AI Content Ready</p>
              <p className="text-slate-500 text-xs">7 posts generated</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
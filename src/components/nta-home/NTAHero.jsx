import React from 'react';

export default function NTAHero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 overflow-hidden flex flex-col justify-center">
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '64px 64px' }} />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/8 blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-semibold mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            AI-Powered Local Authority Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-8">
            AI Marketing Platform That Builds{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Local Market Authority
            </span>{' '}
            Automatically
          </h1>

          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
            One unified system combining an authority website, AI content engine, streaming TV visibility, and automated publishing — built to dominate your local market and deliver measurable ROI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/book-call"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-black text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 transition-all shadow-2xl shadow-blue-600/40 hover:shadow-blue-500/50 hover:-translate-y-0.5">
              See Platform Demo →
            </a>
            <a href="#results"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-white transition-all">
              View Client Results
            </a>
          </div>

          {/* Social proof strip */}
          <div className="flex items-center justify-center gap-8 mt-12 flex-wrap">
            {[
              { val: '4.9★', label: 'Average Rating' },
              { val: '300+', label: 'Active Clients' },
              { val: '2.4M+', label: 'Content Published' },
              { val: '97%', label: 'Client Retention' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-black text-white">{s.val}</p>
                <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Platform preview */}
        <div className="relative max-w-5xl mx-auto">
          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 backdrop-blur overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900">
              <div className="flex gap-1.5">
                {['#ef4444','#f59e0b','#10b981'].map(c => <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />)}
              </div>
              <div className="flex-1 mx-4 h-6 rounded-lg bg-slate-800 flex items-center px-3">
                <span className="text-slate-500 text-xs">app.ntaauthority.com/dashboard</span>
              </div>
            </div>

            {/* Dashboard mock */}
            <div className="p-6 bg-slate-950 grid grid-cols-12 gap-4 min-h-72">
              {/* Sidebar */}
              <div className="col-span-2 space-y-2">
                {['Dashboard','Content','Publishing','SEO','Streaming','Reports'].map(item => (
                  <div key={item} className={`px-3 py-2 rounded-lg text-xs font-semibold ${item === 'Dashboard' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-600'}`}>
                    {item}
                  </div>
                ))}
              </div>

              {/* Main */}
              <div className="col-span-7 space-y-4">
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { l: 'Visibility Score', v: '94', c: '#10b981' },
                    { l: 'Content Published', v: '847', c: '#3b82f6' },
                    { l: 'Leads Generated', v: '126', c: '#f59e0b' },
                    { l: 'ROI This Month', v: '312%', c: '#8b5cf6' },
                  ].map((m, i) => (
                    <div key={i} className="bg-slate-900 rounded-xl p-3 border border-slate-800">
                      <p className="text-slate-600 text-xs mb-1">{m.l}</p>
                      <p className="font-black text-lg" style={{ color: m.c }}>{m.v}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                  <p className="text-slate-500 text-xs mb-3 font-semibold">PUBLISHING ACTIVITY — THIS WEEK</p>
                  <div className="flex items-end gap-1 h-20">
                    {[40,65,45,80,72,90,68].map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i === 5 ? '#3b82f6' : '#1e3a5f' }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right panel */}
              <div className="col-span-3 space-y-3">
                <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
                  <p className="text-xs font-bold text-green-400 mb-2">● AI Running — 3 tasks</p>
                  {['Writing blog post...','Scheduling social...','Updating GMB...'].map((t, i) => (
                    <div key={i} className="text-xs text-slate-600 py-1">{t}</div>
                  ))}
                </div>
                <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
                  <p className="text-xs font-bold text-slate-400 mb-2">UPCOMING CONTENT</p>
                  <div className="space-y-1.5">
                    {['Mon: Blog Article','Tue: Social (5)','Wed: Video Script'].map((t, i) => (
                      <div key={i} className="text-xs text-slate-600">{t}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <div className="absolute -left-6 top-1/3 bg-white rounded-2xl shadow-2xl p-4 hidden lg:block">
            <p className="text-2xl font-black text-slate-900">+312%</p>
            <p className="text-slate-500 text-xs">Organic Visibility</p>
          </div>
          <div className="absolute -right-6 bottom-1/4 bg-white rounded-2xl shadow-2xl p-4 hidden lg:block">
            <p className="text-2xl font-black text-slate-900">47 leads</p>
            <p className="text-slate-500 text-xs">Generated this month</p>
          </div>
        </div>
      </div>
    </section>
  );
}
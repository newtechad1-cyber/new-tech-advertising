import React from 'react';

export default function NTAConversionClose() {
  return (
    <section id="demo" className="py-28 bg-slate-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/10" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-300 text-sm font-semibold mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
          Limited spots available in your market
        </div>

        <h2 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
          Your Competitors Are Getting More{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Visible Every Day
          </span>
        </h2>

        <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
          Every week without an authority system is a week your competitors build more rankings, more reviews, and more streaming visibility in your market. The gap compounds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <a href="/nta/deal-room"
            className="w-full sm:w-auto px-10 py-5 rounded-2xl text-lg font-black text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 transition-all shadow-2xl shadow-blue-600/40 hover:shadow-blue-500/50 hover:-translate-y-1">
            Book My Platform Demo →
          </a>
        </div>

        <p className="text-slate-500 text-sm mb-16">
          30-minute demo · No obligation · See your specific market live
        </p>

        {/* Trust indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-slate-800">
          {[
            { val: '300+', label: 'Businesses Trust NTA' },
            { val: '97%', label: 'Client Retention Rate' },
            { val: '4.9★', label: 'Average Client Rating' },
            { val: '$0', label: 'Risk to Book a Demo' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-black text-white mb-1">{s.val}</p>
              <p className="text-slate-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
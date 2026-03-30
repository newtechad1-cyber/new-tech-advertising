import React, { useState } from 'react';
import { ArrowRight, Zap, CheckCircle } from 'lucide-react';
import { openSchedulingCalendar } from '@/components/config/bookingConfig';

export default function BCHero() {
  const [opened, setOpened] = useState(false);

  const handleClick = () => {
    openSchedulingCalendar();
    setOpened(true);
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
      
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/8 blur-[100px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-semibold mb-8">
          <Zap className="w-3.5 h-3.5" />
          30-minute strategy session • No obligation
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight mb-8">
          Book Your NTA{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Strategy Call
          </span>
        </h1>

        <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto mb-10">
          Let's talk about how AI websites, video, SEO, social media, and streaming TV can help your small or mid-sized business dominate your local market.
        </p>

        <a
          href="https://calendar.app.google/p6ieYanvwhixXxZ67"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpened(true)}
          className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl text-lg font-black text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 transition-all shadow-2xl shadow-blue-600/40 hover:shadow-blue-500/50 hover:-translate-y-1"
        >
          Choose Your Time <ArrowRight className="w-5 h-5" />
        </a>

        {opened && (
          <div className="mt-4 inline-flex items-center gap-2 bg-green-500/20 border border-green-400/40 text-green-300 px-5 py-3 rounded-xl text-sm font-semibold">
            <CheckCircle className="w-4 h-4" />
            Calendar opened in a new tab — pick your time!
          </div>
        )}

        <p className="text-slate-500 text-sm mt-6">
          Calendar opens instantly • Book on your schedule • Call confirmed in 2 hours
        </p>
      </div>
    </section>
  );
}
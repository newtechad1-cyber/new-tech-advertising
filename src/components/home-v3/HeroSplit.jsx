import React from 'react';
import { Phone } from 'lucide-react';

export default function HeroSplit() {
  const scrollToNext = () => {
    window.scrollTo({ top: window.innerHeight * 0.85, behavior: 'smooth' });
  };

  return (
    <section className="relative bg-slate-950 text-white pt-32 pb-24 px-6 overflow-hidden flex flex-col items-center justify-center text-center min-h-[85vh]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url('https://media.base44.com/images/public/691f41a18de4a7f498c8f884/8348a4046_backgroundheroimage.png')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-slate-950" />
      
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* Subtle glowing badge */}
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-8 shadow-[0_0_15px_rgba(16,185,129,0.15)] backdrop-blur-sm">
          🏆 Iowa & Southern Minnesota's First AI-Powered Marketing Agency
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight mb-6 tracking-tight">
          30 Years Ago, I Sold Television Ads on Blind Faith.<br/>
          <span className="text-emerald-500">I Build AI-Powered Websites & Campaigns with Absolute Proof.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
          I spent decades matching businesses to Nielsen ratings, wishing I could look a client in the eye and prove exactly how many dollars walked through their door. The technology has finally caught up to my vision. I build high-performance websites optimized for AI and voice search that don't just look pretty—they prove their ROI.
        </p>

        {/* Trust Text */}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 text-sm text-slate-500 mb-10 font-medium max-w-4xl mx-auto">
          <span className="flex items-center gap-1.5 whitespace-nowrap"><span className="text-emerald-500 font-bold">✓</span> First AI-built websites in the Mason City DMA</span>
          <span className="hidden md:inline text-slate-700">-</span>
          <span className="flex items-center gap-1.5 whitespace-nowrap"><span className="text-emerald-500 font-bold">✓</span> Serving Iowa & Southern Minnesota</span>
          <span className="hidden md:inline text-slate-700">-</span>
          <span className="flex items-center gap-1.5 whitespace-nowrap"><span className="text-emerald-500 font-bold">✓</span> Built by a local business owner, for local business owners</span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={scrollToNext}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-xl transition-all text-base shadow-[0_0_20px_rgba(16,185,129,0.25)]"
          >
            Stop Guessing. Let Me Prove It.
          </button>
          <a 
            href="tel:6414208816" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-500 bg-slate-900/50 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-xl transition-all text-base backdrop-blur-sm"
          >
            <Phone className="w-5 h-5" />
            Call 641-420-8816
          </a>
        </div>
      </div>
    </section>
  );
}
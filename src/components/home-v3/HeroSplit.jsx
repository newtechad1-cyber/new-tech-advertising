import React from 'react';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';

export default function HeroSplit() {
  return (
    <section className="relative bg-slate-950 text-white py-20 px-6 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url('https://media.base44.com/images/public/691f41a18de4a7f498c8f884/fb7ea9a91_backgroundimage.png')` }}
      />
      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT: Text */}
        <div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-5">
            Websites & Marketing That Actually Bring In Calls
          </h1>
          <p className="text-slate-300 text-lg mb-4 leading-relaxed">
            If your current marketing isn't consistently bringing in calls or customers, it's usually not just one thing.
          </p>
          <p className="text-slate-400 text-base mb-4 leading-relaxed">
            It's small gaps — how your site shows up, how it explains what you do, and how easy it is for someone to take the next step. That's where I help.
          </p>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            I don't come in and change everything. I look at what you're already doing, keep what's working, and fix what's not — using 40+ years of real marketing experience and newer tools that can often do the same work more efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="tel:+16414208816"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-4 rounded-xl transition-colors text-base"
            >
              Call or Text 641-420-8816
            </a>
            <Link
              to="/gap-audit"
              className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-bold px-6 py-4 rounded-xl transition-colors text-base"
            >
              Get a Free Website Review
            </Link>
            <Link
              to="/our-work"
              className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-white/30 text-slate-300 hover:text-white font-semibold px-6 py-4 rounded-xl transition-colors text-base"
            >
              See My Work
            </Link>
          </div>
        </div>

        {/* RIGHT: Video */}
        <div className="w-full rounded-2xl overflow-hidden aspect-video shadow-2xl">
          <iframe
            src="https://app.heygen.com/embeds/d6013cc5a88542999dedaafc9ed72800"
            title="NTA — Local Lead Systems"
            allow="autoplay; fullscreen"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

      </div>
    </section>
  );
}
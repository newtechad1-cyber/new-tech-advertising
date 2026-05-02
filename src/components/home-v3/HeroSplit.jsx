import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Play } from 'lucide-react';

export default function HeroSplit() {
  return (
    <section className="bg-slate-950 text-white py-20 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT: Text */}
        <div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-5">
            Local Websites & Marketing That Actually Bring In Calls
          </h1>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            Websites, SEO pages, and campaigns built for real local businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="tel:+16414208816"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-4 rounded-xl transition-colors text-base"
            >
              <Phone className="w-4 h-4" /> Call or Text: 641-420-8816
            </a>
            <Link
              to="/our-work"
              className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-bold px-6 py-4 rounded-xl transition-colors text-base"
            >
              View My Work
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
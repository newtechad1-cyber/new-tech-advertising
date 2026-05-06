import React from 'react';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';

export default function HeroSplit() {
  return (
    <section className="relative bg-slate-950 text-white py-20 px-6 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url('https://media.base44.com/images/public/691f41a18de4a7f498c8f884/8348a4046_backgroundheroimage.png')` }}
      />
      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT: Text */}
        <div>
          <p className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-3">NTA AI Growth System</p>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-5">
            AI-Powered Marketing Systems For Local Businesses
          </h1>
          <p className="text-slate-300 text-lg mb-4 leading-relaxed">
            Helping service businesses and local brands generate more leads, customers, and repeat business through better visibility, content, advertising, and follow-up.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/gap-audit"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-4 rounded-xl transition-colors text-base"
            >
              Get My AI Gap Audit
            </Link>
            <Link
              to="/our-work"
              className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-bold px-6 py-4 rounded-xl transition-colors text-base"
            >
              See Our Work
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
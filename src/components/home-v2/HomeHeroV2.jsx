import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';

export default function HomeHeroV2() {
  return (
    <section className="bg-slate-950 text-white pt-20 pb-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Hero text */}
        <div className="max-w-3xl mb-10">
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-5 text-white">
            Local Lead Systems for North Iowa Businesses
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
            We help local businesses get found and turn interest into real calls, customers, and jobs.
          </p>

          {/* Strong CTA block */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <Link
              to="/gap-audit"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-4 rounded-xl text-base transition-colors"
            >
              Get My Free Gap Audit <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+16414208816"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold px-7 py-4 rounded-xl text-base transition-colors"
            >
              <Phone className="w-4 h-4" /> Call or Text: 641-420-8816
            </a>
          </div>
        </div>

        {/* HeyGen Video Embed */}
        <div className="w-full rounded-2xl overflow-hidden aspect-video">
          <iframe
            src="https://app.heygen.com/embeds/d6013cc5a88542999dedaafc9ed72800"
            title="Local Lead Systems for North Iowa Businesses"
            allow="autoplay; fullscreen"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

      </div>
    </section>
  );
}
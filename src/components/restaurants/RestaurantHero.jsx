import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, ArrowRight, Phone } from 'lucide-react';

export default function RestaurantHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-[#020617] to-[#020617] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-24 text-center flex flex-col items-center">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium mb-8">
          <Utensils className="w-4 h-4" />
          Built for Restaurants, Bars & Cafes
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-8 tracking-tight text-white max-w-4xl">
          What Could Your Restaurant Do If Your{' '}
          <span className="text-blue-400">Whole Team Helped You Build It?</span>
        </h1>

        <div className="max-w-3xl space-y-5 text-slate-300/90 text-lg md:text-xl leading-relaxed mb-10">
          <p>Your restaurant already knows more than you may realize.</p>
          <p>
            Your servers hear what customers ask for. Bartenders know what people order and why they come back. Kitchen
            employees see what slows things down. Managers solve problems every day. Customers tell you what they love—and
            what frustrates them.
          </p>
          <p>Most of that knowledge disappears into conversations, texts, meetings and people's heads.</p>
          <p>
            NTA helps you capture it, organize it and turn what your restaurant is learning into a practical{' '}
            <span className="text-white font-semibold">Restaurant Growth Roadmap&trade;</span>.
          </p>
        </div>

        <div className="text-blue-300 font-semibold text-lg mb-10">
          People provide the knowledge. People make the decisions.
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            to="/start"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-4 rounded-xl transition-all text-base shadow-[0_0_24px_rgba(59,130,246,0.3)]"
          >
            Start a Free Growth Conversation <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="tel:6414208816"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-500 bg-slate-900/50 hover:bg-slate-800 text-slate-200 font-semibold px-8 py-4 rounded-xl transition-all text-base"
          >
            <Phone className="w-4 h-4 text-blue-400" />
            641-420-8816
          </a>
        </div>
      </div>
    </section>
  );
}
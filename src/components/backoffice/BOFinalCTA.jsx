import React from 'react';
import { Phone } from 'lucide-react';

export default function BOFinalCTA() {
  return (
    <section className="py-24 px-6 bg-slate-950 relative overflow-hidden">
      {/* Subtle green radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight tracking-tight">
          Stop Paying for Software<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">That Doesn't Fit</span>
        </h2>
        
        <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          See what a custom back-office system looks like for your business. No pressure, no contracts — just a live demo and an honest conversation.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
          <a 
            href="https://johnson-backoffice-f202e3a3.viktor.space" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
          >
            See the Live Demo →
          </a>
          <a 
            href="tel:6414208816" 
            className="w-full sm:w-auto border border-slate-700 hover:border-slate-500 bg-slate-900/50 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
          >
            <Phone className="w-5 h-5 text-slate-400" /> Call 641-420-8816
          </a>
        </div>

        {/* Small footer text */}
        <div className="text-sm text-slate-500 font-medium pt-8 border-t border-slate-800/50">
          © 2026 New Tech Advertising · Mason City, Iowa · 641-420-8816 · info@newtechadvertising.com
        </div>
      </div>
    </section>
  );
}
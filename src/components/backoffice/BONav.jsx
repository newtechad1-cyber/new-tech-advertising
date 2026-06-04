import React from 'react';
import { Link } from 'react-router-dom';

export default function BONav() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-[#0B1120] border-b border-slate-800 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
        <span className="text-white font-bold text-lg tracking-tight">New Tech Advertising</span>
      </div>
      <div className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link to="/" className="text-slate-400 hover:text-white transition-colors">← Back to Main Site</Link>
        <a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a>
        <a href="#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</a>
        <a href="https://johnson-backoffice-f202e3a3.viktor.space" target="_blank" rel="noopener noreferrer" className="bg-[#10B981] hover:bg-emerald-400 text-white px-5 py-2.5 rounded-lg transition-colors font-bold shadow-lg shadow-emerald-900/20">
          See Live Demo
        </a>
      </div>
      {/* Mobile Demo CTA */}
      <div className="md:hidden">
        <a href="https://johnson-backoffice-f202e3a3.viktor.space" target="_blank" rel="noopener noreferrer" className="bg-[#10B981] text-white px-4 py-2 rounded-lg text-sm font-bold">
          Demo
        </a>
      </div>
    </nav>
  );
}
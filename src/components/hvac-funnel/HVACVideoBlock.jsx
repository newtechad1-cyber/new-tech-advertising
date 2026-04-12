import React from 'react';
import { Play } from 'lucide-react';

export default function HVACVideoBlock({ title, subtitle }) {
  return (
    <div className="w-full max-w-3xl mx-auto my-8">
      <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700" style={{ aspectRatio: '16/9' }}>
        {/* Placeholder avatar video area */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center gap-4">
          <div className="w-20 h-20 rounded-full bg-blue-600/20 border-2 border-blue-500 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center text-2xl">🎙️</div>
          </div>
          <div className="text-center px-6">
            <p className="text-white font-bold text-lg">{title || 'Video Message from Rick'}</p>
            {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-full transition-all shadow-lg shadow-blue-600/30">
            <Play className="w-5 h-5 fill-white" /> Watch Now
          </button>
        </div>
        {/* Corner badge */}
        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black px-2 py-1 rounded-md">● LIVE</div>
      </div>
    </div>
  );
}
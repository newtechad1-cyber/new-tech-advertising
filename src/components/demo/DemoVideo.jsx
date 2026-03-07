import React, { useState } from 'react';
import { Play, Monitor } from 'lucide-react';

// Placeholder thumbnail — swap src for real embed URL when video is ready
const DEMO_VIDEO_EMBED = null; // e.g. "https://www.youtube.com/embed/XXXX"
const THUMBNAIL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691f41a18de4a7f498c8f884/c74887154_generated_image.png";

export default function DemoVideo({ videoRef }) {
  const [playing, setPlaying] = useState(false);

  return (
    <section ref={videoRef} className="bg-slate-950 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Video container */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl shadow-violet-900/20 bg-slate-900 aspect-video">
          {DEMO_VIDEO_EMBED && playing ? (
            <iframe
              src={`${DEMO_VIDEO_EMBED}?autoplay=1`}
              className="w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
              title="NTA Platform Demo"
            />
          ) : (
            <>
              <img src={THUMBNAIL} alt="NTA Platform Demo" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950/60" />
              {/* Browser chrome overlay */}
              <div className="absolute top-0 left-0 right-0 flex items-center gap-2 px-4 py-3 bg-slate-800/90 backdrop-blur-sm border-b border-slate-700">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/70" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <span className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 bg-slate-700 rounded px-3 py-1 text-slate-400 text-xs text-center max-w-xs mx-auto">
                  app.newtechadvertising.com/dashboard
                </div>
              </div>
              {/* Play button */}
              <button
                onClick={() => DEMO_VIDEO_EMBED ? setPlaying(true) : null}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 group"
              >
                <div className="w-20 h-20 bg-violet-600 hover:bg-violet-500 rounded-full flex items-center justify-center shadow-2xl shadow-violet-600/50 transition-all group-hover:scale-110">
                  <Play className="w-8 h-8 fill-white text-white ml-1" />
                </div>
                <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-xl px-5 py-2.5 text-center">
                  <p className="text-white font-bold text-sm">2-Minute Platform Overview</p>
                  <p className="text-slate-400 text-xs mt-0.5">Coming soon — full video walkthrough</p>
                </div>
              </button>
            </>
          )}
        </div>

        {/* Support text */}
        <div className="mt-6 flex items-start gap-3 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <Monitor className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
          <p className="text-slate-300 text-sm leading-relaxed">
            This quick walkthrough shows how small businesses use the system to generate marketing ideas, create content, produce videos, and launch campaigns — all from one connected platform.
          </p>
        </div>
      </div>
    </section>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import NTAGuideAvatar from './NTAGuideAvatar';
import NTAGuidePanel from './NTAGuidePanel';

// mode: 'homepage' | 'funnel' | 'client'
export default function NTASiteGuide({ mode = 'homepage' }) {
  const [state, setState] = useState('hidden'); // 'hidden' | 'bubble' | 'open'
  const [dismissed, setDismissed] = useState(false);
  const timerRef = useRef(null);

  const greetings = {
    homepage: "Hi — I'm the NTA Growth Guide. Want a quick tour of how this platform builds local market authority?",
    funnel:   "Need help understanding the strategy session? I can walk you through what to expect.",
    client:   "Welcome back. I can help you find approvals, check channel connections, or view your latest report.",
  };

  useEffect(() => {
    if (dismissed) return;
    const delay = mode === 'homepage' ? 3500 : mode === 'funnel' ? 8000 : 5000;
    timerRef.current = setTimeout(() => setState('bubble'), delay);
    return () => clearTimeout(timerRef.current);
  }, [mode, dismissed]);

  const handleDismissBubble = () => {
    setState('hidden');
    setDismissed(true);
  };

  const handleOpen  = () => setState('open');
  const handleClose = () => setState('bubble');

  if (dismissed && state === 'hidden') return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">

      {/* Guided panel */}
      {state === 'open' && (
        <div className="pointer-events-auto" style={{ transformOrigin: 'bottom right' }}>
          <div className="transition-all duration-200 ease-out"
            style={{ opacity: 1, transform: 'scale(1) translateY(0)' }}>
            <NTAGuidePanel mode={mode} onClose={handleClose} />
          </div>
        </div>
      )}

      {/* Greeting bubble */}
      {state === 'bubble' && (
        <div className="pointer-events-auto max-w-xs">
          <div className="relative bg-white border border-slate-200 shadow-xl rounded-2xl rounded-br-sm px-4 py-3.5"
            style={{ animation: 'slideUpFade 0.3s ease-out' }}>
            <button onClick={handleDismissBubble}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors">
              <X className="w-3 h-3 text-slate-600" />
            </button>
            <p className="text-slate-700 text-sm leading-relaxed mb-3 pr-2">{greetings[mode]}</p>
            <div className="flex gap-2">
              <button onClick={handleOpen}
                className="flex-1 py-2 rounded-xl text-xs font-black text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20">
                Show Me
              </button>
              <button onClick={handleDismissBubble}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors">
                I'm Just Browsing
              </button>
            </div>
          </div>
          {/* Bubble tail */}
          <div className="ml-auto mr-3 w-0 h-0" style={{ borderLeft: '6px solid transparent', borderRight: '0', borderTop: '6px solid white', filter: 'drop-shadow(0 1px 0 #e2e8f0)' }} />
        </div>
      )}

      {/* Floating avatar button */}
      <div className="pointer-events-auto">
        {state === 'open' ? (
          <button onClick={handleClose}
            className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center text-white shadow-xl hover:bg-slate-700 transition-colors ml-auto">
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="relative">
            {state === 'hidden' && !dismissed && (
              <button onClick={() => setState('bubble')}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center z-10 animate-bounce">
                <MessageCircle className="w-2.5 h-2.5 text-white" />
              </button>
            )}
            <NTAGuideAvatar
              size={48}
              pulse={state === 'bubble'}
              onClick={state === 'bubble' ? handleOpen : () => setState('bubble')}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
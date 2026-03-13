import React from 'react';
import { AlertCircle, RefreshCw, ExternalLink, CheckCircle2 } from 'lucide-react';

const STEPS = [
  'Open TikTok on your mobile device',
  'Go to Profile → Settings → Manage Account',
  'Switch to Business Account if not already done',
  'Return here and click "Retry Connection"',
];

export default function CHTikTokFallback({ onRetry, onSkip }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-white font-black text-base">TikTok Connection Help</h3>
            <p className="text-slate-500 text-xs">Follow these steps to resolve the issue</p>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-xl">
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 text-xs font-black text-white mt-0.5">{i + 1}</div>
              <p className="text-slate-300 text-sm">{step}</p>
            </div>
          ))}
        </div>

        <div className="p-3 bg-blue-950/20 border border-blue-800/30 rounded-xl mb-5">
          <p className="text-blue-400 text-xs font-bold mb-1">Why TikTok Sometimes Fails</p>
          <p className="text-slate-400 text-xs leading-relaxed">TikTok requires a Business Account with Creator Tools enabled. Personal accounts cannot authorize third-party publishing access.</p>
        </div>

        <div className="flex gap-3">
          <button onClick={onSkip} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:bg-slate-800 transition-colors">
            Skip for Now
          </button>
          <button onClick={onRetry} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-[#69c9d0]/20 border border-[#69c9d0]/40 hover:bg-[#69c9d0]/30 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Retry Connection
          </button>
        </div>
      </div>
    </div>
  );
}
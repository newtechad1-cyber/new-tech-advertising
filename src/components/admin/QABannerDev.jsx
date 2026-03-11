import React from 'react';
import { AlertCircle, Zap } from 'lucide-react';

export default function QABannerDev() {
  // Dev-only banner — only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="bg-amber-900/20 border-b border-amber-700/50 px-4 py-2 flex items-center gap-3 text-sm">
      <Zap className="w-4 h-4 text-amber-600" />
      <span className="text-amber-700 font-medium">Navigation QA Mode Active</span>
      <a
        href="/adminqa/navigation"
        className="ml-auto text-amber-600 hover:text-amber-500 underline text-xs font-mono"
      >
        Launch QA Dashboard →
      </a>
    </div>
  );
}
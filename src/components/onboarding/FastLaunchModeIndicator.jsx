import React from 'react';
import { Zap } from 'lucide-react';

export default function FastLaunchModeIndicator({ client, isHighPriority }) {
  if (!isHighPriority) return null;

  return (
    <div className="flex items-center gap-1 bg-amber-900/40 border border-amber-700 rounded-full px-2 py-1">
      <Zap className="w-3 h-3 text-amber-400" />
      <span className="text-xs font-bold text-amber-400">Fast Track</span>
    </div>
  );
}
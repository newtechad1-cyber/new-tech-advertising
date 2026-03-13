import React, { useState } from 'react';
import { AlertCircle, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { detectInactivity } from './ntaRetentionEngine';

export default function DIYInactivityNudge({ metrics, onAction }) {
  const [dismissed, setDismissed] = useState(false);

  if (!metrics || dismissed) return null;

  const inactivity = detectInactivity(metrics);

  if (inactivity.level === 'active') return null;

  const levelStyles = {
    warning: 'bg-amber-500/10 border-amber-500/30',
    alert: 'bg-orange-500/10 border-orange-500/30',
    critical: 'bg-red-500/10 border-red-500/30',
  };

  const levelColors = {
    warning: 'text-amber-300',
    alert: 'text-orange-300',
    critical: 'text-red-300',
  };

  return (
    <div className={`rounded-lg border p-4 mb-6 ${levelStyles[inactivity.level]}`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${levelColors[inactivity.level]}`} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold mb-2">{inactivity.message}</p>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                onAction?.();
                setDismissed(true);
              }}
              size="sm"
              className="bg-white text-slate-900 hover:bg-slate-100 font-semibold"
            >
              {inactivity.actionText}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button
              onClick={() => setDismissed(true)}
              size="sm"
              variant="ghost"
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
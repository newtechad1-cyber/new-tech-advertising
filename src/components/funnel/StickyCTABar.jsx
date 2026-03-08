import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { X } from 'lucide-react';

export default function StickyCTABar({ message, serviceSlug }) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400 && !dismissed) setVisible(true);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dismissed]);

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 text-white border-t border-slate-700 shadow-2xl">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <p className="text-sm font-medium hidden sm:block flex-1">
          {message || 'See How Your Business Could Advertise on Streaming TV.'}
        </p>
        <div className="flex items-center gap-2 flex-1 sm:flex-none justify-center sm:justify-end">
          <Button
            size="sm"
            variant="outline"
            className="border-slate-600 text-white hover:bg-slate-800 text-xs"
            onClick={() => window.location.href = createPageUrl('Demo')}
          >
            Watch Demo
          </Button>
          <Button
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold"
            onClick={() => window.location.href = createPageUrl('Start')}
          >
            Start Free Trial
          </Button>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
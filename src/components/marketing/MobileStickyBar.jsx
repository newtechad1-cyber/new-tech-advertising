import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

// Shows only on mobile, after scrolling past hero, disappears near footer
export default function MobileStickyBar({ onCTAClick, ctaLabel = "Start My 7-Day Free Trial" }) {
  const [visible, setVisible] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const viewportH = window.innerHeight;
      // Show after scrolling 400px, hide when near footer (last 15%)
      const nearFooter = scrollY + viewportH > docHeight * 0.85;
      setVisible(scrollY > 400 && !nearFooter);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden">
      <div className="bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] px-4 py-3 flex items-center gap-3">
        <div className="flex-1">
          <Button
            onClick={onCTAClick}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3"
          >
            {ctaLabel}
          </Button>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-slate-500 leading-tight">No credit</p>
          <p className="text-xs text-slate-500 leading-tight">card</p>
        </div>
      </div>
    </div>
  );
}
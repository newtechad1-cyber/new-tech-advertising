import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, Calendar, ChevronRight } from 'lucide-react';

export default function StickySalesCTA({ currentStep, onTrack }) {
  const handleClick = (eventName) => {
    onTrack && onTrack(eventName);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur border-t border-slate-800 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
      <p className="text-slate-400 text-xs hidden sm:block">
        <span className="text-white font-medium">New Tech Advertising</span> · Built for small businesses
      </p>
      <div className="flex items-center gap-2 flex-1 sm:flex-none justify-center sm:justify-end flex-wrap">
        <Link
          to={createPageUrl('Book-Call')}
          onClick={() => handleClick('cta_book_call')}
          className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1 px-3 py-2 border border-slate-700 rounded-lg hover:border-slate-600"
        >
          <Calendar className="w-3.5 h-3.5" /> Book Call
        </Link>
        <Link
          to={createPageUrl('DealRoomPricing')}
          onClick={() => handleClick('deal_room_pricing')}
          className="text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1 px-3 py-2 border border-slate-700 rounded-lg hover:border-violet-600"
        >
          View Pricing <ChevronRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          to={createPageUrl('StartTrial')}
          onClick={() => handleClick('cta_start_trial')}
          className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-violet-600/20"
        >
          Start Free Trial <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
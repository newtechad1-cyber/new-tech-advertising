import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function OCPActionBar({ priorityActions }) {
  if (!priorityActions.length) return null;

  const top = priorityActions[0];
  const URGENCY_COLORS = {
    critical: { bg: 'bg-red-600',   text: 'text-white',     badge: 'bg-red-700' },
    high:     { bg: 'bg-amber-500', text: 'text-white',     badge: 'bg-amber-600' },
    medium:   { bg: 'bg-blue-600',  text: 'text-white',     badge: 'bg-blue-700' },
  };
  const clr = URGENCY_COLORS[top.urgency] || URGENCY_COLORS.medium;

  return (
    <div className={`rounded-2xl px-5 py-4 flex items-center gap-4 ${clr.bg}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-xs font-black px-2 py-0.5 rounded-full ${clr.badge} ${clr.text} uppercase tracking-wide`}>
            Priority Action
          </span>
          {priorityActions.length > 1 && (
            <span className="text-xs font-bold opacity-70 text-white">+{priorityActions.length - 1} more</span>
          )}
        </div>
        <p className={`font-black text-sm ${clr.text}`}>{top.label}</p>
        {top.description && <p className={`text-xs mt-0.5 opacity-80 ${clr.text}`}>{top.description}</p>}
      </div>
      {top.linkTo && (
        <Link to={top.linkTo}
          className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-black text-xs transition-colors">
          Take Action <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}
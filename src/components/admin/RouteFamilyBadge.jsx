/**
 * RouteFamilyBadge
 *
 * A small floating badge that identifies which route family is currently
 * rendered. Helps catch cross-family routing bugs during development.
 *
 * Renders as a subtle fixed pill in the bottom-right corner.
 * It is intentionally unobtrusive — low opacity until hovered.
 */
import React from 'react';
import { FAMILY_DISPLAY } from '@/lib/routeMap';

export default function RouteFamilyBadge({ family }) {
  const def = FAMILY_DISPLAY[family];
  if (!def) return null;

  return (
    <div
      title={`Route family: ${family}`}
      className={`
        fixed bottom-3 right-3 z-[9999]
        flex items-center gap-1.5 px-2.5 py-1
        rounded-full text-[9px] font-extrabold uppercase tracking-widest
        text-white opacity-40 hover:opacity-90 transition-opacity
        pointer-events-none select-none shadow-lg
        ${def.bg}
      `}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${def.dot}`} />
      {def.label}
    </div>
  );
}
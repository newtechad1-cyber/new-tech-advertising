import React from 'react';
import { useTutorial, HELP_TOOLTIPS } from './TutorialContext';

/**
 * Wrap any section with this to make it:
 * 1. A tutorial highlight target (glows when active step matches)
 * 2. A help-mode tooltip anchor
 *
 * Usage: <TutorialHighlight id="daily-command-panel">...</TutorialHighlight>
 */
export default function TutorialHighlight({ id, children, className = '' }) {
  const { active, currentStep, helpMode } = useTutorial();

  const isHighlighted = active && currentStep?.highlight === id;
  const tooltipText = HELP_TOOLTIPS[id];

  return (
    <div
      data-tutorial={id}
      className={`relative transition-all duration-300 ${
        isHighlighted
          ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-950 rounded-2xl z-10'
          : ''
      } ${className}`}
    >
      {children}
      {helpMode && tooltipText && (
        <div className="absolute -top-9 left-0 z-30 bg-blue-900 border border-blue-700 text-blue-100 text-xs rounded-lg px-3 py-1.5 shadow-lg whitespace-nowrap pointer-events-none">
          <span className="text-blue-400 mr-1">?</span>{tooltipText}
          <div className="absolute top-full left-4 w-2 h-2 bg-blue-900 border-r border-b border-blue-700 rotate-45 -translate-y-1" />
        </div>
      )}
    </div>
  );
}
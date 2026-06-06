import React from 'react';
import { Link } from 'react-router-dom';

export function TrackProgress({ trackName, currentStep, totalSteps, color = "emerald" }) {
  const progress = Math.round((currentStep / totalSteps) * 100);
  const colorClass = color === 'emerald' ? 'bg-emerald-500' : color === 'blue' ? 'bg-blue-500' : 'bg-purple-500';
  const textColorClass = color === 'emerald' ? 'text-emerald-400' : color === 'blue' ? 'text-blue-400' : 'text-purple-400';
  const bgColorClass = color === 'emerald' ? 'bg-emerald-500/20' : color === 'blue' ? 'bg-blue-500/20' : 'bg-purple-500/20';

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center text-sm font-bold mb-3">
        <span className={textColorClass}>{trackName}</span>
        <span className="text-slate-400">Step {currentStep} of {totalSteps}</span>
      </div>
      <div className={`h-1.5 w-full rounded-full ${bgColorClass} overflow-hidden`}>
        <div className={`h-full ${colorClass} transition-all duration-500`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export function TrackBottomNav({ prevLink, prevText, nextLink, nextText, color = "emerald" }) {
  const btnColorClass = color === 'emerald' 
    ? 'bg-emerald-600 hover:bg-emerald-500' 
    : color === 'blue' 
      ? 'bg-blue-600 hover:bg-blue-500' 
      : 'bg-purple-600 hover:bg-purple-500';

  const isExternal = nextLink && nextLink.startsWith('http');
      
  return (
    <div className="mt-16 mb-8 pt-8 border-t border-slate-800">
      {prevLink && (
        <div className="mb-4">
          <Link to={prevLink} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
            {prevText || "← Previous"}
          </Link>
        </div>
      )}
      {nextLink && (
        isExternal ? (
          <a href={nextLink} target="_blank" rel="noopener noreferrer" className={`block w-full text-center py-4 rounded-xl text-white font-bold text-lg transition-colors shadow-lg ${btnColorClass}`}>
            {nextText}
          </a>
        ) : (
          <Link to={nextLink} className={`block w-full text-center py-4 rounded-xl text-white font-bold text-lg transition-colors shadow-lg ${btnColorClass}`}>
            {nextText}
          </Link>
        )
      )}
    </div>
  );
}
import React from 'react';

export default function BottomActionBar({ onContinue, onSkip }) {
  return (
    <div className="mt-12 pt-6 border-t border-slate-200 flex items-center justify-between">
      <button
        onClick={onSkip}
        className="text-slate-600 hover:text-slate-900 font-medium text-sm"
      >
        Skip for now
      </button>
      
      <button
        onClick={onContinue}
        className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
      >
        Continue Setup
      </button>
    </div>
  );
}
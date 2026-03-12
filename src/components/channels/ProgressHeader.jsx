import React from 'react';

export default function ProgressHeader({ step = 3, totalSteps = 4 }) {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="mb-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Connect Your Marketing Channels</h1>
      <p className="text-slate-600 mb-6">We'll publish content and grow visibility through these accounts.</p>
      
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-700">Step {step} of {totalSteps} — Channel Setup</span>
        <div className="flex-1 max-w-xs bg-slate-200 rounded-full h-2">
          <div 
            className="bg-slate-900 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
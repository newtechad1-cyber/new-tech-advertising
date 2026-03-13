import React from 'react';
import { Check } from 'lucide-react';

const STEPS = [
  { label: 'Qualify' },
  { label: 'Market Insights' },
  { label: 'Book Session' },
  { label: 'Confirmed' },
];

export default function FunnelProgress({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((step, i) => {
        const stepNum = i + 1;
        const done = currentStep > stepNum;
        const active = currentStep === stepNum;
        return (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all ${
                done    ? 'bg-blue-600 border-blue-600 text-white' :
                active  ? 'bg-white border-blue-600 text-blue-600' :
                          'bg-white border-slate-200 text-slate-400'
              }`}>
                {done ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              <span className={`text-xs font-semibold mt-1.5 whitespace-nowrap ${
                active ? 'text-slate-900' : done ? 'text-blue-600' : 'text-slate-400'
              }`}>{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-16 sm:w-24 mb-5 transition-colors ${done || active ? 'bg-blue-200' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
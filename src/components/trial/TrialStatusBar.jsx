import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';

const STEPS = [
  { key: 'submitted', label: 'Submitted' },
  { key: 'in_review', label: 'In Review' },
  { key: 'configured', label: 'Configured' },
  { key: 'ready', label: 'Ready' },
];

const ORDER = ['submitted', 'in_review', 'configured', 'ready', 'active'];

export default function TrialStatusBar({ status }) {
  const currentIndex = ORDER.indexOf(status);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
      <p className="text-sm font-semibold text-blue-900 mb-4 text-center">Your Trial Account Status</p>
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 right-0 top-4 h-0.5 bg-slate-200 z-0" />
        {STEPS.map((step, i) => {
          const stepIndex = ORDER.indexOf(step.key);
          const done = currentIndex > stepIndex;
          const active = currentIndex === stepIndex;
          return (
            <div key={step.key} className="flex flex-col items-center z-10 gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                done ? 'bg-green-500 border-green-500' :
                active ? 'bg-blue-600 border-blue-600' :
                'bg-white border-slate-300'
              }`}>
                {done ? <CheckCircle className="w-5 h-5 text-white" /> :
                 active ? <Clock className="w-4 h-4 text-white" /> :
                 <Circle className="w-4 h-4 text-slate-300" />}
              </div>
              <span className={`text-xs font-medium text-center ${
                done ? 'text-green-600' : active ? 'text-blue-700 font-bold' : 'text-slate-400'
              }`}>{step.label}</span>
            </div>
          );
        })}
      </div>
      {status === 'submitted' && (
        <p className="text-xs text-center text-blue-600 mt-4">
          ✓ We received your info. Your account will be ready within 1 business day.
        </p>
      )}
      {status === 'in_review' && (
        <p className="text-xs text-center text-blue-600 mt-4">
          Our team is reviewing your submission and building your Brand DNA profile.
        </p>
      )}
      {status === 'configured' && (
        <p className="text-xs text-center text-green-600 mt-4">
          Your dashboard is configured. Final review underway.
        </p>
      )}
      {(status === 'ready' || status === 'active') && (
        <p className="text-xs text-center text-green-600 mt-4 font-semibold">
          🎉 Your account is ready. Log in to get started.
        </p>
      )}
    </div>
  );
}
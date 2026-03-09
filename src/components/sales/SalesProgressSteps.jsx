import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CheckCircle, Circle } from 'lucide-react';

const STEPS = [
  { key: 'DemoOverview', label: 'Overview', step: 1 },
  { key: 'DemoPlatform', label: 'Platform', step: 2 },
  { key: 'DemoExamples', label: 'Examples', step: 3 },
  { key: 'DemoPricing', label: 'Pricing', step: 4 },
  { key: 'DemoStart', label: 'Get Started', step: 5 },
];

export default function SalesProgressSteps({ currentStep }) {
  const currentIndex = STEPS.findIndex(s => s.key === currentStep);

  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <React.Fragment key={step.key}>
            <Link to={createPageUrl(step.key)} className="flex flex-col items-center group">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                done ? 'bg-violet-600 border-violet-600' :
                active ? 'bg-violet-600/20 border-violet-500' :
                'bg-slate-900 border-slate-700 group-hover:border-slate-500'
              }`}>
                {done
                  ? <CheckCircle className="w-4 h-4 text-white" />
                  : <span className={`text-xs font-bold ${active ? 'text-violet-300' : 'text-slate-500'}`}>{step.step}</span>
                }
              </div>
              <span className={`text-xs mt-1 font-medium ${active ? 'text-violet-300' : done ? 'text-slate-400' : 'text-slate-600'}`}>
                {step.label}
              </span>
            </Link>
            {i < STEPS.length - 1 && (
              <div className={`w-8 sm:w-12 h-0.5 mx-1 mb-4 ${i < currentIndex ? 'bg-violet-600' : 'bg-slate-700'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
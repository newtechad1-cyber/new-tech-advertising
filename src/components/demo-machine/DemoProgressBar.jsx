import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Check } from 'lucide-react';

const STEPS = [
  { label: 'Problem', page: 'DemoProblem' },
  { label: 'Platform', page: 'DemoPlatform' },
  { label: 'Features', page: 'DemoFeatures' },
  { label: 'Examples', page: 'DemoExamples' },
  { label: 'Pricing', page: 'DemoPricing' },
  { label: 'ROI', page: 'DemoRoi' },
  { label: 'Next Steps', page: 'DemoNext' },
];

export default function DemoProgressBar({ currentPage }) {
  const currentIdx = STEPS.findIndex(s => s.page === currentPage);

  return (
    <div className="bg-slate-950 border-b border-slate-800 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-1">
        {STEPS.map((step, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx;
          return (
            <Link key={step.page} to={createPageUrl(step.page)} className="flex items-center gap-1 group">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors
                ${done ? 'bg-green-500 text-white' : active ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'}`}>
                {done ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              <span className={`text-xs hidden sm:block transition-colors ${active ? 'text-white font-semibold' : done ? 'text-green-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                {step.label}
              </span>
              {i < STEPS.length - 1 && <div className={`w-4 md:w-8 h-px mx-1 ${i < currentIdx ? 'bg-green-500' : 'bg-slate-700'}`} />}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
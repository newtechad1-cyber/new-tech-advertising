import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, ArrowLeft, BookOpen, HelpCircle } from 'lucide-react';
import { useTutorial, STEPS } from './TutorialContext';

const WORKFLOW_LABELS = [
  'Dashboard', 'Leads', 'Pipeline', 'Campaigns', 'Campaign Actions',
  'Review Content', 'Schedule', 'Social Queue', 'Complete'
];

export default function TutorialOverlay() {
  const { active, stepIndex, currentStep, totalSteps, next, back, skip } = useTutorial();
  const navigate = useNavigate();

  // Navigate to the correct route when step changes
  useEffect(() => {
    if (!active || !currentStep) return;
    navigate(currentStep.route);
    // Scroll highlight target into view after navigation settles
    const t = setTimeout(() => {
      const el = document.querySelector(`[data-tutorial="${currentStep.highlight}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 400);
    return () => clearTimeout(t);
  }, [active, stepIndex]);

  if (!active || !currentStep) return null;

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;
  const progress = Math.round(((stepIndex + 1) / totalSteps) * 100);

  return (
    <>
      {/* Dim overlay */}
      <div className="fixed inset-0 bg-black/40 z-40 pointer-events-none" />

      {/* Step panel — bottom-center */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
        <div className="bg-slate-900 border border-blue-700/60 rounded-2xl shadow-2xl overflow-hidden">
          {/* Progress bar */}
          <div className="h-1 bg-slate-800">
            <div
              className="h-1 bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-5">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                  {stepIndex + 1}
                </div>
                <p className="text-sm font-bold text-blue-300">{currentStep.title}</p>
              </div>
              <button onClick={skip} className="text-slate-600 hover:text-white p-1 flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step text */}
            <p className="text-sm text-slate-300 leading-relaxed mb-4">{currentStep.text}</p>

            {/* Step progress dots */}
            <div className="flex items-center gap-1.5 mb-4 flex-wrap">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i < stepIndex ? 'bg-blue-500 w-3' :
                    i === stepIndex ? 'bg-blue-400 w-5' :
                    'bg-slate-700 w-1.5'
                  }`}
                />
              ))}
            </div>

            {/* Workflow label */}
            <p className="text-xs text-slate-600 mb-4 font-mono">
              Step {stepIndex + 1} of {totalSteps} — {WORKFLOW_LABELS[stepIndex] || ''}
            </p>

            {/* Action buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {!isFirst && (
                  <button onClick={back} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                )}
                <button onClick={skip} className="text-xs text-slate-600 hover:text-slate-400 px-2 py-2 transition-colors">
                  Skip Tutorial
                </button>
              </div>
              <button
                onClick={next}
                className="flex items-center gap-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors"
              >
                {isLast ? 'Finish' : 'Next'}
                {!isLast && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Help Mode tooltip bubble — rendered next to data-tutorial elements
export function HelpTooltip({ id, text }) {
  const { helpMode } = useTutorial();
  if (!helpMode) return null;
  return (
    <div className="absolute -top-8 left-0 z-30 bg-blue-900 border border-blue-700 text-blue-100 text-xs rounded-lg px-3 py-1.5 shadow-lg whitespace-nowrap max-w-xs pointer-events-none">
      <span className="text-blue-400 mr-1">?</span>{text}
      <div className="absolute top-full left-4 w-2 h-2 bg-blue-900 border-r border-b border-blue-700 rotate-45 -translate-y-1" />
    </div>
  );
}
import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function DemoFlowStep({ step, title, subtitle, children, onNext, onBack, showNext = true, showBack = true, nextLabel = 'Next', backLabel = 'Back' }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        {/* Step counter */}
        <div className="mb-8 flex items-center gap-2">
          <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Step {step}
          </span>
          <span className="text-slate-400 text-sm">of 7</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold mb-4 leading-tight">{title}</h1>
        {subtitle && <p className="text-xl text-slate-300 mb-12">{subtitle}</p>}

        {/* Content */}
        <div className="mb-16">
          {children}
        </div>

        {/* Navigation */}
        <div className="flex gap-4 pt-8 border-t border-slate-700">
          {showBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-6 py-3 text-white border border-slate-600 hover:border-slate-400 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {backLabel}
            </button>
          )}
          {showNext && (
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ml-auto font-semibold"
            >
              {nextLabel}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
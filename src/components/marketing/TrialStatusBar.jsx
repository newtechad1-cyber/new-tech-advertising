import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';

const STEPS = [
  { key: 'submitted', label: 'Submitted' },
  { key: 'in_review', label: 'In Review' },
  { key: 'configuring', label: 'Configuring' },
  { key: 'ready', label: 'Ready' },
];

// Map actual DB status values to step keys
const STATUS_TO_STEP = {
  draft: 'submitted',
  submitted: 'submitted',
  in_review: 'in_review',
  configured: 'configuring',
  ready: 'ready',
  active: 'ready',
};

const MESSAGES = {
  submitted: 'Trial Status: Building Your Account — ready within 1 business day.',
  in_review: 'Trial Status: Building Your Account — ready within 1 business day.',
  configured: 'Almost ready — connecting platforms and loading your first content drafts.',
  ready: 'Your portal is ready — log in to review your first content.',
  active: 'Your portal is ready — log in to review your first content.',
  draft: 'Trial Status: Building Your Account — ready within 1 business day.',
};

const STEP_ORDER = ['submitted', 'in_review', 'configuring', 'ready'];

export default function TrialStatusBar({ status }) {
  const mappedStep = STATUS_TO_STEP[status] || 'submitted';
  const currentIndex = STEP_ORDER.indexOf(mappedStep);
  const message = MESSAGES[status] || MESSAGES.submitted;
  const isReady = status === 'ready' || status === 'active';

  return (
    <div className={`rounded-2xl border p-5 ${isReady ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
      <p className={`text-xs font-bold uppercase tracking-widest text-center mb-4 ${isReady ? 'text-green-700' : 'text-blue-700'}`}>
        Account Status
      </p>

      {/* Step track */}
      <div className="flex items-center justify-between relative mb-4">
        {/* Track line */}
        <div className="absolute left-4 right-4 top-4 h-0.5 bg-slate-200 z-0" />
        {/* Filled line */}
        <motion.div
          className={`absolute left-4 top-4 h-0.5 z-0 ${isReady ? 'bg-green-400' : 'bg-blue-500'}`}
          initial={{ width: 0 }}
          animate={{ width: currentIndex === 0 ? '0%' : `${(currentIndex / (STEP_ORDER.length - 1)) * 92}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {STEPS.map((step, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <div key={step.key} className="flex flex-col items-center z-10 gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                done ? 'bg-green-500 border-green-500' :
                active ? `${isReady ? 'bg-green-500 border-green-500' : 'bg-blue-600 border-blue-600'}` :
                'bg-white border-slate-300'
              }`}>
                {done ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : active && !isReady ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 className="w-4 h-4 text-white" />
                  </motion.div>
                ) : active && isReady ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-300" />
                )}
              </div>

              {/* Pulse ring on active */}
              {active && !isReady && (
                <span className="absolute w-8 h-8 rounded-full border-2 border-blue-400 animate-ping opacity-30" style={{ marginTop: 0 }} />
              )}

              <span className={`text-xs font-medium text-center ${
                done ? 'text-green-600' :
                active ? (isReady ? 'text-green-700 font-bold' : 'text-blue-700 font-bold') :
                'text-slate-400'
              }`}>{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Status message */}
      <p className={`text-xs text-center font-medium ${isReady ? 'text-green-700' : 'text-blue-600'}`}>
        {isReady && '🎉 '}{message}
      </p>
    </div>
  );
}
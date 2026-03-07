import React from 'react';
import { Check, Clock, Zap } from 'lucide-react';

const STEPS = [
  { key: 'trial_started', label: 'Trial Started', icon: Check },
  { key: 'profile_created', label: 'Business Profile Created', icon: Check },
  { key: 'intelligence_generated', label: 'Marketing Intelligence Generated', icon: Check },
  { key: 'plan_ready', label: 'Weekly Plan Ready', icon: Check },
];

export default function DashboardSetupStatus({ trial, businessProfile, intelProfile, weeklyPlan, readinessState }) {
  const getStepStatus = (step) => {
    if (step === 'trial_started') return true;
    if (step === 'profile_created') return !!businessProfile;
    if (step === 'intelligence_generated') return !!intelProfile;
    if (step === 'plan_ready') return !!weeklyPlan;
    return false;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-6">Setup Progress</h3>
      
      <div className="space-y-3">
        {STEPS.map((step, idx) => {
          const isComplete = getStepStatus(step.key);
          const isActive = !isComplete && (
            (step.key === 'profile_created' && getStepStatus('trial_started')) ||
            (step.key === 'intelligence_generated' && getStepStatus('profile_created')) ||
            (step.key === 'plan_ready' && getStepStatus('intelligence_generated'))
          );

          return (
            <div key={step.key} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                isComplete
                  ? 'bg-emerald-600 border border-emerald-500'
                  : isActive
                  ? 'bg-violet-600 border border-violet-500 animate-pulse'
                  : 'bg-slate-700 border border-slate-600'
              }`}>
                {isComplete && <Check className="w-3.5 h-3.5 text-white" />}
                {isActive && <Clock className="w-3.5 h-3.5 text-white animate-spin" />}
              </div>
              <span className={`text-sm font-medium ${
                isComplete ? 'text-emerald-400' : isActive ? 'text-violet-300' : 'text-slate-500'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
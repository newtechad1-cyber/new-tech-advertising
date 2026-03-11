import React from 'react';
import { CheckCircle2, Circle, Lock, Zap } from 'lucide-react';

export default function OnboardingProgressExperience({ onboarding }) {
  const stages = [
    {
      step: 1,
      title: 'Account Setup',
      description: 'Your platform account is ready',
      completed: true,
      active: false,
      icon: CheckCircle2,
    },
    {
      step: 2,
      title: 'Brand Your Platform',
      description: 'Add logo, colors, and custom domain',
      completed: onboarding?.branding_complete,
      active: !onboarding?.branding_complete,
      icon: onboarding?.branding_complete ? CheckCircle2 : Circle,
    },
    {
      step: 3,
      title: 'Connect Domain',
      description: 'Set up custom domain or subdomain',
      completed: onboarding?.domain_connected,
      active: onboarding?.branding_complete && !onboarding?.domain_connected,
      icon: onboarding?.domain_connected ? CheckCircle2 : Circle,
    },
    {
      step: 4,
      title: 'Build Your Team',
      description: 'Invite team members to collaborate',
      completed: onboarding?.users_invited,
      active: onboarding?.domain_connected && !onboarding?.users_invited,
      icon: onboarding?.users_invited ? CheckCircle2 : Circle,
    },
    {
      step: 5,
      title: 'Add Your First Client',
      description: 'Create and activate your first client',
      completed: onboarding?.first_client_created,
      active: onboarding?.users_invited && !onboarding?.first_client_created,
      icon: onboarding?.first_client_created ? CheckCircle2 : Circle,
    },
    {
      step: 6,
      title: 'Configure Publishing',
      description: 'Set up publishing destinations',
      completed: onboarding?.first_publish_configured,
      active: onboarding?.first_client_created && !onboarding?.first_publish_configured,
      icon: onboarding?.first_publish_configured ? CheckCircle2 : Circle,
    },
    {
      step: 7,
      title: 'Activate Reports',
      description: 'Enable performance reporting',
      completed: onboarding?.training_complete,
      active: onboarding?.first_publish_configured && !onboarding?.training_complete,
      icon: onboarding?.training_complete ? CheckCircle2 : Circle,
    },
  ];

  const completedCount = stages.filter(s => s.completed).length;
  const progressPercentage = (completedCount / stages.length) * 100;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Partner Setup Progress
          </h3>
          <span className="text-sm font-bold text-emerald-400">{completedCount}/{stages.length}</span>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-amber-600 to-amber-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <div
              key={idx}
              className={`relative flex items-start gap-4 p-4 rounded-lg border transition-all ${
                stage.completed
                  ? 'bg-emerald-900/10 border-emerald-700'
                  : stage.active
                  ? 'bg-blue-900/20 border-blue-700'
                  : 'bg-slate-800/50 border-slate-700 opacity-60'
              }`}
            >
              <Icon
                className={`w-6 h-6 flex-shrink-0 mt-0.5 ${
                  stage.completed
                    ? 'text-emerald-400'
                    : stage.active
                    ? 'text-blue-400'
                    : 'text-slate-500'
                }`}
              />

              <div className="flex-1">
                <p className={`font-semibold ${stage.completed ? 'text-white line-through opacity-70' : stage.active ? 'text-white' : 'text-slate-400'}`}>
                  {stage.title}
                </p>
                <p className={`text-sm ${stage.active ? 'text-slate-300' : 'text-slate-500'}`}>
                  {stage.description}
                </p>
              </div>

              {stage.active && (
                <div className="flex-shrink-0">
                  <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded animate-pulse">
                    Next
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {completedCount === stages.length && (
        <div className="mt-6 p-4 bg-emerald-900/30 border border-emerald-700 rounded-lg">
          <p className="text-sm font-semibold text-emerald-200">🎉 Platform Ready</p>
          <p className="text-xs text-emerald-100 mt-1">All setup steps complete. Begin serving your clients.</p>
        </div>
      )}
    </div>
  );
}
import React from 'react';
import { CheckCircle, Clock, Zap } from 'lucide-react';

const stateMessages = {
  provisioning_queued: {
    headline: "Welcome! Your Setup Is Starting",
    subheading: "We've received your details and are building your marketing system.",
    icon: Clock,
  },
  profile_ready: {
    headline: "Welcome! Your Profile Is Ready",
    subheading: "Your business profile is complete. We're generating your marketing direction.",
    icon: CheckCircle,
  },
  intelligence_ready: {
    headline: "Welcome! Your Marketing Profile Is Ready",
    subheading: "We've identified your best opportunities. Your weekly plan is being prepared.",
    icon: CheckCircle,
  },
  plan_ready: {
    headline: "Your Marketing System Is Ready",
    subheading: "Your first weekly marketing plan is ready. Let's start building.",
    icon: Zap,
  },
};

export default function DashboardWelcome({ trial, businessProfile, readinessState }) {
  const state = stateMessages[readinessState] || stateMessages.provisioning_queued;
  const Icon = state.icon;

  return (
    <div className="bg-gradient-to-br from-violet-600/10 to-cyan-600/10 border border-violet-500/20 rounded-2xl p-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-violet-600/20 border border-violet-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-violet-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-2">
            {businessProfile?.business_name ? `${state.headline.split('Welcome')[1]}` : state.headline}
            {businessProfile?.business_name && (
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                {businessProfile.business_name}
              </span>
            )}
          </h2>
          <p className="text-slate-300 text-base leading-relaxed max-w-2xl">
            {state.subheading}
          </p>
        </div>
      </div>
    </div>
  );
}
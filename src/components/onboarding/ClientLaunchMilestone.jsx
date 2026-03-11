import React from 'react';
import { CheckCircle, Zap } from 'lucide-react';

export default function ClientLaunchMilestone({ client }) {
  const isReadyToLaunch = client.onboarding_stage === 'content_approved' || client.onboarding_stage === 'fully_live';
  const isLive = client.onboarding_status === 'live' || client.onboarding_stage === 'fully_live';

  if (isLive) {
    return (
      <div className="bg-emerald-900/40 border border-emerald-700 rounded-lg p-3 flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <div>
          <p className="text-xs font-bold text-emerald-400">Client Going Live</p>
          <p className="text-xs text-emerald-300 mt-0.5">
            {client.onboarding_completed_date 
              ? new Date(client.onboarding_completed_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : 'Active'
            }
          </p>
        </div>
      </div>
    );
  }

  if (isReadyToLaunch) {
    return (
      <div className="bg-violet-900/40 border border-violet-700 rounded-lg p-3 flex items-center gap-3">
        <Zap className="w-5 h-5 text-violet-400 flex-shrink-0 animate-pulse" />
        <div>
          <p className="text-xs font-bold text-violet-400">Ready to Launch</p>
          <p className="text-xs text-violet-300">All systems ready</p>
        </div>
      </div>
    );
  }

  return null;
}
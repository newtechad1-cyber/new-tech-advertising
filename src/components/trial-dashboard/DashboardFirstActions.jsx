import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CheckSquare, ArrowRight, Play, FileText, Video } from 'lucide-react';

const actionsByState = {
  provisioning_queued: [
    { label: "Watch the Demo", description: "See the platform in action", icon: Play, link: "Demo" },
    { label: "Review How It Works", description: "Understand the system", icon: FileText, link: "Demo" },
    { label: "Confirm Your Details", description: "Check your business profile", icon: CheckSquare, link: null },
  ],
  profile_ready: [
    { label: 'Review Your Business Profile', description: 'Check your information', icon: CheckSquare, link: null },
    { label: 'Watch the Demo', description: 'Learn the platform', icon: Play, link: 'Demo' },
  ],
  intelligence_ready: [
    { label: 'Review Your Opportunities', description: 'See what we found', icon: CheckSquare, link: null },
    { label: 'View Your Plan', description: 'See your week ahead', icon: FileText, link: 'GrowthSystem' },
  ],
  plan_ready: [
    { label: 'Review Your Weekly Plan', description: 'See this week's tasks', icon: CheckSquare, link: 'GrowthSystem' },
    { label: 'Generate Your First Content', description: 'Start creating', icon: FileText, link: 'AiSocialMedia' },
    { label: 'Create Your First Video', description: 'Use the video studio', icon: Video, link: 'AiVideos' },
  ],
};

export default function DashboardFirstActions({ readinessState, businessProfile, weeklyPlan }) {
  const actions = actionsByState[readinessState] || actionsByState.provisioning_queued;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
        <CheckSquare className="w-5 h-5 text-emerald-400" />
        Get Started
      </h3>

      <div className="grid sm:grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          const content = (
            <div className="flex items-start gap-4 h-full">
              <div className="w-10 h-10 bg-violet-600/20 border border-violet-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-violet-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">{action.label}</p>
                <p className="text-slate-500 text-xs mt-1">{action.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0 mt-1" />
            </div>
          );

          return (
            <div key={action.label}>
              {action.link ? (
                <Link
                  to={createPageUrl(action.link)}
                  className="block bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-slate-600 rounded-lg p-4 transition-all"
                >
                  {content}
                </Link>
              ) : (
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  {content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
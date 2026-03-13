import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle } from 'lucide-react';

const MILESTONE_STEPS = [
  {
    id: 'onboarding',
    title: 'Onboarding Complete',
    description: 'Account set up and ready',
    icon: '✅',
    action: null
  },
  {
    id: 'first_content',
    title: 'First Content Created',
    description: 'Social post, video, or blog published',
    icon: '📝',
    actions: ['social_post', 'video_script']
  },
  {
    id: 'first_campaign',
    title: 'First Campaign Launched',
    description: 'Content automation running',
    icon: '🚀',
    actions: ['campaign']
  },
  {
    id: 'first_activity',
    title: 'First Activity Logged',
    description: 'Lead, click, or engagement tracked',
    icon: '📊',
    actions: ['log_lead']
  }
];

export default function FirstWeekMomentumTracker({ completedActions = [], isNewUser = true }) {
  // Calculate progress
  const getMilestoneStatus = (milestone) => {
    if (milestone.id === 'onboarding') {
      return !isNewUser ? 'completed' : 'pending';
    }

    if (!milestone.actions) return 'pending';

    const isCompleted = milestone.actions.some((action) =>
      completedActions.includes(action)
    );

    return isCompleted ? 'completed' : 'pending';
  };

  const completedMilestones = MILESTONE_STEPS.filter(
    (m) => getMilestoneStatus(m) === 'completed'
  ).length;

  const progressPercent = Math.round((completedMilestones / MILESTONE_STEPS.length) * 100);

  return (
    <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">First-Week Momentum</CardTitle>
          <Badge className="bg-green-600 text-white">
            {completedMilestones}/{MILESTONE_STEPS.length}
          </Badge>
        </div>
        <p className="text-sm text-slate-600 mt-2">
          Track your progress toward marketing activation
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">Progress</span>
            <span className="text-sm font-bold text-green-700">{progressPercent}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Milestone Steps */}
        <div className="space-y-3 mt-4">
          {MILESTONE_STEPS.map((milestone, idx) => {
            const status = getMilestoneStatus(milestone);
            const isCompleted = status === 'completed';

            return (
              <div key={milestone.id} className="flex gap-4">
                {/* Timeline Line + Icon */}
                <div className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full font-lg ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                  {idx < MILESTONE_STEPS.length - 1 && (
                    <div
                      className={`w-0.5 h-8 my-1 ${
                        isCompleted ? 'bg-green-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1.5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{milestone.icon}</span>
                    <h4
                      className={`font-semibold text-sm ${
                        isCompleted ? 'text-slate-900' : 'text-slate-700'
                      }`}
                    >
                      {milestone.title}
                    </h4>
                    {isCompleted && (
                      <Badge className="bg-green-100 text-green-900 text-xs font-medium">
                        ✓
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {milestone.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Momentum Message */}
        <div className="mt-4 p-3 bg-white border border-green-200 rounded-lg text-sm">
          {completedMilestones === 0 && (
            <p className="text-slate-700">
              🚀 <strong>Ready to start?</strong> Pick any action below to unlock your first win.
            </p>
          )}
          {completedMilestones === 1 && (
            <p className="text-slate-700">
              💪 <strong>Great start!</strong> You've taken the first step. Keep the momentum going.
            </p>
          )}
          {completedMilestones === 2 && (
            <p className="text-slate-700">
              🔥 <strong>You're on fire!</strong> Two milestones down. Almost there!
            </p>
          )}
          {completedMilestones === 3 && (
            <p className="text-slate-700">
              ⚡ <strong>One step away!</strong> Complete your last milestone for full activation.
            </p>
          )}
          {completedMilestones === 4 && (
            <p className="text-green-800 font-semibold">
              🎉 <strong>Marketing activated!</strong> You've completed first-week onboarding. Now scale!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
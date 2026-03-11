import React from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';

export default function MilestoneMessage({ report, previousReport }) {
  const milestones = [];

  // Check for milestones
  if ((report.content_published_count || 0) >= 5 && (previousReport?.content_published_count || 0) < 5) {
    milestones.push({
      icon: Sparkles,
      message: 'Your brand visibility cadence is now fully active.',
      type: 'activation',
    });
  }

  if ((report.campaigns_active || 0) >= 3 && (previousReport?.campaigns_active || 0) < 3) {
    milestones.push({
      icon: Sparkles,
      message: 'Multi-channel marketing strategy is now live.',
      type: 'expansion',
    });
  }

  if ((report.scheduled_content_count || 0) >= 10) {
    milestones.push({
      icon: CheckCircle,
      message: 'Content pipeline is primed for sustained visibility.',
      type: 'pipeline',
    });
  }

  if ((report.approval_activity_count || 0) >= 10) {
    milestones.push({
      icon: Sparkles,
      message: 'Your marketing team is executing with strong momentum.',
      type: 'engagement',
    });
  }

  // High momentum milestone
  const momentumScore = Math.round(
    Math.min((report.content_published_count || 0) * 10, 25) +
    Math.min((report.scheduled_content_count || 0) * 5, 25) +
    Math.min((report.campaigns_active || 0) * 15, 25) +
    Math.min((report.approval_activity_count || 0) * 3, 25)
  );

  if (momentumScore >= 80 && (!previousReport || previousReport.momentum_score < 80)) {
    milestones.push({
      icon: Sparkles,
      message: 'Your marketing momentum has reached peak performance.',
      type: 'peak',
    });
  }

  if (milestones.length === 0) return null;

  return (
    <div className="space-y-3">
      {milestones.map((milestone, idx) => {
        const Icon = milestone.icon;
        return (
          <div key={idx} className="bg-emerald-900/40 border border-emerald-700 rounded-lg p-4 flex items-start gap-3">
            <Icon className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5 animate-pulse" />
            <p className="text-sm font-semibold text-emerald-200">{milestone.message}</p>
          </div>
        );
      })}
    </div>
  );
}
import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function ClientProgressScore({ client }) {
  // Calculate progress based on onboarding stage
  const stageOrder = ['deal_closed', 'welcome_sent', 'brand_assets', 'platform_setup', 'publishing_connected', 'first_content', 'content_approved', 'fully_live'];
  const currentStageIdx = stageOrder.indexOf(client.onboarding_stage || 'deal_closed');
  const baseProgress = ((currentStageIdx + 1) / stageOrder.length) * 100;

  // Bonus points for completed checklist items
  const checklistItems = [
    'logo_uploaded', 'brand_colors_set', 'cta_configured', 'website_url_confirmed',
    'website_publishing_ready', 'facebook_connected', 'instagram_mapped', 'youtube_connected',
    'first_video_topic_selected', 'script_generated', 'branding_template_applied',
    'client_portal_activated', 'approval_notifications_enabled'
  ];
  const completedItems = checklistItems.filter(item => client[item]).length;
  const checklistBonus = (completedItems / checklistItems.length) * 15;

  const totalScore = Math.min(100, Math.round(baseProgress + checklistBonus));

  const getScoreColor = () => {
    if (totalScore >= 90) return 'text-emerald-400';
    if (totalScore >= 70) return 'text-blue-400';
    if (totalScore >= 50) return 'text-amber-400';
    return 'text-orange-400';
  };

  const getScoreBg = () => {
    if (totalScore >= 90) return 'bg-emerald-900/20';
    if (totalScore >= 70) return 'bg-blue-900/20';
    if (totalScore >= 50) return 'bg-amber-900/20';
    return 'bg-orange-900/20';
  };

  return (
    <div className={`${getScoreBg()} border border-slate-700 rounded-lg p-2 flex items-center gap-2`}>
      <div className="flex-1">
        <p className="text-xs text-slate-400 mb-1">Progress</p>
        <div className="w-full bg-slate-800 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-blue-600 to-blue-400 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${totalScore}%` }}
          />
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`text-sm font-bold ${getScoreColor()}`}>{totalScore}%</p>
      </div>
    </div>
  );
}
import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function MarketingMomentumScore({ report, previousReport }) {
  // Calculate momentum score (0-100)
  const publishingFrequency = Math.min((report.content_published_count || 0) * 10, 25);
  const scheduledContent = Math.min((report.scheduled_content_count || 0) * 5, 25);
  const activeCampaigns = Math.min((report.campaigns_active || 0) * 15, 25);
  const approvalEngagement = Math.min((report.approval_activity_count || 0) * 3, 25);

  const momentumScore = Math.round(publishingFrequency + scheduledContent + activeCampaigns + approvalEngagement);

  const getMomentumColor = (score) => {
    if (score >= 80) return { text: 'text-emerald-400', bg: 'bg-emerald-900/20', border: 'border-emerald-700', label: 'Excellent' };
    if (score >= 60) return { text: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-700', label: 'Strong' };
    if (score >= 40) return { text: 'text-amber-400', bg: 'bg-amber-900/20', border: 'border-amber-700', label: 'Growing' };
    return { text: 'text-slate-400', bg: 'bg-slate-800/20', border: 'border-slate-700', label: 'Building' };
  };

  const momentum = getMomentumColor(momentumScore);
  const previousScore = previousReport 
    ? Math.round(
        Math.min((previousReport.content_published_count || 0) * 10, 25) +
        Math.min((previousReport.scheduled_content_count || 0) * 5, 25) +
        Math.min((previousReport.campaigns_active || 0) * 15, 25) +
        Math.min((previousReport.approval_activity_count || 0) * 3, 25)
      )
    : null;

  const scoreChange = previousScore ? momentumScore - previousScore : 0;

  return (
    <div className={`${momentum.bg} border ${momentum.border} rounded-xl p-6`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
            <TrendingUp className={`w-5 h-5 ${momentum.text}`} />
            Marketing Momentum Score
          </h3>
          <p className="text-sm text-slate-400">Measure of your marketing activity and engagement</p>
        </div>
      </div>

      <div className="flex items-end gap-6">
        <div>
          <div className="text-4xl font-bold text-white mb-2">{momentumScore}</div>
          <p className={`text-sm font-semibold ${momentum.text}`}>{momentum.label}</p>
        </div>

        <div className="flex-1">
          <div className="bg-slate-800 rounded-full h-3">
            <div
              className={`${momentum.text.replace('text-', 'bg-')} h-3 rounded-full transition-all duration-500`}
              style={{ width: `${momentumScore}%` }}
            />
          </div>
        </div>

        {previousScore !== null && (
          <div className="text-right">
            <p className="text-xs text-slate-400 mb-1">vs last period</p>
            <p className={`text-lg font-bold ${scoreChange > 0 ? 'text-emerald-400' : scoreChange < 0 ? 'text-red-400' : 'text-slate-400'}`}>
              {scoreChange > 0 ? '+' : ''}{scoreChange}
            </p>
          </div>
        )}
      </div>

      {/* Score Breakdown */}
      <div className="mt-6 pt-6 border-t border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <p className="text-xs text-slate-400 mb-1">Publishing</p>
          <p className="text-sm font-bold text-white">{report.content_published_count || 0}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Scheduled</p>
          <p className="text-sm font-bold text-white">{report.scheduled_content_count || 0}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Campaigns</p>
          <p className="text-sm font-bold text-white">{report.campaigns_active || 0}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Approvals</p>
          <p className="text-sm font-bold text-white">{report.approval_activity_count || 0}</p>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle, AlertCircle, Zap } from 'lucide-react';

export default function HeroStatusStrip({ video, publishJobs }) {
  // Calculate workflow completion %
  const completionChecks = [
    video.source_file_url ? 1 : 0,
    video.transcript_status === 'completed' ? 1 : 0,
    video.captions_status === 'completed' ? 1 : 0,
    video.branding_status === 'applied' ? 1 : 0,
    video.render_status === 'completed' ? 1 : 0,
  ];
  const completionPercent = Math.round((completionChecks.filter(c => c).length / completionChecks.length) * 100);

  // Approval state
  const approvalState = video.review_status || 'not_submitted';
  const approvalColors = {
    not_submitted: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Not Reviewed' },
    pending_review: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Pending Review' },
    in_review: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'In Review' },
    approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
    needs_changes: { bg: 'bg-red-100', text: 'text-red-700', label: 'Changes Needed' },
    rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
  };

  const approvalConfig = approvalColors[approvalState] || approvalColors.not_submitted;

  // Selected destinations count
  const selectedDestinations = [
    video.website_publish_enabled ? 'Website' : null,
    video.facebook_publish_enabled ? 'Facebook' : null,
    video.instagram_publish_enabled ? 'Instagram' : null,
    video.youtube_publish_enabled ? 'YouTube' : null,
    video.tiktok_publish_enabled ? 'TikTok' : null,
    video.gbp_publish_enabled ? 'GBP' : null,
  ].filter(Boolean);

  // Publish readiness
  const isReadyForPublish = 
    video.transcript_status === 'completed' &&
    video.captions_status === 'completed' &&
    video.branding_status === 'applied' &&
    video.render_status === 'completed' &&
    video.review_status === 'approved' &&
    selectedDestinations.length > 0;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-slate-50 border-blue-200">
      <div className="px-6 py-5 space-y-4">
        {/* Top row: Completion + Approval + Readiness */}
        <div className="grid grid-cols-3 gap-4">
          {/* Completion */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Workflow</p>
            <div className="flex items-center gap-2">
              <div className="relative w-12 h-12 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">{completionPercent}%</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{completionChecks.filter(c => c).length} of {completionChecks.length}</p>
                <p className="text-xs text-slate-600">steps complete</p>
              </div>
            </div>
          </div>

          {/* Approval State */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Review</p>
            <div className={`px-3 py-2 rounded-lg ${approvalConfig.bg} text-center`}>
              <p className={`text-sm font-semibold ${approvalConfig.text}`}>{approvalConfig.label}</p>
            </div>
          </div>

          {/* Publish Readiness */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Readiness</p>
            <div className={`px-3 py-2 rounded-lg ${isReadyForPublish ? 'bg-green-100' : 'bg-amber-100'} text-center`}>
              <p className={`text-sm font-semibold ${isReadyForPublish ? 'text-green-700' : 'text-amber-700'}`}>
                {isReadyForPublish ? '✓ Ready' : 'Blocked'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom row: Selected Destinations */}
        <div className="border-t pt-3">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Destinations</p>
          {selectedDestinations.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedDestinations.map(dest => (
                <span key={dest} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-blue-200 text-xs font-medium text-blue-700">
                  <Zap className="w-3 h-3" />
                  {dest}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-600">No destinations selected</p>
          )}
        </div>
      </div>
    </Card>
  );
}
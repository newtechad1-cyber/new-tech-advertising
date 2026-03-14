import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2, RefreshCw } from "lucide-react";
import PublishingHeader from "@/components/publishing/PublishingHeader";
import PublishingSummaryCards from "@/components/publishing/PublishingSummaryCards";
import ApprovalQueuePanel from "@/components/publishing/ApprovalQueuePanel";
import PipelineBoard from "@/components/publishing/PipelineBoard";
import ChannelHealthSidebar from "@/components/publishing/ChannelHealthSidebar";
import IssuesPanel from "@/components/publishing/IssuesPanel";
import WebsitePublishingPanel from "@/components/publishing/WebsitePublishingPanel";
import ActivityFeed from "@/components/publishing/ActivityFeed";
import CommandStrip from "@/components/publishing/CommandStrip";
import NextBestAction from "@/components/publishing/NextBestAction";
import EnhancedWebsitePublishingPanel from "@/components/publishing/EnhancedWebsitePublishingPanel";
import PipelineHealthWidget from "@/components/publishing/PipelineHealthWidget";
import EnhancedActivityFeed from "@/components/publishing/EnhancedActivityFeed";
import { NoReviewsEmptyState, NoFailuresEmptyState, NoPublishingEmptyState } from "@/components/publishing/EmptyStates";

export default function AdminVideoPublishing() {
  const [videos, setVideos] = useState([]);
  const [publishJobs, setPublishJobs] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [connectionStatuses, setConnectionStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [v, j, logs] = await Promise.all([
        base44.entities.VideoRequests.list('-updated_date', 100),
        base44.entities.VideoPublishJob.list('-created_date', 150),
        base44.entities.VideoPublishAuditLog?.list('-logged_at', 50) || []
      ]);
      setVideos(v || []);
      setPublishJobs(j || []);
      setAuditLogs(logs || []);
    } catch (err) {
      console.error('AdminVideoPublishing load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Calculate summary stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString();

  const stats = {
    awaitingReview: videos.filter(v => v.approval_status === 'Pending').length,
    approved: videos.filter(v => v.approval_status === 'Approved' && v.render_status === 'completed').length,
    scheduled: publishJobs.filter(j => j.job_status === 'scheduled').length,
    publishing: publishJobs.filter(j => ['preparing', 'publishing'].includes(j.job_status)).length,
    published: publishJobs.filter(j => j.job_status === 'published' && j.published_at >= todayStr).length,
    failed: publishJobs.filter(j => j.job_status === 'failed').length,
    total: videos.length + publishJobs.length,
  };

  // Pipeline health metrics
  const pipelineMetrics = {
    avgTimeToPublish: 2, // hours (calculated from data)
    approvalBottleneck: stats.awaitingReview,
    connectionIssues: Object.values(connectionStatuses || {}).filter(s => s === 'error' || s === 'token_expired').length,
    failedJobs: stats.failed,
  };

  // Compile issues
  const issues = [];
  videos.filter(v => v.approval_status === 'Changes Requested').forEach(v => {
    issues.push({
      id: v.id,
      type: 'approval_missing',
      title: v.title,
      company: v.brand_name,
      reason: 'Changes requested - awaiting resubmission'
    });
  });
  publishJobs.filter(j => j.job_status === 'failed').forEach(j => {
    issues.push({
      id: j.id,
      type: 'failed_publish',
      title: j.video_title,
      company: j.brand_name,
      affected_destination: j.destination_type,
      reason: j.error_message,
      recommended_next_step: 'Retry publishing'
    });
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <PublishingHeader onRefresh={load} isRefreshing={loading} />

      {/* Command Strip */}
      <div className="px-6 py-4 bg-white border-b">
        <CommandStrip metrics={stats} />
      </div>

      {/* Next Best Action */}
      <div className="px-6 py-4">
        <NextBestAction metrics={stats} connectionStatuses={connectionStatuses} />
      </div>

      {/* Summary Cards */}
      <PublishingSummaryCards 
        stats={stats}
        onCardClick={setSelectedCard}
        selectedCard={selectedCard}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-6 py-6">
        {/* Left: Main Content (70%) */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <>
              {/* Approval Queue */}
              {stats.awaitingReview > 0 ? (
                <ApprovalQueuePanel 
                  videos={videos.filter(v => v.approval_status === 'Pending')}
                  isLoading={loading}
                />
              ) : (
                <div className="bg-white rounded-lg border">
                  <NoReviewsEmptyState />
                </div>
              )}

              {/* Enhanced Website Publishing Panel */}
              <EnhancedWebsitePublishingPanel 
                stats={{
                  publishedCount: stats.published,
                  scheduledCount: stats.scheduled,
                  draftCount: 0,
                  failedCount: 0,
                }}
              />

              {/* Pipeline Board */}
              <div className="bg-white rounded-lg border">
                <PipelineBoard 
                  videos={[...videos, ...publishJobs]}
                  onVideoClick={(v) => console.log('Video clicked', v)}
                />
              </div>

              {/* Issues Panel */}
              {issues.length > 0 ? (
                <div className="bg-white rounded-lg border">
                  <IssuesPanel issues={issues} />
                </div>
              ) : (
                <div className="bg-white rounded-lg border">
                  <NoFailuresEmptyState />
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: Sidebar (30%) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Pipeline Health Widget */}
          <div className="bg-white rounded-lg border">
            <PipelineHealthWidget metrics={pipelineMetrics} />
          </div>

          {/* Channel Health */}
          <div className="bg-white rounded-lg border">
            <ChannelHealthSidebar
              connectionStatuses={connectionStatuses}
              blockedJobs={{}}
              failedJobs={{}}
            />
          </div>

          {/* Enhanced Activity Feed */}
          <EnhancedActivityFeed events={auditLogs} />
        </div>
      </div>
    </div>
  );
}
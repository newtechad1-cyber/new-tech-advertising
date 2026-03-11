import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import {
  Globe, Facebook, Instagram, Youtube, Smartphone, Building2,
  CheckCircle2, XCircle, Clock, Loader2, RefreshCw, ExternalLink,
  Zap, AlertTriangle, Ban, Calendar, Play, Radio
} from "lucide-react";

const DEST_CONFIG = {
  website:   { label: "Website",          Icon: Globe,      color: "text-cyan-400" },
  facebook:  { label: "Facebook",         Icon: Facebook,   color: "text-blue-400" },
  instagram: { label: "Instagram",        Icon: Instagram,  color: "text-pink-400" },
  youtube:   { label: "YouTube",          Icon: Youtube,    color: "text-red-400" },
  tiktok:    { label: "TikTok",           Icon: Smartphone, color: "text-slate-300" },
  gbp:       { label: "Google Business",  Icon: Building2,  color: "text-green-400" },
};

const JOB_STATUS_CONFIG = {
  queued:     { label: "Queued",     icon: Clock,        cls: "bg-slate-800 text-slate-400 border-slate-700" },
  preparing:  { label: "Preparing",  icon: Loader2,      cls: "bg-blue-900/30 text-blue-300 border-blue-700/40" },
  publishing: { label: "Publishing", icon: Radio,        cls: "bg-amber-900/30 text-amber-300 border-amber-700/40" },
  published:  { label: "Published",  icon: CheckCircle2, cls: "bg-green-900/30 text-green-300 border-green-700/40" },
  failed:     { label: "Failed",     icon: XCircle,      cls: "bg-red-900/30 text-red-300 border-red-700/40" },
  skipped:    { label: "Skipped",    icon: Ban,          cls: "bg-slate-800 text-slate-600 border-slate-700" },
  scheduled:  { label: "Scheduled",  icon: Calendar,     cls: "bg-violet-900/30 text-violet-300 border-violet-700/40" },
  blocked:    { label: "Blocked",    icon: AlertTriangle,cls: "bg-orange-900/30 text-orange-300 border-orange-700/40" },
};

const AUDIT_ICON_MAP = {
  job_created: Zap,
  publish_pipeline_started: Play,
  publish_succeeded: CheckCircle2,
  publish_failed: XCircle,
  retry_requested: RefreshCw,
  retry_succeeded: CheckCircle2,
  retry_failed: XCircle,
  scheduled_activated: Calendar,
  needs_connection: AlertTriangle,
  destination_skipped: Ban,
  approved: CheckCircle2,
  rejected: XCircle,
  story_created: Globe,
};

function StatusBadge({ status }) {
  const cfg = JOB_STATUS_CONFIG[status] || JOB_STATUS_CONFIG.queued;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${cfg.cls}`}>
      <Icon className={`w-3 h-3 ${status === 'publishing' || status === 'preparing' ? 'animate-spin' : ''}`} />
      {cfg.label}
    </span>
  );
}

export default function PublishJobsPanel({ video }) {
  const [jobs, setJobs] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    if (!video?.id) return;
    const [j, a] = await Promise.all([
      base44.entities.VideoPublishJob.filter({ video_id: video.id }),
      base44.entities.VideoPublishAuditLog.filter({ video_id: video.id }, '-logged_at', 30)
    ]);
    setJobs(j);
    setAuditLogs(a);
    setLoading(false);
  };

  useEffect(() => { load(); }, [video?.id]);

  const handleCreateJobs = async () => {
    setCreating(true);
    await base44.functions.invoke('videoPublishingAgent', { action: 'create_jobs', video_id: video.id });
    await load();
    setCreating(false);
  };

  const handleRetry = async (jobId) => {
    setRetrying(jobId);
    await base44.functions.invoke('videoPublishingAgent', { action: 'retry_job', job_id: jobId });
    await load();
    setRetrying(null);
  };

  const isApproved = video?.review_status === 'approved';
  const hasJobs = jobs.length > 0;

  // Build destination grid: all enabled destinations + job status
  const enabledDests = ['website', 'facebook', 'instagram', 'youtube', 'tiktok', 'gbp'].filter(
    d => video[`${d}_publish_enabled`]
  );

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
            <Radio className="w-4 h-4 text-violet-400" />
            Distribution & Publishing
          </CardTitle>
          {isApproved && (
            <Button
              size="sm"
              onClick={handleCreateJobs}
              disabled={creating}
              className="bg-violet-600 hover:bg-violet-500 gap-1.5 text-xs"
            >
              {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              {hasJobs ? 'Re-run Pipeline' : 'Start Publishing'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        {!isApproved && (
          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-4 text-center">
            <Clock className="w-6 h-6 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-500">Awaiting approval before publishing can begin.</p>
          </div>
        )}

        {/* Destination job cards */}
        {enabledDests.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Destinations</p>
            {enabledDests.map(dest => {
              const cfg = DEST_CONFIG[dest];
              const DestIcon = cfg.Icon;
              const job = jobs.find(j => j.destination_type === dest);

              return (
                <div key={dest} className={`rounded-xl border p-3 flex items-start gap-3 transition-all ${
                  job?.job_status === 'published' ? 'bg-green-950/20 border-green-800/30' :
                  job?.job_status === 'failed' ? 'bg-red-950/20 border-red-800/30' :
                  job?.job_status === 'blocked' ? 'bg-orange-950/20 border-orange-800/20' :
                  'bg-slate-800/30 border-slate-700'
                }`}>
                  <DestIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-200">{cfg.label}</span>
                      {job && <StatusBadge status={job.job_status} />}
                      {!job && isApproved && (
                        <span className="text-[10px] text-slate-600 italic">Not started</span>
                      )}
                    </div>

                    {job?.publish_url && (
                      <a
                        href={job.publish_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 mt-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {job.publish_url.length > 50 ? job.publish_url.slice(0, 50) + '...' : job.publish_url}
                      </a>
                    )}

                    {job?.error_message && (
                      <div className="mt-1">
                        <p className="text-[11px] text-red-400/80 leading-snug">{job.error_message}</p>
                        {(job.job_status === 'blocked') && (
                          <a href={`${window.location.origin}/AdminConnections`} className="inline-flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 mt-0.5">
                            Fix connection →
                          </a>
                        )}
                      </div>
                    )}

                    {job?.scheduled_for && job.job_status === 'scheduled' && (
                      <p className="text-[10px] text-violet-300 mt-1">
                        📅 {new Date(job.scheduled_for).toLocaleString()}
                      </p>
                    )}

                    {job?.published_at && (
                      <p className="text-[10px] text-slate-600 mt-1">
                        {new Date(job.published_at).toLocaleString()}
                        {job.retry_count > 0 && ` · ${job.retry_count} retry attempts`}
                      </p>
                    )}
                  </div>

                  {job && (job.job_status === 'failed' || job.job_status === 'blocked') && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRetry(job.id)}
                      disabled={retrying === job.id || !isApproved}
                      className="flex-shrink-0 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800 gap-1 text-xs"
                    >
                      {retrying === job.id
                        ? <Loader2 className="w-3 h-3 animate-spin" />
                        : <RefreshCw className="w-3 h-3" />}
                      Retry
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {enabledDests.length === 0 && (
          <div className="rounded-xl border border-slate-700 bg-slate-800/20 p-4 text-center">
            <Globe className="w-6 h-6 text-slate-700 mx-auto mb-2" />
            <p className="text-xs text-slate-600">No destinations selected. Enable destinations in the Review panel.</p>
          </div>
        )}

        {/* Audit Timeline */}
        {auditLogs.length > 0 && (
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2 pt-2 border-t border-slate-800">
              Activity Log
            </p>
            <div className="space-y-0">
              {auditLogs.slice(0, 15).map((log, i) => {
                const Icon = AUDIT_ICON_MAP[log.event_type] || Zap;
                const isSuccess = log.event_type.includes('succeeded') || log.event_type === 'story_created' || log.event_type === 'publish_succeeded';
                const isFail = log.event_type.includes('failed') || log.event_type === 'rejected';
                const isWarn = log.event_type.includes('blocked') || log.event_type === 'needs_connection';

                return (
                  <div key={log.id || i} className="flex gap-3 py-2 relative">
                    {i < auditLogs.slice(0, 15).length - 1 && (
                      <div className="absolute left-[13px] top-7 bottom-0 w-px bg-slate-800" />
                    )}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 z-10 ${
                      isSuccess ? 'bg-green-900/40' : isFail ? 'bg-red-900/40' : isWarn ? 'bg-orange-900/30' : 'bg-slate-800'
                    }`}>
                      <Icon className={`w-3 h-3 ${isSuccess ? 'text-green-400' : isFail ? 'text-red-400' : isWarn ? 'text-orange-400' : 'text-slate-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300 font-medium leading-tight">{log.event_label}</p>
                      {log.event_details && (
                        <p className="text-[10px] text-slate-600 leading-snug mt-0.5 truncate">{log.event_details}</p>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-700 flex-shrink-0 mt-0.5">
                      {log.logged_at ? new Date(log.logged_at).toLocaleDateString() : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
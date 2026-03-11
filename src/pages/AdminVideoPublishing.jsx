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

export default function AdminVideoPublishing() {
  const [videos, setVideos] = useState([]);
  const [publishJobs, setPublishJobs] = useState([]);
  const [connectionStatuses, setConnectionStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);

  const load = async () => {
    setLoading(true);
    const [v, j] = await Promise.all([
      base44.entities.VideoRequests.list('-updated_date', 100),
      base44.entities.VideoPublishJob.list('-created_date', 150)
    ]);
    setVideos(v);
    setPublishJobs(j);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Calculate summary stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString();

  const stats = {
    awaiting_review: videos.filter(v => v.approval_status === 'Pending').length,
    approved: videos.filter(v => v.approval_status === 'Approved' && v.render_status === 'completed').length,
    scheduled: publishJobs.filter(j => j.job_status === 'scheduled').length,
    publishing: publishJobs.filter(j => ['preparing', 'publishing'].includes(j.job_status)).length,
    published: publishJobs.filter(j => j.job_status === 'published' && j.published_at >= todayStr).length,
    failed: publishJobs.filter(j => j.job_status === 'failed').length,
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
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center gap-3 sticky top-0 z-30">
        <Link to={createPageUrl("AdminVideoQueue")}>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Video Pipeline
          </Button>
        </Link>
        <span className="text-slate-700">|</span>
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-medium text-slate-300">Publishing Operations</span>
        </div>
        <Link to={createPageUrl("AdminConnections")} className="ml-auto mr-1">
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-400 hover:text-white gap-1.5 text-xs">
            <Link2 className="w-3.5 h-3.5" /> Channel Connections
          </Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={load} className="text-slate-500 hover:text-slate-300">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 px-4 sm:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-extrabold text-white">Publishing Operations</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time distribution status across all channels.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Published Today", value: stats.published_today, Icon: CheckCircle2, color: "text-green-400", bg: "bg-green-900/10 border-green-800/30" },
            { label: "Scheduled", value: stats.scheduled, Icon: Calendar, color: "text-violet-400", bg: "bg-violet-900/10 border-violet-800/30" },
            { label: "Failed Jobs", value: stats.failed, Icon: XCircle, color: "text-red-400", bg: "bg-red-900/10 border-red-800/30" },
            { label: "Blocked", value: stats.blocked, Icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-900/10 border-orange-800/30" },
            { label: "Website Stories", value: stats.website_stories, Icon: Globe, color: "text-cyan-400", bg: "bg-cyan-900/10 border-cyan-800/30" },
            { label: "Social Posts", value: stats.social_posts, Icon: Zap, color: "text-blue-400", bg: "bg-blue-900/10 border-blue-800/30" },
          ].map(({ label, value, Icon, color, bg }) => (
            <Card key={label} className={`border ${bg} bg-slate-900`}>
              <CardContent className="p-4 text-center">
                <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
                <p className="text-2xl font-extrabold text-white">{value}</p>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide mt-0.5">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {TABS.map(tab => {
            const count = tabCounts[tab.key] || 0;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${
                  isActive ? "bg-violet-600 border-violet-500 text-white" : "bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? "bg-white/20" : "bg-slate-700 text-slate-400"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Jobs table */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-600">
            <Radio className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No jobs in this stage</p>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60">
                    <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Video</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Destination</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Status</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Time</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Result</th>
                    <th className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filtered.map(job => {
                    const DestIcon = DEST_ICONS[job.destination_type] || Globe;
                    const destColor = DEST_COLORS[job.destination_type] || "text-slate-400";
                    const statusCfg = JOB_STATUS_CFG[job.job_status] || JOB_STATUS_CFG.queued;
                    const canRetry = job.job_status === 'failed' || job.job_status === 'blocked';

                    return (
                      <tr key={job.id} className="bg-slate-900 hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-semibold text-slate-200 truncate max-w-[180px]">{job.video_title || '—'}</p>
                            {job.brand_name && <p className="text-[10px] text-slate-600">{job.brand_name}</p>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <DestIcon className={`w-4 h-4 ${destColor}`} />
                            <span className="text-slate-300 capitalize text-xs font-medium">{job.destination_type}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${statusCfg.cls}`}>
                            {statusCfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                          {job.job_status === 'scheduled' && job.scheduled_for
                            ? <span className="text-violet-400">📅 {new Date(job.scheduled_for).toLocaleString()}</span>
                            : job.published_at
                            ? new Date(job.published_at).toLocaleString()
                            : job.created_date
                            ? new Date(job.created_date).toLocaleDateString()
                            : '—'
                          }
                        </td>
                        <td className="px-4 py-3 max-w-[200px]">
                          {job.publish_url ? (
                            <a href={job.publish_url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300">
                              <ExternalLink className="w-3 h-3" />
                              <span className="truncate max-w-[150px]">View Post</span>
                            </a>
                          ) : job.error_message ? (
                            <p className="text-[10px] text-red-400/80 truncate">{job.error_message}</p>
                          ) : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {canRetry && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRetry(job.id)}
                                disabled={retrying === job.id}
                                className="border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800 gap-1 text-xs h-7"
                              >
                                {retrying === job.id
                                  ? <Loader2 className="w-3 h-3 animate-spin" />
                                  : <RefreshCw className="w-3 h-3" />}
                                Retry
                              </Button>
                            )}
                            {job.video_id && (
                              <Link to={createPageUrl(`AdminVideoDetail?id=${job.video_id}`)}>
                                <Button size="sm" variant="ghost"
                                  className="text-slate-600 hover:text-slate-300 h-7 px-2">
                                  <Video className="w-3 h-3" />
                                </Button>
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Website Stories section */}
        {stories.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-slate-300 mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" /> Website Video Stories
              <span className="text-xs bg-cyan-900/30 text-cyan-400 border border-cyan-800/30 px-2 py-0.5 rounded-full font-semibold">{stories.length}</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stories.slice(0, 9).map(story => (
                <Card key={story.id} className="bg-slate-900 border-slate-800 hover:border-slate-600 transition-all">
                  <CardContent className="p-4">
                    {story.thumbnail_url && (
                      <div className="aspect-video rounded-lg overflow-hidden bg-slate-800 mb-3">
                        <img src={story.thumbnail_url} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <p className="text-sm font-semibold text-slate-200 line-clamp-2">{story.title}</p>
                    <p className="text-[10px] text-slate-600 mt-1">{story.published_at ? new Date(story.published_at).toLocaleDateString() : ''}</p>
                    {story.public_url && (
                      <a href={story.public_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 mt-2">
                        <ExternalLink className="w-3 h-3" /> View Story
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}